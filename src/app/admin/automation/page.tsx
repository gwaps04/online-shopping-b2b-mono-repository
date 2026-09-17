import { neon } from "@neondatabase/serverless";
import { Zap } from "lucide-react";
import AutomationForm from "./AutomationForm";

export default async function AutomationPage() {
  const sql = neon(process.env.DATABASE_URL!);
  
  let settings = {
    webhook_url: "",
    webhook_secret: "",
    is_active: false,
    updated_at: new Date().toISOString()
  };

  try {
    const data = await sql`SELECT webhook_url, webhook_secret, is_active, updated_at FROM automation_settings WHERE id = 1`;
    if (data.length > 0) {
      settings = data[0] as any;
    }
  } catch (error) {
    console.error("Failed to load automation settings:", error);
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Zap className="w-6 h-6 text-amber-500" /> Automation & Webhooks
        </h2>
        <p className="text-slate-500 mt-1">
          Connect external workflows (n8n, Make, Telegram, Email alerts) to your order transaction pipeline.
        </p>
      </div>

      <AutomationForm settings={settings} />
    </div>
  );
}