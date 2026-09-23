import { prisma } from "../src/lib/db";

async function main() {
  const users = await prisma.user.count();
  const papers = await prisma.paper.count();
  const assignments = await prisma.paperAssignment.count();
  const evaluations = await prisma.evaluation.count();

  console.log({
    users,
    papers,
    assignments,
    evaluations,
  });

  const sampleUsers = await prisma.user.findMany({
    select: { id: true, username: true, role: true, name: true },
  });
  console.log("Registered Users:", sampleUsers);

  const samplePapers = await prisma.paper.findMany({
    select: { id: true, paperId: true, title: true, status: true },
  });
  console.log("Papers:", samplePapers);

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
