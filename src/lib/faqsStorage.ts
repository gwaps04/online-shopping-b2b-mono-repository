import fs from "fs";
import path from "path";
import { FAQSettings, DEFAULT_FAQ_SETTINGS, DEFAULT_FAQS } from "./faqsTypes";

export * from "./faqsTypes";

const DATA_FILE = path.join(process.cwd(), "src", "data", "faqs_settings.json");

export async function getFaqsSettings(): Promise<FAQSettings> {
  // 1. Try Neon Database if DATABASE_URL is set
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && dbUrl.startsWith("postgres")) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(dbUrl);

      // Self-healing migration: Ensure table exists before querying
      await sql`
        CREATE TABLE IF NOT EXISTS faqs_settings (
          id integer PRIMARY KEY DEFAULT 1,
          title character varying NOT NULL DEFAULT 'Frequently Asked Questions',
          subtitle text,
          faqs jsonb DEFAULT '[]'::jsonb,
          bg_type character varying DEFAULT 'solid',
          bg_color character varying DEFAULT '#ffffff',
          bg_gradient_end character varying DEFAULT '#f8fafc',
          bg_gradient_direction character varying DEFAULT 'to-br',
          text_color character varying DEFAULT '#0f172a',
          font_key character varying DEFAULT 'sans',
          accordion_bg character varying DEFAULT '#f8fafc',
          accordion_question_color character varying DEFAULT '#0f172a',
          accordion_answer_color character varying DEFAULT '#475569',
          accordion_border_color character varying DEFAULT '#e2e8f0',
          accordion_accent_color character varying DEFAULT '#2563eb',
          accordion_radius character varying DEFAULT 'rounded-2xl',
          accordion_layout character varying DEFAULT 'single-column',
          updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
        )
      `;

      const rows = await sql`SELECT * FROM faqs_settings WHERE id = 1 LIMIT 1`;
      if (rows && rows.length > 0) {
        const row = rows[0] as any;
        return {
          ...DEFAULT_FAQ_SETTINGS,
          title: row.title || DEFAULT_FAQ_SETTINGS.title,
          subtitle: row.subtitle !== undefined ? row.subtitle : DEFAULT_FAQ_SETTINGS.subtitle,
          faqs: row.faqs ? (typeof row.faqs === "string" ? JSON.parse(row.faqs) : row.faqs) : DEFAULT_FAQS,
          bg_type: row.bg_type || DEFAULT_FAQ_SETTINGS.bg_type,
          bg_color: row.bg_color || DEFAULT_FAQ_SETTINGS.bg_color,
          bg_gradient_end: row.bg_gradient_end || DEFAULT_FAQ_SETTINGS.bg_gradient_end,
          bg_gradient_direction: row.bg_gradient_direction || DEFAULT_FAQ_SETTINGS.bg_gradient_direction,
          text_color: row.text_color || DEFAULT_FAQ_SETTINGS.text_color,
          font_key: row.font_key || DEFAULT_FAQ_SETTINGS.font_key,
          accordion_bg: row.accordion_bg || DEFAULT_FAQ_SETTINGS.accordion_bg,
          accordion_question_color: row.accordion_question_color || DEFAULT_FAQ_SETTINGS.accordion_question_color,
          accordion_answer_color: row.accordion_answer_color || DEFAULT_FAQ_SETTINGS.accordion_answer_color,
          accordion_border_color: row.accordion_border_color || DEFAULT_FAQ_SETTINGS.accordion_border_color,
          accordion_accent_color: row.accordion_accent_color || DEFAULT_FAQ_SETTINGS.accordion_accent_color,
          accordion_radius: row.accordion_radius || DEFAULT_FAQ_SETTINGS.accordion_radius,
          accordion_layout: row.accordion_layout || DEFAULT_FAQ_SETTINGS.accordion_layout,
        };
      }
    } catch (e) {
      console.warn("[FaqsStorage] Neon fetch fallback:", e);
    }
  }

  // 2. Read from persistent local JSON file
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_FAQ_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.warn("[FaqsStorage] File read fallback:", e);
  }

  // 3. Fallback to defaults
  return DEFAULT_FAQ_SETTINGS;
}

export async function saveFaqsSettings(settings: FAQSettings): Promise<void> {
  // 1. Write to local JSON file for guaranteed instant persistence
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(settings, null, 2), "utf-8");
  } catch (e) {
    console.error("[FaqsStorage] Failed to save JSON file:", e);
  }

  // 2. Write to Neon Database if available
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && dbUrl.startsWith("postgres")) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(dbUrl);
      await sql`
        CREATE TABLE IF NOT EXISTS faqs_settings (
          id integer PRIMARY KEY DEFAULT 1,
          title character varying NOT NULL DEFAULT 'Frequently Asked Questions',
          subtitle text,
          faqs jsonb DEFAULT '[]'::jsonb,
          bg_type character varying DEFAULT 'solid',
          bg_color character varying DEFAULT '#ffffff',
          bg_gradient_end character varying DEFAULT '#f8fafc',
          bg_gradient_direction character varying DEFAULT 'to-br',
          text_color character varying DEFAULT '#0f172a',
          font_key character varying DEFAULT 'sans',
          accordion_bg character varying DEFAULT '#f8fafc',
          accordion_question_color character varying DEFAULT '#0f172a',
          accordion_answer_color character varying DEFAULT '#475569',
          accordion_border_color character varying DEFAULT '#e2e8f0',
          accordion_accent_color character varying DEFAULT '#2563eb',
          accordion_radius character varying DEFAULT 'rounded-2xl',
          accordion_layout character varying DEFAULT 'single-column',
          updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
        )
      `;
      const faqsJson = JSON.stringify(settings.faqs);
      await sql`
        INSERT INTO faqs_settings (
          id, title, subtitle, faqs,
          bg_type, bg_color, bg_gradient_end, bg_gradient_direction,
          text_color, font_key,
          accordion_bg, accordion_question_color, accordion_answer_color,
          accordion_border_color, accordion_accent_color, accordion_radius, accordion_layout
        )
        VALUES (
          1, ${settings.title}, ${settings.subtitle}, ${faqsJson}::jsonb,
          ${settings.bg_type}, ${settings.bg_color}, ${settings.bg_gradient_end}, ${settings.bg_gradient_direction},
          ${settings.text_color}, ${settings.font_key},
          ${settings.accordion_bg}, ${settings.accordion_question_color}, ${settings.accordion_answer_color},
          ${settings.accordion_border_color}, ${settings.accordion_accent_color}, ${settings.accordion_radius}, ${settings.accordion_layout}
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          subtitle = EXCLUDED.subtitle,
          faqs = EXCLUDED.faqs,
          bg_type = EXCLUDED.bg_type,
          bg_color = EXCLUDED.bg_color,
          bg_gradient_end = EXCLUDED.bg_gradient_end,
          bg_gradient_direction = EXCLUDED.bg_gradient_direction,
          text_color = EXCLUDED.text_color,
          font_key = EXCLUDED.font_key,
          accordion_bg = EXCLUDED.accordion_bg,
          accordion_question_color = EXCLUDED.accordion_question_color,
          accordion_answer_color = EXCLUDED.accordion_answer_color,
          accordion_border_color = EXCLUDED.accordion_border_color,
          accordion_accent_color = EXCLUDED.accordion_accent_color,
          accordion_radius = EXCLUDED.accordion_radius,
          accordion_layout = EXCLUDED.accordion_layout,
          updated_at = CURRENT_TIMESTAMP
      `;
    } catch (e) {
      console.warn("[FaqsStorage] Neon save warning:", e);
    }
  }
}
