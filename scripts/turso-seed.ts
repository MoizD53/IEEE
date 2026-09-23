import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import * as bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

async function seedTurso() {
  const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || (!url.startsWith("libsql://") && !url.startsWith("https://"))) {
    console.error("❌ Error: Valid Turso URL (libsql://... or https://...) required.");
    process.exit(1);
  }

  const libsql = createClient({ url, authToken });
  const adapter = new PrismaLibSQL(libsql);
  const prisma = new PrismaClient({ adapter });

  console.log("🌱 Seeding Turso cloud database with initial conference data...");

  // 1. Admin User
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      passwordHash: adminPasswordHash,
      name: "System Admin",
      role: "ADMIN",
      email: "admin@csm-ieee.org",
      institution: "IEEE CSM Secretariat",
    },
  });
  console.log("✅ Admin user seeded:", admin.username);

  // 2. Demo Session Chairs
  const chairPasswordHash = await bcrypt.hash("pooja123", 10);
  const pooja = await prisma.user.upsert({
    where: { username: "pooja" },
    update: {},
    create: {
      username: "pooja",
      passwordHash: chairPasswordHash,
      name: "Dr. Pooja Sharma",
      role: "SESSION_CHAIR",
      email: "pooja.sharma@karnavatiuniversity.edu.in",
      institution: "Unitedworld Institute of Technology (UIT)",
    },
  });

  const rahulPasswordHash = await bcrypt.hash("rahul123", 10);
  const rahul = await prisma.user.upsert({
    where: { username: "rahul" },
    update: {},
    create: {
      username: "rahul",
      passwordHash: rahulPasswordHash,
      name: "Prof. Rahul Verma",
      role: "SESSION_CHAIR",
      email: "rahul.verma@ieee-gujarat.org",
      institution: "IEEE Gujarat Section",
    },
  });

  const amitPasswordHash = await bcrypt.hash("amit123", 10);
  const amit = await prisma.user.upsert({
    where: { username: "amit" },
    update: {},
    create: {
      username: "amit",
      passwordHash: amitPasswordHash,
      name: "Dr. Amit Kumar",
      role: "SESSION_CHAIR",
      email: "amit.kumar@ieee.org",
      institution: "UID School of Computing",
    },
  });
  console.log("✅ Session Chairs seeded: pooja, rahul, amit");

  // 3. Demo Papers
  const papers = [
    {
      paperId: "IEEE-2026-101",
      title: "Autonomous UAV Swarm Coordination for Disaster Response Networks",
      authors: "Dr. Alok Verma, Sneha Patel, Dr. Rajesh Shah",
      abstract:
        "This paper proposes a decentralized mesh-routing algorithm for UAV swarms operating in degraded communication environments following natural disasters.",
      keywords: "UAV Swarms, Mesh Networks, Disaster Management, Distributed Robotics",
      track: "Robotics & Autonomous Systems",
      session: "Track A - Hall 1 (Morning)",
      status: "EVALUATED",
    },
    {
      paperId: "IEEE-2026-102",
      title: "Zero-Trust Blockchain Framework for Healthcare IoT Security",
      authors: "Meera Nair, Vikram Malhotra, Dr. Ramesh K.",
      abstract:
        "A hybrid lightweight cryptographic architecture designed for constrained medical sensor networks ensuring HIPAA and IEEE 802.15.6 compliance.",
      keywords: "Blockchain, Zero Trust, IoT Security, Medical Sensors",
      track: "Cybersecurity & Blockchain",
      session: "Track B - Hall 2 (Morning)",
      status: "ASSIGNED",
    },
    {
      paperId: "IEEE-2026-103",
      title: "Deep Reinforcement Learning for Adaptive Traffic Signal Scheduling in Smart Cities",
      authors: "Kavita Rao, Daniel Chen, Dr. Sanjay Joshi",
      abstract:
        "We present a multi-agent deep Q-learning formulation with graph neural representations of urban intersection grids to reduce vehicle latency by 34%.",
      keywords: "Reinforcement Learning, Smart Cities, Traffic Optimization, Multi-Agent Systems",
      track: "Artificial Intelligence & Smart Cities",
      session: "Track C - Audi 1 (Afternoon)",
      status: "ASSIGNED",
    },
    {
      paperId: "IEEE-2026-001",
      title: "Advances in Neuromorphic Edge Computing",
      authors: "Dr. Kiran Desai, Prof. Anita Sharma",
      abstract: "Ultra-low power spiking neural networks implemented on memristive crossbar arrays.",
      keywords: "Neuromorphic, Edge AI, Spiking Neural Networks",
      track: "VLSI & Hardware Systems",
      session: "Track D - Hall 3 (Afternoon)",
      status: "UNASSIGNED",
    },
    {
      paperId: "IEEE-2026-002",
      title: "Quantum Key Distribution across Free-Space Satellite Links",
      authors: "Dr. Vikram Sarabhai, Dr. Priya Menon",
      abstract: "Atmospheric turbulence mitigation for continuous-variable quantum key distribution.",
      keywords: "Quantum Key Distribution, Optical Communications, Satellite Networks",
      track: "Quantum Communications",
      session: "Track E - Hall 4 (Morning)",
      status: "UNASSIGNED",
    },
  ];

  for (const p of papers) {
    await prisma.paper.upsert({
      where: { paperId: p.paperId },
      update: {},
      create: p,
    });
  }
  console.log("✅ 5 Papers seeded successfully");

  // 4. Assignments for Dr. Pooja Sharma
  const p101 = await prisma.paper.findUnique({ where: { paperId: "IEEE-2026-101" } });
  const p102 = await prisma.paper.findUnique({ where: { paperId: "IEEE-2026-102" } });
  const p103 = await prisma.paper.findUnique({ where: { paperId: "IEEE-2026-103" } });

  if (p101 && p102 && p103) {
    await prisma.paperAssignment.upsert({
      where: { paperId_chairId: { paperId: p101.id, chairId: pooja.id } },
      update: {},
      create: { paperId: p101.id, chairId: pooja.id },
    });
    await prisma.paperAssignment.upsert({
      where: { paperId_chairId: { paperId: p102.id, chairId: pooja.id } },
      update: {},
      create: { paperId: p102.id, chairId: pooja.id },
    });
    await prisma.paperAssignment.upsert({
      where: { paperId_chairId: { paperId: p103.id, chairId: pooja.id } },
      update: {},
      create: { paperId: p103.id, chairId: pooja.id },
    });
    console.log("✅ Assignments for Dr. Pooja Sharma created");

    // 5. Evaluation for p101
    await prisma.evaluation.upsert({
      where: { paperId_chairId: { paperId: p101.id, chairId: pooja.id } },
      update: {},
      create: {
        paperId: p101.id,
        chairId: pooja.id,
        relevanceNoveltyScore: 9,
        technicalMethodologyScore: 9,
        resultsContributionScore: 8,
        presentationClarityScore: 9,
        qaKnowledgeScore: 8,
        totalScore: 43,
        averageScore: 8.6,
        recommended: true,
        feedbackRating: 5,
        feedbackText:
          "Outstanding formulation with robust simulations across multi-intersection traffic networks. Highly recommended for IEEE publication.",
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
    });
    console.log("✅ Evaluation and recommendation seeded");
  }

  await prisma.$disconnect();
  console.log("🎉 Turso database seed completed successfully!");
}

seedTurso().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
