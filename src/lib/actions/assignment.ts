"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function assignPaper(paperId: string, chairId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");
  
  // Create or restore assignment
  await prisma.paperAssignment.upsert({
    where: {
      paperId_chairId: {
        paperId,
        chairId
      }
    },
    update: {
      status: "ACTIVE"
    },
    create: {
      paperId,
      chairId,
      status: "ACTIVE"
    }
  });

  // Update paper status
  await prisma.paper.update({
    where: { id: paperId },
    data: { status: "ASSIGNED" } // In a real app we might want to ensure we don't downgrade from EVALUATED
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "ASSIGN_PAPER",
      entityType: "PAPER",
      entityId: paperId,
      metadata: `Assigned paper to chair ${chairId}`
    }
  });

  revalidatePath(`/admin/papers/${paperId}`);
  revalidatePath(`/admin/papers`);
}

export async function removeAssignment(paperId: string, chairId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");
  
  await prisma.paperAssignment.update({
    where: {
      paperId_chairId: {
        paperId,
        chairId
      }
    },
    data: {
      status: "REMOVED"
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "REMOVE_ASSIGNMENT",
      entityType: "PAPER",
      entityId: paperId,
      metadata: `Removed assignment for chair ${chairId}`
    }
  });

  revalidatePath(`/admin/papers/${paperId}`);
}
