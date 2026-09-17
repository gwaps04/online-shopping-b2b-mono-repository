"use server";

import { neon } from "@neondatabase/serverless";

export async function processCheckout(prevState: any, formData: FormData) {
  const firstName = formData.get("firstName") as string || "";
  const lastName = formData.get("lastName") as string || "";
  const name = `${firstName.trim()} ${lastName.trim()}`.trim();
  
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const method = formData.get("payment_method") as string;
  const cartDataRaw = formData.get("cart_data") as string;

  if (!name || !email || !phone || !address || !cartDataRaw) {
    return { error: "Please fill out all required fields." };
  }

  let clientCart;
  try {
    clientCart = JSON.parse(cartDataRaw);
    if (!Array.isArray(clientCart) || clientCart.length === 0) throw new Error();
  } catch {
    return { error: "Invalid cart data." };
  }

  const sql = neon(process.env.DATABASE_URL!);

  try {
    // 1. SECURE PRICING CALCULATION
    let verifiedTotal = 0;
    const verifiedItems = [];

    for (const item of clientCart) {
      const dbProduct = await sql`SELECT id, price, discount_percentage, stock FROM products WHERE id = ${item.id}::integer`;
      if (dbProduct.length === 0) return { error: `Product not found in database.` };
      
      const currentStock = dbProduct[0].stock || 0;
      if (currentStock < item.quantity) return { error: `Insufficient stock for ${item.title}. Only ${currentStock} left.` };

      const basePrice = Number(dbProduct[0].price || 0);
      const discount = Number(dbProduct[0].discount_percentage || 0);
      const finalPrice = discount > 0 ? basePrice - (basePrice * (discount / 100)) : basePrice;

      verifiedTotal += finalPrice * item.quantity;
      verifiedItems.push({
        product_id: dbProduct[0].id,
        title: item.title, 
        quantity: Number(item.quantity), 
        price_at_purchase: finalPrice
      });
    }

    const safeTotal = Math.round(verifiedTotal * 100) / 100;

    // 2. CREATE THE ORDER
    const orderResult = await sql`
      INSERT INTO orders (customer_name, customer_email, customer_phone, shipping_address, payment_method, total_amount)
      VALUES (${name}, ${email}, ${phone}, ${address}, ${method}, ${safeTotal})
      RETURNING id
    `;
    const orderId = orderResult[0].id;

    // 3. INSERT ORDER ITEMS & DEDUCT STOCK
    for (const vItem of verifiedItems) {
      const safePrice = Math.round(vItem.price_at_purchase * 100) / 100;
      await sql`
        INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
        VALUES (${orderId}::uuid, ${vItem.product_id}::integer, ${vItem.quantity}::integer, ${safePrice})
      `;
      await sql`
        UPDATE products SET stock = COALESCE(stock, 0) - ${vItem.quantity}::integer WHERE id = ${vItem.product_id}::integer
      `;
    }

    // 4. WOZ ENGINE: DISPATCH TO N8N WEBHOOK WITH DEEP LOGGING
    try {
      const autoSettings = await sql`SELECT webhook_url, webhook_secret, is_active FROM automation_settings WHERE id = 1`;
      const storeSettings = await sql`SELECT currency FROM product_settings WHERE id = 1`;
      
      const isActive = autoSettings.length > 0 && autoSettings[0].is_active;
      const targetUrl = autoSettings.length > 0 ? autoSettings[0].webhook_url : null;

      if (isActive && targetUrl) {
        console.log(`\n[WEBHOOK] Dispatching Live Order to: ${targetUrl}`);
        
        const currency = storeSettings.length > 0 ? storeSettings[0].currency : "PHP";
        const webhookPayload = {
          event: "order.created",
          timestamp: new Date().toISOString(),
          store: "Store Mono E-Commerce",
          data: {
            order_id: orderId,
            customer_name: name,
            customer_email: email,
            customer_phone: phone,
            shipping_address: address,
            payment_method: method,
            payment_status: "pending",
            total_amount: safeTotal,
            currency: currency,
            items: verifiedItems.map(vi => ({
              product_id: vi.product_id,
              title: vi.title,
              quantity: vi.quantity,
              price_at_purchase: vi.price_at_purchase
            }))
          }
        };

        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (autoSettings[0].webhook_secret) {
          headers["X-Webhook-Secret"] = autoSettings[0].webhook_secret;
          headers["Authorization"] = `Bearer ${autoSettings[0].webhook_secret}`;
        }

        // Fire request with an 8-second abort guard to prevent hanging the checkout
        await fetch(targetUrl, {
          method: "POST",
          headers,
          body: JSON.stringify(webhookPayload),
          signal: AbortSignal.timeout(8000)
        })
        .then(res => {
          if (!res.ok) console.error(`[WEBHOOK ERROR] n8n rejected the payload. Status: ${res.status} ${res.statusText}`);
          else console.log(`[WEBHOOK SUCCESS] n8n accepted the order! Status: ${res.status}`);
        })
        .catch(e => console.error(`[WEBHOOK FAILED] Network or Timeout Error: ${e.message}`));

      } else {
        console.log(`[WEBHOOK SKIPPED] Status: Active=${isActive}, URL Setup=${!!targetUrl}`);
      }
    } catch (webhookErr) {
      console.error("[WEBHOOK DB QUERY ERROR]:", webhookErr);
    }

    // 5. PAYMENT ROUTING
    if (method === 'COD') {
      return { success: true, redirectUrl: `/checkout/success?order=${orderId}` };
    } 
    
    if (method === 'PAYMONGO') {
      const amountInCents = Math.round(safeTotal * 100);
      const paymongoPayload = { data: { attributes: { amount: amountInCents, description: `Order ${orderId}`, remarks: `Customer: ${email}` } } };

      const pmResponse = await fetch("https://api.paymongo.com/v1/links", {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY!).toString("base64")}`,
        },
        body: JSON.stringify(paymongoPayload),
      });

      if (!pmResponse.ok) throw new Error("Payment Gateway failed to generate link.");

      const pmData = await pmResponse.json();
      const checkoutUrl = pmData.data.attributes.checkout_url;
      const linkId = pmData.data.id;

      await sql`UPDATE orders SET paymongo_link_id = ${linkId} WHERE id = ${orderId}::uuid`;
      return { success: true, redirectUrl: checkoutUrl };
    }

  } catch (error: any) {
    console.error("Checkout Error Log:", error);
    return { error: `Checkout Failed: ${error.message}` };
  }
}