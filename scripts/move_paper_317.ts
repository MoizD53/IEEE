import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config();

async function movePaper317() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  const correctTrack = "Multiple Tracks (Online Session III)";
  const correctSession = "Online Presentation Session III (Multiple Tracks) (10-10-2026 10:45 AM to 12:45 PM @ D9, D Block - UIT (Online))";
  const poojaId = "cmuxxgs2l00fyrpj39oujdi09";

  // 1. Turso
  if (url && authToken) {
    const libsql = createClient({ url, authToken });
    const adapter = new PrismaLibSQL(libsql);
    const tursoPrisma = new PrismaClient({ adapter });

    try {
      const p = await tursoPrisma.paper.update({
        where: { paperId: "317" },
        data: {
          track: correctTrack,
          session: correctSession
        }
      });
      
      await tursoPrisma.paperAssignment.updateMany({
        where: { paperId: p.id },
        data: { chairId: poojaId }
      });
      console.log("Moved Paper 317 to Pooja Chaturvedi in Turso.");
    } catch (e) {
      console.error(e);
    } finally {
      await tursoPrisma.$disconnect();
    }
  }

  // 2. Local
  const localPrisma = new PrismaClient();
  try {
    const poojaLocal = await localPrisma.user.findFirst({where: {name: 'Dr. Pooja chaturvedi'}});
    
    const p = await localPrisma.paper.update({
      where: { paperId: "317" },
      data: {
        track: correctTrack,
        session: correctSession
      }
    });
    
    if (poojaLocal) {
      await localPrisma.paperAssignment.updateMany({
        where: { paperId: p.id },
        data: { chairId: poojaLocal.id }
      });
      console.log("Moved Paper 317 to Pooja Chaturvedi in Local DB.");
    }
  } catch(e) {
    console.error(e);
  } finally {
    await localPrisma.$disconnect();
  }
}

movePaper317();
