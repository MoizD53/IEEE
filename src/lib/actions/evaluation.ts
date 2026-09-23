"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function submitEvaluation(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "SESSION_CHAIR") throw new Error("Unauthorized");
  
  const paperId = formData.get("paperId") as string;
  const technicalScore = parseInt(formData.get("technicalScore") as string);
  const originalityScore = parseInt(formData.get("originalityScore") as string);
  const relevanceScore = parseInt(formData.get("relevanceScore") as string);
  const presentationScore = parseInt(formData.get("presentationScore") as string);
  
  const recommended = formData.get("recommended") === "true";
  const feedbackRating = parseInt(formData.get("feedbackRating") as string) || 0;
  const feedbackText = formData.get("feedbackText") as string;

  // Validate authorization to evaluate this paper
  const assignment = await prisma.paperAssignment.findUnique({
    where: {
      paperId_chairId: {
        paperId,
        chairId: session.user.id
      }
    }
  });

  if (!assignment || assignment.status !== "ACTIVE") {
    throw new Error("You are not assigned to evaluate this paper.");
  }

  // Check if already submitted
  const existingEval = await prisma.evaluation.findUnique({
    where: {
      paperId_chairId: {
        paperId,
        chairId: session.user.id
      }
    }
  });

  if (existingEval?.status === "SUBMITTED") {
    throw new Error("Evaluation already submitted.");
  }

  const totalScore = technicalScore + originalityScore + relevanceScore + presentationScore;
  const averageScore = totalScore / 4;

  const evaluation = await prisma.evaluation.upsert({
    where: {
      paperId_chairId: {
        paperId,
        chairId: session.user.id
      }
    },
    update: {
      technicalScore,
      originalityScore,
      relevanceScore,
      presentationScore,
      totalScore,
      averageScore,
      recommended,
      feedbackRating,
      feedbackText,
      status: "SUBMITTED",
      submittedAt: new Date()
    },
    create: {
      paperId,
      chairId: session.user.id,
      technicalScore,
      originalityScore,
      relevanceScore,
      presentationScore,
      totalScore,
      averageScore,
      recommended,
      feedbackRating,
      feedbackText,
      status: "SUBMITTED",
      submittedAt: new Date()
    }
  });

  // Re-evaluate paper status if it was IN_REVIEW
  await prisma.paper.update({
    where: { id: paperId },
    data: { status: "EVALUATED" }
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "SUBMIT_EVALUATION",
      entityType: "EVALUATION",
      entityId: evaluation.id,
      metadata: `Score: ${totalScore}, Recommended: ${recommended}`
    }
  });

  revalidatePath(`/chair/evaluate/${paperId}`);
  revalidatePath(`/chair/dashboard`);
}

export async function reopenEvaluation(evaluationId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

  const ev = await prisma.evaluation.update({
    where: { id: evaluationId },
    data: {
      status: "DRAFT",
    },
    include: { paper: true, chair: true }
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "REOPEN_EVALUATION",
      entityType: "EVALUATION",
      entityId: evaluationId,
      metadata: `Admin reopened evaluation for paper ${ev.paper?.paperId} submitted by ${ev.chair?.username}`
    }
  });

  revalidatePath(`/admin/feedback`);
  revalidatePath(`/admin/papers`);
  revalidatePath(`/chair/dashboard`);
  if (ev.paperId) {
    revalidatePath(`/chair/evaluate/${ev.paperId}`);
  }
}
