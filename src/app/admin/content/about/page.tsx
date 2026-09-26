"use client";

import React, { useActionState, useState, useEffect } from "react";
import { 
  CheckCircle2, AlertCircle, Sparkles, Eye, 
  Target, Compass, Palette, Type, Layers 
} from "lucide-react";
import { updateAboutSettings, getAboutSettingsAction } from "../actions";

const initialState = { success: "", error: "" };

const FONT_OPTIONS = [
  { key: "sans", name: "Modern Sans (Inter / Clean)", className: "font-sans" },
  { key: "display", name: "Bold Display (Impactful)", className: "font-display font-black tracking-tight" },
  { key: "serif", name: "Editorial Serif (Classic & Luxurious)", className: "font-serif italic" },
  { key: "mono", name: "Technical Mono (Modern Minimal)", className: "font-mono uppercase tracking-tight" },
];

const COLOR_PRESETS = [
  { label: "Silver White (Default)", value: "#f1f5f9" },
  { label: "Pure White", value: "#ffffff" },
  { label: "Light Slate", value: "#f8fafc" },
  { label: "Soft Cream", value: "#fefce8" },
  { label: "Ice Blue", value: "#f0f9ff" },
  { label: "Charcoal Dark", value: "#0f172a" },
  { label: "Midnight Blue", value: "#1e1b4b" },
];

const GRADIENT_PRESETS = [
  { label: "Silver to Slate (Default)", start: "#f1f5f9", end: "#e2e8f0" },
  { label: "Silver White to Pure White", start: "#f1f5f9", end: "#ffffff" },
  { label: "Ice to Sky", start: "#f0f9ff", end: "#e0f2fe" },
  { label: "Pearl to Rose", start: "#f8fafc", end: "#ffe4e6" },
  { label: "Obsidian to Slate", start: "#020617", end: "#1e293b" },
  { label: "Indigo to Midnight", start: "#1e1b4b", end: "#0f172a" },
];

