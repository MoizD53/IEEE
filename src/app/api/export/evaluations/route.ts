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
    "Session",
    "Session Chair Name",
    "Chair Username",
    "Relevance & Novelty (0-10)",
    "Technical & Methodology (0-10)",
    "Results & Contribution (0-10)",
    "Presentation & Clarity (0-10)",
    "Q&A & Subject Knowledge (0-10)",
    "Total Score (/50)",
    "Average Score (/10)",
    "Recommended for Best Paper",
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
    e.paper?.session || "",
    `"${(e.chair?.name || "").replace(/"/g, '""')}"`,
    e.chair?.username || "",
    e.relevanceNoveltyScore,
    e.technicalMethodologyScore,
    e.resultsContributionScore,
    e.presentationClarityScore,
    e.qaKnowledgeScore,
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
      "Content-Disposition": "attachment; filename=ieee_evaluations_summary_50marks.csv",
    },
  });
}
