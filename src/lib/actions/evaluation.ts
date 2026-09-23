"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { withChairAuth, withAdminAuth } from "@/lib/safe-action";
import { z } from "zod";

const evaluationSchema = z.object({
  paperId: z.string().min(1, "Paper ID is required"),
  technicalScore: z.number().int().min(0).max(5),
  originalityScore: z.number().int().min(0).max(5),
  relevanceScore: z.number().int().min(0).max(5),
  presentationScore: z.number().int().min(0).max(5),
  recommended: z.boolean(),
  feedbackRating: z.number().int().min(0).max(5).optional().default(0),
  feedbackText: z.string().max(2000, "Feedback text is too long").optional().default("")
});

export const submitEvaluation = withChairAuth(async (user, formData: FormData) => {
  const parsed = evaluationSchema.safeParse({
    paperId: formData.get("paperId") as string,
    technicalScore: parseInt(formData.get("technicalScore") as string) || 0,
    originalityScore: parseInt(formData.get("originalityScore") as string) || 0,
    relevanceScore: parseInt(formData.get("relevanceScore") as string) || 0,
    presentationScore: parseInt(formData.get("presentationScore") as string) || 0,
    recommended: formData.get("recommended") === "true",
    feedbackRating: parseInt(formData.get("feedbackRating") as string) || 0,
    feedbackText: formData.get("feedbackText") as string || "",
  });

  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.errors.map(e => e.message).join(", ")}`);
  }

  const {
    paperId,
    technicalScore,
    originalityScore,
    relevanceScore,
    presentationScore,
    recommended,
    feedbackRating,
    feedbackText
  } = parsed.data;

  // Verify ownership via assignment. Use user.id from session!
  const assignment = await prisma.paperAssignment.findUnique({
    where: {
      paperId_chairId: {
        paperId,
        chairId: user.id
      }
    }
  });

  if (!assignment || assignment.status !== "ACTIVE") {
    throw new Error("Forbidden: You are not assigned to evaluate this paper.");
  }

  // Verify existing status (Prevent modification of SUBMITTED evaluation)
  const existingEval = await prisma.evaluation.findUnique({
    where: {
      paperId_chairId: {
        paperId,
        chairId: user.id
      }
    }
  });

  if (existingEval?.status === "SUBMITTED") {
    throw new Error("Forbidden: Evaluation has already been submitted and is locked.");
  }

  // Calculate scores securely on server
  const totalScore = technicalScore + originalityScore + relevanceScore + presentationScore;
  const averageScore = totalScore / 4;

  const evaluation = await prisma.evaluation.upsert({
    where: {
      paperId_chairId: {
        paperId,
        chairId: user.id
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
      chairId: user.id,
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
      userId: user.id,
      action: "SUBMIT_EVALUATION",
      entityType: "EVALUATION",
      entityId: evaluation.id,
      metadata: `Score: ${totalScore}, Recommended: ${recommended}`
    }
  });

  revalidatePath("/chair/dashboard");
  revalidatePath("/chair/papers");
  revalidatePath(`/chair/evaluate/${paperId}`);
});

export const reopenEvaluation = withAdminAuth(async (user, evaluationId: string) => {
  // Validate evaluationId
  if (!evaluationId || typeof evaluationId !== "string") {
    throw new Error("Invalid evaluation ID");
  }

  const evaluation = await prisma.evaluation.update({
    where: { id: evaluationId },
    data: { 
      status: "DRAFT",
      submittedAt: null 
    },
    include: { paper: true }
  });

  // Re-evaluate paper status if it was EVALUATED and this was the only evaluation
  const remainingSubmittedEvals = await prisma.evaluation.count({
    where: {
      paperId: evaluation.paperId,
      status: "SUBMITTED"
    }
  });

  if (remainingSubmittedEvals === 0) {
    await prisma.paper.update({
      where: { id: evaluation.paperId },
      data: { status: "IN_REVIEW" }
    });
  }

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "REOPEN_EVALUATION",
      entityType: "EVALUATION",
      entityId: evaluation.id,
      metadata: `Reopened for Paper: ${evaluation.paper.paperId}`
    }
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/feedback");
});
