import { NextRequest, NextResponse } from "next/server";
import { getAIAssistantSettings } from "@/lib/aiAssistantStorage";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, sessionId } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message content cannot be empty." },
        { status: 400 }
      );
    }

    const cleanMessage = message.trim();
    const effectiveSessionId = sessionId || `session_${Date.now()}`;

    // Get current AI assistant configuration
    const settings = await getAIAssistantSettings();
    const webhookUrl = settings.ai_assistant_webhook_url?.trim();
    const personaName = settings.ai_assistant_name || "Business AI Persona";

    // ADMIN PROTECTION: If no webhook URL is configured or it is not active, reject immediately!
    if (!webhookUrl || !webhookUrl.startsWith("http")) {
      return NextResponse.json(
        {
          error: "The Business AI Assistant is currently offline. The administrator has not configured a valid webhook endpoint yet.",
          code: "WEBHOOK_NOT_CONFIGURED",
          isConfigured: false,
        },
        { status: 503 }
      );
    }

    // 1. Dispatch to self-hosted n8n workflow
    try {
      const n8nPayload = {
        message: cleanMessage,
        chatInput: cleanMessage,
        sessionId: effectiveSessionId,
        timestamp: new Date().toISOString(),
        source: "storefront_chat",
        persona: personaName,
      };

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "StoreMono-AIAssistantClient/1.0",
        },
        body: JSON.stringify(n8nPayload),
        signal: AbortSignal.timeout(20000), // 20-second timeout for LLM inference
      });

      if (response.ok) {
        const rawText = await response.text();
        let replyText = rawText;

        try {
          const parsed = JSON.parse(rawText);
          if (typeof parsed === "string") {
            replyText = parsed;
          } else if (parsed && typeof parsed === "object") {
            if (parsed.output) replyText = String(parsed.output);
            else if (parsed.response) replyText = String(parsed.response);
            else if (parsed.text) replyText = String(parsed.text);
            else if (parsed.message) replyText = String(parsed.message);
            else if (Array.isArray(parsed) && parsed[0]?.output) replyText = String(parsed[0].output);
            else if (Array.isArray(parsed) && parsed[0]?.json?.text) replyText = String(parsed[0].json.text);
            else if (Array.isArray(parsed) && parsed[0]?.json?.message) replyText = String(parsed[0].json.message);
            else if (Array.isArray(parsed) && parsed[0]?.json?.output) replyText = String(parsed[0].json.output);
            else replyText = JSON.stringify(parsed, null, 2);
          }
        } catch {
          // Raw text is plain string
        }

        if (replyText && replyText.trim()) {
          return NextResponse.json({
            reply: replyText.trim(),
            source: "n8n",
            persona: personaName,
            timestamp: new Date().toISOString(),
          });
        }
      }

      return NextResponse.json(
        { 
          error: "The AI agent workflow did not return a valid response. Please check your n8n workflow.",
          source: "n8n_error"
        },
        { status: 502 }
      );
    } catch (err: any) {
      console.error("[AIAssistant] Failed to communicate with n8n webhook:", err);
      return NextResponse.json(
        { 
          error: `Failed to reach n8n AI webhook: ${err.message}`, 
          source: "n8n_unreachable" 
        },
        { status: 504 }
      );
    }
  } catch (error: any) {
    console.error("[AIAssistant] Route Error:", error);
    return NextResponse.json(
      { error: "Internal server error while processing AI chat." },
      { status: 500 }
    );
  }
}
