import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { rateLimit, resetRateLimit } from "./rate-limit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const username = (credentials.username as string).trim().toLowerCase();

        // --- Brute-Force Protection ---
        // Rate-limit by username (5 attempts per 15 min per username, per server instance)
        // Note: this is per-instance and NOT globally distributed on serverless.
        const limiter = rateLimit(`login_${username}`, 5, 15 * 60 * 1000);
        if (!limiter.success) {
          // Return null — NextAuth surfaces a generic "CredentialsSignin" error to the client.
          // We never reveal whether the username exists.
          console.warn(`[RATE_LIMIT] Login blocked for username: ${username}`);
          return null;
        }

        // Always look up the user — constant-time to not reveal username existence
        const user = await prisma.user.findUnique({
          where: { username },
          select: {
            id: true,
            name: true,
            username: true,
            role: true,
            status: true,
            passwordHash: true
          }
        });

        // Use bcrypt.compare regardless of whether user exists to prevent timing attacks
        const dummyHash = "$2b$12$invalidhashfortimingprotectiononly..................";
        const hashToCompare = user?.passwordHash ?? dummyHash;
        const passwordMatch = await bcrypt.compare(credentials.password as string, hashToCompare);

        if (!user || !passwordMatch || user.status !== "ACTIVE") {
          // Audit failed login attempts (never log the actual password)
          if (user) {
            try {
              await prisma.auditLog.create({
                data: {
                  userId: user.id,
                  action: "LOGIN_FAILURE",
                  entityType: "USER",
                  entityId: user.id,
                  metadata: `Failed login attempt for: ${username}`
                }
              });
            } catch {
              // Non-critical — don't block the auth flow
            }
          }
          return null;
        }

        // Successful login — reset rate limit counter and audit
        resetRateLimit(`login_${username}`);
        try {
          await prisma.auditLog.create({
            data: {
              userId: user.id,
              action: "LOGIN_SUCCESS",
              entityType: "USER",
              entityId: user.id,
              metadata: `Successful login: ${username}`
            }
          });
        } catch {
          // Non-critical
        }

        return {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 4 * 60 * 60, // 4 hours
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      }
    }
  }
});
