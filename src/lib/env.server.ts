/**
 * Centralized server-only environment variable validation.
 * Import this ONLY in server-side code. Never import in client components.
 */

const REQUIRED_SECRETS = ["AUTH_SECRET"] as const;
const SENSITIVE_PREFIXES = ["DATABASE_URL", "TURSO_DATABASE_URL", "TURSO_AUTH_TOKEN", "AUTH_SECRET"];

export function validateEnv(): void {
  // Anti-leak check: ensure no secret is accidentally exposed via NEXT_PUBLIC_ prefix
  for (const key of SENSITIVE_PREFIXES) {
    if (process.env[`NEXT_PUBLIC_${key}`]) {
      // In production, this is a critical error
      console.error(`🚨 CRITICAL SECURITY ERROR: Secret '${key}' is exposed via NEXT_PUBLIC_ prefix. Refusing to continue.`);
      if (process.env.NODE_ENV === "production") {
        process.exit(1);
      }
    }
  }

  // Validate required secrets exist
  for (const key of REQUIRED_SECRETS) {
    if (!process.env[key]) {
      console.warn(`⚠️  WARNING: Required environment variable '${key}' is missing.`);
    }
  }

  // Validate at least one database URL is configured
  if (!process.env.DATABASE_URL && !process.env.TURSO_DATABASE_URL) {
    console.warn("⚠️  WARNING: Neither DATABASE_URL nor TURSO_DATABASE_URL is configured. Database will not work in production.");
  }
}

/**
 * Safe accessor for server-only secrets.
 * Throws at runtime (not build time) if a required secret is missing in production.
 */
export function getServerEnv() {
  if (process.env.NODE_ENV === "production") {
    if (!process.env.AUTH_SECRET) {
      throw new Error("AUTH_SECRET environment variable is required in production.");
    }
    if (!process.env.DATABASE_URL && !process.env.TURSO_DATABASE_URL) {
      throw new Error("A database URL (DATABASE_URL or TURSO_DATABASE_URL) is required in production.");
    }
  }

  return {
    authSecret: process.env.AUTH_SECRET ?? "",
    databaseUrl: process.env.DATABASE_URL ?? process.env.TURSO_DATABASE_URL ?? "file:./dev.db",
    tursoAuthToken: process.env.TURSO_AUTH_TOKEN,
    nodeEnv: process.env.NODE_ENV,
  };
}
