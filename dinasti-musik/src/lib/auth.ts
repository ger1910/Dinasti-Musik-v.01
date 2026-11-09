import { cookies, headers } from "next/headers";
import { readDB, writeDB } from "@/lib/db";
import { Session, User } from "@/types";
import { randomUUID } from "crypto";

const SESSION_COOKIE = "dm_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export type AuthUser = Omit<User, "password">;

async function getIsSecure(): Promise<boolean> {
  if (process.env.COOKIE_SECURE === "true") return true;
  if (process.env.COOKIE_SECURE === "false") return false;
  try {
    const headerList = await headers();
    const proto = headerList.get("x-forwarded-proto");
    const referer = headerList.get("referer") || "";
    if (proto === "https" || referer.startsWith("https://")) {
      return true;
    }
  } catch {}
  return false;
}

/**
 * Creates a server-side session and sets an HttpOnly cookie.
 */
export async function createSession(userId: string, role: "owner" | "customer"): Promise<string> {
  const db = readDB();
  const sessionId = randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_DURATION_MS);

  const session: Session = {
    id: sessionId,
    userId,
    role,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  if (!db.sessions) db.sessions = [];
  // Clean old sessions for this user
  db.sessions = db.sessions.filter((s) => s.userId !== userId);
  db.sessions.push(session);
  writeDB(db);

  const isSecure = await getIsSecure();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
  cookieStore.set("dm_role", role, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return sessionId;
}

/**
 * Handles Social Login with Google.
 * Finds or creates user, establishes session cookie automatically.
 */
export async function loginWithGoogle(profile: {
  email: string;
  name?: string;
  image?: string;
  sub?: string;
}): Promise<AuthUser> {
  const db = readDB();
  db.users = db.users || [];

  let user = db.users.find(
    (u) => u.email.toLowerCase() === profile.email.toLowerCase()
  );

  if (!user) {
    const newId = `usr_${randomUUID().slice(0, 8)}`;
    user = {
      id: newId,
      name: profile.name || profile.email.split("@")[0],
      email: profile.email.toLowerCase(),
      role: "customer",
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    writeDB(db);
  }

  // Create session & set HttpOnly session cookies
  await createSession(user.id, user.role);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userSafe } = user;
  return userSafe as AuthUser;
}

/**
 * Reads session from cookie and validates it.
 * Returns the authenticated user or null.
 */
export async function getSession(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
    if (!sessionId) return null;

    const db = readDB();
    const session = (db.sessions || []).find((s) => s.id === sessionId);
    if (!session) return null;

    // Check expiry
    if (new Date(session.expiresAt) < new Date()) {
      // Expired — clean up
      db.sessions = (db.sessions || []).filter((s) => s.id !== sessionId);
      writeDB(db);
      return null;
    }

    const user = (db.users || []).find((u) => u.id === session.userId);
    if (!user) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userSafe } = user;
    return userSafe as AuthUser;
  } catch {
    return null;
  }
}

/**
 * Requires authentication. Returns user or throws 401.
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getSession();
  if (!user) {
    throw new AuthError("Sesi tidak valid. Silakan login kembali.", 401);
  }
  return user;
}

/**
 * Requires specific role. Returns user or throws 403.
 */
export async function requireRole(role: "owner" | "customer"): Promise<AuthUser> {
  const user = await requireAuth();
  if (user.role !== role) {
    throw new AuthError(`Akses ditolak. Diperlukan role: ${role}.`, 403);
  }
  return user;
}

/**
 * Destroys the current session.
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (sessionId) {
    const db = readDB();
    db.sessions = (db.sessions || []).filter((s) => s.id !== sessionId);
    writeDB(db);
  }

  const isSecure = await getIsSecure();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  cookieStore.set("dm_role", "", {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
