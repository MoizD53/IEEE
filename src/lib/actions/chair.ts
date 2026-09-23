"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";

export async function getChairs() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");
  
  return prisma.user.findMany({
    where: { role: "SESSION_CHAIR" },
    orderBy: { createdAt: "desc" }
  });
}

export async function createChair(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const institution = formData.get("institution") as string;

  if (!name || !username || !password) {
    throw new Error("Missing required fields");
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    throw new Error("Username already taken");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newChair = await prisma.user.create({
    data: {
      name,
      username,
      passwordHash,
      email,
      phone,
      institution,
      role: "SESSION_CHAIR",
      status: "ACTIVE"
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "CREATE_CHAIR",
      entityType: "USER",
      entityId: newChair.id,
      metadata: `Created chair ${username}`
    }
  });

  revalidatePath("/admin/chairs");
}

export async function toggleChairStatus(chairId: string, currentStatus: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

  const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  await prisma.user.update({
    where: { id: chairId },
    data: { status: newStatus }
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "TOGGLE_CHAIR_STATUS",
      entityType: "USER",
      entityId: chairId,
      metadata: `Changed status to ${newStatus}`
    }
  });

  revalidatePath("/admin/chairs");
}
