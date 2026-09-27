"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Bot, Send, Sparkles, RefreshCw, Copy, Check, 
  ArrowLeft, Shield, HelpCircle, ShoppingBag, 
  Truck, CreditCard, RotateCcw, ExternalLink,
  Lock
} from "lucide-react";
import { AIAssistantSettings, DEFAULT_AI_ASSISTANT_SETTINGS } from "@/lib/aiAssistantTypes";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  source?: string;
}

const STARTER_PROMPTS = [
  { icon: ShoppingBag, label: "Top Products", prompt: "What are your most popular products and best-sellers right now?" },
  { icon: Truck, label: "Shipping Policy", prompt: "How long does shipping take and do you provide order tracking?" },
  { icon: CreditCard, label: "Payment Options", prompt: "What payment methods and currencies do you support?" },
  { icon: HelpCircle, label: "Returns & Support", prompt: "What is your return policy and how do I contact customer support?" },
];

export default function AIAssistantClient({ initialSettings }: { initialSettings?: AIAssistantSettings }) {
  const settings = initialSettings || DEFAULT_AI_ASSISTANT_SETTINGS;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize Session ID & Initial Greeting
  useEffect(() => {
    let currentSession = "";
    try {
      currentSession = localStorage.getItem("ai_persona_session_id") || "";
      if (!currentSession) {
        currentSession = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        localStorage.setItem("ai_persona_session_id", currentSession);
      }
    } catch {
      currentSession = `session_${Date.now()}`;
    }
    setSessionId(currentSession);

    // Initial welcome message from persona
    setMessages([
      {
        id: "welcome_msg",
        sender: "assistant",
        text: settings.ai_assistant_welcome_message || DEFAULT_AI_ASSISTANT_SETTINGS.ai_assistant_welcome_message,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, [settings]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const personaName = settings.ai_assistant_name || "Business AI Persona";
  const isConfigured = Boolean(settings.ai_assistant_webhook_url?.trim()?.startsWith("http"));

  const handleSendMessage = async (textToSend?: string) => {
    if (!isConfigured) return;
    const messageContent = (textToSend || inputMessage).trim();
    if (!messageContent || isLoading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      sender: "user",
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai-assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageContent,
          sessionId: sessionId || "default_session",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to receive response from AI Assistant");
      }

      const assistantMessage: Message = {
        id: `assistant_${Date.now()}`,
        sender: "assistant",
        text: data.reply || "I received your message and will look into it right away!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        source: data.source,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: `err_${Date.now()}`,
        sender: "assistant",
        text: err.message || "I apologize, but I am momentarily experiencing trouble reaching our n8n automation workflow. Please try sending your message again, or visit our Contact page to reach our team!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    const newSession = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setSessionId(newSession);
    try {
      localStorage.setItem("ai_persona_session_id", newSession);
    } catch {}

    setMessages([
      {
        id: `welcome_${Date.now()}`,
        sender: "assistant",
        text: settings.ai_assistant_welcome_message || DEFAULT_AI_ASSISTANT_SETTINGS.ai_assistant_welcome_message,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const formatText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ") || line.trim().startsWith("• ")) {
        return (
          <li key={idx} className="ml-4 list-disc my-1">
            {line.trim().replace(/^[-*•]\s+/, "")}
          </li>
        );
      }
      if (line.trim() === "") {
        return <div key={idx} className="h-2" />;
      }
      return <p key={idx} className="my-1">{line}</p>;
    });
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans selection:bg-red-500 selection:text-white">
      
      {/* Top Header Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Return to Main Store"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Store</span>
          </Link>

          <div className="h-5 w-px bg-slate-800 mx-1 hidden sm:block" />

          {/* AI Persona Avatar & Badge */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-red-600/30 ring-2 ring-red-500/20">
                <Bot className="w-5 h-5" />
              </div>
              {isConfigured ? (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse" />
              ) : (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-amber-500 border-2 border-slate-900 rounded-full" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white tracking-tight">
                  {personaName}
                </h1>
                {isConfigured ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Online Concierge
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    Offline • Setup Required
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                {isConfigured ? (
                  <React.Fragment>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Online • n8n Workflow Connected</span>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="text-amber-400/90">Chat Locked • Webhook Endpoint Pending</span>
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          {isConfigured && (
            <button
              onClick={handleResetChat}
              className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Clear current messages and start a new conversation session"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Session</span>
            </button>
          )}

          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span>Visit Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Conversation Scrollable View */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto w-full">
        
        {/* Offline Setup Protection Card (Visible when webhook is NOT configured) */}
        {!isConfigured && (
          <div className="p-5 sm:p-6 rounded-2xl bg-amber-950/30 border-2 border-amber-500/40 text-amber-200 shadow-xl space-y-4 animate-in fade-in">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-white">
                    AI Assistant Inactive — Webhook Setup Required
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Admin Protected
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Interactive chat is locked because the store administrator has not yet configured a valid self-hosted n8n AI webhook URL. Shoppers cannot send messages until the webhook connection is established.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-amber-300/80 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                Chat inputs and action prompts are disabled to prevent errors.
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href="/"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                >
                  Return to Store
                </Link>
                <Link
                  href="/admin/ai-assistant"
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors shadow-md flex items-center gap-1"
                >
                  <span>Configure Webhook in Admin</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Ambient Top Welcome Card (Only shown if configured) */}
        {isConfigured && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-red-950/20 border border-slate-800 shadow-sm flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-1 text-xs">
              <h2 className="font-bold text-slate-200">
                Welcome to the {personaName} Chat Experience
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Ask questions about our product specifications, active discounts, stock availability, order tracking, and store policies.
              </p>
            </div>
          </div>
        )}

        {/* Message Thread */}
        <div className="space-y-5">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";

            return (
              <div
                key={msg.id}
                className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-700 to-rose-500 text-white flex items-center justify-center shrink-0 mt-1 shadow-md shadow-red-700/20">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`relative group max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                    isUser
                      ? "bg-red-600 text-white rounded-br-xs shadow-md shadow-red-900/20"
                      : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-xs shadow-sm"
                  }`}
                >
                  {/* Sender & Timestamp Header */}
                  <div className="flex items-center justify-between gap-4 mb-1 text-[11px] opacity-75">
                    <span className="font-semibold">
                      {isUser ? "You" : personaName}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Message Content */}
                  <div className="break-words">
                    {formatText(msg.text)}
                  </div>

                  {/* Copy Button for Assistant Replies */}
                  {!isUser && (
                    <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{msg.source === "n8n" ? "⚡ Powered by n8n Workflow" : "Verified Persona Response"}</span>
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        className="hover:text-slate-300 transition-colors p-1 flex items-center gap-1 cursor-pointer"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <React.Fragment>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </React.Fragment>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-1 text-xs font-bold">
                    You
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-3 items-start animate-in fade-in">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-700 to-rose-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl rounded-bl-xs bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-xs text-slate-400 ml-2">
                  {personaName} is thinking...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        {messages.length <= 2 && (
          <div className="pt-4 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              {isConfigured ? "Quick Inquiries to Explore:" : "Sample Inquiries (Disabled until Webhook is configured):"}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STARTER_PROMPTS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.prompt)}
                    disabled={!isConfigured}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 text-xs ${
                      isConfigured 
                        ? "bg-slate-900 hover:bg-slate-850 border-slate-800 hover:border-red-500/50 text-slate-300 group cursor-pointer" 
                        : "bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-60 cursor-not-allowed"
                    }`}
                    title={isConfigured ? item.prompt : "Chat is locked until administrator sets up the AI webhook."}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isConfigured 
                        ? "bg-slate-800 group-hover:bg-red-600/20 text-slate-400 group-hover:text-red-400" 
                        : "bg-slate-800/40 text-slate-600"
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className={`flex-1 font-medium ${isConfigured ? "group-hover:text-white transition-colors" : ""}`}>
                      {item.prompt}
                    </span>
                    {!isConfigured && (
                      <Lock className="w-3 h-3 text-slate-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Sticky Input Bar */}
      <footer className="border-t border-slate-800 bg-slate-900/90 backdrop-blur-md p-4 sm:p-5 shrink-0 z-10">
        <div className="max-w-4xl mx-auto space-y-2">
          
          <div className={`relative flex items-center gap-2 border rounded-2xl p-2 transition-all ${
            isConfigured 
              ? "bg-slate-950 border-slate-800 focus-within:ring-2 focus-within:ring-red-600 focus-within:border-transparent" 
              : "bg-slate-950/50 border-slate-800/60 opacity-75"
          }`}>
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isConfigured 
                  ? "Ask anything about our products, orders, shipping, or policies (Press Enter to send)..." 
                  : "🔒 Chat is disabled: Store administrator must configure the n8n AI Webhook URL first."
              }
              disabled={!isConfigured || isLoading}
              className={`flex-1 bg-transparent px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none resize-none max-h-32 min-h-11 ${
                !isConfigured ? "cursor-not-allowed text-slate-500" : ""
              }`}
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!isConfigured || isLoading || !inputMessage.trim()}
              className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all shadow-md shrink-0 ${
                isConfigured 
                  ? "bg-red-600 hover:bg-red-500 text-white disabled:opacity-40 disabled:hover:bg-red-600 cursor-pointer" 
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
              title={isConfigured ? "Send Message" : "Chat locked until webhook is set up"}
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
              ) : !isConfigured ? (
                <Lock className="w-4 h-4 text-slate-500" />
              ) : (
                <Send className="w-4 h-4 text-white" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-slate-400" />
              <span>Session ID: <code className="font-mono text-slate-400">{sessionId ? sessionId.slice(0, 18) : "generating..."}</code></span>
            </span>

            <span>
              {isConfigured ? (
                <React.Fragment>
                  Connected to n8n AI workflow • Press <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">Enter ↵</kbd> to send
                </React.Fragment>
              ) : (
                <span className="text-amber-400/90 font-medium">
                  🔒 Admin Protection Active • Configure Webhook URL in Admin Panel
                </span>
              )}
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}
