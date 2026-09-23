import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 });

  const papers = await prisma.paper.findMany();
  
  const headers = ["ID", "Paper ID", "Title", "Authors", "Track", "Session", "Status"];
  const rows = papers.map(p => [
    p.id, p.paperId, `"${p.title.replace(/"/g, '""')}"`, `"${p.authors.replace(/"/g, '""')}"`, 
    p.track || "", p.session || "", p.status
  ]);
  
  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=papers.csv"
    }
  });
}
