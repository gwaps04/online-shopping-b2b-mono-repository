"use client";

import { useActionState, useState } from "react";
import { Zap, CheckCircle2, AlertCircle, Send, Key, Globe, Shield, RefreshCw, Terminal, CreditCard } from "lucide-react";
import { saveAutomationSettings, sendTestPing } from "./actions";

interface SettingsProps {
  webhook_url: string;
  webhook_secret: string;
  is_active: boolean;
  paymongo_secret_key: string;
  updated_at: string;
}

export default function AutomationForm({ settings }: { settings: SettingsProps }) {
  const [formState, formAction, isPending] = useActionState(saveAutomationSettings, { success: "", error: "" });
  
  const [urlInput, setUrlInput] = useState(settings?.webhook_url || "");
  const [secretInput, setSecretInput] = useState(settings?.webhook_secret || "");
  const [isActive, setIsActive] = useState(settings?.is_active || false);
  const [pmSecretInput, setPmSecretInput] = useState(settings?.paymongo_secret_key || "");

  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<{ success?: boolean; message?: string; body?: string } | null>(null);

  const handleTriggerPing = async () => {
    setIsPinging(true);
    setPingResult(null);
    const result = await sendTestPing(urlInput, secretInput);
    setPingResult(result);
    setIsPinging(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Form Settings */}
      <div className="lg:col-span-7">
        <form action={formAction} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          
          {/* Section 1: n8n Webhook */}
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" /> Webhook Destination
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Provide your n8n endpoint to receive real-time order payloads.
            </p>
          </div>

          {formState?.success && (
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200 flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              {formState.success}
            </div>
          )}

          {formState?.error && (
            <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-200 flex items-center gap-2 text-sm font-medium">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              {formState.error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Target Webhook URL</label>
              <input name="webhookUrl" type="url" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="https://n8n.yourdomain.com/webhook/order-placed" className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none font-mono text-sm text-slate-900" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><Key className="w-3.5 h-3.5 text-slate-500" /> Webhook Secret Token</label>
              <input name="webhookSecret" type="text" value={secretInput} onChange={(e) => setSecretInput(e.target.value)} placeholder="e.g. sk_live_secure_n8n_token" className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none font-mono text-sm text-slate-900" />
            </div>

            <div className="pt-2 pb-6 border-b border-slate-100">
              <label className="relative flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                <input type="checkbox" name="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                <div>
                  <span className="text-sm font-bold text-slate-900 block">Dispatch Live Orders</span>
                  <span className="text-xs text-slate-500 block">Automatically forward successful checkouts to this webhook.</span>
                </div>
              </label>
            </div>
          </div>

          {/* Section 2: PayMongo Gateway */}
          <div className="pt-2">
            <div className="pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" /> Payment Gateway (PayMongo)
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Securely store your API key. Use <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded">sk_test_...</code> for simulated checkouts and <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded">sk_live_...</code> to accept real money.
              </p>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><Key className="w-3.5 h-3.5 text-slate-500" /> Secret Key (Live or Test)</label>
              <input 
                name="paymongoSecret" 
                type="password" 
                value={pmSecretInput} 
                onChange={(e) => setPmSecretInput(e.target.value)} 
                placeholder="sk_test_xxxxxxxxxxxxxxxxxxx" 
                className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none font-mono text-sm text-slate-900 tracking-widest" 
              />
            </div>
          </div>

          <button type="submit" disabled={isPending} className="w-full h-12 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 mt-4">
            {isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            Save Settings & Keys
          </button>
        </form>
      </div>

      {/* Right Column: Interactive Test Console */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold flex items-center gap-2 text-white">
                <Terminal className="w-5 h-5 text-amber-400" />
                Live Payload Simulator
              </h3>
              <span className="text-[10px] font-mono uppercase bg-slate-800 text-amber-400 px-2 py-0.5 rounded border border-slate-700">POST JSON</span>
            </div>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              Send a simulated order event to your n8n workflow. Use this to verify Telegram bot pings before running real transactions.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-400 max-h-48 overflow-y-auto">
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

          <div>
            <button type="button" onClick={handleTriggerPing} disabled={isPinging || !urlInput} className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-40 shadow-md">
              {isPinging ? <><RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> Dispatching...</> : <><Send className="w-4 h-4 text-slate-950" /> Trigger Test Ping</>}
            </button>
          </div>

          {pingResult && (
            <div className={`p-4 rounded-xl border text-xs font-mono transition-all animate-in fade-in ${pingResult.success ? "bg-emerald-950/60 border-emerald-700 text-emerald-300" : "bg-rose-950/60 border-rose-700 text-rose-300"}`}>
              <div className="font-bold flex items-center gap-1.5 mb-1">
                {pingResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />}
                {pingResult.message}
              </div>
              {pingResult.body && <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] opacity-80 break-all max-h-24 overflow-y-auto">Response: {pingResult.body}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}