import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config();

const newPaper = {
  paperId: "714",
  title: "Cuffless Blood Pressure Estimation from Photoplethysmography Signals Using",
  authors: "Priyanka patel",
  abstract: "",
  keywords: "",
  track: "Track 5: Smart Systems and IoT",
  session: "Track 5: Smart Systems and IoT – Session II (10-10-2026 10:45 AM to 12:45 PM @ D6)",
  status: "UNASSIGNED"
};

async function addPaper() {
  // 1. Local DB
  const localPrisma = new PrismaClient();
  try {
    const p1 = await localPrisma.paper.upsert({
      where: { paperId: newPaper.paperId },
      update: newPaper,
      create: newPaper
    });
    console.log("Added to local DB:", p1.paperId);
  } catch (e) {
    console.error("Local DB error:", e);
  } finally {
    await localPrisma.$disconnect();
  }

  // 2. Turso DB
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (url && authToken) {
    const libsql = createClient({ url, authToken });
    const adapter = new PrismaLibSQL(libsql);
    const tursoPrisma = new PrismaClient({ adapter });
    try {
      const p2 = await tursoPrisma.paper.upsert({
        where: { paperId: newPaper.paperId },
        update: newPaper,
        create: newPaper
      });
      console.log("Added to Turso DB:", p2.paperId);
    } catch (e) {
      console.error("Turso DB error:", e);
    } finally {
      await tursoPrisma.$disconnect();
    }
  } else {
    console.log("No Turso credentials found.");
  }
}

addPaper();
