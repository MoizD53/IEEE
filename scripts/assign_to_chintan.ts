import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config();

async function assignToChintan() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  const correctTrack = "Multiple Tracks (Online Session II)";
  const correctSession = "Online Presentation Session II (Multiple Tracks) (10-10-2026 10:45 AM to 12:45 PM @ D8, D Block - UIT (Online))";
  const chintanId = "cmuxxgqad00f3rpj3vobvfrgr";
  const paperIds = ["375", "376", "555"];

  // 1. Turso
  if (url && authToken) {
    const libsql = createClient({ url, authToken });
    const adapter = new PrismaLibSQL(libsql);
    const tursoPrisma = new PrismaClient({ adapter });

    try {
      // Update paper metadata
      await tursoPrisma.paper.updateMany({
        where: { paperId: { in: paperIds } },
        data: {
          track: correctTrack,
          session: correctSession
        }
      });
      
      // Update assignments
      const papers = await tursoPrisma.paper.findMany({ where: { paperId: { in: paperIds } } });
      for (const p of papers) {
        await tursoPrisma.paperAssignment.updateMany({
          where: { paperId: p.id },
          data: { chairId: chintanId }
        });
      }
      console.log("Assigned papers to Chintan Thacker in Turso.");
    } catch (e) {
      console.error(e);
    } finally {
      await tursoPrisma.$disconnect();
    }
  }

  // 2. Local
  const localPrisma = new PrismaClient();
  try {
    const chintanLocal = await localPrisma.user.findFirst({where: {name: 'Dr. Chintan Thacker'}});
    
    await localPrisma.paper.updateMany({
      where: { paperId: { in: paperIds } },
      data: {
        track: correctTrack,
        session: correctSession
      }
    });
    
    if (chintanLocal) {
      const papers = await localPrisma.paper.findMany({ where: { paperId: { in: paperIds } } });
      for (const p of papers) {
        await localPrisma.paperAssignment.updateMany({
          where: { paperId: p.id },
          data: { chairId: chintanLocal.id }
        });
      }
      console.log("Assigned papers to Chintan Thacker in Local DB.");
    }
  } catch(e) {
    console.error(e);
  } finally {
    await localPrisma.$disconnect();
  }
}

assignToChintan();
