import { createClient } from "@libsql/client";
import { execSync } from "child_process";
import * as dotenv from "dotenv";

// Load environment variables (.env or .env.production)
dotenv.config();

async function migrateTurso() {
  const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || (!url.startsWith("libsql://") && !url.startsWith("https://"))) {
    console.error("❌ Error: Valid Turso URL (libsql://... or https://...) required.");
    console.error("Please set DATABASE_URL (or TURSO_DATABASE_URL) and TURSO_AUTH_TOKEN.");
    process.exit(1);
  }

  if (!authToken) {
    console.error("❌ Error: TURSO_AUTH_TOKEN environment variable is required.");
    process.exit(1);
  }

  console.log(`🌐 Connecting to Turso database at: ${url.replace(/\/\/[^:]+:[^@]+@/, "//***:***@")}`);
  const client = createClient({ url, authToken });

  // Test connection
  try {
    const rs = await client.execute("SELECT 1 as connected;");
    console.log("✅ Successfully connected to Turso cloud database!");
  } catch (err: any) {
    console.error("❌ Connection failed to Turso:", err.message);
    process.exit(1);
  }

  console.log("📄 Generating SQLite schema DDL from prisma/schema.prisma...");
  const ddl = execSync("npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script", {
    encoding: "utf-8",
  });

  console.log("🚀 Applying schema to Turso via @libsql/client...");
  try {
    await client.executeMultiple(ddl);
    console.log("✅ Schema successfully applied to Turso!");
  } catch (err: any) {
    console.error("❌ Error applying schema:", err.message);
    process.exit(1);
  }

  // Verify all tables exist
  const tables = await client.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
  );
  const tableNames = tables.rows.map((r) => r.name);
  console.log("📋 Verified tables in Turso:", tableNames);

  const requiredTables = [
    "User",
    "Paper",
    "PaperAssignment",
    "Evaluation",
    "EvaluationCriterion",
    "AuditLog",
  ];

  const missing = requiredTables.filter((t) => !tableNames.includes(t));
  if (missing.length > 0) {
    console.error("❌ Missing required tables:", missing);
    process.exit(1);
  }

  console.log("🎉 All 6 core application models successfully verified on Turso!");
}

migrateTurso().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
