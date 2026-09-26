export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQSettings {
  title: string;
  subtitle: string;
  faqs: FAQItem[];
  bg_type: "solid" | "gradient";
  bg_color: string;
  bg_gradient_end: string;
  bg_gradient_direction: string;
  text_color: string;
  font_key: string;
  // Accordion styling & color schemes
  accordion_bg: string;
  accordion_question_color: string;
  accordion_answer_color: string;
  accordion_border_color: string;
  accordion_accent_color: string;
  accordion_radius: "rounded-lg" | "rounded-xl" | "rounded-2xl" | "rounded-3xl" | "rounded-none";
  accordion_layout: "single-column" | "two-column";
}

export const DEFAULT_FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "What are your shipping options and delivery timelines?",
    answer: "We offer Standard Shipping (3–5 business days) and Express Courier (1–2 business days). Orders over $75 qualify for complimentary standard shipping worldwide. You will receive real-time carrier tracking upon dispatch.",
  },
  {
    id: "faq-2",
    question: "What is your return and exchange policy?",
    answer: "We offer a 30-day hassle-free return window for unworn and unused products in their original packaging. Prepaid digital return labels are provided through our automated self-serve return portal.",
  },
  {
    id: "faq-3",
    question: "How can I track my order once it has shipped?",
    answer: "Once your package leaves our fulfillment center, you will immediately receive an email and SMS confirmation containing your tracking number and a live carrier status link.",
  },
  {
    id: "faq-4",
    question: "What payment methods and currencies do you accept?",
    answer: "We support Visa, MasterCard, American Express, Apple Pay, Google Pay, PayPal, and interest-free installment plans via Klarna. Currencies are automatically converted based on your checkout locale.",
  },
  {
    id: "faq-5",
    question: "Do you ship internationally to countries outside the US?",
    answer: "Yes, we ship to over 65 countries worldwide. International shipping options, duties, and local taxes are calculated with transparent upfront pricing at checkout.",
  },
  {
    id: "faq-6",
    question: "Are your materials sustainably and ethically sourced?",
    answer: "Every item in our collection is crafted with certified ethical manufacturing standards, recycled packaging, and responsibly sourced materials designed for long-lasting durability.",
  },
  {
    id: "faq-7",
    question: "Can I cancel or modify my order after placing it?",
    answer: "Orders are processed rapidly to ensure quick delivery. If you need to make changes or cancel, please contact customer care within 60 minutes of placing your order.",
  },
  {
    id: "faq-8",
    question: "What warranty or guarantee comes with purchases?",
    answer: "All premium hardware, watches, tech gear, and leather essentials include a complimentary 1-year manufacturer guarantee protecting against defects in workmanship.",
  },
  {
    id: "faq-9",
    question: "Do you offer wholesale, bulk orders, or corporate gifting?",
    answer: "Yes! For orders of 15 units or more, or bespoke corporate gifting packages, our sales concierge provides tiered pricing and custom packaging options.",
  },
  {
    id: "faq-10",
    question: "How do I contact customer support if I need assistance?",
    answer: "Our dedicated support team is available Monday through Friday from 9 AM to 6 PM EST via live concierge chat or email. Typical response time is under two hours.",
  },
];

export const DEFAULT_FAQ_SETTINGS: FAQSettings = {
  title: "Frequently Asked Questions",
  subtitle: "Everything you need to know about our products, delivery, warranty, and customer care.",
  faqs: DEFAULT_FAQS,
  bg_type: "solid",
  bg_color: "#ffffff",
  bg_gradient_end: "#f8fafc",
  bg_gradient_direction: "to-br",
  text_color: "#0f172a",
  font_key: "sans",
  accordion_bg: "#f8fafc",
  accordion_question_color: "#0f172a",
  accordion_answer_color: "#475569",
  accordion_border_color: "#e2e8f0",
  accordion_accent_color: "#2563eb",
  accordion_radius: "rounded-2xl",
  accordion_layout: "single-column",
};

export async function getFaqsSettings(): Promise<FAQSettings> {
  // 1. Try Neon Database if DATABASE_URL is set
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && dbUrl.startsWith("postgres")) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(dbUrl);
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

  // 2. Read from local JSON file
  try {
    const fs = await import("fs");
    const path = await import("path");
    const dataFile = path.join(process.cwd(), "src", "data", "faqs_settings.json");
    if (fs.existsSync(dataFile)) {
      const raw = fs.readFileSync(dataFile, "utf-8");
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
    const fs = await import("fs");
    const path = await import("path");
    const dataFile = path.join(process.cwd(), "src", "data", "faqs_settings.json");
    const dir = path.dirname(dataFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFile, JSON.stringify(settings, null, 2), "utf-8");
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
