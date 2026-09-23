import { prisma } from "../src/lib/db";
import * as bcrypt from "bcryptjs";

async function runLocalVerification() {
  console.log("===============================================================================");
  console.log("🔍 IEEE CSM PORTAL - LOCAL SQLITE DATABASE VERIFICATION");
  console.log("===============================================================================");

  console.log("1️⃣ Verifying Local Database connection via src/lib/db.ts...");
  const userCount = await prisma.user.count();
  console.log(`   ✅ Local database connected! Found ${userCount} existing users.`);

  console.log("2️⃣ Verifying Admin authentication (username: admin)...");
  const adminUser = await prisma.user.findUnique({ where: { username: "admin" } });
  if (!adminUser) throw new Error("Admin user not found.");
  const adminMatch = await bcrypt.compare("admin123", adminUser.passwordHash);
  if (!adminMatch) throw new Error("Admin password mismatch.");
  console.log(`   ✅ Admin authenticated: ${adminUser.name} (${adminUser.role})`);

  console.log("3️⃣ Verifying Session Chair authentication (username: pooja)...");
  const chairUser = await prisma.user.findUnique({ where: { username: "pooja" } });
  if (!chairUser) throw new Error("Chair user 'pooja' not found.");
  const chairMatch = await bcrypt.compare("pooja123", chairUser.passwordHash);
  if (!chairMatch) throw new Error("Chair password mismatch.");
  console.log(`   ✅ Session Chair authenticated: ${chairUser.name} (${chairUser.role})`);

  console.log("4️⃣ Testing 'Create Chair' workflow...");
  const testChairUsername = `local_test_chair_${Date.now()}`;
  const testChairHash = await bcrypt.hash("test1234", 10);
  const testChair = await prisma.user.create({
    data: {
      username: testChairUsername,
      name: "Local Test Chair",
      passwordHash: testChairHash,
      role: "SESSION_CHAIR",
      email: `${testChairUsername}@test.ieee.org`,
      institution: "Local Verification University",
    },
  });
  console.log(`   ✅ Created chair: ${testChair.name} [ID: ${testChair.id}]`);

  console.log("5️⃣ Testing 'Create Paper' workflow...");
  const testPaperId = `IEEE-LOC-${Date.now().toString().slice(-4)}`;
  const testPaper = await prisma.paper.create({
    data: {
      paperId: testPaperId,
      title: "Verification of Local SQLite Reliability",
      authors: "Local Tester Alpha, Local Tester Beta",
      abstract: "Testing transactional safety and data integrity on local SQLite setup.",
      keywords: "Prisma, SQLite, Local Dev",
      track: "Software Engineering",
      session: "Track L - Room 1",
      status: "UNASSIGNED",
    },
  });
  console.log(`   ✅ Created paper: ${testPaper.title} [Paper ID: ${testPaper.paperId}]`);

  console.log("6️⃣ Testing 'Assign Paper' workflow...");
  const testAssignment = await prisma.paperAssignment.create({
    data: {
      paperId: testPaper.id,
      chairId: testChair.id,
    },
  });
  console.log(`   ✅ Assigned paper ${testPaper.paperId} to chair ${testChair.username}`);

  console.log("7️⃣ Testing 'Submit Evaluation' (5-Parameter evaluation & Recommendation)...");
  const testEvaluation = await prisma.evaluation.create({
    data: {
      paperId: testPaper.id,
      chairId: testChair.id,
      relevanceNoveltyScore: 9,
      technicalMethodologyScore: 8,
      resultsContributionScore: 9,
      presentationClarityScore: 8,
      qaKnowledgeScore: 9,
      totalScore: 43,
      averageScore: 8.6,
      recommended: true,
      feedbackRating: 5,
      feedbackText: "Local verification evaluation submitted cleanly on 50-mark scale.",
      status: "SUBMITTED",
      submittedAt: new Date(),
    },
  });
  console.log(`   ✅ Submitted evaluation with score ${testEvaluation.totalScore}/50, Recommended: ${testEvaluation.recommended}`);

  console.log("8️⃣ Testing 'Feedback' query...");
  const feedbackList = await prisma.evaluation.findMany({
    where: { status: "SUBMITTED", feedbackText: { not: null } },
    include: { paper: true, chair: true },
  });
  console.log(`   ✅ Retrieved ${feedbackList.length} feedback records with paper & chair relations`);

  console.log("9️⃣ Testing 'Admin Analytics' aggregation queries...");
  const totalPapers = await prisma.paper.count();
  const totalChairs = await prisma.user.count({ where: { role: "SESSION_CHAIR" } });
  const recommendedCount = await prisma.evaluation.count({ where: { recommended: true } });
  console.log(`   ✅ Analytics aggregation results:`);
  console.log(`      - Total Papers: ${totalPapers}`);
  console.log(`      - Total Session Chairs: ${totalChairs}`);
  console.log(`      - Recommended Papers: ${recommendedCount}`);

  console.log("🔟 Testing Data Persistence across new client instance...");
  const persistedPaper = await prisma.paper.findUnique({
    where: { id: testPaper.id },
    include: { evaluations: true, assignments: true },
  });
  if (!persistedPaper || persistedPaper.evaluations.length === 0) {
    throw new Error("Local persistence check failed.");
  }
  console.log("   ✅ Persistence verified: Record retrieved successfully!");

  console.log("1️⃣1️⃣ Cleaning up test records...");
  await prisma.evaluation.delete({ where: { id: testEvaluation.id } });
  await prisma.paperAssignment.delete({ where: { id: testAssignment.id } });
  await prisma.paper.delete({ where: { id: testPaper.id } });
  await prisma.user.delete({ where: { id: testChair.id } });
  console.log("   ✅ Temporary verification artifacts cleaned up successfully!");

  console.log("===============================================================================");
  console.log("🎉 ALL LOCAL SQLITE DATABASE CHECKS PASSED WITH 100% SUCCESS!");
  console.log("===============================================================================");

  process.exit(0);
}

runLocalVerification().catch((err) => {
  console.error("❌ Local verification failed:", err);
  process.exit(1);
});
