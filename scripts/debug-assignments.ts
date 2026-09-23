import { createClient } from "@libsql/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
dotenv.config();

const client = createClient({ url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN });
const adapter = new PrismaLibSQL(client);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const pooja = await prisma.user.findFirst({ where: { username: "pooja" } });
  const rahul = await prisma.user.findFirst({ where: { username: "rahul" } });

  const poojaAssignments = await prisma.paperAssignment.findMany({
    where: { chairId: pooja!.id, status: "ACTIVE" },
    select: { paperId: true }
  });
  const rahulAssignment = await prisma.paperAssignment.findFirst({
    where: { chairId: rahul!.id, status: "ACTIVE" }
  });

  console.log("Pooja assigned papers:", poojaAssignments.map(a => a.paperId));
  console.log("Rahul assigned paper:", rahulAssignment?.paperId);
  console.log("Same paper?", poojaAssignments.some(a => a.paperId === rahulAssignment?.paperId));

  // Check if pooja has cross-assignment to rahul's paper
  if (rahulAssignment) {
    const cross = await prisma.paperAssignment.findUnique({
      where: { paperId_chairId: { paperId: rahulAssignment.paperId, chairId: pooja!.id } }
    });
    console.log("Cross assignment (should be null):", cross);
  }

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
