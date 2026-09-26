import fs from "fs";
import path from "path";
import { FooterSettings, DEFAULT_FOOTER_SETTINGS } from "./footerTypes";

export * from "./footerTypes";

const FOOTER_DATA_FILE = path.join(process.cwd(), "src", "data", "footer_settings.json");
const NEWSLETTER_DATA_FILE = path.join(process.cwd(), "src", "data", "newsletter_subscribers.json");

export async function getFooterSettings(): Promise<FooterSettings> {
  // 1. Try Neon Database if DATABASE_URL is configured
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && dbUrl.startsWith("postgres")) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(dbUrl);

      // Self-healing migration for footer_settings
      await sql`
        CREATE TABLE IF NOT EXISTS footer_settings (
          id integer PRIMARY KEY DEFAULT 1,
          company_name_override character varying,
          tagline text NOT NULL DEFAULT 'Premium quality products designed for modern life. Experience the difference in every detail.',
          copyright_text character varying DEFAULT 'All rights reserved.',
          bg_type character varying DEFAULT 'solid',
          bg_color character varying DEFAULT '#020617',
          bg_gradient_end character varying DEFAULT '#0f172a',
          bg_gradient_direction character varying DEFAULT 'to-b',
          font_key character varying DEFAULT 'sans',
          text_color character varying DEFAULT '#94a3b8',
          heading_color character varying DEFAULT '#f8fafc',
          accent_color character varying DEFAULT '#3b82f6',
          newsletter_title character varying DEFAULT 'Stay Updated',
          newsletter_description text DEFAULT 'Subscribe to receive special offers, new collection announcements, and exclusive insider discounts.',
          newsletter_placeholder character varying DEFAULT 'Enter your email address...',
          newsletter_button_text character varying DEFAULT 'Join',
          columns_json text,
          updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
        )
      `;

      const rows = await sql`SELECT * FROM footer_settings WHERE id = 1 LIMIT 1`;
      if (rows && rows.length > 0) {
        const row = rows[0] as any;
        let parsedColumns = DEFAULT_FOOTER_SETTINGS.columns;
        if (row.columns_json) {
          try {
            parsedColumns = JSON.parse(row.columns_json);
          } catch (e) {
            console.warn("Failed to parse columns_json from db", e);
          }
        }
        return {
          ...DEFAULT_FOOTER_SETTINGS,
          company_name_override: row.company_name_override || undefined,
          tagline: row.tagline || DEFAULT_FOOTER_SETTINGS.tagline,
          copyright_text: row.copyright_text || DEFAULT_FOOTER_SETTINGS.copyright_text,
          bg_type: row.bg_type || DEFAULT_FOOTER_SETTINGS.bg_type,
          bg_color: row.bg_color || DEFAULT_FOOTER_SETTINGS.bg_color,
          bg_gradient_end: row.bg_gradient_end || DEFAULT_FOOTER_SETTINGS.bg_gradient_end,
          bg_gradient_direction: row.bg_gradient_direction || DEFAULT_FOOTER_SETTINGS.bg_gradient_direction,
          font_key: row.font_key || DEFAULT_FOOTER_SETTINGS.font_key,
          text_color: row.text_color || DEFAULT_FOOTER_SETTINGS.text_color,
          heading_color: row.heading_color || DEFAULT_FOOTER_SETTINGS.heading_color,
          accent_color: row.accent_color || DEFAULT_FOOTER_SETTINGS.accent_color,
          newsletter_title: row.newsletter_title || DEFAULT_FOOTER_SETTINGS.newsletter_title,
          newsletter_description: row.newsletter_description || DEFAULT_FOOTER_SETTINGS.newsletter_description,
          newsletter_placeholder: row.newsletter_placeholder || DEFAULT_FOOTER_SETTINGS.newsletter_placeholder,
          newsletter_button_text: row.newsletter_button_text || DEFAULT_FOOTER_SETTINGS.newsletter_button_text,
          columns: parsedColumns,
        };
      }
    } catch (e) {
      console.warn("[FooterStorage] Neon fetch fallback:", e);
    }
  }

  // 2. Read from persistent local JSON file
  try {
    if (fs.existsSync(FOOTER_DATA_FILE)) {
      const raw = fs.readFileSync(FOOTER_DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_FOOTER_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.warn("[FooterStorage] File read fallback:", e);
  }

  return DEFAULT_FOOTER_SETTINGS;
}

export async function saveFooterSettings(settings: FooterSettings): Promise<void> {
  // 1. Write to local JSON file for instant file persistence
  try {
    const dir = path.dirname(FOOTER_DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(FOOTER_DATA_FILE, JSON.stringify(settings, null, 2), "utf-8");
  } catch (e) {
    console.error("[FooterStorage] Failed to save JSON file:", e);
  }

  // 2. Write to Neon Database if available
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && dbUrl.startsWith("postgres")) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(dbUrl);
      await sql`
        CREATE TABLE IF NOT EXISTS footer_settings (
          id integer PRIMARY KEY DEFAULT 1,
          company_name_override character varying,
          tagline text NOT NULL DEFAULT 'Premium quality products designed for modern life. Experience the difference in every detail.',
          copyright_text character varying DEFAULT 'All rights reserved.',
          bg_type character varying DEFAULT 'solid',
          bg_color character varying DEFAULT '#020617',
          bg_gradient_end character varying DEFAULT '#0f172a',
          bg_gradient_direction character varying DEFAULT 'to-b',
          font_key character varying DEFAULT 'sans',
          text_color character varying DEFAULT '#94a3b8',
          heading_color character varying DEFAULT '#f8fafc',
          accent_color character varying DEFAULT '#3b82f6',
          newsletter_title character varying DEFAULT 'Stay Updated',
          newsletter_description text DEFAULT 'Subscribe to receive special offers, new collection announcements, and exclusive insider discounts.',
          newsletter_placeholder character varying DEFAULT 'Enter your email address...',
          newsletter_button_text character varying DEFAULT 'Join',
          columns_json text,
          updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
        )
      `;

      const columnsJson = JSON.stringify(settings.columns || DEFAULT_FOOTER_SETTINGS.columns);

      await sql`
        INSERT INTO footer_settings (
          id, company_name_override, tagline, copyright_text,
          bg_type, bg_color, bg_gradient_end, bg_gradient_direction,
          font_key, text_color, heading_color, accent_color,
          newsletter_title, newsletter_description, newsletter_placeholder,
          newsletter_button_text, columns_json
        )
        VALUES (
          1, ${settings.company_name_override || null}, ${settings.tagline}, ${settings.copyright_text},
          ${settings.bg_type}, ${settings.bg_color}, ${settings.bg_gradient_end}, ${settings.bg_gradient_direction},
          ${settings.font_key}, ${settings.text_color}, ${settings.heading_color}, ${settings.accent_color},
          ${settings.newsletter_title}, ${settings.newsletter_description}, ${settings.newsletter_placeholder},
          ${settings.newsletter_button_text}, ${columnsJson}
        )
        ON CONFLICT (id) DO UPDATE SET
          company_name_override = EXCLUDED.company_name_override,
          tagline = EXCLUDED.tagline,
          copyright_text = EXCLUDED.copyright_text,
          bg_type = EXCLUDED.bg_type,
          bg_color = EXCLUDED.bg_color,
          bg_gradient_end = EXCLUDED.bg_gradient_end,
          bg_gradient_direction = EXCLUDED.bg_gradient_direction,
          font_key = EXCLUDED.font_key,
          text_color = EXCLUDED.text_color,
          heading_color = EXCLUDED.heading_color,
          accent_color = EXCLUDED.accent_color,
          newsletter_title = EXCLUDED.newsletter_title,
          newsletter_description = EXCLUDED.newsletter_description,
          newsletter_placeholder = EXCLUDED.newsletter_placeholder,
          newsletter_button_text = EXCLUDED.newsletter_button_text,
          columns_json = EXCLUDED.columns_json,
          updated_at = CURRENT_TIMESTAMP
      `;
    } catch (e) {
      console.warn("[FooterStorage] Neon save warning:", e);
    }
  }
}

