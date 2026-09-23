import { createClient } from "@libsql/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
dotenv.config();

const client = createClient({ url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN });
const adapter = new PrismaLibSQL(client);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const rahul = await prisma.user.findFirst({ where: { username: "rahul" } });
  const pooja = await prisma.user.findFirst({ where: { username: "pooja" } });
  if (!rahul || !pooja) { console.log("Users not found"); return; }

  const poojaAssignedIds = (await prisma.paperAssignment.findMany({
    where: { chairId: pooja.id },
    select: { paperId: true }
  })).map(a => a.paperId);

  const rahulAssignments = await prisma.paperAssignment.findMany({
    where: { chairId: rahul.id },
    select: { paperId: true }
  });

  // Remove all current Rahul assignments
  for (const a of rahulAssignments) {
    await prisma.paperAssignment.delete({ where: { paperId_chairId: { paperId: a.paperId, chairId: rahul.id } } });
    console.log("Removed rahul assignment from paper:", a.paperId);
  }

  // Find a paper NOT assigned to pooja
  const exclusivePaper = await prisma.paper.findFirst({
    where: { id: { notIn: poojaAssignedIds } }
  });

  if (!exclusivePaper) {
    // Create a brand new paper for this test
    const newPaper = await prisma.paper.create({
      data: {
        paperId: "IEEE-RAHUL-EXCLUSIVE-001",
        title: "Rahul Exclusive Test Paper",
        authors: "Test Author",
        abstract: "Test abstract for IDOR testing",
        keywords: "test",
        track: "Test",
        session: "S1",
        status: "UNASSIGNED"
      }
    });
    await prisma.paperAssignment.create({ data: { paperId: newPaper.id, chairId: rahul.id, status: "ACTIVE" } });
    await prisma.paper.update({ where: { id: newPaper.id }, data: { status: "ASSIGNED" } });
    console.log("Created new exclusive paper and assigned to rahul:", newPaper.paperId);
  } else {
    await prisma.paperAssignment.create({ data: { paperId: exclusivePaper.id, chairId: rahul.id, status: "ACTIVE" } });
    await prisma.paper.update({ where: { id: exclusivePaper.id }, data: { status: "ASSIGNED" } });
    console.log("Assigned exclusive paper to rahul:", exclusivePaper.paperId);
  }

  console.log("Done.");
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
