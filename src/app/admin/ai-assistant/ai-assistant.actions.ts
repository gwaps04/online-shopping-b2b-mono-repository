// FILE: src/app/admin/ai-assistant/ai-assistant.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { 
  getAIAssistantSettings, 
  saveAIAssistantSettings, 
  testN8nAIPing 
} from "@/lib/aiAssistantStorage";

export async function saveAIAssistantSettingsOnly(prevState: any, formData: FormData) {
  const aiAssistantWebhookUrl = (formData.get("aiAssistantWebhookUrl") as string || "").trim();
  const aiAssistantActive = formData.get("aiAssistantActive") === "on";
  const aiAssistantName = (formData.get("aiAssistantName") as string || "Business AI Persona").trim();
  const aiAssistantWelcome = (formData.get("aiAssistantWelcome") as string || "").trim();
  const aiAssistantButtonText = (formData.get("aiAssistantButtonText") as string || "Talk with our AI Persona").trim();

  try {
    // Strictly saves ONLY the AI assistant columns. Does NOT touch webhook_url or paymongo!
    await saveAIAssistantSettings({
      ai_assistant_webhook_url: aiAssistantWebhookUrl,
      ai_assistant_active: aiAssistantActive,
      ai_assistant_name: aiAssistantName,
      ai_assistant_welcome_message: aiAssistantWelcome,
      ai_assistant_button_text: aiAssistantButtonText,
    });

    revalidatePath("/admin/ai-assistant");
    revalidatePath("/", "layout");
    revalidatePath("/ai-assistant");
    return { success: "Business AI Assistant Webhook & Persona settings saved successfully!", error: "" };
  } catch (error: any) {
    console.error("AI Assistant Save Error:", error);
    return { error: `Failed to save AI configuration: ${error.message}`, success: "" };
  }
}

export async function sendTestAIPingAction(webhookUrl: string, promptMessage: string) {
  return await testN8nAIPing(webhookUrl, promptMessage);
}