import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config();

const sessionsOn10th = [
  "Track 4: Computing and Communication Technologies - Session 1",
  "Track 8: Design for Mobility + Track 10: AI-Driven Design Innovation Session II",
  "Track 6: Sustainable Healthcare Systems Session 3 + Track 3: Cybersecurity",
  "Online Presentation Session II",
  "Online Presentation Session III",
  "Track 5: Smart Systems and IoT – Session II"
];

async function revertDates() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) return;

  const libsql = createClient({ url, authToken });
  const adapter = new PrismaLibSQL(libsql);
  const prisma = new PrismaClient({ adapter });

  try {
    const papers = await prisma.paper.findMany();
    let updated = 0;

    for (const p of papers) {
      // Check if this paper's session should be on the 10th
      const shouldBeOn10th = sessionsOn10th.some(sName => p.session.includes(sName));
      
      if (shouldBeOn10th && p.session.includes("09-10-2026")) {
        const newSession = p.session.replace("09-10-2026", "10-10-2026");
        await prisma.paper.update({
          where: { id: p.id },
          data: { session: newSession }
        });
        updated++;
      }
    }
    console.log(`Reverted ${updated} papers back to 10-10-2026 in Turso.`);
  } catch(e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
revertDates();
