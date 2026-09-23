import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const pooja = await prisma.user.findUnique({
    where: { username: "pooja" },
  });

  if (!pooja) {
    console.error("Pooja account not found!");
    return;
  }

  console.log(`Found Pooja with ID: ${pooja.id}`);

  const papers = [
    {
      paperId: "IEEE-2026-101",
      title: "Autonomous UAV Swarm Coordination for Disaster Response Networks",
      authors: "Dr. A. K. Sharma, Neha Patel, Vikramaditya Rao",
      abstract:
        "This paper presents a decentralized consensus algorithm for unmanned aerial vehicle (UAV) swarms operating in GPS-denied environments during disaster recovery missions. Experimental simulations exhibit a 34% reduction in packet delivery delay and robust failover fault tolerance.",
      keywords: "UAV Swarms, Distributed Consensus, Disaster Recovery, Mobile Ad-Hoc Networks",
      track: "Robotics & Autonomous Systems",
      session: "Session 2B: Aerial Computing & Robotics",
      status: "ASSIGNED",
    },
    {
      paperId: "IEEE-2026-102",
      title: "Zero-Trust Blockchain Framework for Healthcare IoT Security",
      authors: "Pooja Trivedi, Rajesh Singhania, Dr. Elena Rostova",
      abstract:
        "We formulate a lightweight Byzantine fault-tolerant smart contract infrastructure tailored for resource-constrained wearable biomedical sensors, guaranteeing tamper-proof audit trails for Electronic Health Records (EHR).",
      keywords: "Zero-Trust Architecture, Blockchain, Medical IoT, Cryptographic Authentication",
      track: "Cybersecurity & Blockchain",
      session: "Session 3A: IoT Privacy and Cryptography",
      status: "ASSIGNED",
    },
    {
      paperId: "IEEE-2026-103",
      title: "Deep Reinforcement Learning for Adaptive Traffic Signal Scheduling in Smart Cities",
      authors: "Arjun Nambiar, Kavita Mehra, Dr. C. S. Subramanian",
      abstract:
        "An end-to-end multi-agent deep reinforcement learning controller implemented on city-scale microscopic road simulations, achieving a 28.4% improvement in intersection throughput.",
      keywords: "Deep Reinforcement Learning, Multi-Agent Systems, Smart Mobility, Traffic Control",
      track: "Artificial Intelligence & Smart Systems",
      session: "Session 1A: Next-Gen Machine Learning",
      status: "ASSIGNED",
    },
  ];

  for (const p of papers) {
    const paper = await prisma.paper.upsert({
      where: { paperId: p.paperId },
      update: {
        title: p.title,
        authors: p.authors,
        abstract: p.abstract,
        keywords: p.keywords,
        track: p.track,
        session: p.session,
        status: p.status,
      },
      create: p,
    });

    await prisma.paperAssignment.upsert({
      where: {
        paperId_chairId: {
          paperId: paper.id,
          chairId: pooja.id,
        },
      },
      update: {
        status: "ACTIVE",
      },
      create: {
        paperId: paper.id,
        chairId: pooja.id,
        status: "ACTIVE",
      },
    });

    console.log(`Assigned ${p.paperId} to Pooja`);
  }

  console.log("Successfully seeded demo papers for Pooja!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
