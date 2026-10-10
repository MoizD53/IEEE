import { PrismaClient } from "@prisma/client";

async function fixLocal() {
  const prisma = new PrismaClient();
  try {
    const papers = await prisma.paper.findMany({
      where: {
        session: { contains: "10-10-2026" }
      }
    });
    for (const p of papers) {
      const newSession = p.session.replace("10-10-2026", "09-10-2026");
      await prisma.paper.update({
        where: { id: p.id },
        data: { session: newSession }
      });
    }
    console.log(`Updated ${papers.length} papers in local DB.`);
  } finally {
    await prisma.$disconnect();
  }
}
fixLocal();