export interface Subscriber {
  id?: number | string;
  email: string;
  created_at: string;
}

export async function subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return { success: false, message: "Please enter a valid email address." };
  }

  // 1. Neon Database subscriber registration
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && dbUrl.startsWith("postgres")) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(dbUrl);
      await sql`
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
          id serial PRIMARY KEY,
          email character varying UNIQUE NOT NULL,
          created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
        )
      `;

      const existing = await sql`SELECT id FROM newsletter_subscribers WHERE email = ${cleanEmail}`;
      if (existing.length > 0) {
        return { success: true, message: "You are already subscribed to our newsletter!" };
      }

      await sql`INSERT INTO newsletter_subscribers (email) VALUES (${cleanEmail})`;
    } catch (e: any) {
      if (e.message?.includes("unique constraint") || e.code === "23505") {
        return { success: true, message: "You are already subscribed to our newsletter!" };
      }
      console.warn("[Newsletter] Neon subscription warning:", e);
    }
  }

  // 2. Local JSON subscriber storage
  try {
    let subscribers: Subscriber[] = [];
    if (fs.existsSync(NEWSLETTER_DATA_FILE)) {
      const raw = fs.readFileSync(NEWSLETTER_DATA_FILE, "utf-8");
      subscribers = JSON.parse(raw);
    }
    const alreadyExists = subscribers.some((s) => s.email.toLowerCase() === cleanEmail);
    if (!alreadyExists) {
      subscribers.push({
        id: Date.now().toString(),
        email: cleanEmail,
        created_at: new Date().toISOString(),
      });
      fs.writeFileSync(NEWSLETTER_DATA_FILE, JSON.stringify(subscribers, null, 2), "utf-8");
    }
  } catch (e) {
    console.error("[Newsletter] Local file write error:", e);
  }

  return { success: true, message: "Welcome to our VIP newsletter! You are now subscribed." };
}

export async function getNewsletterSubscribers(): Promise<Subscriber[]> {
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && dbUrl.startsWith("postgres")) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(dbUrl);
      await sql`
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
          id serial PRIMARY KEY,
          email character varying UNIQUE NOT NULL,
          created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
        )
      `;
      const rows = await sql`SELECT id, email, created_at FROM newsletter_subscribers ORDER BY created_at DESC LIMIT 50`;
      if (rows && rows.length > 0) {
        return rows.map((r: any) => ({
          id: r.id,
          email: r.email,
          created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        }));
      }
    } catch (e) {
      console.warn("[Newsletter] Neon fetch warning:", e);
    }
  }

  try {
    if (fs.existsSync(NEWSLETTER_DATA_FILE)) {
      const raw = fs.readFileSync(NEWSLETTER_DATA_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn("[Newsletter] JSON file read warning:", e);
  }

  return [];
}
