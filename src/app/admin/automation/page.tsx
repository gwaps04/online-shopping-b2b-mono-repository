import { neon } from "@neondatabase/serverless";
import { Zap } from "lucide-react";
import AutomationForm from "./AutomationForm";

export default async function AutomationPage() {
  const dbUrl = process.env.DATABASE_URL;
  
  let settings = {
    webhook_url: "https://n8n.macrotek-edubot.cloud/webhook/onlinestorrepo",
    webhook_secret: "admin@macrotek.com",
    is_active: true,
    paymongo_secret_key: "",
    updated_at: new Date().toISOString()
  };

  // Fetch automation settings from DB if available
  if (dbUrl && dbUrl.startsWith("postgres")) {
    try {
      const sql = neon(dbUrl);
      const data = await sql`
        SELECT 
          webhook_url, 
          webhook_secret, 
          is_active, 
          paymongo_secret_key, 
          updated_at 
        FROM automation_settings 
        WHERE id = 1
      `;
      if (data.length > 0) {
        settings = { ...settings, ...(data[0] as any) };
      }
    } catch (error) {
      console.error("Failed to load automation settings:", error);
    }
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <Zap className="w-5 h-5 text-amber-400" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              Orders & Fulfillment Webhook
            </h1>
            <p className="text-sm text-slate-500">
              Connect your external n8n workflows for order notifications and manage secure Payment Gateway API keys.
            </p>
          </div>
        </div>
      </div>

      <AutomationForm settings={settings} />
    </div>
  );
}
