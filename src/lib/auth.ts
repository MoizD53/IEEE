import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { rateLimit, resetRateLimit } from "./rate-limit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
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

        // Brute-Force Protection: 5 attempts per 15 min per username (per server instance)
        // NOTE: In-memory only — not distributed. On serverless, each instance has its own counter.
        const limiter = rateLimit(`login_${username}`, 5, 15 * 60 * 1000);
        if (!limiter.success) {
          console.warn(`[RATE_LIMIT] Login blocked for username: ${username}`);
          return null;
        }

        // Always look up and compare — timing-safe (doesn't reveal username existence)
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

        const dummyHash = "$2b$12$invalidhashfortimingprotectionxxxxxxxxxxxxxxxxxxxxxxxx";
        const hashToCompare = user?.passwordHash ?? dummyHash;
        const passwordMatch = await bcrypt.compare(credentials.password as string, hashToCompare);

        if (!user || !passwordMatch || user.status !== "ACTIVE") {
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
            } catch { /* non-critical */ }
          }
          return null;
        }

        // Successful login — reset rate limit and audit
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
        } catch { /* non-critical */ }

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
  // NOTE: NextAuth v5 beta automatically sets HttpOnly, SameSite=Lax, and Secure
  // in production based on AUTH_SECRET and NODE_ENV. The `cookies` config block
  // from v4 is not compatible with v5 beta and was causing the server config error.
});
