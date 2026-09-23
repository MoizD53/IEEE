import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 });

  const recommendedEvals = await prisma.evaluation.findMany({
    where: {
      recommended: true,
      status: "SUBMITTED",
    },
    include: {
      paper: true,
      chair: true,
    },
    orderBy: { totalScore: "desc" },
  });

  const headers = [
    "Paper ID",
    "Paper Title",
    "Authors",
    "Track",
    "Session",
    "Recommending Chair",
    "Total Score (/20)",
    "Average Score (/5)",
    "Feedback Stars",
    "Comments",
    "Submitted Date",
  ];

  const rows = recommendedEvals.map((e) => [
    e.paper?.paperId || "",
    `"${(e.paper?.title || "").replace(/"/g, '""')}"`,
    `"${(e.paper?.authors || "").replace(/"/g, '""')}"`,
    e.paper?.track || "",
    e.paper?.session || "",
    `"${(e.chair?.name || "").replace(/"/g, '""')}"`,
    e.totalScore,
    e.averageScore,
    e.feedbackRating || "",
    `"${(e.feedbackText || "").replace(/"/g, '""')}"`,
    e.submittedAt ? new Date(e.submittedAt).toLocaleDateString() : "",
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=recommended_papers.csv",
    },
  });
}
