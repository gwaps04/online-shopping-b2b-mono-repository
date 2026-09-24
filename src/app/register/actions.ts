"use server";

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { headers } from "next/headers";

export async function processRegistration(prevState: any, formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const birthdate = formData.get("birthdate") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const provCode = formData.get("provCode") as string;
  const provName = formData.get("provName") as string;
  const cityCode = formData.get("cityCode") as string;
  const cityName = formData.get("cityName") as string;
  const brgyCode = formData.get("brgyCode") as string;
  const brgyName = formData.get("brgyName") as string;
  const zipCode = formData.get("zipCode") as string;
  const streetAddress = formData.get("streetAddress") as string;

  if (!email || !password || !confirmPassword || !firstName || !lastName || !provCode || !cityCode || !brgyCode) {
    return { error: "Please complete all required fields." };
  }

  if (password !== confirmPassword) {
    return { error: "Security Error: Passwords do not match. Please try again." };
  }

  const passwordComplexityRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$\%^&*(),.?":{}\vert{}<>]).{8,}$/;
  if (!passwordComplexityRegex.test(password)) {
    return { error: "Security Error: Password does not meet complexity requirements." };
  }

  const sql = neon(process.env.DATABASE_URL!);

  try {
    const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existingUser.length > 0) {
      return { error: "An account with this email already exists." };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verifyToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const insertResult = await sql`
      INSERT INTO users (
        email, password_hash, first_name, last_name, birthdate, phone,
        address_province, address_province_code,
        address_city, address_city_code,
        address_barangay, address_barangay_code,
        address_zip, address_street,
        is_verified, verification_token, token_expires_at
      )
      VALUES (
        ${email}, ${hashedPassword}, ${firstName}, ${lastName}, ${birthdate}, ${phone},
        ${provName}, ${provCode},
        ${cityName}, ${cityCode},
        ${brgyName}, ${brgyCode},
        ${zipCode}, ${streetAddress},
        FALSE, ${verifyToken}, ${expiresAt}
      )
      RETURNING id
    `;

    try {
      const autoSettings = await sql`SELECT webhook_url, webhook_secret, is_active FROM automation_settings WHERE id = 1`;
      if (autoSettings.length > 0 && autoSettings[0].is_active && autoSettings[0].webhook_url) {
        
        const headersList = await headers();
        const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const verificationLink = `${origin}/verify?token=${verifyToken}`;

        console.log('\n====================================================================');
        console.log('🚀 [WOZ DEV BYPASS] NEW USER REGISTERED!');
        console.log(`📧 User: ${email}`);
        console.log('🔗 CLICK THIS LINK TO VERIFY THE ACCOUNT:');
        console.log(`\x1b[36m%s\x1b[0m`, verificationLink);
        console.log('====================================================================\n');

        const webhookPayload = {
          event: "user.registered",
          timestamp: new Date().toISOString(),
          data: {
            user_id: insertResult[0].id,
            first_name: firstName,
            email: email,
            verification_link: verificationLink 
          }
        };

        const fetchHeaders: Record<string, string> = { "Content-Type": "application/json" };
        if (autoSettings[0].webhook_secret) {
          fetchHeaders["X-Webhook-Secret"] = autoSettings[0].webhook_secret;
        }

        // Woz Fix: Added explicit 'await' so Vercel keeps the function alive until n8n receives the payload
        await fetch(autoSettings[0].webhook_url, {
          method: "POST",
          headers: fetchHeaders,
          body: JSON.stringify(webhookPayload),
          signal: AbortSignal.timeout(5000)
        });
      }
    } catch (webhookError) {
      console.error("Failed to trigger registration webhook", webhookError);
    }

    return { success: true, redirectUrl: "/login?check_email=true" };

  } catch (error: any) {
    console.error("Registration Error:", error);
    return { error: "An unexpected server error occurred. Please try again." };
  }
}
// Woz Fix: Added explicit 'await' so Vercel keeps the function alive until n8n receives the payload
        await fetch(autoSettings[0].webhook_url, {
          method: "POST",
          headers: fetchHeaders,
          body: JSON.stringify(webhookPayload),
          signal: AbortSignal.timeout(5000)
        }).catch(err => console.error("[n8n Webhook Error] - Payload failed to send:", err.message));