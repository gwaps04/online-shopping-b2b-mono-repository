"use client";

import React, { useActionState, useState, useEffect } from "react";
import { 
  HelpCircle, Eye, Palette, Type, Layers, 
  Plus, Trash2, ArrowUp, ArrowDown, CheckCircle2, 
  AlertCircle, ChevronDown, RotateCcw, LayoutGrid
} from "lucide-react";
import { updateFaqsSettings, getFaqsSettingsAction } from "../actions";
import { FAQItem, DEFAULT_FAQS, DEFAULT_FAQ_SETTINGS } from "@/lib/faqsStorage";

const initialState = { success: "", error: "" };

const FONT_OPTIONS = [
  { key: "sans", name: "Modern Sans (Inter / Clean)", className: "font-sans" },
  { key: "display", name: "Bold Display (Impactful)", className: "font-display font-black tracking-tight" },
  { key: "serif", name: "Editorial Serif (Classic & Luxurious)", className: "font-serif italic" },
  { key: "mono", name: "Technical Mono (Modern Minimal)", className: "font-mono uppercase tracking-tight" },
];

const BG_COLOR_PRESETS = [
  { label: "Pure White", value: "#ffffff" },
  { label: "Light Slate", value: "#f8fafc" },
  { label: "Silver Mist", value: "#f1f5f9" },
  { label: "Soft Cream", value: "#fefce8" },
  { label: "Ice Blue", value: "#f0f9ff" },
  { label: "Dark Charcoal", value: "#0f172a" },
  { label: "Midnight Blue", value: "#090d16" },
];

const GRADIENT_PRESETS = [
  { label: "Pure White to Light Slate", start: "#ffffff", end: "#f8fafc" },
  { label: "Silver to Mist", start: "#f1f5f9", end: "#e2e8f0" },
  { label: "Ice to Sky", start: "#f0f9ff", end: "#e0f2fe" },
  { label: "Pale Lavender to Slate", start: "#f5f3ff", end: "#ede9fe" },
  { label: "Dark Slate to Obsidian", start: "#0f172a", end: "#020617" },
  { label: "Deep Indigo to Midnight", start: "#1e1b4b", end: "#0f172a" },
];

const ACCORDION_THEME_PRESETS = [
  {
    name: "Light Clean (Default)",
    bg: "#f8fafc",
    question: "#0f172a",
    answer: "#475569",
    border: "#e2e8f0",
    accent: "#2563eb",
  },
  {
    name: "Crisp White Elevated",
    bg: "#ffffff",
    question: "#1e293b",
    answer: "#64748b",
    border: "#e2e8f0",
    accent: "#3b82f6",
  },
  {
    name: "Modern Emerald",
    bg: "#f0fdf4",
    question: "#064e3b",
    answer: "#047857",
    border: "#bbf7d0",
    accent: "#059669",
  },
  {
    name: "Warm Sand & Cream",
    bg: "#fffbeb",
    question: "#78350f",
    answer: "#92400e",
    border: "#fde68a",
    accent: "#d97706",
  },
  {
    name: "Royal Violet",
    bg: "#faf5ff",
    question: "#581c87",
    answer: "#6b21a8",
    border: "#e9d5ff",
    accent: "#9333ea",
  },
  {
    name: "Dark Obsidian Card",
    bg: "#1e293b",
    question: "#f8fafc",
    answer: "#94a3b8",
    border: "#334155",
    accent: "#38bdf8",
  },
];

