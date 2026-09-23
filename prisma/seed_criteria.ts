import { prisma } from "../src/lib/db";

async function main() {
  await prisma.evaluationCriterion.deleteMany({});
  
  const criteria = [
    { name: "Relevance, Significance & Novelty", description: "Relevance of the problem, significance, originality and novelty of the approach.", maxScore: 10, order: 1 },
    { name: "Technical Quality & Methodology", description: "Theoretical soundness, technical depth, research design, and methodology.", maxScore: 10, order: 2 },
    { name: "Results & Research Contribution", description: "Experimental rigor, comparative benchmark results, validation, and contribution.", maxScore: 10, order: 3 },
    { name: "Presentation Quality & Clarity", description: "Visual slide design, clarity of delivery, organization, pacing, and time management.", maxScore: 10, order: 4 },
    { name: "Q&A / Subject Knowledge", description: "Defense of research, clarity in answering queries, and command of subject knowledge.", maxScore: 10, order: 5 },
  ];

  for (const c of criteria) {
    await prisma.evaluationCriterion.create({ data: c });
  }

  console.log("Successfully seeded 5 evaluation criteria (10 marks each)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
