"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { withAdminAuth } from "@/lib/safe-action";
import { z } from "zod";

const assignSchema = z.object({
  paperId: z.string().min(1, "Paper ID required"),
  chairId: z.string().min(1, "Chair ID required"),
});

export const assignPaper = withAdminAuth(async (user, paperId: string, chairId: string) => {
  const parsed = assignSchema.safeParse({ paperId, chairId });
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.errors.map(e => e.message).join(", ")}`);
  }

  // Verify the chair exists and is a SESSION_CHAIR (prevent role escalation via assignment)
  const chair = await prisma.user.findFirst({
    where: { id: parsed.data.chairId, role: "SESSION_CHAIR", status: "ACTIVE" },
    select: { id: true }
  });
  if (!chair) throw new Error("Target chair not found or is not an active session chair.");

  const existing = await prisma.paperAssignment.findUnique({
    where: { paperId_chairId: { paperId: parsed.data.paperId, chairId: parsed.data.chairId } }
  });

  if (existing) {
    if (existing.status === "REMOVED") {
      await prisma.paperAssignment.update({
        where: { id: existing.id },
        data: { status: "ACTIVE" }
      });
    } else {
      throw new Error("Paper is already assigned to this chair.");
    }
  } else {
    await prisma.paperAssignment.create({
      data: { paperId: parsed.data.paperId, chairId: parsed.data.chairId, status: "ACTIVE" }
    });
  }

  const paper = await prisma.paper.findUnique({ where: { id: parsed.data.paperId } });
  if (paper && paper.status === "UNASSIGNED") {
    await prisma.paper.update({ where: { id: parsed.data.paperId }, data: { status: "ASSIGNED" } });
  }

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "PAPER_ASSIGNED",
      entityType: "PAPER_ASSIGNMENT",
      entityId: `${parsed.data.paperId}_${parsed.data.chairId}`,
      metadata: `Paper ${parsed.data.paperId} assigned to chair ${parsed.data.chairId}`
    }
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/papers");
  revalidatePath(`/admin/papers/${parsed.data.paperId}`);
});

export const removeAssignment = withAdminAuth(async (user, paperId: string, chairId: string) => {
  const parsed = assignSchema.safeParse({ paperId, chairId });
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.errors.map(e => e.message).join(", ")}`);
  }

  await prisma.paperAssignment.delete({
    where: { paperId_chairId: { paperId: parsed.data.paperId, chairId: parsed.data.chairId } }
  });

  const activeAssignments = await prisma.paperAssignment.count({
    where: { paperId: parsed.data.paperId, status: "ACTIVE" }
  });

  if (activeAssignments === 0) {
    const paper = await prisma.paper.findUnique({ where: { id: parsed.data.paperId } });
    if (paper && paper.status === "ASSIGNED") {
      await prisma.paper.update({ where: { id: parsed.data.paperId }, data: { status: "UNASSIGNED" } });
    }
  }

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "PAPER_REASSIGNED",
      entityType: "PAPER_ASSIGNMENT",
      entityId: `${parsed.data.paperId}_${parsed.data.chairId}`,
      metadata: `Assignment removed: paper ${parsed.data.paperId} from chair ${parsed.data.chairId}`
    }
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/papers");
  revalidatePath(`/admin/papers/${parsed.data.paperId}`);
});