export default function AboutCMSPage({ initialData }: { initialData?: any }) {
  const [state, formAction, isPending] = useActionState(updateAboutSettings, initialState);

  // Real-time preview states
  const [title, setTitle] = useState(initialData?.title || "About Our Store");
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || "Crafting exceptional experiences and curated essentials for the modern lifestyle.");
  const [aboutContent, setAboutContent] = useState(initialData?.about_content || "Founded with a dedication to simplicity, reliability, and modern aesthetics, our store curates high-performing products designed to elevate everyday life. Every piece in our collection is carefully evaluated for durability, utility, and refined craftsmanship.");
  
  const [visionTitle, setVisionTitle] = useState(initialData?.vision_title || "Our Vision");
  const [visionStatement, setVisionStatement] = useState(initialData?.vision_statement || "To be the trusted destination for individuals who value quality craftsmanship, minimalist aesthetics, and timeless design in everyday products.");
  
  const [missionTitle, setMissionTitle] = useState(initialData?.mission_title || "Our Mission");
  const [missionStatement, setMissionStatement] = useState(initialData?.mission_statement || "Empowering our customers through meticulously designed, sustainably sourced, and enduring goods while delivering transparent, first-class service.");
  
  const [bgType, setBgType] = useState<"solid" | "gradient">(initialData?.bg_type || "solid");
  const [bgColor, setBgColor] = useState(initialData?.bg_color || "#f1f5f9"); // Silver White default
  const [bgGradientEnd, setBgGradientEnd] = useState(initialData?.bg_gradient_end || "#e2e8f0");
  const [bgGradientDirection, setBgGradientDirection] = useState(initialData?.bg_gradient_direction || "to-br");
  
  const [textColor, setTextColor] = useState(initialData?.text_color || "#000000"); // Black default
  const [fontKey, setFontKey] = useState(initialData?.font_key || "sans");

  // Load existing persistent settings on mount
  useEffect(() => {
    let isMounted = true;
    getAboutSettingsAction().then((data) => {
      if (!isMounted || !data) return;
      if (data.title) setTitle(data.title);
      if (data.subtitle !== undefined) setSubtitle(data.subtitle);
      if (data.about_content !== undefined) setAboutContent(data.about_content);
      if (data.vision_title) setVisionTitle(data.vision_title);
      if (data.vision_statement !== undefined) setVisionStatement(data.vision_statement);
      if (data.mission_title) setMissionTitle(data.mission_title);
      if (data.mission_statement !== undefined) setMissionStatement(data.mission_statement);
      if (data.bg_type) setBgType(data.bg_type as any);
      if (data.bg_color) setBgColor(data.bg_color);
      if (data.bg_gradient_end) setBgGradientEnd(data.bg_gradient_end);
      if (data.bg_gradient_direction) setBgGradientDirection(data.bg_gradient_direction);
      if (data.text_color) setTextColor(data.text_color);
      if (data.font_key) setFontKey(data.font_key);
    }).catch((err) => console.warn("Failed to load initial about settings:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Dynamic preview style generator
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

  return (
    <div className="max-w-6xl space-y-8 pb-16">
      
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">About Us Content & Styling</h1>
            <p className="text-sm text-slate-500">Manage titles, story, vision, mission, and visual themes for your storefront.</p>
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
          <span className="text-xs text-slate-400">Updates live as you type & adjust colors</span>
        </div>

        <div 
          className={`p-8 sm:p-12 transition-all duration-300 ${getFontClass()}`}
          style={{ ...getPreviewBackgroundStyle(), color: textColor }}
        >
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Header Preview */}
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-current opacity-70">
                Company Profile
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {title || "About Our Store"}
              </h2>
              {subtitle && (
                <p className="text-base sm:text-lg opacity-80 max-w-2xl mx-auto leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>

            {/* About Narrative Preview */}
            {aboutContent && (
              <div className="p-6 sm:p-8 rounded-2xl bg-white/40 backdrop-blur-xs border border-black/5 shadow-xs leading-relaxed text-sm sm:text-base">
                <p className="whitespace-pre-line">{aboutContent}</p>
              </div>
            )}

            {/* Vision & Mission Cards Grid Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Vision Card */}
              <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-xs border border-black/5 shadow-xs flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold">{visionTitle || "Our Vision"}</h3>
                <p className="text-sm opacity-80 leading-relaxed">
                  {visionStatement || "No vision statement defined yet."}
                </p>
              </div>

              {/* Mission Card */}
              <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-xs border border-black/5 shadow-xs flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold">{missionTitle || "Our Mission"}</h3>
                <p className="text-sm opacity-80 leading-relaxed">
                  {missionStatement || "No mission statement defined yet."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main CMS Editor Form */}
      <form action={formAction} className="space-y-8">
        
        {/* Hidden inputs to pass state */}
        <input type="hidden" name="bgType" value={bgType} />
        <input type="hidden" name="bgColor" value={bgColor} />
        <input type="hidden" name="bgGradientEnd" value={bgGradientEnd} />
        <input type="hidden" name="bgGradientDirection" value={bgGradientDirection} />
        <input type="hidden" name="textColor" value={textColor} />
        <input type="hidden" name="fontKey" value={fontKey} />

        {/* Section 1: Section Header & Main About Content */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              1. Title, Subtitle & Main Story
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Define the introductory headline and detailed narrative for the About section.</p>
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
                placeholder="e.g. About Our Store / Who We Are"
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
                placeholder="e.g. Crafting exceptional experiences and curated essentials."
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Main About Us Narrative
              </label>
              <textarea
                name="aboutContent"
                rows={4}
                value={aboutContent}
                onChange={(e) => setAboutContent(e.target.value)}
                placeholder="Share your company origins, principles, craftsmanship standards, and dedication to your customers..."
                className="w-full p-3.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-y"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Vision & Mission Statements */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              2. Vision & Mission Statements
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Articulate where your enterprise is headed and the mission guiding your operations.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vision Form */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Vision Statement</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vision Header
                </label>
                <input
                  type="text"
                  name="visionTitle"
                  value={visionTitle}
                  onChange={(e) => setVisionTitle(e.target.value)}
                  placeholder="e.g. Our Vision"
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-slate-900 text-sm bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vision Statement Content
                </label>
                <textarea
                  name="visionStatement"
                  rows={3}
                  value={visionStatement}
                  onChange={(e) => setVisionStatement(e.target.value)}
                  placeholder="State your long-term aspiration and future impact..."
                  className="w-full p-3 rounded-lg border border-slate-300 text-slate-900 text-sm bg-white focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                />
              </div>
            </div>

            {/* Mission Form */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Target className="w-4 h-4 text-emerald-600" />
                <span>Mission Statement</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mission Header
                </label>
                <input
                  type="text"
                  name="missionTitle"
                  value={missionTitle}
                  onChange={(e) => setMissionTitle(e.target.value)}
                  placeholder="e.g. Our Mission"
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-slate-900 text-sm bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mission Statement Content
                </label>
                <textarea
                  name="missionStatement"
                  rows={3}
                  value={missionStatement}
                  onChange={(e) => setMissionStatement(e.target.value)}
                  placeholder="State your day-to-day commitments, craftsmanship, and customer pledge..."
                  className="w-full p-3 rounded-lg border border-slate-300 text-slate-900 text-sm bg-white focus:ring-2 focus:ring-emerald-600 outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Background Styling & Gradient Effect */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-600" />
              3. Background Styling & Gradient Color
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Default is Silver White (`#f1f5f9`). You can switch to a gradient effect with custom direction and end tones.
            </p>
          </div>

          <div className="space-y-6">
            {/* Style Selector: Solid vs Gradient */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Background Type
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
                  <span>Solid Color</span>
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
                  <span>Gradient Effect</span>
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

            {/* Colors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Primary Background Color */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  {bgType === "gradient" ? "Gradient Start Color" : "Background Color"} (Default: Silver White `#f1f5f9`)
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
                    placeholder="#f1f5f9"
                    className="flex-1 h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 font-mono text-sm focus:ring-2 focus:ring-blue-600 outline-none uppercase"
                  />
                </div>

                {/* Color presets chips */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {COLOR_PRESETS.map((c) => (
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

              {/* Gradient End Color */}
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
                      placeholder="#e2e8f0"
                      className="flex-1 h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 font-mono text-sm focus:ring-2 focus:ring-purple-600 outline-none uppercase"
                    />
                  </div>

                  {/* Gradient Direction */}
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

        {/* Section 4: Typography & Font Styles */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Type className="w-4 h-4 text-emerald-600" />
              4. Typography, Font Style & Font Color
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Default Font Color is Black (`#000000`). Select your brand typeface family and font color.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Font Color Picker */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Font Color (Default: Black `#000000`)
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
                  placeholder="#000000"
                  className="flex-1 h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 font-mono text-sm focus:ring-2 focus:ring-emerald-600 outline-none uppercase"
                />
              </div>

              {/* Font Color presets */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {[
                  { label: "Black (Default)", value: "#000000" },
                  { label: "Slate Dark", value: "#0f172a" },
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
                Font Family Style
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
                Saving Changes...
              </span>
            ) : (
              "Save About Us Settings"
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
