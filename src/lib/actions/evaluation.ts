"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { withChairAuth, withAdminAuth } from "@/lib/safe-action";
import { z } from "zod";

const evaluationSchema = z.object({
  paperId: z.string().min(1, "Paper ID is required"),
  relevanceNoveltyScore: z.number().int().min(0).max(10),
  technicalMethodologyScore: z.number().int().min(0).max(10),
  resultsContributionScore: z.number().int().min(0).max(10),
  presentationClarityScore: z.number().int().min(0).max(10),
  qaKnowledgeScore: z.number().int().min(0).max(10),
  recommended: z.boolean(),
  feedbackRating: z.number().int().min(0).max(5).optional().default(0),
  feedbackText: z.string().max(2000, "Feedback text is too long").optional().default("")
});

export const submitEvaluation = withChairAuth(async (user, formData: FormData) => {
  try {
    const parsed = evaluationSchema.safeParse({
      paperId: formData.get("paperId") as string,
      relevanceNoveltyScore: parseInt(formData.get("relevanceNoveltyScore") as string) || 0,
      technicalMethodologyScore: parseInt(formData.get("technicalMethodologyScore") as string) || 0,
      resultsContributionScore: parseInt(formData.get("resultsContributionScore") as string) || 0,
      presentationClarityScore: parseInt(formData.get("presentationClarityScore") as string) || 0,
      qaKnowledgeScore: parseInt(formData.get("qaKnowledgeScore") as string) || 0,
      recommended: formData.get("recommended") === "true",
      feedbackRating: parseInt(formData.get("feedbackRating") as string) || 0,
      feedbackText: (formData.get("feedbackText") as string) || "",
    });

    if (!parsed.success) {
      return { success: false, error: `Validation failed: ${parsed.error.errors.map(e => e.message).join(", ")}` };
    }

    const {
      paperId,
      relevanceNoveltyScore,
      technicalMethodologyScore,
      resultsContributionScore,
      presentationClarityScore,
      qaKnowledgeScore,
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
      return { success: false, error: "Forbidden: You are not assigned to evaluate this paper." };
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
      return { success: false, error: "Forbidden: Evaluation has already been submitted and is locked." };
    }

    // Calculate scores securely on server (Total out of 50, Average out of 10)
    const totalScore = relevanceNoveltyScore + technicalMethodologyScore + resultsContributionScore + presentationClarityScore + qaKnowledgeScore;
    const averageScore = totalScore / 5;

    const evaluation = await prisma.evaluation.upsert({
      where: {
        paperId_chairId: {
          paperId,
          chairId: user.id
        }
      },
      update: {
        relevanceNoveltyScore,
        technicalMethodologyScore,
        resultsContributionScore,
        presentationClarityScore,
        qaKnowledgeScore,
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
        relevanceNoveltyScore,
        technicalMethodologyScore,
        resultsContributionScore,
        presentationClarityScore,
        qaKnowledgeScore,
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

    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "SUBMIT_EVALUATION",
          entityType: "EVALUATION",
          entityId: evaluation.id,
          metadata: `Score: ${totalScore}/50, Recommended for Best Paper: ${recommended}`
        }
      });
    } catch {
      // non-critical
    }

    revalidatePath("/chair/dashboard");
    revalidatePath("/chair/papers");
    revalidatePath(`/chair/evaluate/${paperId}`);
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/feedback");
    revalidatePath("/admin/analytics");
    revalidatePath("/admin/reports");
    return { success: true };
  } catch (err: any) {
    console.error("submitEvaluation error:", err);
    return { success: false, error: err.message || "Failed to submit evaluation" };
  }
});

export const reopenEvaluation = withAdminAuth(async (user, evaluationId: string) => {
  try {
    // Validate evaluationId
    if (!evaluationId || typeof evaluationId !== "string") {
      return { success: false, error: "Invalid evaluation ID" };
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

    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "REOPEN_EVALUATION",
          entityType: "EVALUATION",
          entityId: evaluation.id,
          metadata: `Reopened for Paper: ${evaluation.paper.paperId}`
        }
      });
    } catch {
      // non-critical
    }

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/feedback");
    revalidatePath("/admin/analytics");
    revalidatePath("/admin/reports");
    return { success: true };
  } catch (err: any) {
    console.error("reopenEvaluation error:", err);
    return { success: false, error: err.message || "Failed to reopen evaluation" };
  }
});
