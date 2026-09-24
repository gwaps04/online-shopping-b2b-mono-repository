"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

export async function updateFulfillmentStatus(orderId: string, newStatus: string) {
  const sql = neon(process.env.DATABASE_URL!);
  
  try {
    const validStatuses = ['processing', 'preparing', 'in_transit', 'delivered', 'cancelled'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error("Invalid fulfillment status.");
    }

    // Woz Engine: Inventory Restoration Logic for Abandoned Checkouts!
    if (newStatus === 'cancelled') {
      // Check if it's already cancelled to prevent double-restoring stock
      const orderCheck = await sql`SELECT fulfillment_status FROM orders WHERE id = ${orderId}::uuid`;
      
      if (orderCheck.length > 0 && orderCheck[0].fulfillment_status !== 'cancelled') {
        const items = await sql`SELECT product_id, quantity FROM order_items WHERE order_id = ${orderId}::uuid`;
        
        // Loop through the items and instantly give the stock back to the store
        for (const item of items) {
          await sql`
            UPDATE products 
            SET stock = stock + ${item.quantity} 
            WHERE id = ${item.product_id}
          `;
        }
      }
    }

    await sql`
      UPDATE orders 
      SET fulfillment_status = ${newStatus} 
      WHERE id = ${orderId}::uuid
    `;

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update fulfillment status:", error);
    return { success: false, error: error.message };
  }
}