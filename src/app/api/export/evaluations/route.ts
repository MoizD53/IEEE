import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 });

  const evaluations = await prisma.evaluation.findMany({
    include: {
      paper: true,
      chair: true,
    },
    orderBy: { submittedAt: "desc" },
  });

  const headers = [
    "Evaluation ID",
    "Paper ID",
    "Paper Title",
    "Track",
    "Session Chair Name",
    "Chair Username",
    "Technical Quality (0-5)",
    "Originality (0-5)",
    "Relevance (0-5)",
    "Presentation (0-5)",
    "Total Score (/20)",
    "Average Score (/5)",
    "Recommended",
    "Feedback Star Rating",
    "Written Feedback",
    "Evaluation Status",
    "Submitted At",
  ];

  const rows = evaluations.map((e) => [
    e.id,
    e.paper?.paperId || "",
    `"${(e.paper?.title || "").replace(/"/g, '""')}"`,
    e.paper?.track || "",
    `"${(e.chair?.name || "").replace(/"/g, '""')}"`,
    e.chair?.username || "",
    e.technicalScore,
    e.originalityScore,
    e.relevanceScore,
    e.presentationScore,
    e.totalScore,
    e.averageScore,
    e.recommended ? "YES" : "NO",
    e.feedbackRating || "",
    `"${(e.feedbackText || "").replace(/"/g, '""')}"`,
    e.status,
    e.submittedAt ? new Date(e.submittedAt).toISOString() : "",
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=evaluations_summary.csv",
    },
  });
}
