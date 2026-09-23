import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 });

  const chairs = await prisma.user.findMany({
    where: { role: "SESSION_CHAIR" },
    include: {
      assignments: {
        where: { status: "ACTIVE" },
      },
      evaluations: {
        where: { status: "SUBMITTED" },
      },
    },
    orderBy: { name: "asc" },
  });

  const headers = [
    "Chair ID",
    "Full Name",
    "Username",
    "Email",
    "Phone",
    "Institution",
    "Account Status",
    "Assigned Papers",
    "Completed Evaluations",
    "Pending Evaluations",
    "Recommended Count",
    "Average Score Given (/20)",
  ];

  const rows = chairs.map((c) => {
    const assignedCount = c.assignments.length;
    const completedCount = c.evaluations.length;
    const pendingCount = Math.max(0, assignedCount - completedCount);
    const recommendedCount = c.evaluations.filter((e) => e.recommended).length;
    const avgScore = completedCount > 0
      ? (c.evaluations.reduce((acc, e) => acc + e.totalScore, 0) / completedCount).toFixed(2)
      : "N/A";

    return [
      c.id,
      `"${c.name.replace(/"/g, '""')}"`,
      c.username,
      c.email || "",
      c.phone || "",
      `"${(c.institution || "").replace(/"/g, '""')}"`,
      c.status,
      assignedCount,
      completedCount,
      pendingCount,
      recommendedCount,
      avgScore,
    ];
  });

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=session_chair_performance.csv",
    },
  });
}
