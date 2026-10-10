import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import * as bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

async function updateTurso() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    console.error("No Turso URL");
    return;
  }

  const libsql = createClient({ url, authToken });
  const adapter = new PrismaLibSQL(libsql);
  const prisma = new PrismaClient({ adapter });

  console.log("Updating Turso DB...");

  const user = await prisma.user.findUnique({
    where: { username: "sheetal.track1" },
  });

  if (!user) {
    console.log("User sheetal.track1 not found in Turso. Checking if uttam.chauhan exists...");
    const uttam = await prisma.user.findUnique({
      where: { username: "uttam.chauhan" }
    });
    console.log("Uttam exists:", uttam);
    return;
  }

  const newPassword = "Uttam@2026";
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const updatedUser = await prisma.user.update({
    where: { username: "sheetal.track1" },
    data: {
      username: "uttam.chauhan",
      name: "Uttam Chauhan",
      passwordHash: hashedPassword,
      email: "uttam.chauhan@cicon2026.org",
    },
  });

  console.log("Turso User updated successfully:");
  console.log(updatedUser);

  await prisma.$disconnect();
}

updateTurso().catch((e) => console.error(e));
