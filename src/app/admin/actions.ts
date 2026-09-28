"use server";

import { neon } from "@/lib/db";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession, deleteSession, touchAdminSession } from "@/lib/session";

export async function loginAction(prevState: any, formData: FormData) {
  const email = (formData.get("email") as string || "").trim().toLowerCase();
  const password = (formData.get("password") as string || "").trim();
  const redirectTarget = (formData.get("redirect") as string || "/admin").trim();

  if (!email || !password) {
    return { error: "Both email and password are required." };
  }

  const dbUrl = process.env.DATABASE_URL;

  try {
    // If real Neon DB is connected, ensure table and default admin seed exist
    if (dbUrl && dbUrl.startsWith("postgres")) {
      const sql = neon(dbUrl);
      await sql`
        CREATE TABLE IF NOT EXISTS admins (
          id serial PRIMARY KEY,
          email varchar(255) UNIQUE NOT NULL,
          password_hash varchar(255) NOT NULL,
          created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Seed initial admin if empty
      const existing = await sql`SELECT id FROM admins WHERE email = 'admin@macrotek.com' LIMIT 1`;
      if (existing.length === 0) {
        const defaultHash = await bcrypt.hash("admin123", 10);
        await sql`INSERT INTO admins (email, password_hash) VALUES ('admin@macrotek.com', ${defaultHash}) ON CONFLICT DO NOTHING`;
      }
    }

    const sql = neon(dbUrl || "");
    const users = await sql`SELECT id, email, password_hash FROM admins WHERE email = ${email}`;

    if (!users || users.length === 0) {
      return { error: "Invalid credentials. Please verify your email and password." };
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return { error: "Invalid credentials. Please verify your email and password." };
    }

    // Create secure 30-minute JWT session with sliding activity timestamp
    await createSession(String(user.id), user.email);
  } catch (error: any) {
    console.error("Admin Login Error:", error);
    return { error: "An unexpected error occurred during authentication. Please try again." };
  }

  // Safe redirect path validation
  const safeRedirect = redirectTarget.startsWith("/admin") && redirectTarget !== "/admin/login" 
    ? redirectTarget 
    : "/admin";

  redirect(safeRedirect);
}

export async function logoutAction() {
  await deleteSession();
  redirect("/admin/login?reason=manual_logout");
}

export async function touchSessionAction() {
  await touchAdminSession();
  return { success: true };
}
