import { auth } from "@/lib/auth";

export class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionError";
  }
}

type SessionUser = {
  id: string;
  role: string;
  username: string;
};

/**
 * Wraps a Server Action to guarantee it is only executed by an authenticated Admin.
 * The validated user payload is securely injected into the action.
 */
export function withAdminAuth<T extends any[], R>(
  action: (user: SessionUser, ...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    const session = await auth();
    if (!session?.user) {
      throw new ActionError("Unauthorized: Not logged in");
    }
    if (session.user.role !== "ADMIN") {
      throw new ActionError("Forbidden: Requires Admin privileges");
    }
    return action(session.user as SessionUser, ...args);
  };
}

/**
 * Wraps a Server Action to guarantee it is only executed by an authenticated Session Chair.
 * The validated user payload is securely injected, preventing IDOR attacks by forcing the action
 * to use the guaranteed `user.id` from the active session rather than trusting a client payload.
 */
export function withChairAuth<T extends any[], R>(
  action: (user: SessionUser, ...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    const session = await auth();
    if (!session?.user) {
      throw new ActionError("Unauthorized: Not logged in");
    }
    if (session.user.role !== "SESSION_CHAIR") {
      throw new ActionError("Forbidden: Requires Session Chair privileges");
    }
    return action(session.user as SessionUser, ...args);
  };
}

/**
 * Wraps a Server Action to guarantee it is executed by an authenticated user of any role.
 * The validated user payload is securely injected.
 */
export function withAuth<T extends any[], R>(
  action: (user: SessionUser, ...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    const session = await auth();
    if (!session?.user) {
      throw new ActionError("Unauthorized: Not logged in");
    }
    return action(session.user as SessionUser, ...args);
  };
}
