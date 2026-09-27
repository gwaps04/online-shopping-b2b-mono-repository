import fs from "fs";
import path from "path";
import { AIAssistantSettings, DEFAULT_AI_ASSISTANT_SETTINGS } from "./aiAssistantTypes";

export * from "./aiAssistantTypes";

const AI_DATA_FILE = path.join(process.cwd(), "src", "data", "ai_assistant_settings.json");

export async function getAIAssistantSettings(): Promise<AIAssistantSettings> {
  const dbUrl = process.env.DATABASE_URL;

  // 1. Try Neon Database if configured
  if (dbUrl && dbUrl.startsWith("postgres")) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(dbUrl);

      // Self-healing migration to ensure columns exist in automation_settings
      await sql`
        ALTER TABLE automation_settings 
        ADD COLUMN IF NOT EXISTS ai_assistant_webhook_url text DEFAULT '',
        ADD COLUMN IF NOT EXISTS ai_assistant_active boolean DEFAULT true,
        ADD COLUMN IF NOT EXISTS ai_assistant_name varchar DEFAULT 'Business AI Persona',
        ADD COLUMN IF NOT EXISTS ai_assistant_welcome_message text DEFAULT 'Hello! 👋 I am your Business AI Assistant. How can I help you today with our products, orders, or store policies?',
        ADD COLUMN IF NOT EXISTS ai_assistant_button_text varchar DEFAULT 'Talk with our AI Persona';
      `;

      const rows = await sql`
        SELECT 
          ai_assistant_webhook_url,
          ai_assistant_active,
          ai_assistant_name,
          ai_assistant_welcome_message,
          ai_assistant_button_text,
          updated_at
        FROM automation_settings 
        WHERE id = 1 
        LIMIT 1
      `;

      if (rows && rows.length > 0) {
        const row = rows[0] as any;
        return {
          ai_assistant_webhook_url: row.ai_assistant_webhook_url || "",
          ai_assistant_active: row.ai_assistant_active ?? DEFAULT_AI_ASSISTANT_SETTINGS.ai_assistant_active,
          ai_assistant_name: row.ai_assistant_name || DEFAULT_AI_ASSISTANT_SETTINGS.ai_assistant_name,
          ai_assistant_welcome_message: row.ai_assistant_welcome_message || DEFAULT_AI_ASSISTANT_SETTINGS.ai_assistant_welcome_message,
          ai_assistant_button_text: row.ai_assistant_button_text || DEFAULT_AI_ASSISTANT_SETTINGS.ai_assistant_button_text,
          updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
        };
      }
    } catch (e) {
      console.warn("[AIAssistantStorage] Neon fetch fallback:", e);
    }
  }

  // 2. Fallback to persistent local JSON file
  try {
    if (fs.existsSync(AI_DATA_FILE)) {
      const raw = fs.readFileSync(AI_DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_AI_ASSISTANT_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.warn("[AIAssistantStorage] Local file read fallback:", e);
  }

  return DEFAULT_AI_ASSISTANT_SETTINGS;
}

export async function saveAIAssistantSettings(settings: Partial<AIAssistantSettings>): Promise<void> {
  const merged: AIAssistantSettings = {
    ...DEFAULT_AI_ASSISTANT_SETTINGS,
    ...(await getAIAssistantSettings()),
    ...settings,
  };

  // 1. Write to local JSON file
  try {
    const dir = path.dirname(AI_DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(AI_DATA_FILE, JSON.stringify(merged, null, 2), "utf-8");
  } catch (e) {
    console.error("[AIAssistantStorage] Failed to save JSON file:", e);
  }

  // 2. Write to Neon Database
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && dbUrl.startsWith("postgres")) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(dbUrl);

      await sql`
        ALTER TABLE automation_settings 
        ADD COLUMN IF NOT EXISTS ai_assistant_webhook_url text DEFAULT '',
        ADD COLUMN IF NOT EXISTS ai_assistant_active boolean DEFAULT true,
        ADD COLUMN IF NOT EXISTS ai_assistant_name varchar DEFAULT 'Business AI Persona',
        ADD COLUMN IF NOT EXISTS ai_assistant_welcome_message text DEFAULT 'Hello! 👋 I am your Business AI Assistant. How can I help you today with our products, orders, or store policies?',
        ADD COLUMN IF NOT EXISTS ai_assistant_button_text varchar DEFAULT 'Talk with our AI Persona';
      `;

      await sql`
        INSERT INTO automation_settings (
          id,
          ai_assistant_webhook_url,
          ai_assistant_active,
          ai_assistant_name,
          ai_assistant_welcome_message,
          ai_assistant_button_text,
          updated_at
        )
        VALUES (
          1,
          ${merged.ai_assistant_webhook_url},
          ${merged.ai_assistant_active},
          ${merged.ai_assistant_name},
          ${merged.ai_assistant_welcome_message},
          ${merged.ai_assistant_button_text},
          CURRENT_TIMESTAMP
        )
        ON CONFLICT (id) DO UPDATE SET
          ai_assistant_webhook_url = EXCLUDED.ai_assistant_webhook_url,
          ai_assistant_active = EXCLUDED.ai_assistant_active,
          ai_assistant_name = EXCLUDED.ai_assistant_name,
          ai_assistant_welcome_message = EXCLUDED.ai_assistant_welcome_message,
          ai_assistant_button_text = EXCLUDED.ai_assistant_button_text,
          updated_at = CURRENT_TIMESTAMP
      `;
    } catch (e) {
      console.warn("[AIAssistantStorage] Neon save warning:", e);
    }
  }
}

