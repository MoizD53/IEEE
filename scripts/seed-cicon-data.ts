import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting CICON-2026 Conference Seeding...");

  // 1. Ensure Admin User
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      name: "System Admin",
      username: "admin",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      email: "admin@cicon2026.org",
      institution: "IEEE CSM / Karnavati University Secretariat",
      status: "ACTIVE",
    },
  });
  console.log("✅ Admin user ready: admin");

  // Read structured JSON
  const jsonPath = path.join(__dirname, "cicon_sessions_data.json");
  const sessions = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  console.log(`📋 Found ${sessions.length} sessions to seed.`);

  let createdChairs = 0;
  let createdPapers = 0;
  let createdAssignments = 0;

  for (const session of sessions) {
    const passwordHash = await bcrypt.hash(session.password, 10);

    // Upsert User (Session Chair)
    const user = await prisma.user.upsert({
      where: { username: session.username },
      update: {
        name: session.name,
        phone: session.phone || null,
        email: session.email || null,
        institution: `${session.institution} • Venue: ${session.venue} • Time: ${session.time}`,
        status: "ACTIVE",
        role: "SESSION_CHAIR",
      },
      create: {
        name: session.name,
        username: session.username,
        passwordHash,
        role: "SESSION_CHAIR",
        phone: session.phone || null,
        email: session.email || null,
        institution: `${session.institution} • Venue: ${session.venue} • Time: ${session.time}`,
        status: "ACTIVE",
      },
    });
    createdChairs++;

    // Process papers for this session
    for (const paperData of session.papers) {
      const paper = await prisma.paper.upsert({
        where: { paperId: String(paperData.paperId) },
        update: {
          title: paperData.title,
          authors: paperData.author || "Presenter",
          track: session.track,
          session: `${session.sessionName} (${session.date} ${session.time} @ ${session.venue})`,
          abstract: `Official submission for CICON-2026 in track: ${session.track}. Author contact: ${paperData.email || "N/A"}, Phone: ${paperData.phone || "N/A"}.`,
          keywords: `${session.track}, IEEE CICON-2026, Technical Presentation`,
          status: "ASSIGNED",
        },
        create: {
          paperId: String(paperData.paperId),
          title: paperData.title,
          authors: paperData.author || "Presenter",
          track: session.track,
          session: `${session.sessionName} (${session.date} ${session.time} @ ${session.venue})`,
          abstract: `Official submission for CICON-2026 in track: ${session.track}. Author contact: ${paperData.email || "N/A"}, Phone: ${paperData.phone || "N/A"}.`,
          keywords: `${session.track}, IEEE CICON-2026, Technical Presentation`,
          status: "ASSIGNED",
        },
      });
      createdPapers++;

      // Create Assignment
      await prisma.paperAssignment.upsert({
        where: {
          paperId_chairId: {
            paperId: paper.id,
            chairId: user.id,
          },
        },
        update: {
          status: "ACTIVE",
        },
        create: {
          paperId: paper.id,
          chairId: user.id,
          status: "ACTIVE",
        },
      });
      createdAssignments++;
    }
  }

  // Also if swapnil.online exists, give swapnil.parikh assignments for those papers too as an alias
  const mainSwapnil = await prisma.user.findUnique({ where: { username: "swapnil.parikh" } });
  const onlineSwapnil = await prisma.user.findUnique({ where: { username: "swapnil.online" } });
  if (mainSwapnil && onlineSwapnil) {
    const onlineAssignments = await prisma.paperAssignment.findMany({ where: { chairId: onlineSwapnil.id } });
    for (const oa of onlineAssignments) {
      await prisma.paperAssignment.upsert({
        where: {
          paperId_chairId: {
            paperId: oa.paperId,
            chairId: mainSwapnil.id,
          },
        },
        update: { status: "ACTIVE" },
        create: {
          paperId: oa.paperId,
          chairId: mainSwapnil.id,
          status: "ACTIVE",
        },
      });
    }
  }

  console.log(`\n🎉 Seed Completed Successfully!`);
  console.log(`Total Session Chairs registered: ${createdChairs}`);
  console.log(`Total Paper instances processed: ${createdPapers}`);
  console.log(`Total Paper Assignments created: ${createdAssignments}`);

  const totalUsers = await prisma.user.count();
  const totalPapersCount = await prisma.paper.count();
  const totalAssignmentsCount = await prisma.paperAssignment.count();
  console.log(`\nDatabase Counts in dev.db:`);
  console.log(`- Users: ${totalUsers}`);
  console.log(`- Papers: ${totalPapersCount}`);
  console.log(`- Assignments: ${totalAssignmentsCount}`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
