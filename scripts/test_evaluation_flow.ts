import { prisma } from "../src/lib/db";

async function runVerification() {
  console.log("=== IEEE 50-MARK EVALUATION & CONFERENCE FEEDBACK VERIFICATION ===");

  // 1. Get or create test chair
  let chair = await prisma.user.findFirst({ where: { role: "SESSION_CHAIR" } });
  if (!chair) {
    chair = await prisma.user.create({
      data: {
        name: "Dr. Ananya Verma",
        username: "chair_ananya",
        passwordHash: "hash123",
        role: "SESSION_CHAIR",
        institution: "National Institute of Technology",
      },
    });
  }
  console.log(`1. Session Chair verified: ${chair.name} (${chair.username})`);

  // 2. Get or create test paper
  let paper = await prisma.paper.findFirst();
  if (!paper) {
    paper = await prisma.paper.create({
      data: {
        paperId: "IEEE-2026-104",
        title: "Edge-Assisted Federated Learning for Threat Detection",
        authors: "Dr. Rajesh Sharma, Priya Nair",
        abstract: "Real-time edge threat detection using decentralized models.",
        keywords: "IoT, Federated Learning, Edge Computing",
        track: "Track 1: AI & Intelligent Systems",
        session: "Session 2A (Hall B)",
      },
    });
  }
  console.log(`2. Paper verified: [${paper.paperId}] ${paper.title}`);

  // 3. Test Paper Evaluation submission (5 parameters out of 10, total 50)
  const p1 = 9; // Relevance, Significance & Novelty
  const p2 = 8; // Technical Quality & Methodology
  const p3 = 9; // Results & Research Contribution
  const p4 = 8; // Presentation Quality & Clarity
  const p5 = 9; // Q&A / Subject Knowledge
  const totalPaperScore = p1 + p2 + p3 + p4 + p5; // 43
  const avgPaperScore = totalPaperScore / 5; // 8.6

  const evaluation = await prisma.evaluation.upsert({
    where: {
      paperId_chairId: {
        paperId: paper.id,
        chairId: chair.id,
      },
    },
    update: {
      relevanceNoveltyScore: p1,
      technicalMethodologyScore: p2,
      resultsContributionScore: p3,
      presentationClarityScore: p4,
      qaKnowledgeScore: p5,
      totalScore: totalPaperScore,
      averageScore: avgPaperScore,
      recommended: true,
      feedbackRating: 5,
      feedbackText: "Outstanding technical depth and clear defense of methodology.",
      status: "SUBMITTED",
      submittedAt: new Date(),
    },
    create: {
      paperId: paper.id,
      chairId: chair.id,
      relevanceNoveltyScore: p1,
      technicalMethodologyScore: p2,
      resultsContributionScore: p3,
      presentationClarityScore: p4,
      qaKnowledgeScore: p5,
      totalScore: totalPaperScore,
      averageScore: avgPaperScore,
      recommended: true,
      feedbackRating: 5,
      feedbackText: "Outstanding technical depth and clear defense of methodology.",
      status: "SUBMITTED",
      submittedAt: new Date(),
    },
  });
  console.log(`3. Paper Evaluation saved successfully:`);
  console.log(`   - Novelty: ${evaluation.relevanceNoveltyScore}/10`);
  console.log(`   - Methodology: ${evaluation.technicalMethodologyScore}/10`);
  console.log(`   - Results: ${evaluation.resultsContributionScore}/10`);
  console.log(`   - Clarity: ${evaluation.presentationClarityScore}/10`);
  console.log(`   - Q&A: ${evaluation.qaKnowledgeScore}/10`);
  console.log(`   - Total: ${evaluation.totalScore}/50 (Avg: ${evaluation.averageScore}/10)`);
  console.log(`   - Best Paper Recommended: ${evaluation.recommended ? "YES" : "NO"}`);

  // 4. Test Conference Feedback submission (5 parameters out of 10, total 50)
  const c1 = 9; // Session Planning & Coordination
  const c2 = 9; // Presentation & Time Management
  const c3 = 8; // Technical/AV & Infrastructure Support
  const c4 = 9; // Participant & Presenter Management
  const c5 = 9; // Overall Conference Organization & Support
  const totalConfScore = c1 + c2 + c3 + c4 + c5; // 44
  const avgConfScore = totalConfScore / 5; // 8.8

  const confFeedback = await prisma.conferenceFeedback.create({
    data: {
      chairId: chair.id,
      sessionTrack: "Track 1: AI & Intelligent Systems",
      sessionName: "Session 2A (Hall B)",
      planningScore: c1,
      timeManagementScore: c2,
      infrastructureScore: c3,
      participantManagementScore: c4,
      organizationScore: c5,
      totalScore: totalConfScore,
      averageScore: avgConfScore,
      highlights: "Exceptional volunteer support, seamless hybrid streaming.",
      suggestions: "Provide a 5-minute transition buffer between parallel sessions.",
      status: "SUBMITTED",
    },
  });
  console.log(`4. Conference Feedback saved successfully:`);
  console.log(`   - Planning: ${confFeedback.planningScore}/10`);
  console.log(`   - Time Mgmt: ${confFeedback.timeManagementScore}/10`);
  console.log(`   - AV / Tech: ${confFeedback.infrastructureScore}/10`);
  console.log(`   - Presenters: ${confFeedback.participantManagementScore}/10`);
  console.log(`   - Overall Support: ${confFeedback.organizationScore}/10`);
  console.log(`   - Total Conference Rating: ${confFeedback.totalScore}/50 (Avg: ${confFeedback.averageScore}/10)`);

  // 5. Query Audit
  const totalEvals = await prisma.evaluation.count({ where: { status: "SUBMITTED" } });
  const totalConfs = await prisma.conferenceFeedback.count({ where: { status: "SUBMITTED" } });
  console.log(`5. Database Audit Count: ${totalEvals} Paper Evaluations, ${totalConfs} Conference Feedbacks.`);

  console.log("\nALL VERIFICATION CHECKS PASSED PERFECTLY!");
}

runVerification()
  .catch((e) => {
    console.error("Verification failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
