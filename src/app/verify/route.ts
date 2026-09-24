import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // 1. Extract the secure token from the URL parameters
  const token = req.nextUrl.searchParams.get("token");

  // If there's no token, boot them to login
  if (!token) {
    return NextResponse.redirect(new URL("/login?error=invalid_token", req.url));
  }

  const sql = neon(process.env.DATABASE_URL!);

  try {
    // 2. Find the user with this exact token
    const users = await sql`
      SELECT id, token_expires_at 
      FROM users 
      WHERE verification_token = ${token}
    `;

    if (users.length === 0) {
      return NextResponse.redirect(new URL("/login?error=invalid_token", req.url));
    }

    const user = users[0];

    // 3. Check if the 24-hour limit has expired
    if (new Date() > new Date(user.token_expires_at)) {
      return NextResponse.redirect(new URL("/login?error=expired_token", req.url));
    }

    // 4. Verification Success! Activate the account and permanently destroy the token.
    await sql`
      UPDATE users 
      SET is_verified = TRUE, 
          verification_token = NULL, 
          token_expires_at = NULL 
      WHERE id = ${user.id}::uuid
    `;

    // 5. Send them to the login page with a success flag
    return NextResponse.redirect(new URL("/login?verified=true", req.url));

  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.redirect(new URL("/login?error=server_error", req.url));
  }
}