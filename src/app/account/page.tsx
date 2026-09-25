import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AccountClientForm from "./AccountClientForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | Store Mono",
  description: "Manage your personal profile, shipping address, and order history.",
};

export default async function AccountPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("store_session")?.value;

  if (!sessionId) {
    redirect("/login");
  }

  const sql = neon(process.env.DATABASE_URL!);
  let userData = null;
  let userOrders: any[] = [];

  try {
    // 1. Fetch User Record with strict ::uuid casting
    const users = await sql`
      SELECT 
        id,
        first_name, 
        last_name, 
        email, 
        phone, 
        birthdate,
        address_province, 
        address_province_code,
        address_city, 
        address_city_code,
        address_barangay, 
        address_barangay_code,
        address_zip, 
        address_street,
        is_verified
      FROM users 
      WHERE id = ${sessionId}::uuid
      LIMIT 1
    `;

    if (users.length === 0) {
      redirect("/login");
    }

    const raw = users[0];
    userData = {
      id: String(raw.id || sessionId),
      first_name: raw.first_name || "",
      last_name: raw.last_name || "",
      email: raw.email || "",
      phone: raw.phone || "",
      birthdate: raw.birthdate ? new Date(raw.birthdate).toISOString().split("T")[0] : "",
      address_province: raw.address_province || "",
      address_province_code: raw.address_province_code || "",
      address_city: raw.address_city || "",
      address_city_code: raw.address_city_code || "",
      address_barangay: raw.address_barangay || "",
      address_barangay_code: raw.address_barangay_code || "",
      address_zip: raw.address_zip || "",
      address_street: raw.address_street || "",
      is_verified: Boolean(raw.is_verified),
    };

    // 2. Fetch Orders matching your orders table schema: customer_email = users.email
    const orders = await sql`
      SELECT 
        id,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        payment_method,
        payment_status,
        paymongo_link_id,
        total_amount,
        created_at,
        tracking_number,
        fulfillment_status
      FROM orders
      WHERE customer_email = ${userData.email}
      ORDER BY created_at DESC
      LIMIT 20
    `;

    userOrders = orders.map((o: any) => ({
      ...o,
      total_amount: Number(o.total_amount || 0),
      created_at: o.created_at ? new Date(o.created_at).toISOString() : new Date().toISOString(),
    }));

  } catch (error) {
    console.error("Neon Profile Query Error:", error);
    redirect("/login");
  }

  return (
  <div className="min-h-screen bg-slate-50/60 py-10">
    <AccountClientForm initialUser={userData} />
  </div>
);
}