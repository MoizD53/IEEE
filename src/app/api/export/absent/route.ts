import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 });

  const papers = await prisma.paper.findMany({
    where: { status: "ABSENT" },
    include: {
      assignments: {
        include: { chair: true },
        where: { status: "ACTIVE" }
      }
    }
  });
  
  const headers = ["Internal ID", "Paper ID", "Title", "Authors", "Track", "Session", "Assigned Chair"];
  const rows = papers.map(p => {
    const chairName = p.assignments.length > 0 ? p.assignments[0].chair.name : "Unassigned";
    return [
      p.id, 
      p.paperId, 
      `"${p.title.replace(/"/g, '""')}"`, 
      `"${p.authors.replace(/"/g, '""')}"`, 
      `"${(p.track || "").replace(/"/g, '""')}"`, 
      `"${(p.session || "").replace(/"/g, '""')}"`, 
      `"${chairName.replace(/"/g, '""')}"`
    ];
  });
  
  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=absent_papers.csv"
    }
  });
}
