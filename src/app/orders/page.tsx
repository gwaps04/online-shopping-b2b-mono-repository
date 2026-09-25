import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OrdersClientView from "./OrdersClientView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders | Store Mono",
  description: "Track your orders, delivery status, and purchase history.",
};

export default async function OrdersPage() {
  // 1. Session Route Guard
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("store_session")?.value;

  if (!sessionId) {
    redirect("/login");
  }

  const sql = neon(process.env.DATABASE_URL!);
  let userEmail = "";
  let userOrders: any[] = [];

  try {
    // 2. Fetch authenticated user email from Neon
    const users = await sql`
      SELECT email FROM users WHERE id = ${sessionId}::uuid LIMIT 1
    `;

    if (users.length === 0) {
      redirect("/login");
    }

    userEmail = users[0].email;

    // 3. Fetch Orders from Neon orders table matching customer_email
    const orders = await sql`
      SELECT 
        o.id,
        o.customer_name,
        o.customer_email,
        o.customer_phone,
        o.shipping_address,
        o.payment_method,
        o.payment_status,
        o.paymongo_link_id,
        o.total_amount,
        o.created_at,
        o.tracking_number,
        o.fulfillment_status
      FROM orders o
      WHERE o.customer_email = ${userEmail}
      ORDER BY o.created_at DESC
    `;

    // 4. Fetch Order Items if orders exist
    if (orders.length > 0) {
      const orderIds = orders.map((o: any) => o.id);
      
      const items = await sql`
        SELECT 
          oi.id,
          oi.order_id,
          oi.product_id,
          oi.quantity,
          oi.price_at_purchase,
          p.title as product_title,
          p.image_1 as product_image
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ANY(${orderIds})
      `;

      // Group items under each order
      userOrders = orders.map((o: any) => ({
        ...o,
        total_amount: Number(o.total_amount || 0),
        created_at: o.created_at ? new Date(o.created_at).toISOString() : new Date().toISOString(),
        items: items
          .filter((it: any) => it.order_id === o.id)
          .map((it: any) => ({
            id: it.id,
            product_id: it.product_id,
            quantity: Number(it.quantity || 1),
            price_at_purchase: Number(it.price_at_purchase || 0),
            product_title: it.product_title || `Product #${it.product_id}`,
            product_image: it.product_image || null,
          })),
      }));
    }
  } catch (error) {
    console.error("Failed to fetch customer orders from Neon:", error);
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50/60 py-10">
      <OrdersClientView 
        initialOrders={userOrders} 
        customerEmail={userEmail} 
      />
    </div>
  );
}