"use server";

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";

// Woz Fix: Added 'prevState: any' to comply with React 19 useActionState requirements
export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Email and password required." };

  // Connect to Neon DB
  const sql = neon(process.env.DATABASE_URL!);

  try {
    // Retrieve the hashed password
    const users = await sql`SELECT id, email, password_hash FROM admins WHERE email = ${email}`;
    
    if (users.length === 0) return { error: "Invalid credentials." };

    const user = users[0];

    // Compare the plaintext password with the hash from the database
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordMatch) return { error: "Invalid credentials." };

    // Create the secure JWT session
    await createSession(user.id, user.email);
    
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Internal server error. Please try again." };
  }

  // Redirect to CMS Dashboard on success (This must be outside the try/catch block)
  redirect("/admin");
}

// Logout remains a void action, so it does not need a prevState parameter
export async function logoutAction() {
  await deleteSession();
  redirect("/admin/login");
}
