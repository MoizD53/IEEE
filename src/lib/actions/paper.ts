"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function getPapers() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");
  
  return prisma.paper.findMany({
    orderBy: { createdAt: "desc" }
  });
}

export async function createPaper(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

  const paperId = formData.get("paperId") as string;
  const title = formData.get("title") as string;
  const authors = formData.get("authors") as string;
  const abstract = formData.get("abstract") as string;
  const track = formData.get("track") as string;
  const sessionName = formData.get("session") as string;
  const keywords = formData.get("keywords") as string;

  if (!paperId || !title || !authors) {
    throw new Error("Missing required fields");
  }

  const existing = await prisma.paper.findUnique({ where: { paperId } });
  if (existing) {
    throw new Error("Paper ID already exists");
  }

  // Normally we would handle PDF upload here, but for this iteration we'll just save metadata
  
  const newPaper = await prisma.paper.create({
    data: {
      paperId,
      title,
      authors,
      abstract,
      track,
      session: sessionName,
      keywords,
      status: "UNASSIGNED"
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "CREATE_PAPER",
      entityType: "PAPER",
      entityId: newPaper.id,
      metadata: `Created paper ${paperId}`
    }
  });

  revalidatePath("/admin/papers");
}
