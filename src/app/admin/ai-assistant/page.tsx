import { Bot } from "lucide-react";
import AIAssistantAdminForm from "./AIAssistantAdminForm";
import { getAIAssistantSettings } from "@/lib/aiAssistantStorage";

export default async function AdminAIAssistantPage() {
  const settings = await getAIAssistantSettings();

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/30">
            <Bot className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              Business AI Assistant (Chat n8n Webhook)
            </h1>
            <p className="text-sm text-slate-500">
              Configure your dedicated n8n AI Chat Persona Webhook, floating frontpage button, and test live AI conversations.
            </p>
          </div>
        </div>
      </div>

      <AIAssistantAdminForm initialSettings={settings} />
    </div>
  );
}