export async function testN8nAIPing(
  webhookUrl: string, 
  promptMessage: string, 
  sessionId?: string
): Promise<{ success: boolean; message: string; reply?: string; latency?: number }> {
  if (!webhookUrl || !webhookUrl.startsWith("http")) {
    return { success: false, message: "A valid HTTP or HTTPS n8n Webhook URL is required." };
  }

  const startTime = Date.now();
  const testSession = sessionId || `test_admin_${Date.now()}`;

  const payload = {
    message: promptMessage || "Hello! What products are available in your store?",
    chatInput: promptMessage || "Hello! What products are available in your store?",
    sessionId: testSession,
    timestamp: new Date().toISOString(),
    event: "ai_chat.message",
    source: "n8n_test_console",
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "StoreMono-AIAssistant/1.0",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000), // 15s timeout for AI agent execution
    });

    const latency = Date.now() - startTime;
    const responseText = await response.text();

    if (!response.ok) {
      return { 
        success: false, 
        message: `HTTP ${response.status} Error received from n8n (${latency}ms)`, 
        reply: responseText.slice(0, 300),
        latency 
      };
    }

    // Try parsing JSON response from n8n AI Agent / Webhook
    let aiReply = responseText;
    try {
      const parsed = JSON.parse(responseText);
      if (typeof parsed === "string") {
        aiReply = parsed;
      } else if (parsed && typeof parsed === "object") {
        if (parsed.output) aiReply = String(parsed.output);
        else if (parsed.response) aiReply = String(parsed.response);
        else if (parsed.text) aiReply = String(parsed.text);
        else if (parsed.message) aiReply = String(parsed.message);
        else if (Array.isArray(parsed) && parsed[0]?.output) aiReply = String(parsed[0].output);
        else if (Array.isArray(parsed) && parsed[0]?.json?.text) aiReply = String(parsed[0].json.text);
        else if (Array.isArray(parsed) && parsed[0]?.json?.message) aiReply = String(parsed[0].json.message);
        else aiReply = JSON.stringify(parsed, null, 2);
      }
    } catch {
      // responseText is plain text
    }

    return {
      success: true,
      message: `200 OK — AI Webhook responded in ${latency}ms!`,
      reply: aiReply || "Connection verified. n8n workflow executed successfully.",
      latency,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Connection failed: ${error.message || "Unknown error"}`,
    };
  }
}
