"use server";

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function processLogin(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please provide both email and password." };
  }

  const sql = neon(process.env.DATABASE_URL!);

  try {
    // Woz Fix: We must fetch the is_verified column
    const users = await sql`
      SELECT id, password_hash, first_name, is_verified 
      FROM users 
      WHERE email = ${email}
    `;

    if (users.length === 0) {
      return { error: "Invalid email or password." };
    }

    const user = users[0];

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return { error: "Invalid email or password." };
    }

    // Woz Guard: The Bouncer. Halt the login if they haven't clicked the email link.
    if (user.is_verified === false) {
      return { error: "Security Halt: Please verify your email address before logging in. Check your inbox for the verification link." };
    }

    const cookieStore = await cookies();
    cookieStore.set("store_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/"
    });

    return { 
      success: true, 
      redirectUrl: "/checkout", 
      message: `Welcome back, ${user.first_name}!` 
    };

  } catch (error: any) {
    console.error("Login Error:", error);
    return { error: "An unexpected server error occurred. Please try again." };
  }
}