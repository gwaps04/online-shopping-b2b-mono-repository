import { Metadata } from "next";
import { getAIAssistantSettings } from "@/lib/aiAssistantStorage";
import AIAssistantClient from "./AIAssistantClient";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAIAssistantSettings();
  const name = settings.ai_assistant_name || "Business AI Persona";
  return {
    title: `${name} | Interactive AI Concierge`,
    description: `Chat live with our ${name} for product recommendations, instant order updates, and customer support.`,
  };
}

export default async function AIAssistantPage() {
  const settings = await getAIAssistantSettings();

  return <AIAssistantClient initialSettings={settings} />;
}
