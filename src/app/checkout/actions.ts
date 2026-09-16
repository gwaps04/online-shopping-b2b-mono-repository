"use server";

import { neon } from "@neondatabase/serverless";

export async function processCheckout(prevState: any, formData: FormData) {
  // Extract fields securely
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
      // Woz Fix: Cast item.id to ::integer because products.id is an integer in your DB
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
        quantity: Number(item.quantity), 
        price_at_purchase: finalPrice
      });
    }

    const safeTotal = Math.round(verifiedTotal * 100) / 100;

    // 2. CREATE THE ORDER (orders.id is a UUID)
    const orderResult = await sql`
      INSERT INTO orders (customer_name, customer_email, customer_phone, shipping_address, payment_method, total_amount)
      VALUES (${name}, ${email}, ${phone}, ${address}, ${method}, ${safeTotal})
      RETURNING id
    `;
    const orderId = orderResult[0].id;

    // 3. INSERT ORDER ITEMS & DEDUCT STOCK
    for (const vItem of verifiedItems) {
      const safePrice = Math.round(vItem.price_at_purchase * 100) / 100;
      
      // Woz Fix: order_id is ::uuid, but product_id is ::integer
      await sql`
        INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
        VALUES (${orderId}::uuid, ${vItem.product_id}::integer, ${vItem.quantity}::integer, ${safePrice})
      `;
      
      // Woz Fix: Cast id to ::integer
      await sql`
        UPDATE products 
        SET stock = COALESCE(stock, 0) - ${vItem.quantity}::integer 
        WHERE id = ${vItem.product_id}::integer
      `;
    }

    // 4. PAYMENT ROUTING
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