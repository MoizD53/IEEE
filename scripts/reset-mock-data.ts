import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import * as bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

async function resetDatabase(name: string, prisma: PrismaClient) {
  console.log(`\n==================================================`);
  console.log(`🧹 RESETTING DATA IN: ${name}`);
  console.log(`==================================================`);

  // 1. Delete all Evaluations
  const deletedEvals = await prisma.evaluation.deleteMany({});
  console.log(`✅ Deleted evaluations: ${deletedEvals.count}`);

  // 2. Delete all ConferenceFeedbacks (if model exists)
  try {
    const deletedFeedbacks = await prisma.conferenceFeedback.deleteMany({});
    console.log(`✅ Deleted conference feedbacks: ${deletedFeedbacks.count}`);
  } catch (e: any) {
    console.log(`ℹ️ ConferenceFeedback table not present or empty:`, e.message);
  }

  // 3. Delete all PaperAssignments
  const deletedAssignments = await prisma.paperAssignment.deleteMany({});
  console.log(`✅ Deleted paper assignments: ${deletedAssignments.count}`);

  // 4. Delete all AuditLogs
  const deletedAudit = await prisma.auditLog.deleteMany({});
  console.log(`✅ Deleted audit logs: ${deletedAudit.count}`);

  // 5. Delete all papers
  const deletedPapers = await prisma.paper.deleteMany({});
  console.log(`✅ Deleted all papers: ${deletedPapers.count}`);

  // 6. Delete all SESSION_CHAIR users, but keep the ADMIN user
  const deletedChairs = await prisma.user.deleteMany({
    where: {
      role: "SESSION_CHAIR",
    },
  });
  console.log(`✅ Deleted mock session chairs: ${deletedChairs.count}`);

  // Ensure Admin user exists with valid credentials
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
    create: {
      username: "admin",
      passwordHash: adminPasswordHash,
      name: "System Admin",
      role: "ADMIN",
      email: "admin@cicon-ieee.org",
      institution: "IEEE CICON Secretariat",
    },
  });
  console.log(`✅ Admin user verified: ${admin.username} (${admin.name})`);

  // Print summary counts
  const paperCount = await prisma.paper.count();
  const chairCount = await prisma.user.count({ where: { role: "SESSION_CHAIR" } });
  const assignmentCount = await prisma.paperAssignment.count();
  const evalCount = await prisma.evaluation.count();
  const userCount = await prisma.user.count();

  console.log(`\n📊 Current Stats in ${name}:`);
  console.log(`   - Papers (kept): ${paperCount}`);
  console.log(`   - Session Chairs: ${chairCount}`);
  console.log(`   - Assignments: ${assignmentCount}`);
  console.log(`   - Evaluations: ${evalCount}`);
  console.log(`   - Total Users: ${userCount} (1 Admin only)`);
}

async function main() {
  // 1. Reset Local Database
  console.log("Checking local database...");
  const localPrisma = new PrismaClient();
  await resetDatabase("LOCAL SQLITE (dev.db)", localPrisma);
  await localPrisma.$disconnect();

  // 2. Check Turso Cloud Database
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

  if (tursoUrl && tursoAuthToken) {
    console.log("\nConnecting to Turso Cloud Database...");
    const client = createClient({ url: tursoUrl, authToken: tursoAuthToken });

    // Check columns of Evaluation in Turso
    try {
      const tableInfo = await client.execute("PRAGMA table_info('Evaluation');");
      const columnNames = tableInfo.rows.map((r: any) => r.name);
      console.log("Turso Evaluation columns:", columnNames);

      // Check if relevanceNoveltyScore is missing in Turso
      if (!columnNames.includes("relevanceNoveltyScore")) {
        console.log("⚠️ Turso Evaluation table is missing columns. Syncing schema...");
        // Add missing columns if needed
        const missingCols = [
          "ALTER TABLE Evaluation ADD COLUMN relevanceNoveltyScore INTEGER NOT NULL DEFAULT 0;",
          "ALTER TABLE Evaluation ADD COLUMN technicalMethodologyScore INTEGER NOT NULL DEFAULT 0;",
          "ALTER TABLE Evaluation ADD COLUMN resultsContributionScore INTEGER NOT NULL DEFAULT 0;",
          "ALTER TABLE Evaluation ADD COLUMN presentationClarityScore INTEGER NOT NULL DEFAULT 0;",
          "ALTER TABLE Evaluation ADD COLUMN qaKnowledgeScore INTEGER NOT NULL DEFAULT 0;",
          "ALTER TABLE Evaluation ADD COLUMN averageScore REAL NOT NULL DEFAULT 0;",
          "ALTER TABLE Evaluation ADD COLUMN feedbackRating INTEGER;",
          "ALTER TABLE Evaluation ADD COLUMN feedbackText TEXT;",
          "ALTER TABLE Evaluation ADD COLUMN submittedAt DATETIME;",
        ];
        for (const colSql of missingCols) {
          try {
            await client.execute(colSql);
            console.log(`Applied: ${colSql}`);
          } catch (e: any) {
            // column might already exist
          }
        }
      }

      // Check if ConferenceFeedback table exists in Turso
      const cfCheck = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='ConferenceFeedback';");
      if (cfCheck.rows.length === 0) {
        console.log("⚠️ Creating ConferenceFeedback table in Turso...");
        await client.execute(`
          CREATE TABLE "ConferenceFeedback" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "chairId" TEXT NOT NULL,
            "sessionTrack" TEXT,
            "sessionName" TEXT,
            "planningScore" INTEGER NOT NULL,
            "timeManagementScore" INTEGER NOT NULL,
            "infrastructureScore" INTEGER NOT NULL,
            "participantManagementScore" INTEGER NOT NULL,
            "organizationScore" INTEGER NOT NULL,
            "totalScore" INTEGER NOT NULL,
            "averageScore" REAL NOT NULL,
            "highlights" TEXT,
            "suggestions" TEXT,
            "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
            "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" DATETIME NOT NULL,
            CONSTRAINT "ConferenceFeedback_chairId_fkey" FOREIGN KEY ("chairId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
          );
        `);
        console.log("✅ ConferenceFeedback table created in Turso");
      }

      const tursoAdapter = new PrismaLibSQL(client);
      const tursoPrisma = new PrismaClient({ adapter: tursoAdapter });
      await resetDatabase("TURSO CLOUD DATABASE", tursoPrisma);
      await tursoPrisma.$disconnect();
    } catch (err: any) {
      console.error("Turso error:", err.message);
    }
  }

  console.log("\n🎉 ALL MOCK DATA RESET COMPLETE: Everything is back to 0 except papers!");
}

main().catch((err) => {
  console.error("Execution failed:", err);
  process.exit(1);
});
