"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

export async function saveAutomationSettings(prevState: any, formData: FormData) {
  const webhookUrl = (formData.get("webhookUrl") as string || "").trim();
  const webhookSecret = (formData.get("webhookSecret") as string || "").trim();
  const isActive = formData.get("isActive") === "on";
  
  // Woz Engine: Extract the PayMongo Key securely
  const paymongoSecret = (formData.get("paymongoSecret") as string || "").trim();

  const sql = neon(process.env.DATABASE_URL!);

  try {
    await sql`
      INSERT INTO automation_settings (id, webhook_url, webhook_secret, is_active, paymongo_secret_key, updated_at)
      VALUES (1, ${webhookUrl}, ${webhookSecret}, ${isActive}, ${paymongoSecret}, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        webhook_url = EXCLUDED.webhook_url,
        webhook_secret = EXCLUDED.webhook_secret,
        is_active = EXCLUDED.is_active,
        paymongo_secret_key = EXCLUDED.paymongo_secret_key,
        updated_at = CURRENT_TIMESTAMP
    `;

    revalidatePath("/admin/automation");
    return { success: "Settings and API Keys saved securely.", error: "" };
  } catch (error: any) {
    console.error("Automation DB Save Error:", error);
    return { error: `Failed to save configuration: ${error.message}`, success: "" };
  }
}

export async function sendTestPing(webhookUrl: string, webhookSecret: string) {
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