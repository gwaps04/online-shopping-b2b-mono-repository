// FILE: src/app/admin/automation/automation.actions.ts
"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

export async function saveOrderAutomationSettings(prevState: any, formData: FormData) {
  const webhookUrl = (formData.get("webhookUrl") as string || "").trim();
  const webhookSecret = (formData.get("webhookSecret") as string || "").trim();
  const isActive = formData.get("isActive") === "on";
  const paymongoSecret = (formData.get("paymongoSecret") as string || "").trim();

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || !dbUrl.startsWith("postgres")) {
    return { error: "Database connection not available.", success: "" };
  }

  try {
    const sql = neon(dbUrl);
    
    // Ensure table exists
    await sql`
      CREATE TABLE IF NOT EXISTS automation_settings (
        id integer PRIMARY KEY DEFAULT 1,
        webhook_url text DEFAULT '',
        webhook_secret text DEFAULT '',
        is_active boolean DEFAULT false,
        paymongo_secret_key text DEFAULT '',
        updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Only update order webhook and payment fields! NEVER touch AI assistant columns!
    await sql`
      INSERT INTO automation_settings (
        id, 
        webhook_url, 
        webhook_secret, 
        is_active, 
        paymongo_secret_key, 
        updated_at
      )
      VALUES (
        1, 
        ${webhookUrl}, 
        ${webhookSecret}, 
        ${isActive}, 
        ${paymongoSecret}, 
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (id) DO UPDATE SET
        webhook_url = EXCLUDED.webhook_url,
        webhook_secret = EXCLUDED.webhook_secret,
        is_active = EXCLUDED.is_active,
        paymongo_secret_key = EXCLUDED.paymongo_secret_key,
        updated_at = CURRENT_TIMESTAMP
    `;

    revalidatePath("/admin/automation");
    return { success: "Order Fulfillment & Verification Webhook settings saved successfully.", error: "" };
  } catch (error: any) {
    console.error("Order Automation Save Error:", error);
    return { error: `Failed to save order webhook: ${error.message}`, success: "" };
  }
}

export async function sendOrderTestPing(webhookUrl: string, webhookSecret: string) {
  if (!webhookUrl || !webhookUrl.startsWith("http")) {
    return { success: false, message: "A valid HTTP/HTTPS Webhook URL is required." };
  }

  const samplePayload = {
    event: "order.test_ping",
    timestamp: new Date().toISOString(),
    store: "Store Mono E-Commerce",
    data: {
      order_id: "test-0001-mock",
      customer_name: "Juan Dela Cruz",
      customer_email: "juan@example.ph",
      customer_phone: "09171234567",
      shipping_address: "Unit 402, Rizal St., Legazpi City",
      payment_method: "COD",
      payment_status: "pending",
      total_amount: 31500.00,
      currency: "PHP",
      items: [{ product_id: 1, title: "Samsung Galaxy Flagship", quantity: 1, price_at_purchase: 31500.00 }]
    }
  };

  try {
    const startTime = Date.now();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": "StoreMono-WebhookEngine/1.0",
    };

    if (webhookSecret) {
      headers["X-Webhook-Secret"] = webhookSecret;
      headers["Authorization"] = `Bearer ${webhookSecret}`;
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(samplePayload),
      signal: AbortSignal.timeout(10000), 
    });

    const latency = Date.now() - startTime;
    const responseText = await response.text();

    if (!response.ok) {
      return { success: false, message: `HTTP ${response.status} in ${latency}ms`, body: responseText.slice(0, 300) };
    }
    return { success: true, message: `200 OK — Ping acknowledged in ${latency}ms`, body: responseText.slice(0, 300) };
  } catch (error: any) {
    return { success: false, message: `Connection failed: ${error.message}` };
  }
}