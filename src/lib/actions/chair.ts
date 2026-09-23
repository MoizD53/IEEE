"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { withAdminAuth } from "@/lib/safe-action";
import { z } from "zod";

const createChairSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  username: z.string().min(3, "Username must be at least 3 characters").max(50).regex(/^[a-zA-Z0-9_]+$/, "Username must be alphanumeric"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  institution: z.string().max(300).optional().or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const resetPasswordSchema = z.object({
  chairId: z.string().min(1),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export const getChairs = withAdminAuth(async (user) => {
  return await prisma.user.findMany({
    where: { role: "SESSION_CHAIR" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      phone: true,
      institution: true,
      status: true,
      createdAt: true,
      _count: { select: { assignments: true, evaluations: true } },
      // passwordHash intentionally omitted
    }
  });
});

export const createChair = withAdminAuth(async (user, formData: FormData) => {
  const parsed = createChairSchema.safeParse({
    name: formData.get("name"),
    username: formData.get("username"),
    email: formData.get("email") || "",
    phone: formData.get("phone") || "",
    institution: formData.get("institution") || "",
    password: formData.get("password"),
  });

  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.errors.map(e => e.message).join(", ")}`);
  }

  const { name, username, email, phone, institution, password } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (existingUser) throw new Error("Username already exists");

  const passwordHash = await bcrypt.hash(password, 12);

  const newChair = await prisma.user.create({
    data: {
      name,
      username,
      email: email || null,
      phone: phone || null,
      institution: institution || null,
      passwordHash,
      role: "SESSION_CHAIR",
      status: "ACTIVE"
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "CHAIR_CREATED",
      entityType: "USER",
      entityId: newChair.id,
      metadata: `Created session chair: ${username}`
    }
  });

  revalidatePath("/admin/chairs");
});

export const toggleChairStatus = withAdminAuth(async (user, chairId: string, currentStatus: string) => {
  if (!chairId) throw new Error("Invalid chair ID");
  const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
  const auditAction = newStatus === "INACTIVE" ? "CHAIR_DISABLED" : "CHAIR_ENABLED";

  await prisma.user.update({ where: { id: chairId }, data: { status: newStatus } });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: auditAction,
      entityType: "USER",
      entityId: chairId,
      metadata: `Chair status changed to ${newStatus}`
    }
  });

  revalidatePath("/admin/chairs");
});

/**
 * Admin-only: reset a Session Chair's password.
 * Never logs or returns the raw password.
 */
export const resetChairPassword = withAdminAuth(async (user, chairId: string, newPassword: string) => {
  const parsed = resetPasswordSchema.safeParse({ chairId, newPassword });
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.errors.map(e => e.message).join(", ")}`);
  }

  const targetChair = await prisma.user.findUnique({
    where: { id: parsed.data.chairId },
    select: { id: true, role: true, username: true }
  });

  if (!targetChair || targetChair.role !== "SESSION_CHAIR") {
    throw new Error("Target not found or is not a Session Chair.");
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.user.update({ where: { id: parsed.data.chairId }, data: { passwordHash } });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "PASSWORD_RESET",
      entityType: "USER",
      entityId: parsed.data.chairId,
      metadata: `Password reset by Admin for chair: ${targetChair.username}`
    }
  });

  revalidatePath("/admin/chairs");
});
