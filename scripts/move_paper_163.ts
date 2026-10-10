import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config();

async function movePaper163() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  const correctTrack = "Multiple Tracks (Online Session II)";
  const correctSession = "Online Presentation Session II (Multiple Tracks) (10-10-2026 10:45 AM to 12:45 PM @ D8, D Block - UIT (Online))";
  const chintanId = "cmuxxgqad00f3rpj3vobvfrgr";

  // 1. Turso
  if (url && authToken) {
    const libsql = createClient({ url, authToken });
    const adapter = new PrismaLibSQL(libsql);
    const tursoPrisma = new PrismaClient({ adapter });

    try {
      const p = await tursoPrisma.paper.update({
        where: { paperId: "163" },
        data: {
          track: correctTrack,
          session: correctSession
        }
      });
      
      await tursoPrisma.paperAssignment.updateMany({
        where: { paperId: p.id },
        data: { chairId: chintanId }
      });
      console.log("Moved Paper 163 to Chintan in Turso.");
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
    
    const p = await localPrisma.paper.update({
      where: { paperId: "163" },
      data: {
        track: correctTrack,
        session: correctSession
      }
    });
    
    if (chintanLocal) {
      await localPrisma.paperAssignment.updateMany({
        where: { paperId: p.id },
        data: { chairId: chintanLocal.id }
      });
      console.log("Moved Paper 163 to Chintan in Local DB.");
    }
  } catch(e) {
    console.error(e);
  } finally {
    await localPrisma.$disconnect();
  }
}

movePaper163();
