"use client";

import React, { useActionState, useState } from "react";
import Link from "next/link";
import { 
  Zap, CheckCircle2, AlertCircle, Send, Key, Globe, Shield, 
  RefreshCw, Terminal, CreditCard, Bot, ArrowRight, ExternalLink 
} from "lucide-react";
import { saveOrderAutomationSettings, sendOrderTestPing } from "./automation.actions";

interface SettingsProps {
  webhook_url: string;
  webhook_secret: string;
  is_active: boolean;
  paymongo_secret_key: string;
  updated_at: string;
}

export default function AutomationForm({ settings }: { settings: SettingsProps }) {
  const [formState, formAction, isPending] = useActionState(saveOrderAutomationSettings, { success: "", error: "" });
  
  const [urlInput, setUrlInput] = useState(settings?.webhook_url || "");
  const [secretInput, setSecretInput] = useState(settings?.webhook_secret || "");
  const [isActive, setIsActive] = useState(settings?.is_active || false);
  const [pmSecretInput, setPmSecretInput] = useState(settings?.paymongo_secret_key || "");

  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<{ success?: boolean; message?: string; body?: string } | null>(null);

  const handleTriggerPing = async () => {
    setIsPinging(true);
    setPingResult(null);
    const result = await sendOrderTestPing(urlInput, secretInput);
    setPingResult(result);
    setIsPinging(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Clarification & Quick-Switch Banner */}
      <div className="bg-linear-to-r from-slate-900 via-slate-900 to-red-950/40 border border-red-500/30 p-4 sm:p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-red-600/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Looking for the Chat AI Assistant Webhook?</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/30">
                Separated
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              To keep your <strong>Order Fulfillment & Verification workflow untouched</strong>, your Chat AI Persona has its own dedicated page.
            </p>
          </div>
        </div>

        <Link
          href="/admin/ai-assistant"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
        >
          <span>Open Business AI Assistant</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Order & Payment Webhook Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Order Webhook & PayMongo Configuration */}
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

            {/* Order Fulfillment & Verification Webhook Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" /> Webhook Destination (Orders & Verification)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Provide your n8n endpoint to receive real-time order payloads upon customer checkout.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target Webhook URL
                  </label>
                  <input 
                    name="webhookUrl" 
                    type="url" 
                    value={urlInput} 
                    onChange={(e) => setUrlInput(e.target.value)} 
                    placeholder="https://n8n.macrotek-edubot.cloud/webhook/onlinestorrepo" 
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none font-mono text-sm text-slate-900 bg-white" 
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-slate-500" /> Webhook Secret Token
                  </label>
                  <input 
                    name="webhookSecret" 
                    type="text" 
                    value={secretInput} 
                    onChange={(e) => setSecretInput(e.target.value)} 
                    placeholder="e.g. admin@macrotek.com" 
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none font-mono text-sm text-slate-900 bg-white" 
                  />
                </div>

                <div>
                  <label className="relative flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="isActive" 
                      checked={isActive} 
                      onChange={(e) => setIsActive(e.target.checked)} 
                      className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500" 
                    />
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">Dispatch Live Orders</span>
                      <span className="text-xs text-slate-500 block">Automatically forward successful checkouts to this webhook.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Payment Gateway (PayMongo) Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-600" /> Payment Gateway (PayMongo)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Securely store your API key. Use <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded">sk_test_...</code> for simulated checkouts and <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded">sk_live_...</code> to accept real money.
                </p>
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-slate-500" /> Secret Key (Live or Test)
                </label>
                <input 
                  name="paymongoSecret" 
                  type="password" 
                  value={pmSecretInput} 
                  onChange={(e) => setPmSecretInput(e.target.value)} 
                  placeholder="sk_test_xxxxxxxxxxxxxxxxxxx" 
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none font-mono text-sm text-slate-900 tracking-widest bg-white" 
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isPending} 
              className="w-full h-12 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Order Webhook & Keys...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Save Settings & Keys</span>
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Live Payload Simulator */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold flex items-center gap-2 text-white">
                <Terminal className="w-5 h-5 text-amber-400" /> Live Payload Simulator
              </h3>
              <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold">
                POST JSON
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Send a simulated order event to your n8n workflow. Use this to verify Telegram bot pings or Google Sheets before running real transactions.
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-400 max-h-56 overflow-y-auto">
              <span className="text-emerald-400">&#123;</span><br />
              &nbsp;&nbsp;&quot;event&quot;: <span className="text-amber-300">&quot;order.test_ping&quot;</span>,<br />
              &nbsp;&nbsp;&quot;data&quot;: &#123;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&quot;order_id&quot;: <span className="text-blue-300">&quot;test-0001-mock&quot;</span>,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&quot;customer_name&quot;: <span className="text-slate-200">&quot;Juan Dela Cruz&quot;</span>,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&quot;total_amount&quot;: <span className="text-emerald-300">31500.00</span>,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&quot;payment_method&quot;: <span className="text-blue-300">&quot;COD&quot;</span><br />
              &nbsp;&nbsp;&#125;<br />
              <span className="text-emerald-400">&#125;</span>
            </div>

            <button 
              type="button" 
              onClick={handleTriggerPing} 
              disabled={isPinging || !urlInput} 
              className="w-full h-11 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-40 shadow-md text-xs cursor-pointer"
            >
              {isPinging ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Dispatching Order Payload...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-3.5 h-3.5 text-slate-950" />
                  <span>Trigger Test Ping</span>
                </span>
              )}
            </button>

            {pingResult && (
              <div className={`p-4 rounded-xl border text-xs font-mono transition-all animate-in fade-in ${
                pingResult.success ? "bg-emerald-950/60 border-emerald-700 text-emerald-300" : "bg-rose-950/60 border-rose-700 text-rose-300"
              }`}>
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  {pingResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />}
                  <span>{pingResult.message}</span>
                </div>
                {pingResult.body && (
                  <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] opacity-80 break-all max-h-24 overflow-y-auto">
                    Response: {pingResult.body}
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
