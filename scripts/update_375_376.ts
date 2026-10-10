import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config();

async function updatePapers() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  const correctTrack = "Multiple Tracks (Online Session II)";
  const correctSession = "Online Presentation Session II (Multiple Tracks) (10-10-2026 10:45 AM to 12:45 PM @ D8, D Block - UIT (Online))";

  // 1. Turso
  if (url && authToken) {
    const libsql = createClient({ url, authToken });
    const adapter = new PrismaLibSQL(libsql);
    const tursoPrisma = new PrismaClient({ adapter });

    try {
      await tursoPrisma.paper.updateMany({
        where: { paperId: { in: ["375", "376"] } },
        data: {
          track: correctTrack,
          session: correctSession
        }
      });
      console.log("Updated 375 and 376 in Turso.");
    } catch (e) {
      console.error(e);
    } finally {
      await tursoPrisma.$disconnect();
    }
  }

  // 2. Local
  const localPrisma = new PrismaClient();
  try {
    await localPrisma.paper.updateMany({
      where: { paperId: { in: ["375", "376"] } },
      data: {
        track: correctTrack,
        session: correctSession
      }
    });
    console.log("Updated 375 and 376 in Local DB.");
  } catch(e) {
    console.error(e);
  } finally {
    await localPrisma.$disconnect();
  }
}

updatePapers();
