"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

export async function updateNavbarSettings(prevState: any, formData: FormData) {
  const companyName = formData.get("companyName") as string;
  const themeKey = formData.get("themeKey") as string;
  const fontKey = formData.get("fontKey") as string;
  const logoBase64 = formData.get("logoBase64") as string;

  if (!companyName) {
    return { error: "Company name is required.", success: "" };
  }

  const sql = neon(process.env.DATABASE_URL!);

  try {
    await sql`
      INSERT INTO global_settings (id, company_name, theme_key, font_key, logo_url)
      VALUES (1, ${companyName}, ${themeKey}, ${fontKey}, ${logoBase64})
      ON CONFLICT (id) DO UPDATE SET
        company_name = EXCLUDED.company_name,
        theme_key = EXCLUDED.theme_key,
        font_key = EXCLUDED.font_key,
        logo_url = EXCLUDED.logo_url,
        updated_at = CURRENT_TIMESTAMP
    `;
    
    // Woz Rule: Instantly purge the cache for the public layout and admin panel
    revalidatePath("/", "layout");
    
    return { success: "Navigation settings updated successfully.", error: "" };
  } catch (error) {
    console.error("Database Update Error:", error);
    return { error: "Failed to update settings in the database.", success: "" };
  }
}

export async function updateHeroSettings(prevState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const layoutStyle = formData.get("layoutStyle") as string;
  const imageBase64 = formData.get("imageBase64") as string;
  
  const btnPrimaryText = formData.get("btnPrimaryText") as string;
  const btnPrimaryTheme = formData.get("btnPrimaryTheme") as string;
  const btnSecondaryText = formData.get("btnSecondaryText") as string;
  const btnSecondaryTheme = formData.get("btnSecondaryTheme") as string;

  if (!title) return { error: "Hero title is required.", success: "" };

  const sql = neon(process.env.DATABASE_URL!);

  try {
    await sql`
      INSERT INTO hero_settings (id, title, subtitle, layout_style, image_url, btn_primary_text, btn_primary_theme, btn_secondary_text, btn_secondary_theme)
      VALUES (1, ${title}, ${subtitle}, ${layoutStyle}, ${imageBase64}, ${btnPrimaryText}, ${btnPrimaryTheme}, ${btnSecondaryText}, ${btnSecondaryTheme})
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        subtitle = EXCLUDED.subtitle,
        layout_style = EXCLUDED.layout_style,
        image_url = EXCLUDED.image_url,
        btn_primary_text = EXCLUDED.btn_primary_text,
        btn_primary_theme = EXCLUDED.btn_primary_theme,
        btn_secondary_text = EXCLUDED.btn_secondary_text,
        btn_secondary_theme = EXCLUDED.btn_secondary_theme,
        updated_at = CURRENT_TIMESTAMP
    `;
    
    revalidatePath("/", "layout");
    return { success: "Hero section updated successfully.", error: "" };
  } catch (error) {
    console.error("Hero DB Error:", error);
    return { error: "Failed to update Hero settings.", success: "" };
  }
}

export async function updateCategorySettings(prevState: any, formData: FormData) {
  const sql = neon(process.env.DATABASE_URL!);
  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const bgValue = formData.get("bgValue") as string;
  const textColor = formData.get("textColor") as string;
  const fontKey = formData.get("fontKey") as string;

  try {
    await sql`
      INSERT INTO category_settings (id, title, subtitle, bg_value, text_color, font_key)
      VALUES (1, ${title}, ${subtitle}, ${bgValue}, ${textColor}, ${fontKey})
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title, subtitle = EXCLUDED.subtitle,
        bg_value = EXCLUDED.bg_value, text_color = EXCLUDED.text_color,
        font_key = EXCLUDED.font_key, updated_at = CURRENT_TIMESTAMP
    `;
    revalidatePath("/", "layout");
    return { success: "Category settings updated.", error: "" };
  } catch (error) {
    return { error: "Failed to update category settings.", success: "" };
  }
}

export async function addCategoryItem(prevState: any, formData: FormData) {
  const sql = neon(process.env.DATABASE_URL!);
  const name = formData.get("name") as string;
  const mediaUrl = formData.get("imageBase64") as string;
  
  if (!name) return { error: "Category name is required.", success: "" };
  
  // Auto-generate a URL-friendly slug (e.g., "Men's Shoes" -> "mens-shoes")
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  try {
    await sql`INSERT INTO categories (name, slug, media_url) VALUES (${name}, ${slug}, ${mediaUrl})`;
    revalidatePath("/", "layout");
    return { success: `Category '${name}' added.`, error: "" };
  } catch (error: any) {
    if (error.message.includes('unique constraint')) return { error: "A category with this name already exists.", success: "" };
    return { error: "Failed to add category.", success: "" };
  }
}

export async function deleteCategoryItem(id: string) {
  const sql = neon(process.env.DATABASE_URL!);
  await sql`DELETE FROM categories WHERE id = ${id}`;
  revalidatePath("/", "layout");
}