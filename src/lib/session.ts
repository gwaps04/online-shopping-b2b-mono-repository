import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.JWT_SECRET || "store_mono_super_secure_jwt_secret_key_2026";
const key = new TextEncoder().encode(secretKey);

// 30 Minutes Inactivity Expiration
export const INACTIVITY_TIMEOUT_SECONDS = 30 * 60; // 1800 seconds (30 mins)
export const INACTIVITY_TIMEOUT_MS = INACTIVITY_TIMEOUT_SECONDS * 1000;

export interface AdminSessionPayload {
  userId: string;
  email: string;
  lastActive: number;
}

export async function encrypt(payload: AdminSessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${INACTIVITY_TIMEOUT_SECONDS}s`)
    .sign(key);
}

export async function decrypt(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });

    const session = payload as unknown as AdminSessionPayload;
    if (!session || !session.userId || !session.email) {
      return null;
    }

    // Check sliding inactivity window
    const now = Date.now();
    const lastActive = Number(session.lastActive || 0);
    if (now - lastActive > INACTIVITY_TIMEOUT_MS) {
      return null;
    }

    return {
      userId: session.userId,
      email: session.email,
      lastActive,
    };
  } catch {
    return null;
  }
}

export async function createSession(userId: string, email: string): Promise<string> {
  const now = Date.now();
  const expiresAt = new Date(now + INACTIVITY_TIMEOUT_MS);
  const session = await encrypt({ userId, email, lastActive: now });

  const cookieStore = await cookies();
  cookieStore.set("admin_session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    maxAge: INACTIVITY_TIMEOUT_SECONDS,
    sameSite: "lax",
    path: "/",
  });

  return session;
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session")?.value;
  if (!sessionCookie) return null;

  const session = await decrypt(sessionCookie);
  if (!session) {
    // If token expired or tampered, destroy the cookie
    try {
      cookieStore.delete("admin_session");
    } catch {
      // Best-effort cookie removal
    }
    return null;
  }

  return session;
}

export async function touchAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session")?.value;
  if (!sessionCookie) return;

  const session = await decrypt(sessionCookie);
  if (!session) {
    try {
      cookieStore.delete("admin_session");
    } catch {
      // Best-effort cookie removal
    }
    return;
  }

  // Slide inactivity timestamp
  const now = Date.now();
  const expiresAt = new Date(now + INACTIVITY_TIMEOUT_MS);
  const refreshedToken = await encrypt({
    userId: session.userId,
    email: session.email,
    lastActive: now,
  });

  cookieStore.set("admin_session", refreshedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    maxAge: INACTIVITY_TIMEOUT_SECONDS,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}
