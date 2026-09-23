/**
 * In-memory rate limiter for brute-force protection.
 *
 * IMPORTANT LIMITATION:
 * This is a per-process, per-instance limiter. On Vercel/serverless deployments
 * with multiple concurrent instances, each instance maintains its own counter,
 * so a distributed attacker hitting different instances can exceed the per-instance limit.
 * For fully distributed protection, replace with a Redis/Upstash-backed solution.
 * This implementation is modular and can be swapped without changing call sites.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
  firstAttemptAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 5 * 60 * 1000); // Cleanup every 5 minutes

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
  /** Total milliseconds until the window resets */
  retryAfterMs: number;
}

/**
 * Check and increment the rate limit counter for the given identifier.
 * @param identifier - Unique key (e.g., `login_${username}` or `login_ip_${ip}`)
 * @param limit - Max attempts allowed within the window
 * @param windowMs - Time window in milliseconds
 */
export function rateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 15 * 60 * 1000
): RateLimitResult {
  const now = Date.now();
  const existing = store.get(identifier);

  if (!existing || now > existing.resetAt) {
    // First attempt or window expired — start fresh
    const entry: RateLimitEntry = { count: 1, resetAt: now + windowMs, firstAttemptAt: now };
    store.set(identifier, entry);
    return { success: true, remaining: limit - 1, resetAt: entry.resetAt, retryAfterMs: 0 };
  }

  if (existing.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: existing.resetAt,
      retryAfterMs: existing.resetAt - now,
    };
  }

  existing.count++;
  return {
    success: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
    retryAfterMs: 0,
  };
}

/**
 * Reset the rate limit counter for an identifier (e.g. after successful login).
 */
export function resetRateLimit(identifier: string): void {
  store.delete(identifier);
}
