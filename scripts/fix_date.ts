import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config();

async function checkDate() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (url && authToken) {
    const libsql = createClient({ url, authToken });
    const adapter = new PrismaLibSQL(libsql);
    const tursoPrisma = new PrismaClient({ adapter });
    try {
      const papers = await tursoPrisma.paper.findMany({
        where: {
          session: {
            contains: "10-10-2026"
          }
        }
      });
      console.log("Papers with 10-10-2026:", papers.length);
      
      if (papers.length > 0) {
        // Let's update them all to 09-10-2026
        let updated = 0;
        for (const p of papers) {
          const newSession = p.session.replace("10-10-2026", "09-10-2026");
          await tursoPrisma.paper.update({
            where: { id: p.id },
            data: { session: newSession }
          });
          updated++;
        }
        console.log(`Updated ${updated} papers to 09-10-2026 in Turso.`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      await tursoPrisma.$disconnect();
    }
  }
}
checkDate();
