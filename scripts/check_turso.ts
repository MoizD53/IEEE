import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";
dotenv.config();

async function check() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  
  if (!url) {
    console.log("No Turso URL");
    return;
  }
  
  const libsql = createClient({ url, authToken });
  const adapter = new PrismaLibSQL(libsql);
  const prisma = new PrismaClient({ adapter });
  
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { username: 'sheetal.track1' },
        { username: 'uttam.chauhan' }
      ]
    }
  });
  console.log("Turso Users:", users);
  
  const devPrisma = new PrismaClient();
  const devUsers = await devPrisma.user.findMany({
    where: {
      OR: [
        { username: 'sheetal.track1' },
        { username: 'uttam.chauhan' }
      ]
    }
  });
  console.log("Local Users:", devUsers);
}
check();
