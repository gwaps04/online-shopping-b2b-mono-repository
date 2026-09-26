"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";
import { getAboutSettings, saveAboutSettings } from "@/lib/aboutStorage";
import { getFaqsSettings, saveFaqsSettings } from "@/lib/faqsStorage";
import { getContactSettings, saveContactSettings } from "@/lib/contactStorage";

function getSql() {
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && dbUrl.startsWith("postgres")) {
    return neon(dbUrl);
  }
  return null;
}

export async function getAboutSettingsAction() {
  return await getAboutSettings();
}

export async function getFaqsSettingsAction() {
  return await getFaqsSettings();
}

export async function getContactSettingsAction() {
  return await getContactSettings();
}

export async function updateNavbarSettings(prevState: any, formData: FormData) {
  const companyName = formData.get("companyName") as string;
  const themeKey = formData.get("themeKey") as string;
  const fontKey = formData.get("fontKey") as string;
  const logoBase64 = formData.get("logoBase64") as string;

  if (!companyName) {
    return { error: "Company name is required.", success: "" };
  }

  const sql = getSql();
  if (!sql) {
    revalidatePath("/", "layout");
    return { success: "Navigation settings updated successfully.", error: "" };
  }

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

  const sql = getSql();
  if (!sql) {
    revalidatePath("/", "layout");
    return { success: "Hero section updated successfully.", error: "" };
  }

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
  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const bgValue = formData.get("bgValue") as string;
  const textColor = formData.get("textColor") as string;
  const fontKey = formData.get("fontKey") as string;

  const sql = getSql();
  if (!sql) {
    revalidatePath("/", "layout");
    return { success: "Category settings updated.", error: "" };
  }

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
  const name = formData.get("name") as string;
  const mediaUrl = formData.get("imageBase64") as string;
  
  if (!name) return { error: "Category name is required.", success: "" };
  
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const sql = getSql();
  if (!sql) {
    revalidatePath("/", "layout");
    return { success: `Category '${name}' added.`, error: "" };
  }

  try {
    await sql`INSERT INTO categories (name, slug, media_url) VALUES (${name}, ${slug}, ${mediaUrl})`;
    revalidatePath("/", "layout");
    return { success: `Category '${name}' added.`, error: "" };
  } catch (error: any) {
    if (error.message?.includes('unique constraint')) return { error: "A category with this name already exists.", success: "" };
    return { error: "Failed to add category.", success: "" };
  }
}

export async function deleteCategoryItem(id: string) {
  const sql = getSql();
  if (sql) {
    await sql`DELETE FROM categories WHERE id = ${id}`;
  }
  revalidatePath("/", "layout");
}

export async function updateAboutSettings(prevState: any, formData: FormData) {
  const title = (formData.get("title") as string)?.trim() || "About Our Store";
  const subtitle = (formData.get("subtitle") as string)?.trim() || "";
  const aboutContent = (formData.get("aboutContent") as string)?.trim() || "";
  
  const visionTitle = (formData.get("visionTitle") as string)?.trim() || "Our Vision";
  const visionStatement = (formData.get("visionStatement") as string)?.trim() || "";
  
  const missionTitle = (formData.get("missionTitle") as string)?.trim() || "Our Mission";
  const missionStatement = (formData.get("missionStatement") as string)?.trim() || "";
  
  const bgType = (formData.get("bgType") as string) || "solid";
  const bgColor = (formData.get("bgColor") as string) || "#f1f5f9";
  const bgGradientEnd = (formData.get("bgGradientEnd") as string) || "#e2e8f0";
  const bgGradientDirection = (formData.get("bgGradientDirection") as string) || "to-br";
  
  const textColor = (formData.get("textColor") as string) || "#000000";
  const fontKey = (formData.get("fontKey") as string) || "sans";

  try {
    // Persist settings locally and to Neon database (if configured)
    await saveAboutSettings({
      title,
      subtitle,
      about_content: aboutContent,
      vision_title: visionTitle,
      vision_statement: visionStatement,
      mission_title: missionTitle,
      mission_statement: missionStatement,
      bg_type: bgType,
      bg_color: bgColor,
      bg_gradient_end: bgGradientEnd,
      bg_gradient_direction: bgGradientDirection,
      text_color: textColor,
      font_key: fontKey,
    });
  } catch (error) {
    console.error("About Settings Save Error:", error);
    return { error: "Failed to update About Us settings.", success: "" };
  }

  try {
    revalidatePath("/", "layout");
    revalidatePath("/admin/content/about");
  } catch {
    // Ignore context-free revalidation in non-request environments
  }

  return { success: "About Us content and styling updated successfully!", error: "" };
}

