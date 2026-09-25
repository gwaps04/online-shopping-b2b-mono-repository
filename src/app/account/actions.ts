"use server";

import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(prevState: any, formData: FormData) {
  // Woz Guard: Strict backend verification
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("store_session")?.value;
  
  if (!sessionId) {
    return { error: "Security Error: Session expired. Please log in again." };
  }

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const phone = formData.get("phone") as string;
  const birthdate = formData.get("birthdate") as string;

  const provCode = formData.get("provCode") as string;
  const provName = formData.get("provName") as string;
  const cityCode = formData.get("cityCode") as string;
  const cityName = formData.get("cityName") as string;
  const brgyCode = formData.get("brgyCode") as string;
  const brgyName = formData.get("brgyName") as string;
  const zipCode = formData.get("zipCode") as string;
  const streetAddress = formData.get("streetAddress") as string;

  if (!firstName || !lastName || !phone || !provCode || !cityCode || !brgyCode) {
    return { error: "Please complete all required fields." };
  }

  const sql = neon(process.env.DATABASE_URL!);

  try {
    // We update using the cookie sessionId, NOT a client-provided ID
    await sql`
      UPDATE users 
      SET 
        first_name = ${firstName},
        last_name = ${lastName},
        phone = ${phone},
        birthdate = ${birthdate},
        address_province = ${provName},
        address_province_code = ${provCode},
        address_city = ${cityName},
        address_city_code = ${cityCode},
        address_barangay = ${brgyName},
        address_barangay_code = ${brgyCode},
        address_zip = ${zipCode},
        address_street = ${streetAddress}
      WHERE id = ${sessionId}
    `;

    // Woz Engine: Purge the cache for this route so the user sees updates immediately
    revalidatePath("/account");

    return { success: true, message: "Profile successfully updated!" };
  } catch (error: any) {
    console.error("Profile Update Error:", error);
    return { error: "An unexpected error occurred while saving your profile." };
  }
}