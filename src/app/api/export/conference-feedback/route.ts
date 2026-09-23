import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 });

  const feedbacks = await prisma.conferenceFeedback.findMany({
    include: {
      chair: true,
    },
    orderBy: { submittedAt: "desc" },
  });

  const headers = [
    "Feedback ID",
    "Session Chair Name",
    "Chair Username",
    "Chair Institution",
    "Track Chaired",
    "Session Name/No",
    "Session Planning & Coordination (0-10)",
    "Presentation & Time Management (0-10)",
    "Technical/AV & Infrastructure Support (0-10)",
    "Participant & Presenter Management (0-10)",
    "Overall Conference Organization & Support (0-10)",
    "Total Conference Rating (/50)",
    "Average Rating (/10)",
    "Key Highlights",
    "Suggestions for Future Editions",
    "Status",
    "Submitted At",
  ];

  const rows = feedbacks.map((f) => [
    f.id,
    `"${(f.chair?.name || "").replace(/"/g, '""')}"`,
    f.chair?.username || "",
    `"${(f.chair?.institution || "").replace(/"/g, '""')}"`,
    `"${(f.sessionTrack || "").replace(/"/g, '""')}"`,
    `"${(f.sessionName || "").replace(/"/g, '""')}"`,
    f.planningScore,
    f.timeManagementScore,
    f.infrastructureScore,
    f.participantManagementScore,
    f.organizationScore,
    f.totalScore,
    f.averageScore,
    `"${(f.highlights || "").replace(/"/g, '""')}"`,
    `"${(f.suggestions || "").replace(/"/g, '""')}"`,
    f.status,
    f.submittedAt ? new Date(f.submittedAt).toISOString() : "",
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=conference_organization_feedback.csv",
    },
  });
}
