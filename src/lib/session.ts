import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h") // Session expires in 8 hours
    .sign(key);
}

export async function createSession(userId: string, email: string) {
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);
  const session = await encrypt({ userId, email, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set("admin_session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}