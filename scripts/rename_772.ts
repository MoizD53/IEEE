import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config();

async function renamePaper() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  // 1. Turso
  if (url && authToken) {
    const libsql = createClient({ url, authToken });
    const adapter = new PrismaLibSQL(libsql);
    const tursoPrisma = new PrismaClient({ adapter });

    try {
      await tursoPrisma.paper.update({
        where: { paperId: "772" },
        data: { paperId: "722" }
      });
      console.log("Renamed 772 to 722 in Turso.");
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
      where: { paperId: "772" },
      data: { paperId: "722" }
    });
    console.log("Renamed 772 to 722 in Local DB.");
  } catch(e) {
    console.error(e);
  } finally {
    await localPrisma.$disconnect();
  }
}

renamePaper();
