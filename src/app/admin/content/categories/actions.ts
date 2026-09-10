"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

// 1. CREATE OR UPDATE CATEGORY
export async function saveCategory(prevState: any, formData: FormData) {
  const id = formData.get("id") as string; // If present, we are editing
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const parentIdRaw = formData.get("parentId") as string;
  const iconName = formData.get("iconName") as string;
  const imageBase64 = formData.get("imageBase64") as string;

  if (!name || !slug) return { error: "Name and Slug are required.", success: "" };

  const parentId = parentIdRaw ? parentIdRaw : null;
  const sql = neon(process.env.DATABASE_URL!);

  try {
    if (id) {
      // UPDATE Existing
      await sql`
        UPDATE categories 
        SET name = ${name}, slug = ${slug}, description = ${description}, 
            parent_id = ${parentId}, icon_name = ${iconName}, image_url = ${imageBase64}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
      `;
      revalidatePath("/", "layout");
      return { success: `Category '${name}' updated successfully.`, error: "" };
    } else {
      // INSERT New
      await sql`
        INSERT INTO categories (name, slug, description, parent_id, icon_name, image_url)
        VALUES (${name}, ${slug}, ${description}, ${parentId}, ${iconName}, ${imageBase64})
      `;
      revalidatePath("/", "layout");
      return { success: `Category '${name}' created successfully.`, error: "" };
    }
  } catch (error: any) {
    console.error("DB Error:", error);
    if (error.message?.includes("categories_slug_key")) return { error: "That slug is already in use.", success: "" };
    return { error: `DB Error: ${error.message}`, success: "" };
  }
}

// 2. DELETE CATEGORY
export async function deleteCategory(id: string) {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    await sql`DELETE FROM categories WHERE id = ${id}`;
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Delete Error:", error);
    return { error: error.message };
  }
}

// 3. UPDATE SECTION STYLING
export async function updateCategorySettings(prevState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const bgValue = formData.get("bgValue") as string;
  const textColor = formData.get("textColor") as string;
  const cardBgColor = formData.get("cardBgColor") as string;
  const cardTextColor = formData.get("cardTextColor") as string;
  const fontKey = formData.get("fontKey") as string;

  const sql = neon(process.env.DATABASE_URL!);

  try {
    await sql`
      INSERT INTO category_settings (id, title, subtitle, bg_value, text_color, card_bg_color, card_text_color, font_key)
      VALUES (1, ${title}, ${subtitle}, ${bgValue}, ${textColor}, ${cardBgColor}, ${cardTextColor}, ${fontKey})
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, bg_value = EXCLUDED.bg_value, 
        text_color = EXCLUDED.text_color, card_bg_color = EXCLUDED.card_bg_color, 
        card_text_color = EXCLUDED.card_text_color, font_key = EXCLUDED.font_key, updated_at = CURRENT_TIMESTAMP
    `;
    revalidatePath("/", "layout");
    return { success: "Section styling updated successfully.", error: "" };
  } catch (error: any) {
    console.error("Styling DB Error:", error);
    return { error: `DB Error: ${error.message}`, success: "" };
  }
}