export default function FaqsCMSPage({ initialData }: { initialData?: any }) {
  const [state, formAction, isPending] = useActionState(updateFaqsSettings, initialState);

  // Form & Live Preview States
  const [title, setTitle] = useState(initialData?.title || DEFAULT_FAQ_SETTINGS.title);
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || DEFAULT_FAQ_SETTINGS.subtitle);
  const [faqs, setFaqs] = useState<FAQItem[]>(initialData?.faqs || DEFAULT_FAQS);
  
  // Section Background States
  const [bgType, setBgType] = useState<"solid" | "gradient">(initialData?.bg_type || "solid");
  const [bgColor, setBgColor] = useState(initialData?.bg_color || "#ffffff");
  const [bgGradientEnd, setBgGradientEnd] = useState(initialData?.bg_gradient_end || "#f8fafc");
  const [bgGradientDirection, setBgGradientDirection] = useState(initialData?.bg_gradient_direction || "to-br");
  const [textColor, setTextColor] = useState(initialData?.text_color || "#0f172a");
  const [fontKey, setFontKey] = useState(initialData?.font_key || "sans");

  // Accordion Theme & Styling States
  const [accordionBg, setAccordionBg] = useState(initialData?.accordion_bg || "#f8fafc");
  const [accordionQuestionColor, setAccordionQuestionColor] = useState(initialData?.accordion_question_color || "#0f172a");
  const [accordionAnswerColor, setAccordionAnswerColor] = useState(initialData?.accordion_answer_color || "#475569");
  const [accordionBorderColor, setAccordionBorderColor] = useState(initialData?.accordion_border_color || "#e2e8f0");
  const [accordionAccentColor, setAccordionAccentColor] = useState(initialData?.accordion_accent_color || "#2563eb");
  const [accordionRadius, setAccordionRadius] = useState<"rounded-lg" | "rounded-xl" | "rounded-2xl" | "rounded-3xl" | "rounded-none">(
    initialData?.accordion_radius || "rounded-2xl"
  );
  const [accordionLayout, setAccordionLayout] = useState<"single-column" | "two-column">(
    initialData?.accordion_layout || "single-column"
  );

  // Live Preview interactive preview states
  const [previewOpenIds, setPreviewOpenIds] = useState<Set<string>>(new Set([faqs[0]?.id || "faq-1"]));

  // Load existing persistent settings on mount
  useEffect(() => {
    let isMounted = true;
    getFaqsSettingsAction().then((data) => {
      if (!isMounted || !data) return;
      if (data.title) setTitle(data.title);
      if (data.subtitle !== undefined) setSubtitle(data.subtitle);
      if (data.faqs && Array.isArray(data.faqs)) {
        setFaqs(data.faqs);
        if (data.faqs[0]) setPreviewOpenIds(new Set([data.faqs[0].id]));
      }
      if (data.bg_type) setBgType(data.bg_type as any);
      if (data.bg_color) setBgColor(data.bg_color);
      if (data.bg_gradient_end) setBgGradientEnd(data.bg_gradient_end);
      if (data.bg_gradient_direction) setBgGradientDirection(data.bg_gradient_direction);
      if (data.text_color) setTextColor(data.text_color);
      if (data.font_key) setFontKey(data.font_key);
      if (data.accordion_bg) setAccordionBg(data.accordion_bg);
      if (data.accordion_question_color) setAccordionQuestionColor(data.accordion_question_color);
      if (data.accordion_answer_color) setAccordionAnswerColor(data.accordion_answer_color);
      if (data.accordion_border_color) setAccordionBorderColor(data.accordion_border_color);
      if (data.accordion_accent_color) setAccordionAccentColor(data.accordion_accent_color);
      if (data.accordion_radius) setAccordionRadius(data.accordion_radius as any);
      if (data.accordion_layout) setAccordionLayout(data.accordion_layout as any);
    }).catch((err) => console.warn("Failed to load initial faqs settings:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  // FAQs management helpers
  const handleAddFaq = () => {
    const newId = `faq-${Date.now()}`;
    const newItem: FAQItem = {
      id: newId,
      question: `New Question #${faqs.length + 1}`,
      answer: "Provide a clear and concise answer here to help your customers.",
    };
    setFaqs([...faqs, newItem]);
    setPreviewOpenIds(new Set([newId]));
  };

  const handleUpdateFaq = (id: string, field: "question" | "answer", value: string) => {
    setFaqs(faqs.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  };

  const handleDeleteFaq = (id: string) => {
    if (faqs.length <= 1) {
      alert("At least one FAQ item must remain.");
      return;
    }
    setFaqs(faqs.filter((f) => f.id !== id));
  };

  const handleMoveFaq = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= faqs.length) return;
    const updated = [...faqs];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setFaqs(updated);
  };

  const handleResetDefaults = () => {
    if (window.confirm("Reset FAQs to the 10 curated e-commerce defaults? Your custom edits will be replaced.")) {
      setFaqs(DEFAULT_FAQS);
      setPreviewOpenIds(new Set([DEFAULT_FAQS[0].id]));
    }
  };

  const togglePreviewFaq = (id: string) => {
    setPreviewOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getPreviewBackgroundStyle = () => {
    if (bgType === "gradient") {
      let dir = "to bottom right";
      if (bgGradientDirection === "to-r") dir = "to right";
      if (bgGradientDirection === "to-b") dir = "to bottom";
      if (bgGradientDirection === "to-tr") dir = "to top right";
      return { background: `linear-gradient(${dir}, ${bgColor}, ${bgGradientEnd})` };
    }
    return { backgroundColor: bgColor };
  };

  const getFontClass = () => {
    switch (fontKey) {
      case "display": return "font-display";
      case "serif": return "font-serif";
      case "mono": return "font-mono";
      default: return "font-sans";
    }
  };

  const getRadiusClass = () => {
    switch (accordionRadius) {
      case "rounded-none": return "rounded-none";
      case "rounded-lg": return "rounded-lg";
      case "rounded-xl": return "rounded-xl";
      case "rounded-3xl": return "rounded-3xl";
      default: return "rounded-2xl";
    }
  };

  return (
    <div className="max-w-6xl space-y-8 pb-16">
      
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <HelpCircle className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">FAQs Content & Accordion Styling</h1>
            <p className="text-sm text-slate-500">
              Manage frequently asked questions (10+ items), plain vs gradient background, typography, and accordion color schemes.
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {state?.success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3.5 rounded-xl flex items-center gap-3 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span className="text-sm font-semibold">{state.success}</span>
        </div>
      )}

      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3.5 rounded-xl flex items-center gap-3 shadow-xs animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <span className="text-sm font-semibold">{state.error}</span>
        </div>
      )}

      {/* WYSIWYG Real-Time Storefront Live Preview */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Live Storefront Preview</span>
          </div>
          <span className="text-xs text-slate-400">Click accordions below to preview expand/collapse behavior</span>
        </div>

        <div 
          className={`p-8 sm:p-12 transition-all duration-300 ${getFontClass()}`}
          style={{ ...getPreviewBackgroundStyle(), color: textColor }}
        >
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Header Preview */}
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-current opacity-70">
                Help & Answers
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {title || "Frequently Asked Questions"}
              </h2>
              {subtitle && (
                <p className="text-base sm:text-lg opacity-80 max-w-2xl mx-auto leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Accordion Preview Container */}
            <div
              className={
                accordionLayout === "two-column"
                  ? "grid grid-cols-1 md:grid-cols-2 gap-4 items-start"
                  : "max-w-2xl mx-auto space-y-3.5"
              }
            >
              {faqs.map((faq, index) => {
                const isOpen = previewOpenIds.has(faq.id);

                return (
                  <div
                    key={faq.id}
                    className={`overflow-hidden border transition-all duration-200 shadow-2xs ${getRadiusClass()}`}
                    style={{
                      backgroundColor: accordionBg,
                      borderColor: isOpen ? accordionAccentColor : accordionBorderColor,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => togglePreviewFaq(faq.id)}
                      className="w-full py-4 px-5 text-left flex items-center justify-between gap-3 min-h-11"
                    >
                      <span
                        className="font-bold text-sm sm:text-base leading-snug"
                        style={{ color: accordionQuestionColor }}
                      >
                        {faq.question || "Untitled Question"}
                      </span>
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        style={{
                          backgroundColor: isOpen ? `${accordionAccentColor}20` : "rgba(0,0,0,0.04)",
                          color: isOpen ? accordionAccentColor : accordionQuestionColor,
                        }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </span>
                    </button>

                    {isOpen && (
                      <div
                        className="px-5 pb-5 pt-1 text-xs sm:text-sm leading-relaxed border-t border-black/5"
                        style={{ color: accordionAnswerColor }}
                      >
                        <p className="whitespace-pre-line">{faq.answer || "No answer provided yet."}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main CMS Editor Form */}
      <form action={formAction} className="space-y-8">
        
        {/* Hidden inputs to pass complex states into server action */}
        <input type="hidden" name="faqsJson" value={JSON.stringify(faqs)} />
        <input type="hidden" name="bgType" value={bgType} />
        <input type="hidden" name="bgColor" value={bgColor} />
        <input type="hidden" name="bgGradientEnd" value={bgGradientEnd} />
        <input type="hidden" name="bgGradientDirection" value={bgGradientDirection} />
        <input type="hidden" name="textColor" value={textColor} />
        <input type="hidden" name="fontKey" value={fontKey} />
        <input type="hidden" name="accordionBg" value={accordionBg} />
        <input type="hidden" name="accordionQuestionColor" value={accordionQuestionColor} />
        <input type="hidden" name="accordionAnswerColor" value={accordionAnswerColor} />
        <input type="hidden" name="accordionBorderColor" value={accordionBorderColor} />
        <input type="hidden" name="accordionAccentColor" value={accordionAccentColor} />
        <input type="hidden" name="accordionRadius" value={accordionRadius} />
        <input type="hidden" name="accordionLayout" value={accordionLayout} />

        {/* Section 1: Section Header (Title & Subtitle) */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              1. Title & Subtitle for FAQs Section
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Customize the introductory heading and subtitle text for your storefront FAQs.</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Section Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Frequently Asked Questions"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Section Subtitle
              </label>
              <input
                type="text"
                name="subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Everything you need to know about our products, delivery, warranty, and customer care."
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Manage FAQs (10+ Items with add/remove/reorder) */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">
                  2. FAQ Items Management ({faqs.length} Active)
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {faqs.length >= 10 ? `${faqs.length} FAQs (10+ Target Met)` : `${faqs.length}/10 FAQs`}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Add, edit, reorder, or remove question and answer pairs.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="h-10 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Restore 10 curated store FAQs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset 10 Defaults</span>
              </button>

              <button
                type="button"
                onClick={handleAddFaq}
                className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </button>
            </div>
          </div>

          {/* FAQs List */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Question #{index + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveFaq(index, "up")}
                      className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 disabled:opacity-30 transition-all"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      disabled={index === faqs.length - 1}
                      onClick={() => handleMoveFaq(index, "down")}
                      className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 disabled:opacity-30 transition-all"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="w-8 h-8 rounded-lg border border-red-200 bg-white hover:bg-red-50 flex items-center justify-center text-red-600 transition-all ml-1"
                      title="Delete question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => handleUpdateFaq(faq.id, "question", e.target.value)}
                    placeholder="Enter question text..."
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-semibold bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div>
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => handleUpdateFaq(faq.id, "answer", e.target.value)}
                    placeholder="Enter detailed answer..."
                    className="w-full p-3 rounded-xl border border-slate-300 text-slate-900 text-sm bg-white focus:ring-2 focus:ring-blue-600 outline-none resize-y"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleAddFaq}
              className="w-full h-12 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 text-slate-600 hover:text-blue-600 font-bold text-sm flex items-center justify-center gap-2 transition-all min-h-11"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another FAQ Question (Currently {faqs.length})</span>
            </button>
          </div>
        </div>

        {/* Section 3: Background Styling (Plain Solid vs Gradient) */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-600" />
              3. Section Background Styling (Plain to Gradient)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Switch between a plain solid background color or a rich flowing gradient with customizable angles and tones.
            </p>
          </div>

          <div className="space-y-6">
            {/* Style Selector: Solid vs Gradient */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Background Mode
              </label>
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <button
                  type="button"
                  onClick={() => setBgType("solid")}
                  className={`h-12 px-4 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-all min-h-11 ${
                    bgType === "solid"
                      ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-slate-300 border border-slate-400" />
                  <span>Plain Solid Color</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBgType("gradient")}
                  className={`h-12 px-4 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-all min-h-11 ${
                    bgType === "gradient"
                      ? "border-purple-600 bg-purple-600 text-white shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-linear-to-r from-purple-400 to-pink-400" />
                  <span>Gradient Color Effect</span>
                </button>
              </div>
            </div>

            {/* Quick Gradient Presets */}
            {bgType === "gradient" && (
              <div className="p-4 rounded-xl border border-purple-100 bg-purple-50/50 space-y-3">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                  Recommended Gradient Presets
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {GRADIENT_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setBgColor(p.start);
                        setBgGradientEnd(p.end);
                      }}
                      className="p-2.5 rounded-lg border border-slate-200 bg-white text-left hover:border-purple-400 transition-all flex items-center gap-2 text-xs"
                    >
                      <span 
                        className="w-5 h-5 rounded-md shrink-0 border border-black/10" 
                        style={{ background: `linear-gradient(to bottom right, ${p.start}, ${p.end})` }} 
                      />
                      <span className="truncate font-medium text-slate-700">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Background Colors Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Primary Background Color */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  {bgType === "gradient" ? "Gradient Start Color" : "Background Color"}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-12 h-12 rounded-xl cursor-pointer border border-slate-300 p-1 bg-white shrink-0"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1 h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 font-mono text-sm focus:ring-2 focus:ring-blue-600 outline-none uppercase"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {BG_COLOR_PRESETS.map((c) => (
                    <button
                      key={c.label}
                      type="button"
                      onClick={() => setBgColor(c.value)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                        bgColor.toLowerCase() === c.value.toLowerCase()
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gradient End Color & Direction */}
              {bgType === "gradient" && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Gradient End Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={bgGradientEnd}
                      onChange={(e) => setBgGradientEnd(e.target.value)}
                      className="w-12 h-12 rounded-xl cursor-pointer border border-slate-300 p-1 bg-white shrink-0"
                    />
                    <input
                      type="text"
                      value={bgGradientEnd}
                      onChange={(e) => setBgGradientEnd(e.target.value)}
                      placeholder="#f8fafc"
                      className="flex-1 h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 font-mono text-sm focus:ring-2 focus:ring-purple-600 outline-none uppercase"
                    />
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Gradient Flow Direction
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { key: "to-r", label: "Left → Right" },
                        { key: "to-br", label: "Diagonal ↘" },
                        { key: "to-b", label: "Top ↓ Down" },
                        { key: "to-tr", label: "Diagonal ↗" },
                      ].map((dir) => (
                        <button
                          key={dir.key}
                          type="button"
                          onClick={() => setBgGradientDirection(dir.key)}
                          className={`py-1.5 text-xs font-semibold rounded-lg border text-center transition-all ${
                            bgGradientDirection === dir.key
                              ? "border-purple-600 bg-purple-50 text-purple-700"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {dir.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Typography & Font Family */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Type className="w-4 h-4 text-emerald-600" />
              4. Typography & Font Style
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose the brand typography style and overall text color for headlines and subtitles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Header Text Color */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Section Text Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer border border-slate-300 p-1 bg-white shrink-0"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  placeholder="#0f172a"
                  className="flex-1 h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 font-mono text-sm focus:ring-2 focus:ring-emerald-600 outline-none uppercase"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {[
                  { label: "Dark Slate", value: "#0f172a" },
                  { label: "Pure Black", value: "#000000" },
                  { label: "Charcoal", value: "#334155" },
                  { label: "Pure White", value: "#ffffff" },
                  { label: "Royal Blue", value: "#1d4ed8" },
                ].map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => setTextColor(c.value)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                      textColor.toLowerCase() === c.value.toLowerCase()
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Family Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Brand Font Family
              </label>
              <div className="space-y-2">
                {FONT_OPTIONS.map((f) => (
                  <label
                    key={f.key}
                    onClick={() => setFontKey(f.key)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      fontKey === f.key
                        ? "border-emerald-600 bg-emerald-50/50 shadow-2xs"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="fontKeySelect"
                        checked={fontKey === f.key}
                        onChange={() => setFontKey(f.key)}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className={`text-sm ${f.className} text-slate-900`}>
                        {f.name}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">Aa Bb Gg</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Accordion Color Schemes & Styles */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-600" />
              5. Accordion Styles & Color Schemes
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize card background colors, question/answer typography colors, borders, active highlight accents, and border curves.
            </p>
          </div>

          <div className="space-y-6">
            {/* Quick Accordion Theme Presets */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Curated Color Scheme Presets
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ACCORDION_THEME_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setAccordionBg(preset.bg);
                      setAccordionQuestionColor(preset.question);
                      setAccordionAnswerColor(preset.answer);
                      setAccordionBorderColor(preset.border);
                      setAccordionAccentColor(preset.accent);
                    }}
                    className="p-3 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white text-left transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 truncate">{preset.name}</span>
                      <span 
                        className="w-3 h-3 rounded-full border border-black/10" 
                        style={{ backgroundColor: preset.accent }} 
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md border border-slate-200" style={{ backgroundColor: preset.bg }} />
                      <span className="w-5 h-5 rounded-md border border-slate-200" style={{ backgroundColor: preset.question }} />
                      <span className="w-5 h-5 rounded-md border border-slate-200" style={{ backgroundColor: preset.answer }} />
                      <span className="w-5 h-5 rounded-md border border-slate-200" style={{ backgroundColor: preset.border }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Individual Custom Accordion Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
              {/* Accordion Background */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Card Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accordionBg}
                    onChange={(e) => setAccordionBg(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-1 bg-white shrink-0"
                  />
                  <input
                    type="text"
                    value={accordionBg}
                    onChange={(e) => setAccordionBg(e.target.value)}
                    className="flex-1 h-10 px-3 rounded-lg border border-slate-300 text-slate-900 font-mono text-xs uppercase"
                  />
                </div>
              </div>

              {/* Question Text Color */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Question Text Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accordionQuestionColor}
                    onChange={(e) => setAccordionQuestionColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-1 bg-white shrink-0"
                  />
                  <input
                    type="text"
                    value={accordionQuestionColor}
                    onChange={(e) => setAccordionQuestionColor(e.target.value)}
                    className="flex-1 h-10 px-3 rounded-lg border border-slate-300 text-slate-900 font-mono text-xs uppercase"
                  />
                </div>
              </div>

              {/* Answer Text Color */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Answer Text Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accordionAnswerColor}
                    onChange={(e) => setAccordionAnswerColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-1 bg-white shrink-0"
                  />
                  <input
                    type="text"
                    value={accordionAnswerColor}
                    onChange={(e) => setAccordionAnswerColor(e.target.value)}
                    className="flex-1 h-10 px-3 rounded-lg border border-slate-300 text-slate-900 font-mono text-xs uppercase"
                  />
                </div>
              </div>

              {/* Border Color */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Border Line Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accordionBorderColor}
                    onChange={(e) => setAccordionBorderColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-1 bg-white shrink-0"
                  />
                  <input
                    type="text"
                    value={accordionBorderColor}
                    onChange={(e) => setAccordionBorderColor(e.target.value)}
                    className="flex-1 h-10 px-3 rounded-lg border border-slate-300 text-slate-900 font-mono text-xs uppercase"
                  />
                </div>
              </div>

              {/* Accent / Active Icon Color */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Active Accent & Icon Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accordionAccentColor}
                    onChange={(e) => setAccordionAccentColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-1 bg-white shrink-0"
                  />
                  <input
                    type="text"
                    value={accordionAccentColor}
                    onChange={(e) => setAccordionAccentColor(e.target.value)}
                    className="flex-1 h-10 px-3 rounded-lg border border-slate-300 text-slate-900 font-mono text-xs uppercase"
                  />
                </div>
              </div>

              {/* Corner Curvature Radius */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Card Border Curvature
                </label>
                <select
                  value={accordionRadius}
                  onChange={(e) => setAccordionRadius(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-slate-900 text-xs bg-white font-medium outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="rounded-2xl">Modern Soft (rounded-2xl - Default)</option>
                  <option value="rounded-3xl">Pill Smooth (rounded-3xl)</option>
                  <option value="rounded-xl">Subtle Medium (rounded-xl)</option>
                  <option value="rounded-lg">Compact (rounded-lg)</option>
                  <option value="rounded-none">Sharp Geometric (rounded-none)</option>
                </select>
              </div>
            </div>

            {/* Layout Mode (Single-column vs Two-column) */}
            <div className="pt-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Accordion Grid Layout
              </label>
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <button
                  type="button"
                  onClick={() => setAccordionLayout("single-column")}
                  className={`h-11 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    accordionLayout === "single-column"
                      ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Single Column Stack</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAccordionLayout("two-column")}
                  className={`h-11 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    accordionLayout === "two-column"
                      ? "border-indigo-600 bg-indigo-600 text-white shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Two-Column Grid</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button Bar */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
          <button
            type="submit"
            disabled={isPending}
            className="h-12 px-8 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 min-h-11"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Saving FAQs Settings...
              </span>
            ) : (
              "Save FAQs Section Settings"
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
