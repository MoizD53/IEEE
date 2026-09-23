import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import * as bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

async function runVerification() {
  const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  console.log("===============================================================================");
  console.log("🔍 IEEE CSM PORTAL - TURSO DATABASE COMPLIANCE & INTEGRATION VERIFICATION");
  console.log("===============================================================================");

  if (!url || (!url.startsWith("libsql://") && !url.startsWith("https://"))) {
    console.error("❌ Turso URL not detected in DATABASE_URL or TURSO_DATABASE_URL.");
    console.error("Please provide DATABASE_URL=libsql://... and TURSO_AUTH_TOKEN=...");
    process.exit(1);
  }

  if (!authToken) {
    console.error("❌ TURSO_AUTH_TOKEN is missing.");
    process.exit(1);
  }

  console.log("1️⃣ Initializing LibSQL client and Prisma Driver Adapter...");
  const libsql = createClient({ url, authToken });
  const adapter = new PrismaLibSQL(libsql);
  const prisma = new PrismaClient({ adapter });

  console.log("2️⃣ Testing raw connection ping...");
  await libsql.execute("SELECT 1 as test_ping;");
  console.log("   ✅ Connection established successfully!");

  console.log("3️⃣ Verifying Admin authentication (username: admin)...");
  const adminUser = await prisma.user.findUnique({ where: { username: "admin" } });
  if (!adminUser) {
    throw new Error("Admin user not found. Please run seed script first.");
  }
  const adminMatch = await bcrypt.compare("admin123", adminUser.passwordHash);
  if (!adminMatch) {
    throw new Error("Admin password comparison failed.");
  }
  console.log(`   ✅ Admin authenticated: ${adminUser.name} (${adminUser.role})`);

  console.log("4️⃣ Verifying Session Chair authentication (username: pooja)...");
  const chairUser = await prisma.user.findUnique({ where: { username: "pooja" } });
  if (!chairUser) {
    throw new Error("Chair user 'pooja' not found.");
  }
  const chairMatch = await bcrypt.compare("pooja123", chairUser.passwordHash);
  if (!chairMatch) {
    throw new Error("Chair password comparison failed.");
  }
  console.log(`   ✅ Session Chair authenticated: ${chairUser.name} (${chairUser.role})`);

  console.log("5️⃣ Testing 'Create Chair' workflow...");
  const testChairUsername = `test_chair_${Date.now()}`;
  const testChairHash = await bcrypt.hash("test1234", 10);
  const testChair = await prisma.user.create({
    data: {
      username: testChairUsername,
      name: "Test Verification Chair",
      passwordHash: testChairHash,
      role: "SESSION_CHAIR",
      email: `${testChairUsername}@test.ieee.org`,
      institution: "Test University",
    },
  });
  console.log(`   ✅ Created chair: ${testChair.name} [ID: ${testChair.id}]`);

  console.log("6️⃣ Testing 'Create Paper' workflow...");
  const testPaperId = `IEEE-TEST-${Date.now().toString().slice(-4)}`;
  const testPaper = await prisma.paper.create({
    data: {
      paperId: testPaperId,
      title: "Verification of Autonomous libSQL Adapters for IEEE Systems",
      authors: "Tester Alpha, Tester Beta",
      abstract: "Comprehensive verification of database persistence in distributed cloud environments.",
      keywords: "Prisma, Turso, libSQL, Distributed Databases",
      track: "Cloud & Distributed Computing",
      session: "Track Test - Hall 9",
      status: "UNASSIGNED",
    },
  });
  console.log(`   ✅ Created paper: ${testPaper.title} [Paper ID: ${testPaper.paperId}]`);

  console.log("7️⃣ Testing 'Assign Paper' workflow...");
  const testAssignment = await prisma.paperAssignment.create({
    data: {
      paperId: testPaper.id,
      chairId: testChair.id,
    },
  });
  console.log(`   ✅ Assigned paper ${testPaper.paperId} to chair ${testChair.username}`);

  console.log("8️⃣ Testing 'Submit Evaluation' (4-Block evaluation & Recommendation)...");
  const testEvaluation = await prisma.evaluation.create({
    data: {
      paperId: testPaper.id,
      chairId: testChair.id,
      technicalScore: 5,
      originalityScore: 4,
      relevanceScore: 5,
      presentationScore: 4,
      totalScore: 18,
      averageScore: 4.5,
      recommended: true,
      feedbackRating: 5,
      feedbackText: "Flawless verification evaluation submitted via Turso adapter.",
      status: "SUBMITTED",
      submittedAt: new Date(),
    },
  });
  console.log(`   ✅ Submitted evaluation with score ${testEvaluation.totalScore}/20, Recommended: ${testEvaluation.recommended}`);

  console.log("9️⃣ Testing 'Feedback' query...");
  const feedbackList = await prisma.evaluation.findMany({
    where: { status: "SUBMITTED", feedbackText: { not: null } },
    include: { paper: true, chair: true },
  });
  console.log(`   ✅ Retrieved ${feedbackList.length} feedback records with paper & chair relations`);

  console.log("🔟 Testing 'Admin Analytics' aggregation queries...");
  const totalPapers = await prisma.paper.count();
  const evaluatedCount = await prisma.paper.count({ where: { status: "EVALUATED" } });
  const totalChairs = await prisma.user.count({ where: { role: "SESSION_CHAIR" } });
  const recommendedCount = await prisma.evaluation.count({ where: { recommended: true } });
  console.log(`   ✅ Analytics aggregation results:`);
  console.log(`      - Total Papers: ${totalPapers}`);
  console.log(`      - Total Session Chairs: ${totalChairs}`);
  console.log(`      - Recommended Papers: ${recommendedCount}`);

  console.log("1️⃣1️⃣ Testing Data Persistence across second client session / restart simulation...");
  await prisma.$disconnect();
  // Simulate complete disconnect & recreate client
  const prismaSession2 = new PrismaClient({ adapter: new PrismaLibSQL(createClient({ url, authToken })) });
  const persistedPaper = await prismaSession2.paper.findUnique({
    where: { id: testPaper.id },
    include: { evaluations: true, assignments: true },
  });
  if (!persistedPaper || persistedPaper.evaluations.length === 0) {
    throw new Error("Persistence check failed: record not found in session 2.");
  }
  console.log("   ✅ Persistence verified: Record retrieved successfully in independent second session!");

  console.log("1️⃣2️⃣ Cleaning up test records...");
  await prismaSession2.evaluation.delete({ where: { id: testEvaluation.id } });
  await prismaSession2.paperAssignment.delete({ where: { id: testAssignment.id } });
  await prismaSession2.paper.delete({ where: { id: testPaper.id } });
  await prismaSession2.user.delete({ where: { id: testChair.id } });
  await prismaSession2.$disconnect();
  console.log("   ✅ Temporary verification artifacts cleaned up successfully!");

  console.log("===============================================================================");
  console.log("🎉 ALL TURSO DATABASE INTEGRATION CHECKS PASSED WITH 100% COMPLIANCE!");
  console.log("===============================================================================");
}

runVerification().catch((err) => {
  console.error("❌ Verification failed:", err);
  process.exit(1);
});
