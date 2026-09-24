"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { withAdminAuth } from "@/lib/safe-action";
import { z } from "zod";

const createChairSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  username: z.string().min(3, "Username must be at least 3 characters").max(50).regex(/^[a-zA-Z0-9_]+$/, "Username must contain only letters, numbers, and underscores"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  institution: z.string().max(300).optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const resetPasswordSchema = z.object({
  chairId: z.string().min(1),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
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
  try {
    const rawData = {
      name: (formData.get("name") as string)?.trim() || "",
      username: (formData.get("username") as string)?.trim().toLowerCase() || "",
      email: (formData.get("email") as string)?.trim() || "",
      phone: (formData.get("phone") as string)?.trim() || "",
      institution: (formData.get("institution") as string)?.trim() || "",
      password: (formData.get("password") as string) || "",
    };

    const parsed = createChairSchema.safeParse(rawData);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors.map(e => e.message).join(", ")
      };
    }

    const { name, username, email, phone, institution, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return { success: false, error: "Username already exists. Please choose a different username." };
    }

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

    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "CHAIR_CREATED",
          entityType: "USER",
          entityId: newChair.id,
          metadata: `Created session chair: ${username}`
        }
      });
    } catch {
      // non-critical
    }

    revalidatePath("/admin/chairs");
    return { success: true };
  } catch (err: any) {
    console.error("createChair error:", err);
    return { success: false, error: err.message || "Failed to create chair" };
  }
});

export const toggleChairStatus = withAdminAuth(async (user, chairId: string, currentStatus: string) => {
  try {
    if (!chairId) return { success: false, error: "Invalid chair ID" };
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const auditAction = newStatus === "INACTIVE" ? "CHAIR_DISABLED" : "CHAIR_ENABLED";

    await prisma.user.update({ where: { id: chairId }, data: { status: newStatus } });

    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: auditAction,
          entityType: "USER",
          entityId: chairId,
          metadata: `Chair status changed to ${newStatus}`
        }
      });
    } catch {
      // non-critical
    }

    revalidatePath("/admin/chairs");
    return { success: true };
  } catch (err: any) {
    console.error("toggleChairStatus error:", err);
    return { success: false, error: err.message || "Failed to update chair status" };
  }
});

/**
 * Admin-only: reset a Session Chair's password.
 * Never logs or returns the raw password.
 */
export const resetChairPassword = withAdminAuth(async (user, chairId: string, newPassword: string) => {
  try {
    const parsed = resetPasswordSchema.safeParse({ chairId, newPassword });
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors.map(e => e.message).join(", ") };
    }

    const targetChair = await prisma.user.findUnique({
      where: { id: parsed.data.chairId },
      select: { id: true, role: true, username: true }
    });

    if (!targetChair || targetChair.role !== "SESSION_CHAIR") {
      return { success: false, error: "Target not found or is not a Session Chair." };
    }

    const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
    await prisma.user.update({ where: { id: parsed.data.chairId }, data: { passwordHash } });

    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "PASSWORD_RESET",
          entityType: "USER",
          entityId: parsed.data.chairId,
          metadata: `Password reset by Admin for chair: ${targetChair.username}`
        }
      });
    } catch {
      // non-critical
    }

    revalidatePath("/admin/chairs");
    return { success: true };
  } catch (err: any) {
    console.error("resetChairPassword error:", err);
    return { success: false, error: err.message || "Failed to reset password" };
  }
});
