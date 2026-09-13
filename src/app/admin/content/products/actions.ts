"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

export async function saveProduct(prevState: any, formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const subtitle = formData.get("subtitle") as string;
  const description = formData.get("description") as string;
  
  // Financials
  const unitCost = formData.get("unitCost") as string || "0";
  const price = formData.get("price") as string || "0";
  const srp = formData.get("srp") as string || "0";
  const discount = formData.get("discount") as string || "0";
  
  // Inventory
  const stock = formData.get("stock") as string || "0";
  
  const categoryIdRaw = formData.get("categoryId") as string;
  const img1 = formData.get("img1") as string;
  const img2 = formData.get("img2") as string;
  const img3 = formData.get("img3") as string;

  const attributesPayload: Record<string, string> = {};

  formData.forEach((value, key) => {
    if (key.startsWith("attr_")) {
      const cleanKey = key.replace("attr_", "");
      attributesPayload[cleanKey] = value as string;
    }
  });

  const customKeys: string[] = [];
  const customVals: string[] = [];
  formData.forEach((value, key) => {
    if (key.startsWith("customAttrKey_")) customKeys.push(value as string);
    if (key.startsWith("customAttrVal_")) customVals.push(value as string);
  });
  
  for (let i = 0; i < customKeys.length; i++) {
    if (customKeys[i] && customKeys[i].trim() !== "") {
      attributesPayload[customKeys[i]] = customVals[i] || "";
    }
  }

  if (!title || !slug) return { error: "Title and Slug are required.", success: "" };

  const categoryId = categoryIdRaw ? categoryIdRaw : null;
  const sql = neon(process.env.DATABASE_URL!);

  try {
    if (id) {
      await sql`
        UPDATE products 
        SET title = ${title}, slug = ${slug}, subtitle = ${subtitle}, description = ${description}, 
            unit_cost = ${unitCost}, price = ${price}, srp = ${srp}, discount_percentage = ${discount}, 
            stock = ${stock}, category_id = ${categoryId}, 
            image_1 = ${img1}, image_2 = ${img2}, image_3 = ${img3}, 
            attributes = ${JSON.stringify(attributesPayload)}::jsonb,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
      `;
      revalidatePath("/", "layout");
      return { success: `Product '${title}' updated successfully.`, error: "" };
    } else {
      await sql`
        INSERT INTO products (title, slug, subtitle, description, unit_cost, price, srp, discount_percentage, stock, category_id, image_1, image_2, image_3, attributes)
        VALUES (${title}, ${slug}, ${subtitle}, ${description}, ${unitCost}, ${price}, ${srp}, ${discount}, ${stock}, ${categoryId}, ${img1}, ${img2}, ${img3}, ${JSON.stringify(attributesPayload)}::jsonb)
      `;
      revalidatePath("/", "layout");
      return { success: `Product '${title}' created successfully.`, error: "" };
    }
  } catch (error: any) {
    console.error("Product DB Error:", error);
    if (error.message?.includes("products_slug_key")) return { error: "That slug is already in use.", success: "" };
    return { error: `DB Error: ${error.message}`, success: "" };
  }
}

export async function deleteProduct(id: string) {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    await sql`DELETE FROM products WHERE id = ${id}`;
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Delete Error:", error);
    return { error: error.message };
  }
}

export async function updateProductSettings(prevState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const currency = formData.get("currency") as string;
  const bgColor = formData.get("bgColor") as string;
  const textColor = formData.get("textColor") as string;

  const sql = neon(process.env.DATABASE_URL!);

  try {
    await sql`
      INSERT INTO product_settings (id, title, subtitle, currency, bg_color, text_color)
      VALUES (1, ${title}, ${subtitle}, ${currency}, ${bgColor}, ${textColor})
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, currency = EXCLUDED.currency, 
        bg_color = EXCLUDED.bg_color, text_color = EXCLUDED.text_color, updated_at = CURRENT_TIMESTAMP
    `;
    revalidatePath("/", "layout");
    return { success: "Product section styling and currency updated.", error: "" };
  } catch (error: any) {
    console.error("Styling DB Error:", error);
    return { error: `DB Error: ${error.message}`, success: "" };
  }
}