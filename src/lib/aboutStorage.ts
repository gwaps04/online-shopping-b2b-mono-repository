import fs from "fs";
import path from "path";

export interface AboutSettings {
  title: string;
  subtitle: string;
  about_content: string;
  vision_title: string;
  vision_statement: string;
  mission_title: string;
  mission_statement: string;
  bg_type: string;
  bg_color: string;
  bg_gradient_end: string;
  bg_gradient_direction: string;
  text_color: string;
  font_key: string;
}

export const DEFAULT_ABOUT_SETTINGS: AboutSettings = {
  title: "About Our Store",
  subtitle: "Crafting exceptional experiences and curated essentials for the modern lifestyle.",
  about_content: "Founded with a dedication to simplicity, reliability, and modern aesthetics, our store curates high-performing products designed to elevate everyday life. Every piece in our collection is carefully evaluated for durability, utility, and refined craftsmanship.",
  vision_title: "Our Vision",
  vision_statement: "To be the trusted destination for individuals who value quality craftsmanship, minimalist aesthetics, and timeless design in everyday products.",
  mission_title: "Our Mission",
  mission_statement: "Empowering our customers through meticulously designed, sustainably sourced, and enduring goods while delivering transparent, first-class service.",
  bg_type: "solid",
  bg_color: "#f1f5f9", // Silver White default
  bg_gradient_end: "#e2e8f0",
  bg_gradient_direction: "to-br",
  text_color: "#000000", // Black default
  font_key: "sans",
};

const DATA_FILE = path.join(process.cwd(), "src", "data", "about_settings.json");

export async function getAboutSettings(): Promise<AboutSettings> {
  // 1. Try Neon Database if DATABASE_URL is set
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && dbUrl.startsWith("postgres")) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(dbUrl);
      const rows = await sql`SELECT * FROM about_settings WHERE id = 1 LIMIT 1`;
      if (rows && rows.length > 0) {
        return { ...DEFAULT_ABOUT_SETTINGS, ...rows[0] };
      }
    } catch (e) {
      console.warn("[AboutStorage] Neon fetch fallback:", e);
    }
  }

  // 2. Read from persistent local JSON file
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_ABOUT_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.warn("[AboutStorage] File read fallback:", e);
  }

  // 3. Fallback to default settings
  return DEFAULT_ABOUT_SETTINGS;
}

export async function saveAboutSettings(settings: AboutSettings): Promise<void> {
  // 1. Write to local JSON file for guaranteed instant persistence
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(settings, null, 2), "utf-8");
  } catch (e) {
    console.error("[AboutStorage] Failed to save JSON file:", e);
  }

  // 2. Write to Neon Database if available
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && dbUrl.startsWith("postgres")) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(dbUrl);
      await sql`
        CREATE TABLE IF NOT EXISTS about_settings (
          id integer PRIMARY KEY DEFAULT 1,
          title character varying NOT NULL DEFAULT 'About Our Store',
          subtitle text,
          about_content text,
          vision_title character varying DEFAULT 'Our Vision',
          vision_statement text,
          mission_title character varying DEFAULT 'Our Mission',
          mission_statement text,
          bg_type character varying DEFAULT 'solid',
          bg_color character varying DEFAULT '#f1f5f9',
          bg_gradient_end character varying DEFAULT '#e2e8f0',
          bg_gradient_direction character varying DEFAULT 'to-br',
          text_color character varying DEFAULT '#000000',
          font_key character varying DEFAULT 'sans',
          updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
        )
      `;
      await sql`
        INSERT INTO about_settings (
          id, title, subtitle, about_content,
          vision_title, vision_statement,
          mission_title, mission_statement,
          bg_type, bg_color, bg_gradient_end, bg_gradient_direction,
          text_color, font_key
        )
        VALUES (
          1, ${settings.title}, ${settings.subtitle}, ${settings.about_content},
          ${settings.vision_title}, ${settings.vision_statement},
          ${settings.mission_title}, ${settings.mission_statement},
          ${settings.bg_type}, ${settings.bg_color}, ${settings.bg_gradient_end}, ${settings.bg_gradient_direction},
          ${settings.text_color}, ${settings.font_key}
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          subtitle = EXCLUDED.subtitle,
          about_content = EXCLUDED.about_content,
          vision_title = EXCLUDED.vision_title,
          vision_statement = EXCLUDED.vision_statement,
          mission_title = EXCLUDED.mission_title,
          mission_statement = EXCLUDED.mission_statement,
          bg_type = EXCLUDED.bg_type,
          bg_color = EXCLUDED.bg_color,
          bg_gradient_end = EXCLUDED.bg_gradient_end,
          bg_gradient_direction = EXCLUDED.bg_gradient_direction,
          text_color = EXCLUDED.text_color,
          font_key = EXCLUDED.font_key,
          updated_at = CURRENT_TIMESTAMP
      `;
    } catch (e) {
      console.warn("[AboutStorage] Neon save warning:", e);
    }
  }
}
