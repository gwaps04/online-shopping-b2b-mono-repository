"use server";

import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(data: {
  first_name: string;
  last_name: string;
  phone: string;
  birthdate: string;
  address_province?: string | null;
  address_province_code?: string | null;
  address_city?: string | null;
  address_city_code?: string | null;
  address_barangay?: string | null;
  address_barangay_code?: string | null;
  address_zip?: string | null;
  address_street?: string | null;
}) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("store_session")?.value;

  if (!sessionId) {
    return { success: false, error: "Unauthorized session. Please sign in." };
  }

  // Schema Validation: phone & birthdate are NOT NULL in Neon database
  if (!data.phone || !data.phone.trim()) {
    return { success: false, error: "Phone number is required." };
  }
  if (!data.birthdate) {
    return { success: false, error: "Birthdate is required." };
  }

  const sql = neon(process.env.DATABASE_URL!);

  try {
    // Update matching exact Neon users table columns & types
    await sql`
      UPDATE users
      SET
        first_name = ${data.first_name},
        last_name = ${data.last_name},
        phone = ${data.phone},
        birthdate = ${data.birthdate}::date,
        address_province = ${data.address_province || null},
        address_province_code = ${data.address_province_code || null},
        address_city = ${data.address_city || null},
        address_city_code = ${data.address_city_code || null},
        address_barangay = ${data.address_barangay || null},
        address_barangay_code = ${data.address_barangay_code || null},
        address_zip = ${data.address_zip || null},
        address_street = ${data.address_street || null}
      WHERE id = ${sessionId}::uuid
    `;

    revalidatePath("/account");
    return { success: true };
  } catch (error: any) {
    console.error("Neon users update failed:", error);
    return { 
      success: false, 
      error: error.message || "Failed to update profile record in Neon database." 
    };
  }
}