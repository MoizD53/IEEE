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
  if (!rahul) { console.log("No rahul user found"); return; }

  // Find a paper not yet assigned to rahul
  const paper = await prisma.paper.findFirst({
    where: { assignments: { none: { chairId: rahul.id } } }
  });

  if (paper) {
    await prisma.paperAssignment.create({
      data: { paperId: paper.id, chairId: rahul.id, status: "ACTIVE" }
    });
    await prisma.paper.update({ where: { id: paper.id }, data: { status: "ASSIGNED" } });
    console.log(`Assigned paper '${paper.paperId}' to rahul`);
  } else {
    console.log("No unassigned paper available for rahul");
  }

  // Add audit log so Test 20 has entries
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (admin) {
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "LOGIN_SUCCESS",
        entityType: "USER",
        entityId: admin.id,
        metadata: "Security test setup: admin login recorded"
      }
    });
    console.log("Created audit log entry");
  }

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
