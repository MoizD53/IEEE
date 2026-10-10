import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config();

async function fixPaper() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  const correctTrack = "Track 1: Artificial Intelligence and Data Science";
  const correctSession = "Track 1: Artificial Intelligence and Data Science – Session 4 (09-10-2026 03:00 PM to 05:00 PM @ D7, D Block - UIT)";

  // 1. Turso
  if (url && authToken) {
    const libsql = createClient({ url, authToken });
    const adapter = new PrismaLibSQL(libsql);
    const tursoPrisma = new PrismaClient({ adapter });

    try {
      await tursoPrisma.paper.update({
        where: { paperId: "710" },
        data: {
          track: correctTrack,
          session: correctSession
        }
      });
      console.log("Fixed Paper 710 in Turso.");
    } catch (e) {
      console.error(e);
    } finally {
      await tursoPrisma.$disconnect();
    }
  }

  // 2. Local
  const localPrisma = new PrismaClient();
  try {
    await localPrisma.paper.update({
      where: { paperId: "710" },
      data: {
        track: correctTrack,
        session: correctSession
      }
    });
    console.log("Fixed Paper 710 in Local DB.");
  } catch(e) {
    console.error(e);
  } finally {
    await localPrisma.$disconnect();
  }
}

fixPaper();
