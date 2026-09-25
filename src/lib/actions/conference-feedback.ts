"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { withChairAuth } from "@/lib/safe-action";
import { z } from "zod";

const conferenceFeedbackSchema = z.object({
  sessionTrack: z.string().optional().default(""),
  sessionName: z.string().optional().default(""),
  planningScore: z.number().int().min(0).max(10),
  timeManagementScore: z.number().int().min(0).max(10),
  infrastructureScore: z.number().int().min(0).max(10),
  participantManagementScore: z.number().int().min(0).max(10),
  organizationScore: z.number().int().min(0).max(10),
  highlights: z.string().max(2000, "Highlights text is too long").optional().default(""),
  suggestions: z.string().max(2000, "Suggestions text is too long").optional().default("")
});

export const submitConferenceFeedback = withChairAuth(async (user, formData: FormData) => {
  try {
    const parsed = conferenceFeedbackSchema.safeParse({
      sessionTrack: (formData.get("sessionTrack") as string) || "",
      sessionName: (formData.get("sessionName") as string) || "",
      planningScore: parseInt(formData.get("planningScore") as string) || 0,
      timeManagementScore: parseInt(formData.get("timeManagementScore") as string) || 0,
      infrastructureScore: parseInt(formData.get("infrastructureScore") as string) || 0,
      participantManagementScore: parseInt(formData.get("participantManagementScore") as string) || 0,
      organizationScore: parseInt(formData.get("organizationScore") as string) || 0,
      highlights: (formData.get("highlights") as string) || "",
      suggestions: (formData.get("suggestions") as string) || "",
    });

    if (!parsed.success) {
      return { success: false, error: `Validation failed: ${parsed.error.errors.map(e => e.message).join(", ")}` };
    }

    const {
      sessionTrack,
      sessionName,
      planningScore,
      timeManagementScore,
      infrastructureScore,
      participantManagementScore,
      organizationScore,
      highlights,
      suggestions
    } = parsed.data;

    const totalScore = planningScore + timeManagementScore + infrastructureScore + participantManagementScore + organizationScore;
    const averageScore = totalScore / 5;

    const feedback = await prisma.conferenceFeedback.create({
      data: {
        chairId: user.id,
        sessionTrack,
        sessionName,
        planningScore,
        timeManagementScore,
        infrastructureScore,
        participantManagementScore,
        organizationScore,
        totalScore,
        averageScore,
        highlights,
        suggestions,
        status: "SUBMITTED"
      }
    });

    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "SUBMIT_CONFERENCE_FEEDBACK",
          entityType: "CONFERENCE_FEEDBACK",
          entityId: feedback.id,
          metadata: `Conference Rating: ${totalScore}/50`
        }
      });
    } catch {
      // non-critical
    }

    revalidatePath("/chair/feedback");
    revalidatePath("/admin/feedback");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/reports");

    return { success: true, feedbackId: feedback.id };
  } catch (err: any) {
    console.error("submitConferenceFeedback error:", err);
    return { success: false, error: err.message || "Failed to submit feedback" };
  }
});
