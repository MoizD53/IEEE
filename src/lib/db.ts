import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import { validateEnv } from "./env.server";

// Validate strict backend secrets instantly
validateEnv();

function createPrismaClient() {
  const url = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || "file:./dev.db";

  // If using Turso cloud database (libsql:// or https://)
  if (url.startsWith("libsql://") || url.startsWith("https://")) {
    if (!process.env.TURSO_AUTH_TOKEN) {
      console.warn("⚠️ Warning: TURSO_AUTH_TOKEN is not set for remote libSQL connection:", url);
    }
    const libsql = createClient({
      url,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({ adapter });
  }

  // Fallback to local SQLite file
  return new PrismaClient();
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
