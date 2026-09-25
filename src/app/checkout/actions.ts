"use server";

import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers"; // Woz Fix: Added cookies import

// ============================================================================
// 1. DEDICATED WEBHOOK DISPATCHER
// ============================================================================
export async function dispatchOrderWebhook(orderId: string) {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    const autoSettings = await sql`SELECT webhook_url, webhook_secret, is_active FROM automation_settings WHERE id = 1`;
    if (!autoSettings.length || !autoSettings[0].is_active || !autoSettings[0].webhook_url) return;

    const orders = await sql`SELECT * FROM orders WHERE id = ${orderId}::uuid`;
    if (!orders.length) return;
    const order = orders[0];

    const items = await sql`
      SELECT oi.quantity, oi.price_at_purchase, p.title, p.id as product_id
      FROM order_items oi JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id = ${orderId}::uuid
    `;

    const storeSettings = await sql`SELECT currency FROM product_settings WHERE id = 1`;
    const currency = storeSettings.length > 0 ? storeSettings[0].currency : "PHP";

    const webhookPayload = {
      event: "order.created",
      timestamp: new Date().toISOString(),
      store: "Store Mono E-Commerce",
      data: {
        order_id: order.id,
        tracking_number: order.tracking_number, 
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        shipping_address: order.shipping_address,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        fulfillment_status: order.fulfillment_status,
        total_amount: Number(order.total_amount),
        currency: currency,
        items: items.map(vi => ({
          product_id: vi.product_id,
          title: vi.title,
          quantity: vi.quantity,
          price_at_purchase: Number(vi.price_at_purchase)
        }))
      }
    };

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (autoSettings[0].webhook_secret) {
      headers["X-Webhook-Secret"] = autoSettings[0].webhook_secret;
      headers["Authorization"] = `Bearer ${autoSettings[0].webhook_secret}`;
    }

    await fetch(autoSettings[0].webhook_url, {
      method: "POST",
      headers,
      body: JSON.stringify(webhookPayload),
      signal: AbortSignal.timeout(8000)
    });
    console.log(`[WEBHOOK SUCCESS] Dispatched Order: ${order.id}`);
  } catch (e: any) {
    console.error(`[WEBHOOK FAILED]`, e.message);
  }
}

// ============================================================================
// 2. SUCCESS PAGE VERIFICATION
// ============================================================================
export async function verifyOrderPayment(orderId: string) {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    const orders = await sql`SELECT id, payment_method, payment_status, paymongo_link_id FROM orders WHERE id = ${orderId}::uuid`;
    if (orders.length === 0) return { success: false, error: "Order not found." };
    const order = orders[0];

    if (order.payment_method === 'COD') return { success: true };
    if (order.payment_status === 'paid') return { success: true };

    if (order.payment_method === 'PAYMONGO' && order.paymongo_link_id) {
        const pmSettings = await sql`SELECT paymongo_secret_key FROM automation_settings WHERE id = 1`;
        const pmSecret = (pmSettings.length > 0 && pmSettings[0].paymongo_secret_key) 
                          ? pmSettings[0].paymongo_secret_key : process.env.PAYMONGO_SECRET_KEY;

        if (!pmSecret) throw new Error("API Key missing.");

        const pmResponse = await fetch(`https://api.paymongo.com/v1/checkout_sessions/${order.paymongo_link_id}`, {
            headers: {
                accept: "application/json",
                authorization: `Basic ${Buffer.from(`${pmSecret}:`).toString("base64")}`
            }
        });

        if (!pmResponse.ok) throw new Error("Failed to verify payment with gateway.");
        const pmData = await pmResponse.json();

        const payments = pmData.data?.attributes?.payments || [];
        const isPaid = payments.some((p: any) => p.attributes.status === 'paid');

        if (isPaid) {
            await sql`UPDATE orders SET payment_status = 'paid' WHERE id = ${orderId}::uuid`;
            await dispatchOrderWebhook(orderId);
            return { success: true };
        } else {
            return { success: false, error: "Payment has not been completed yet." };
        }
    }
  } catch (e: any) {
     return { success: false, error: e.message };
  }
}

