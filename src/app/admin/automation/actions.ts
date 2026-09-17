"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

export async function saveAutomationSettings(prevState: any, formData: FormData) {
  const webhookUrl = (formData.get("webhookUrl") as string || "").trim();
  const webhookSecret = (formData.get("webhookSecret") as string || "").trim();
  const isActive = formData.get("isActive") === "on";

  const sql = neon(process.env.DATABASE_URL!);

  try {
    await sql`
      INSERT INTO automation_settings (id, webhook_url, webhook_secret, is_active, updated_at)
      VALUES (1, ${webhookUrl}, ${webhookSecret}, ${isActive}, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        webhook_url = EXCLUDED.webhook_url,
        webhook_secret = EXCLUDED.webhook_secret,
        is_active = EXCLUDED.is_active,
        updated_at = CURRENT_TIMESTAMP
    `;

    revalidatePath("/admin/automation");
    return { success: "Webhook configuration saved successfully.", error: "" };
  } catch (error: any) {
    console.error("Automation DB Save Error:", error);
    return { error: `Failed to save configuration: ${error.message}`, success: "" };
  }
}

export async function sendTestPing(webhookUrl: string, webhookSecret: string) {
  if (!webhookUrl || !webhookUrl.startsWith("http")) {
    return { success: false, message: "A valid HTTP/HTTPS Webhook URL is required." };
  }

  // Exact JSON payload schema representing real checkout events
  const samplePayload = {
    event: "order.test_ping",
    timestamp: new Date().toISOString(),
    store: "Store Mono E-Commerce",
    data: {
      order_id: "test-0001-mock",
      customer_name: "Juan Dela Cruz",
      customer_email: "juan@example.ph",
      customer_phone: "09171234567",
      shipping_address: "Unit 402, Rizal St., Brgy. Bitano, Legazpi City, Albay, 4500",
      payment_method: "COD",
      payment_status: "pending",
      total_amount: 31500.00,
      currency: "PHP",
      items: [
        {
          product_id: 1,
          title: "Samsung Galaxy Flagship",
          quantity: 1,
          price_at_purchase: 31500.00
        }
      ]
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
      signal: AbortSignal.timeout(10000), // 10-second guard against hanging workflows
    });

    const latency = Date.now() - startTime;
    const responseText = await response.text();

    if (!response.ok) {
      return {
        success: false,
        message: `Endpoint responded with HTTP ${response.status} (${response.statusText}) in ${latency}ms`,
        body: responseText.slice(0, 300)
      };
    }

    return {
      success: true,
      message: `200 OK — Ping acknowledged in ${latency}ms`,
      body: responseText.slice(0, 300)
    };
  } catch (error: any) {
    console.error("Test Ping Network Error:", error);
    return {
      success: false,
      message: error.name === "TimeoutError" ? "Request timed out after 10 seconds." : `Connection failed: ${error.message}`
    };
  }
}