export async function updateFaqsSettings(prevState: any, formData: FormData) {
  const title = (formData.get("title") as string)?.trim() || "Frequently Asked Questions";
  const subtitle = (formData.get("subtitle") as string)?.trim() || "";
  const faqsRaw = formData.get("faqsJson") as string;
  
  let faqs = [];
  try {
    if (faqsRaw) {
      faqs = JSON.parse(faqsRaw);
    }
  } catch (e) {
    console.error("Failed to parse faqsJson:", e);
  }

  const bgType = ((formData.get("bgType") as string) || "solid") as "solid" | "gradient";
  const bgColor = (formData.get("bgColor") as string) || "#ffffff";
  const bgGradientEnd = (formData.get("bgGradientEnd") as string) || "#f8fafc";
  const bgGradientDirection = (formData.get("bgGradientDirection") as string) || "to-br";

  const textColor = (formData.get("textColor") as string) || "#0f172a";
  const fontKey = (formData.get("fontKey") as string) || "sans";

  const accordionBg = (formData.get("accordionBg") as string) || "#f8fafc";
  const accordionQuestionColor = (formData.get("accordionQuestionColor") as string) || "#0f172a";
  const accordionAnswerColor = (formData.get("accordionAnswerColor") as string) || "#475569";
  const accordionBorderColor = (formData.get("accordionBorderColor") as string) || "#e2e8f0";
  const accordionAccentColor = (formData.get("accordionAccentColor") as string) || "#2563eb";
  const accordionRadius = ((formData.get("accordionRadius") as string) || "rounded-2xl") as any;
  const accordionLayout = ((formData.get("accordionLayout") as string) || "single-column") as any;

  try {
    await saveFaqsSettings({
      title,
      subtitle,
      faqs,
      bg_type: bgType,
      bg_color: bgColor,
      bg_gradient_end: bgGradientEnd,
      bg_gradient_direction: bgGradientDirection,
      text_color: textColor,
      font_key: fontKey,
      accordion_bg: accordionBg,
      accordion_question_color: accordionQuestionColor,
      accordion_answer_color: accordionAnswerColor,
      accordion_border_color: accordionBorderColor,
      accordion_accent_color: accordionAccentColor,
      accordion_radius: accordionRadius,
      accordion_layout: accordionLayout,
    });
  } catch (error) {
    console.error("FAQs Settings Save Error:", error);
    return { error: "Failed to update FAQs settings.", success: "" };
  }

  try {
    revalidatePath("/", "layout");
    revalidatePath("/admin/content/faqs");
  } catch {
    // Ignore in non-request test contexts
  }

  return { success: "FAQs section and styling updated successfully!", error: "" };
}

export async function updateContactSettings(prevState: any, formData: FormData) {
  const title = (formData.get("title") as string)?.trim() || "Get in Touch with Us";
  const subtitle = (formData.get("subtitle") as string)?.trim() || "";
  const phoneNumber = (formData.get("phoneNumber") as string)?.trim() || "";
  const phoneLabel = (formData.get("phoneLabel") as string)?.trim() || "Direct Support Hotline";
  const emailAddress = (formData.get("emailAddress") as string)?.trim() || "";
  const address = (formData.get("address") as string)?.trim() || "";
  const operatingHours = (formData.get("operatingHours") as string)?.trim() || "";

  if (!phoneNumber) {
    return { error: "Business contact number is required.", success: "" };
  }

  const bgType = ((formData.get("bgType") as string) || "solid") as "solid" | "gradient";
  const bgColor = (formData.get("bgColor") as string) || "#0f172a";
  const bgGradientEnd = (formData.get("bgGradientEnd") as string) || "#1e293b";
  const bgGradientDirection = (formData.get("bgGradientDirection") as string) || "to-br";

  const textColor = (formData.get("textColor") as string) || "#f8fafc";
  const fontKey = (formData.get("fontKey") as string) || "sans";
  const accentColor = (formData.get("accentColor") as string) || "#3b82f6";
  const cardBg = (formData.get("cardBg") as string) || "rgba(255, 255, 255, 0.06)";
  const cardBorder = (formData.get("cardBorder") as string) || "rgba(255, 255, 255, 0.12)";

  try {
    await saveContactSettings({
      title,
      subtitle,
      phone_number: phoneNumber,
      phone_label: phoneLabel,
      email_address: emailAddress,
      address,
      operating_hours: operatingHours,
      bg_type: bgType,
      bg_color: bgColor,
      bg_gradient_end: bgGradientEnd,
      bg_gradient_direction: bgGradientDirection,
      text_color: textColor,
      font_key: fontKey,
      accent_color: accentColor,
      card_bg: cardBg,
      card_border: cardBorder,
    });
  } catch (error) {
    console.error("Contact Settings Save Error:", error);
    return { error: "Failed to update Contact section settings.", success: "" };
  }

  try {
    revalidatePath("/", "layout");
    revalidatePath("/admin/content/contact");
  } catch {
    // Ignore in non-request test contexts
  }

  return { success: "Contact section content & styling updated successfully!", error: "" };
}