// ============================================================================
// 3. THE CHECKOUT PROCESSOR
// ============================================================================
export async function processCheckout(prevState: any, formData: FormData) {
  // Woz Guard: Zero-Trust Backend Verification
  const cookieStore = await cookies();
  if (!cookieStore.has("store_session")) {
    return { error: "Security Halt: You must create an account or log in to process a checkout." };
  }

  const firstName = formData.get("firstName") as string || "";
  const lastName = formData.get("lastName") as string || "";
  const name = `${firstName.trim()} ${lastName.trim()}`.trim();
  
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const method = formData.get("payment_method") as string;
  const cartDataRaw = formData.get("cart_data") as string;
  const baseUrl = formData.get("baseUrl") as string; 

  if (!name || !email || !phone || !address || !cartDataRaw || !baseUrl) {
    return { error: "Please fill out all required fields." };
  }

  let clientCart;
  try {
    clientCart = JSON.parse(cartDataRaw);
  } catch {
    return { error: "Invalid cart data." };
  }

  const sql = neon(process.env.DATABASE_URL!);

  try {
    let verifiedTotal = 0;
    const verifiedItems = [];

    for (const item of clientCart) {
      const dbProduct = await sql`SELECT id, price, discount_percentage, stock FROM products WHERE id = ${item.id}::integer`;
      if (dbProduct.length === 0) return { error: `Product not found in database.` };
      
      const currentStock = dbProduct[0].stock || 0;
      if (currentStock < item.quantity) return { error: `Insufficient stock for ${item.title}.` };

      const basePrice = Number(dbProduct[0].price || 0);
      const discount = Number(dbProduct[0].discount_percentage || 0);
      const finalPrice = discount > 0 ? basePrice - (basePrice * (discount / 100)) : basePrice;

      verifiedTotal += finalPrice * item.quantity;
      verifiedItems.push({ product_id: dbProduct[0].id, title: item.title, quantity: Number(item.quantity), price_at_purchase: finalPrice });
    }

    const safeTotal = Math.round(verifiedTotal * 100) / 100;
    const generatedTracking = 'TRK-' + Math.random().toString(36).substring(2, 10).toUpperCase() + Math.random().toString(36).substring(2, 4).toUpperCase();

    const orderResult = await sql`
      INSERT INTO orders (
        customer_name, customer_email, customer_phone, shipping_address, 
        payment_method, total_amount, tracking_number, fulfillment_status
      )
      VALUES (
        ${name}, ${email}, ${phone}, ${address}, 
        ${method}, ${safeTotal}, ${generatedTracking}, 'processing'
      )
      RETURNING id
    `;
    const orderId = orderResult[0].id;

    for (const vItem of verifiedItems) {
      await sql`
        INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
        VALUES (${orderId}::uuid, ${vItem.product_id}::integer, ${vItem.quantity}::integer, ${vItem.price_at_purchase})
      `;
      await sql`UPDATE products SET stock = COALESCE(stock, 0) - ${vItem.quantity}::integer WHERE id = ${vItem.product_id}::integer`;
    }

    if (method === 'COD') {
      await dispatchOrderWebhook(orderId);
      return { success: true, redirectUrl: `/checkout/success?order=${orderId}`, method: 'COD' };
    } 
    
    if (method === 'PAYMONGO') {
      const pmSettings = await sql`SELECT paymongo_secret_key FROM automation_settings WHERE id = 1`;
      const pmSecret = (pmSettings.length > 0 && pmSettings[0].paymongo_secret_key) 
                        ? pmSettings[0].paymongo_secret_key : process.env.PAYMONGO_SECRET_KEY;

      if (!pmSecret) throw new Error("Payment Gateway is not configured.");

      const amountInCents = Math.round(safeTotal * 100);

      const paymongoPayload = { 
        data: {
          attributes: {
            send_email_receipt: false,
            show_line_items: true,
            reference_number: orderId,
            description: `Order ${orderId} | Trk: ${generatedTracking}`,
            billing: { name, email, phone },
            line_items: [{ 
              currency: "PHP", 
              amount: amountInCents, 
              name: `Order ${orderId.split('-')[0].toUpperCase()}`, 
              quantity: 1 
            }],
            payment_method_types: ["gcash", "paymaya", "card", "qrph"],
            success_url: `${baseUrl}/checkout/success?order=${orderId}`, 
            cancel_url: `${baseUrl}/checkout`
          }
        }
      };

      const pmResponse = await fetch("https://api.paymongo.com/v1/checkout_sessions", {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: `Basic ${Buffer.from(`${pmSecret}:`).toString("base64")}`,
        },
        body: JSON.stringify(paymongoPayload),
      });

      const responseText = await pmResponse.text();
      if (!pmResponse.ok) throw new Error(`PayMongo API Error: ${responseText}`);

      const pmData = JSON.parse(responseText);
      const checkoutUrl = pmData?.data?.attributes?.checkout_url;
      const linkId = pmData?.data?.id;

      await sql`UPDATE orders SET paymongo_link_id = ${linkId} WHERE id = ${orderId}::uuid`;
      return { success: true, redirectUrl: checkoutUrl, method: 'PAYMONGO' };
    }

  } catch (error: any) {
    return { error: `Checkout Failed: ${error.message}` };
  }
}