import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET || "store_mono_super_secure_jwt_secret_key_2026";
const key = new TextEncoder().encode(secretKey);
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });

    const now = Date.now();
    const lastActive = Number(payload.lastActive || 0);

    if (now - lastActive > INACTIVITY_TIMEOUT_MS) {
      return { valid: false, reason: "timeout" };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, reason: "invalid" };
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard /admin routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin_session")?.value;

    // 1. If accessing the Admin Login page
    if (pathname === "/admin/login") {
      if (token) {
        const result = await verifyToken(token);
        if (result.valid) {
          // Already authenticated and active, redirect to admin dashboard
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      }
      return NextResponse.next();
    }

    // 2. For all other /admin routes, enforce authentication
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const result = await verifyToken(token);
    if (!result.valid) {
      const loginUrl = new URL("/admin/login", request.url);
      if (result.reason === "timeout") {
        loginUrl.searchParams.set("reason", "timeout");
      } else {
        loginUrl.searchParams.set("reason", "unauthorized");
      }
      loginUrl.searchParams.set("redirect", pathname);

      const response = NextResponse.redirect(loginUrl);
      // Clean up the expired or invalid cookie
      response.cookies.delete("admin_session");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
