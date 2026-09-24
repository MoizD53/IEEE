"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { withAdminAuth } from "@/lib/safe-action";
import { z } from "zod";

const createPaperSchema = z.object({
  paperId: z.string().min(1, "Paper ID is required").max(100),
  title: z.string().min(1, "Title is required").max(500),
  authors: z.string().min(1, "Authors are required")
});

export const getPapers = withAdminAuth(async (user) => {
  return await prisma.paper.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { assignments: true, evaluations: true }
      }
    }
  });
});

export const createPaper = withAdminAuth(async (user, formData: FormData) => {
  try {
    const rawData = {
      paperId: (formData.get("paperId") as string)?.trim() || "",
      title: (formData.get("title") as string)?.trim() || "",
      authors: (formData.get("authors") as string)?.trim() || ""
    };

    const parsed = createPaperSchema.safeParse(rawData);

    if (!parsed.success) {
      return { success: false, error: parsed.error.errors.map(e => e.message).join(", ") };
    }

    const data = parsed.data;

    const existingPaper = await prisma.paper.findUnique({
      where: { paperId: data.paperId }
    });

    if (existingPaper) {
      return { success: false, error: `Paper ID "${data.paperId}" already exists. Please choose a unique ID.` };
    }

    const newPaper = await prisma.paper.create({
      data: {
        ...data,
        abstract: "",
        keywords: "",
        track: "",
        session: "",
        status: "UNASSIGNED"
      }
    });

    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "CREATE_PAPER",
          entityType: "PAPER",
          entityId: newPaper.id,
          metadata: `Created paper: ${data.paperId}`
        }
      });
    } catch {
      // non-critical
    }

    revalidatePath("/admin/papers");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("createPaper error:", err);
    return { success: false, error: err.message || "Failed to create paper" };
  }
});
