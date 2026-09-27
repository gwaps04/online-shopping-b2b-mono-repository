"use client";

import React, { useActionState, useState } from "react";
import Link from "next/link";
import { 
  Bot, CheckCircle2, AlertCircle, Send, Globe, Shield, 
  RefreshCw, Terminal, Sparkles, MessageSquare, ExternalLink, 
  Move, Radio, ArrowLeft, ArrowUpRight, Lock 
} from "lucide-react";
import { saveAIAssistantSettingsOnly, sendTestAIPingAction } from "./ai-assistant.actions";
import { AIAssistantSettings } from "@/lib/aiAssistantTypes";

export default function AIAssistantAdminForm({ initialSettings }: { initialSettings: AIAssistantSettings }) {
  const [formState, formAction, isPending] = useActionState(saveAIAssistantSettingsOnly, { success: "", error: "" });

  const [aiWebhookUrl, setAiWebhookUrl] = useState(initialSettings.ai_assistant_webhook_url || "");
  const [aiActive, setAiActive] = useState(initialSettings.ai_assistant_active ?? true);
  const [aiName, setAiName] = useState(initialSettings.ai_assistant_name || "Business AI Persona");
  const [aiWelcome, setAiWelcome] = useState(initialSettings.ai_assistant_welcome_message || "Hello! 👋 I am your Business AI Assistant. How can I help you today with our products, orders, or store policies?");
  const [aiButtonText, setAiButtonText] = useState(initialSettings.ai_assistant_button_text || "Talk with our AI Persona");

  // AI Ping Test State
  const [aiTestPrompt, setAiTestPrompt] = useState("Hello! Can you recommend your top featured products and shipping policy?");
  const [isAIPinging, setIsAIPinging] = useState(false);
  const [aiPingResult, setAiPingResult] = useState<{ success?: boolean; message?: string; reply?: string; latency?: number } | null>(null);

  const handleTriggerAIPing = async () => {
    setIsAIPinging(true);
    setAiPingResult(null);
    const result = await sendTestAIPingAction(aiWebhookUrl, aiTestPrompt);
    setAiPingResult(result);
    setIsAIPinging(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner guaranteeing isolation from Orders Webhook */}
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-600/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">Dedicated AI Chat Persona Webhook</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% Isolated
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              This webhook is strictly for your frontpage customer AI assistant. Your <strong>Order Fulfillment & Verification Webhook</strong> is untouched and safely managed in Automations.
            </p>
          </div>
        </div>

        <Link
          href="/admin/automation"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>View Order Webhook</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Configuration */}
        <div className="lg:col-span-7">
          <form action={formAction} className="space-y-6">
            
            {/* Status Banners */}
            {formState?.success && (
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200 flex items-center gap-2 text-sm font-medium animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{formState.success}</span>
              </div>
            )}

            {formState?.error && (
              <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-200 flex items-center gap-2 text-sm font-medium animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>{formState.error}</span>
              </div>
            )}

            {/* Business AI Assistant Settings Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-red-200/80 shadow-xs space-y-6 relative overflow-hidden">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xs">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      n8n AI Chat Persona Webhook
                    </h3>
                    <p className="text-xs text-slate-500">
                      Enter the Webhook URL from your self-hosted n8n AI Chat workflow.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                
                {/* Dedicated Webhook URL Field */}
                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-red-600" /> 
                      Chat AI Assistant Webhook URL
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">Self-Hosted n8n Endpoint</span>
                  </label>
                  <input 
                    name="aiAssistantWebhookUrl" 
                    type="url" 
                    value={aiWebhookUrl} 
                    onChange={(e) => setAiWebhookUrl(e.target.value)} 
                    placeholder="https://n8n.macrotek-edubot.cloud/webhook/ai-business-persona" 
                    className="w-full h-12 px-4 rounded-xl border-2 border-red-300 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none font-mono text-sm text-slate-900 bg-white" 
                  />
                  <p className="text-xs text-slate-500 mt-1.5">
                    This endpoint receives the chat prompt from shoppers: <code>{`{ "message": "...", "sessionId": "...", "timestamp": "..." }`}</code>.
                  </p>

                  {/* Protection Status Indicator */}
                  <div className={`mt-3 p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                    aiWebhookUrl?.trim()?.startsWith("http")
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : "bg-amber-50 border-amber-200 text-amber-900"
                  }`}>
                    {aiWebhookUrl?.trim()?.startsWith("http") ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div className="text-xs leading-relaxed">
                      {aiWebhookUrl?.trim()?.startsWith("http") ? (
                        <span>
                          <strong className="font-semibold text-emerald-800">Chat Enabled:</strong> Valid Webhook URL is supplied. Once saved, shoppers can converse with your n8n AI workflow.
                        </span>
                      ) : (
                        <span>
                          <strong className="font-semibold text-amber-800">Admin Protection Active:</strong> Because no Webhook URL is set, the chat interface and storefront floating button are <strong>locked for all users</strong> to prevent unconfigured AI errors.
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      AI Persona Display Name
                    </label>
                    <input 
                      name="aiAssistantName" 
                      type="text" 
                      value={aiName} 
                      onChange={(e) => setAiName(e.target.value)} 
                      placeholder="e.g. Inocent Bull AI Persona" 
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 outline-none text-sm text-slate-900 bg-white" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Floating Button Pill Text
                    </label>
                    <input 
                      name="aiAssistantButtonText" 
                      type="text" 
                      value={aiButtonText} 
                      onChange={(e) => setAiButtonText(e.target.value)} 
                      placeholder="e.g. Talk with our AI Persona" 
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 outline-none text-sm text-slate-900 bg-white" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Welcome Greeting Message
                  </label>
                  <textarea 
                    name="aiAssistantWelcome" 
                    rows={2}
                    value={aiWelcome} 
                    onChange={(e) => setAiWelcome(e.target.value)} 
                    placeholder="Greeting shown to customers when opening the chat screen..." 
                    className="w-full p-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 outline-none text-sm text-slate-900 resize-none bg-white" 
                  />
                </div>

                <div>
                  <label className="relative flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="aiAssistantActive" 
                      checked={aiActive} 
                      onChange={(e) => setAiActive(e.target.checked)} 
                      className="w-5 h-5 text-red-600 rounded border-slate-300 focus:ring-red-500 cursor-pointer" 
                    />
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">
                        Enable Frontpage Floating AI Persona Button
                      </span>
                      <span className="text-xs text-slate-500 block">
                        Displays the movable red floating button on the storefront for visitors to click and chat in a new tab.
                      </span>
                    </div>
                  </label>
                </div>

              </div>
            </div>

            {/* Save AI Webhook Button */}
            <button 
              type="submit" 
              disabled={isPending} 
              className="w-full h-12 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Saving AI Assistant Webhook...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Save AI Assistant Webhook & Settings</span>
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Frontpage Preview & Live n8n AI Chat Tester */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1. Storefront Floating Icon Preview */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl space-y-4 border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-xs text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-red-400" />
                Storefront Floating Button Preview
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <Radio className="w-3 h-3 animate-pulse" />
                Live on Frontpage
              </span>
            </div>

            <div className="p-4 bg-slate-950/70 rounded-xl flex items-center justify-between gap-4 border border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-linear-to-tr from-red-700 via-red-600 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-red-600/40 ring-4 ring-white/10">
                    <Bot className="w-6 h-6" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full animate-pulse" />
                </div>
                <div className="bg-red-600/15 border border-red-500/30 text-red-200 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-red-400" />
                  <span>{aiButtonText || "Talk with our AI Persona"}</span>
                </div>
              </div>

              <Link
                href="/ai-assistant"
                target="_blank"
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors shrink-0 shadow-sm"
              >
                <span>Test Chat</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Move className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>Icon is red, movable across the screen, and opens the chat in a new tab when clicked.</span>
            </p>
          </div>

          {/* 2. Interactive n8n AI Chat Tester */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl space-y-4 border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold flex items-center gap-2 text-white">
                <Terminal className="w-5 h-5 text-red-400" />
                n8n AI Workflow Simulator
              </h3>
              <span className="text-[10px] font-mono uppercase bg-red-950/80 text-red-300 border border-red-700/50 px-2 py-0.5 rounded font-bold">
                POST CHAT
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Dispatch a test prompt to your n8n AI Webhook to confirm your AI Agent node returns text properly.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Sample Shopper Inquiry:
              </label>
              <textarea
                value={aiTestPrompt}
                onChange={(e) => setAiTestPrompt(e.target.value)}
                rows={2}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:ring-1 focus:ring-red-500 outline-none resize-none font-sans"
                placeholder="Ask your AI agent a question..."
              />
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-400">
              <span className="text-slate-500 block mb-1 font-sans text-[10px] uppercase font-bold tracking-wider">Payload Sent to n8n:</span>
              <span className="text-emerald-400">&#123;</span><br />
              &nbsp;&nbsp;&quot;message&quot;: <span className="text-amber-300">&quot;{aiTestPrompt.slice(0, 40)}...&quot;</span>,<br />
              &nbsp;&nbsp;&quot;sessionId&quot;: <span className="text-blue-300">&quot;test-admin-session&quot;</span><br />
              <span className="text-emerald-400">&#125;</span>
            </div>

            <button
              type="button"
              onClick={handleTriggerAIPing}
              disabled={isAIPinging || !aiWebhookUrl}
              className="w-full h-11 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-40 shadow-md text-xs cursor-pointer"
            >
              {isAIPinging ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Executing n8n AI Agent Workflow...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Test Prompt to n8n AI Webhook</span>
                </span>
              )}
            </button>

            {!aiWebhookUrl && (
              <p className="text-[11px] text-amber-400/90 text-center">
                ⚠️ Enter your n8n AI Webhook URL on the left to test.
              </p>
            )}

            {aiPingResult && (
              <div className={`p-4 rounded-xl border text-xs transition-all animate-in fade-in ${
                aiPingResult.success 
                  ? "bg-emerald-950/60 border-emerald-700 text-emerald-200" 
                  : "bg-rose-950/60 border-rose-700 text-rose-200"
              }`}>
                <div className="font-bold flex items-center gap-1.5 mb-1.5">
                  {aiPingResult.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  )}
                  <span>{aiPingResult.message}</span>
                </div>

                {aiPingResult.reply && (
                  <div className="mt-2 pt-2 border-t border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
                      n8n AI Output Response:
                    </span>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 font-sans text-xs leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap">
                      {aiPingResult.reply}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
