import fs from "fs";
import path from "path";
import { ContactSettings, DEFAULT_CONTACT_SETTINGS } from "./contactTypes";

export * from "./contactTypes";

const DATA_FILE = path.join(process.cwd(), "src", "data", "contact_settings.json");

export async function getContactSettings(): Promise<ContactSettings> {
  // 1. Try Neon Database if DATABASE_URL is configured
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && dbUrl.startsWith("postgres")) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(dbUrl);

      // Self-healing migration: Ensure table exists before querying
      await sql`
        CREATE TABLE IF NOT EXISTS contact_settings (
          id integer PRIMARY KEY DEFAULT 1,
          title character varying NOT NULL DEFAULT 'Get in Touch with Us',
          subtitle text,
          phone_number character varying NOT NULL DEFAULT '+1 (800) 555-0199',
          phone_label character varying DEFAULT 'Direct Support & Inquiries Hotline',
          email_address character varying DEFAULT 'concierge@storebrand.com',
          address text DEFAULT '742 Evergreen Avenue, Suite 400, New York, NY 10001',
          operating_hours character varying DEFAULT 'Monday – Friday: 9:00 AM – 6:00 PM EST',
          bg_type character varying DEFAULT 'solid',
          bg_color character varying DEFAULT '#0f172a',
          bg_gradient_end character varying DEFAULT '#1e293b',
          bg_gradient_direction character varying DEFAULT 'to-br',
          text_color character varying DEFAULT '#f8fafc',
          font_key character varying DEFAULT 'sans',
          card_bg character varying DEFAULT 'rgba(255, 255, 255, 0.06)',
          card_border character varying DEFAULT 'rgba(255, 255, 255, 0.12)',
          accent_color character varying DEFAULT '#3b82f6',
          updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
        )
      `;

      const rows = await sql`SELECT * FROM contact_settings WHERE id = 1 LIMIT 1`;
      if (rows && rows.length > 0) {
        const row = rows[0] as any;
        return {
          ...DEFAULT_CONTACT_SETTINGS,
          title: row.title || DEFAULT_CONTACT_SETTINGS.title,
          subtitle: row.subtitle !== undefined ? row.subtitle : DEFAULT_CONTACT_SETTINGS.subtitle,
          phone_number: row.phone_number || DEFAULT_CONTACT_SETTINGS.phone_number,
          phone_label: row.phone_label || DEFAULT_CONTACT_SETTINGS.phone_label,
          email_address: row.email_address || DEFAULT_CONTACT_SETTINGS.email_address,
          address: row.address || DEFAULT_CONTACT_SETTINGS.address,
          operating_hours: row.operating_hours || DEFAULT_CONTACT_SETTINGS.operating_hours,
          bg_type: row.bg_type || DEFAULT_CONTACT_SETTINGS.bg_type,
          bg_color: row.bg_color || DEFAULT_CONTACT_SETTINGS.bg_color,
          bg_gradient_end: row.bg_gradient_end || DEFAULT_CONTACT_SETTINGS.bg_gradient_end,
          bg_gradient_direction: row.bg_gradient_direction || DEFAULT_CONTACT_SETTINGS.bg_gradient_direction,
          text_color: row.text_color || DEFAULT_CONTACT_SETTINGS.text_color,
          font_key: row.font_key || DEFAULT_CONTACT_SETTINGS.font_key,
          card_bg: row.card_bg || DEFAULT_CONTACT_SETTINGS.card_bg,
          card_border: row.card_border || DEFAULT_CONTACT_SETTINGS.card_border,
          accent_color: row.accent_color || DEFAULT_CONTACT_SETTINGS.accent_color,
        };
      }
    } catch (e) {
      console.warn("[ContactStorage] Neon fetch fallback:", e);
    }
  }

  // 2. Read from persistent local JSON file
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_CONTACT_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.warn("[ContactStorage] File read fallback:", e);
  }

  // 3. Fallback to defaults
  return DEFAULT_CONTACT_SETTINGS;
}

export async function saveContactSettings(settings: ContactSettings): Promise<void> {
  // 1. Write to local JSON file for guaranteed instant persistence
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(settings, null, 2), "utf-8");
  } catch (e) {
    console.error("[ContactStorage] Failed to save JSON file:", e);
  }

  // 2. Write to Neon Database if available
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && dbUrl.startsWith("postgres")) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(dbUrl);
      await sql`
        CREATE TABLE IF NOT EXISTS contact_settings (
          id integer PRIMARY KEY DEFAULT 1,
          title character varying NOT NULL DEFAULT 'Get in Touch with Us',
          subtitle text,
          phone_number character varying NOT NULL DEFAULT '+1 (800) 555-0199',
          phone_label character varying DEFAULT 'Direct Support & Inquiries Hotline',
          email_address character varying DEFAULT 'concierge@storebrand.com',
          address text DEFAULT '742 Evergreen Avenue, Suite 400, New York, NY 10001',
          operating_hours character varying DEFAULT 'Monday – Friday: 9:00 AM – 6:00 PM EST',
          bg_type character varying DEFAULT 'solid',
          bg_color character varying DEFAULT '#0f172a',
          bg_gradient_end character varying DEFAULT '#1e293b',
          bg_gradient_direction character varying DEFAULT 'to-br',
          text_color character varying DEFAULT '#f8fafc',
          font_key character varying DEFAULT 'sans',
          card_bg character varying DEFAULT 'rgba(255, 255, 255, 0.06)',
          card_border character varying DEFAULT 'rgba(255, 255, 255, 0.12)',
          accent_color character varying DEFAULT '#3b82f6',
          updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
        )
      `;
      await sql`
        INSERT INTO contact_settings (
          id, title, subtitle, phone_number, phone_label, email_address,
          address, operating_hours, bg_type, bg_color, bg_gradient_end,
          bg_gradient_direction, text_color, font_key, card_bg, card_border, accent_color
        )
        VALUES (
          1, ${settings.title}, ${settings.subtitle}, ${settings.phone_number},
          ${settings.phone_label || null}, ${settings.email_address || null},
          ${settings.address || null}, ${settings.operating_hours || null},
          ${settings.bg_type}, ${settings.bg_color}, ${settings.bg_gradient_end},
          ${settings.bg_gradient_direction}, ${settings.text_color}, ${settings.font_key},
          ${settings.card_bg || null}, ${settings.card_border || null}, ${settings.accent_color || null}
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          subtitle = EXCLUDED.subtitle,
          phone_number = EXCLUDED.phone_number,
          phone_label = EXCLUDED.phone_label,
          email_address = EXCLUDED.email_address,
          address = EXCLUDED.address,
          operating_hours = EXCLUDED.operating_hours,
          bg_type = EXCLUDED.bg_type,
          bg_color = EXCLUDED.bg_color,
          bg_gradient_end = EXCLUDED.bg_gradient_end,
          bg_gradient_direction = EXCLUDED.bg_gradient_direction,
          text_color = EXCLUDED.text_color,
          font_key = EXCLUDED.font_key,
          card_bg = EXCLUDED.card_bg,
          card_border = EXCLUDED.card_border,
          accent_color = EXCLUDED.accent_color,
          updated_at = CURRENT_TIMESTAMP
      `;
    } catch (e) {
      console.warn("[ContactStorage] Neon save warning:", e);
    }
  }
}
