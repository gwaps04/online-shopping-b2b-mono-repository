"use client";

import React, { useActionState, useState, useEffect } from "react";
import { 
  PanelBottom, Eye, Palette, Type, Layers, CheckCircle2, 
  AlertCircle, Mail, RotateCcw, Plus, Trash2, 
  Users, Link as LinkIcon 
} from "lucide-react";
import { 
  updateFooterSettings, 
  getFooterSettingsAction, 
  getNewsletterSubscribersAction 
} from "@/app/admin/content/actions";
import { FooterColumn, DEFAULT_FOOTER_SETTINGS } from "@/lib/footerTypes";

const initialState = { success: "", error: "" };

const FONT_OPTIONS = [
  { key: "sans", name: "Modern Sans (Inter / Clean)", className: "font-sans" },
  { key: "display", name: "Bold Display (Impactful)", className: "font-display font-black tracking-tight" },
  { key: "serif", name: "Editorial Serif (Classic & Luxurious)", className: "font-serif italic" },
  { key: "mono", name: "Technical Mono (Modern Minimal)", className: "font-mono uppercase tracking-tight" },
];

const SOLID_BG_PRESETS = [
  { label: "Obsidian Black (Default)", value: "#020617" },
  { label: "Deep Slate", value: "#0f172a" },
  { label: "Charcoal Gray", value: "#1e293b" },
  { label: "Midnight Blue", value: "#0f172a" },
  { label: "Deep Forest", value: "#022c22" },
  { label: "Light Slate", value: "#f8fafc" },
  { label: "Pure White", value: "#ffffff" },
];

const GRADIENT_PRESETS = [
  { label: "Obsidian to Slate", start: "#020617", end: "#0f172a" },
  { label: "Deep Indigo Dusk", start: "#0f172a", end: "#1e1b4b" },
  { label: "Charcoal to Night", start: "#18181b", end: "#09090b" },
  { label: "Emerald Twilight", start: "#022c22", end: "#0f172a" },
  { label: "Minimal Silver to Mist", start: "#f8fafc", end: "#e2e8f0" },
  { label: "Royal Blue to Charcoal", start: "#1e3a8a", end: "#020617" },
];

export default function FooterCMSPage() {
  const [state, formAction, isPending] = useActionState(updateFooterSettings, initialState);

  // Form & Preview State
  const [companyNameOverride, setCompanyNameOverride] = useState("");
  const [tagline, setTagline] = useState(DEFAULT_FOOTER_SETTINGS.tagline);
  const [copyrightText, setCopyrightText] = useState(DEFAULT_FOOTER_SETTINGS.copyright_text);

  // Background Plain vs Gradient
  const [bgType, setBgType] = useState<"solid" | "gradient">("solid");
  const [bgColor, setBgColor] = useState(DEFAULT_FOOTER_SETTINGS.bg_color);
  const [bgGradientEnd, setBgGradientEnd] = useState(DEFAULT_FOOTER_SETTINGS.bg_gradient_end);
  const [bgGradientDirection, setBgGradientDirection] = useState(DEFAULT_FOOTER_SETTINGS.bg_gradient_direction);

  // Typography
  const [fontKey, setFontKey] = useState(DEFAULT_FOOTER_SETTINGS.font_key);
  const [textColor, setTextColor] = useState(DEFAULT_FOOTER_SETTINGS.text_color);
  const [headingColor, setHeadingColor] = useState(DEFAULT_FOOTER_SETTINGS.heading_color);
  const [accentColor, setAccentColor] = useState(DEFAULT_FOOTER_SETTINGS.accent_color);

  // Newsletter Section
  const [newsletterTitle, setNewsletterTitle] = useState(DEFAULT_FOOTER_SETTINGS.newsletter_title);
  const [newsletterDescription, setNewsletterDescription] = useState(DEFAULT_FOOTER_SETTINGS.newsletter_description);
  const [newsletterPlaceholder, setNewsletterPlaceholder] = useState(DEFAULT_FOOTER_SETTINGS.newsletter_placeholder);
  const [newsletterButtonText, setNewsletterButtonText] = useState(DEFAULT_FOOTER_SETTINGS.newsletter_button_text);

  // Sorted Columns & Links
  const [columns, setColumns] = useState<FooterColumn[]>(DEFAULT_FOOTER_SETTINGS.columns);

  // Newsletter Subscribers list for live visibility
  const [subscribers, setSubscribers] = useState<Array<{ id?: any; email: string; created_at: string }>>([]);

  // Load existing persistent settings
  useEffect(() => {
    let isMounted = true;
    getFooterSettingsAction().then((data) => {
      if (!isMounted || !data) return;
      if (data.company_name_override !== undefined) setCompanyNameOverride(data.company_name_override);
      if (data.tagline) setTagline(data.tagline);
      if (data.copyright_text) setCopyrightText(data.copyright_text);
      if (data.bg_type) setBgType(data.bg_type as any);
      if (data.bg_color) setBgColor(data.bg_color);
      if (data.bg_gradient_end) setBgGradientEnd(data.bg_gradient_end);
      if (data.bg_gradient_direction) setBgGradientDirection(data.bg_gradient_direction);
      if (data.font_key) setFontKey(data.font_key);
      if (data.text_color) setTextColor(data.text_color);
      if (data.heading_color) setHeadingColor(data.heading_color);
      if (data.accent_color) setAccentColor(data.accent_color);
      if (data.newsletter_title) setNewsletterTitle(data.newsletter_title);
      if (data.newsletter_description !== undefined) setNewsletterDescription(data.newsletter_description);
      if (data.newsletter_placeholder) setNewsletterPlaceholder(data.newsletter_placeholder);
      if (data.newsletter_button_text) setNewsletterButtonText(data.newsletter_button_text);
      if (data.columns && data.columns.length > 0) setColumns(data.columns);
    }).catch((err) => console.warn("Failed to load footer settings:", err));

    getNewsletterSubscribersAction().then((subs) => {
      if (isMounted && subs) setSubscribers(subs);
    }).catch((err) => console.warn("Failed to load subscribers:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  const handleResetDefaults = () => {
    if (window.confirm("Reset Footer section to default settings?")) {
      setCompanyNameOverride("");
      setTagline(DEFAULT_FOOTER_SETTINGS.tagline);
      setCopyrightText(DEFAULT_FOOTER_SETTINGS.copyright_text);
      setBgType("solid");
      setBgColor(DEFAULT_FOOTER_SETTINGS.bg_color);
      setBgGradientEnd(DEFAULT_FOOTER_SETTINGS.bg_gradient_end);
      setBgGradientDirection("to-b");
      setFontKey("sans");
      setTextColor(DEFAULT_FOOTER_SETTINGS.text_color);
      setHeadingColor(DEFAULT_FOOTER_SETTINGS.heading_color);
      setAccentColor(DEFAULT_FOOTER_SETTINGS.accent_color);
      setNewsletterTitle(DEFAULT_FOOTER_SETTINGS.newsletter_title);
      setNewsletterDescription(DEFAULT_FOOTER_SETTINGS.newsletter_description);
      setNewsletterPlaceholder(DEFAULT_FOOTER_SETTINGS.newsletter_placeholder);
      setNewsletterButtonText(DEFAULT_FOOTER_SETTINGS.newsletter_button_text);
      setColumns(DEFAULT_FOOTER_SETTINGS.columns);
    }
  };

  const getPreviewBackgroundStyle = () => {
    if (bgType === "gradient") {
      let dir = "to bottom";
      if (bgGradientDirection === "to-r") dir = "to right";
      if (bgGradientDirection === "to-br") dir = "to bottom right";
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

  // Helper to add a link to a column
  const handleAddLink = (colIndex: number) => {
    const updated = [...columns];
    const newId = `link_${Date.now()}`;
    const nextOrder = updated[colIndex].links.length + 1;
    updated[colIndex].links.push({
      id: newId,
      name: "New Quick Link",
      href: "#",
      order: nextOrder,
    });
    setColumns(updated);
  };

  // Helper to remove a link from a column
  const handleRemoveLink = (colIndex: number, linkIndex: number) => {
    const updated = [...columns];
    updated[colIndex].links.splice(linkIndex, 1);
    // Re-index orders
    updated[colIndex].links = updated[colIndex].links.map((l, idx) => ({ ...l, order: idx + 1 }));
    setColumns(updated);
  };

  // Helper to update link properties
  const handleUpdateLink = (colIndex: number, linkIndex: number, field: string, val: any) => {
    const updated = [...columns];
    updated[colIndex].links[linkIndex] = {
      ...updated[colIndex].links[linkIndex],
      [field]: val,
    };
    setColumns(updated);
  };

  return (
    <div className="max-w-6xl space-y-8 pb-16">
      
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <PanelBottom className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Footer Section & Content</h1>
            <p className="text-sm text-slate-500">
              Manage Company Name branding, plain solid or gradient background, typography, Stay Updated newsletter, and sorted quick links.
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
            <span className="text-xs font-bold uppercase tracking-wider">Live Storefront Footer Preview</span>
          </div>
          <span className="text-xs text-slate-400">Updates instantly as you edit below</span>
        </div>

        <div 
          className={`p-8 sm:p-12 transition-all duration-300 ${getFontClass()}`}
          style={{ ...getPreviewBackgroundStyle(), color: textColor }}
        >
          <div className="max-w-5xl mx-auto space-y-12">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Brand Column */}
              <div className="md:col-span-4 space-y-3">
                <span 
                  className="text-2xl font-black tracking-tight flex items-baseline"
                  style={{ color: headingColor }}
                >
                  <span>{companyNameOverride.trim() || "STORE"}</span>
                  <span style={{ color: accentColor }}>.</span>
                </span>
                <p className="text-xs leading-relaxed opacity-85">
                  {tagline}
                </p>
              </div>

              {/* Sorted Columns Preview */}
              <div className="md:col-span-5 grid grid-cols-3 gap-4">
                {columns.map((col) => {
                  const sorted = [...col.links].sort((a, b) => a.order - b.order);
                  return (
                    <div key={col.id} className="space-y-2">
                      <span 
                        className="text-xs font-bold uppercase tracking-wider block"
                        style={{ color: headingColor }}
                      >
                        {col.title}
                      </span>
                      <ul className="space-y-1.5 text-xs opacity-80">
                        {sorted.map((l) => (
                          <li key={l.id} className="truncate">
                            <span className="hover:underline">{l.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Newsletter Preview */}
              <div className="md:col-span-3 space-y-3">
                <span 
                  className="text-xs font-bold uppercase tracking-wider block"
                  style={{ color: headingColor }}
                >
                  {newsletterTitle}
                </span>
                <p className="text-xs opacity-75">{newsletterDescription}</p>
                <div className="flex gap-1.5">
                  <input 
                    disabled 
                    placeholder={newsletterPlaceholder}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20 opacity-80"
                  />
                  <button 
                    type="button" 
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: accentColor }}
                  >
                    {newsletterButtonText}
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Preview */}
            <div className="pt-6 border-t border-white/10 flex justify-between text-[11px] opacity-70">
              <span>&copy; {new Date().getFullYear()} {companyNameOverride.trim() || "STORE."}. {copyrightText}</span>
              <span>All systems active</span>
            </div>

          </div>
        </div>
      </div>

      {/* Main CMS Editor Form */}
      <form action={formAction} className="space-y-8">
        
        {/* Hidden inputs to pass states to server action */}
        <input type="hidden" name="bgType" value={bgType} />
        <input type="hidden" name="bgColor" value={bgColor} />
        <input type="hidden" name="bgGradientEnd" value={bgGradientEnd} />
        <input type="hidden" name="bgGradientDirection" value={bgGradientDirection} />
        <input type="hidden" name="fontKey" value={fontKey} />
        <input type="hidden" name="textColor" value={textColor} />
        <input type="hidden" name="headingColor" value={headingColor} />
        <input type="hidden" name="accentColor" value={accentColor} />
        <input type="hidden" name="columnsJson" value={JSON.stringify(columns)} />

        {/* Section 1: Company Name & Brand Identity */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                1. Company Name & Brand Identity
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically synchronizes with your Global / Navbar Company Name, or you can specify a custom footer title.
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Company Name (Displays in place of &quot;STORE.&quot;)
              </label>
              <input
                type="text"
                name="companyNameOverride"
                value={companyNameOverride}
                onChange={(e) => setCompanyNameOverride(e.target.value)}
                placeholder="Leave blank to use Global Company Name"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
              />
              <span className="text-xs text-slate-400 mt-1 block">
                When you set your Company Name in Navbar settings, it shows here automatically.
              </span>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Copyright Notice
              </label>
              <input
                type="text"
                name="copyrightText"
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                placeholder="e.g. All rights reserved."
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Brand Tagline / Mission Narrative
              </label>
              <textarea
                name="tagline"
                rows={2}
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Brief mission or quality statement about your store..."
                className="w-full p-3.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-600 outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Background Color (Plain Solid vs Gradient) */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-600" />
              2. Footer Background (Plain Color vs Gradient)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose between a clean solid background or an ambient multi-tone color gradient.
            </p>
          </div>

          <div className="space-y-6">
            {/* Mode Switcher */}
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

            {/* Gradient Presets */}
            {bgType === "gradient" && (
              <div className="p-4 rounded-xl border border-purple-100 bg-purple-50/50 space-y-3">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                  Recommended Gradient Palettes
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

            {/* Color Pickers & Direction */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    placeholder="#020617"
                    className="flex-1 h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 font-mono text-sm focus:ring-2 focus:ring-blue-600 outline-none uppercase"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {SOLID_BG_PRESETS.map((c) => (
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
                      placeholder="#0f172a"
                      className="flex-1 h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 font-mono text-sm focus:ring-2 focus:ring-purple-600 outline-none uppercase"
                    />
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Gradient Flow Direction
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { key: "to-b", label: "Top ↓ Down" },
                        { key: "to-r", label: "Left → Right" },
                        { key: "to-br", label: "Diagonal ↘" },
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

        {/* Section 3: Font Color and Font Styles */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Type className="w-4 h-4 text-emerald-600" />
              3. Font Color & Font Styles
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize typography style and colors for body links, headlines, and accent highlights.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Color Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Body Links / General Text Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 p-1 bg-white shrink-0"
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    placeholder="#94a3b8"
                    className="flex-1 h-10 px-3 rounded-xl border border-slate-300 text-slate-900 font-mono text-sm uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Column Headings Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={headingColor}
                    onChange={(e) => setHeadingColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 p-1 bg-white shrink-0"
                  />
                  <input
                    type="text"
                    value={headingColor}
                    onChange={(e) => setHeadingColor(e.target.value)}
                    placeholder="#f8fafc"
                    className="flex-1 h-10 px-3 rounded-xl border border-slate-300 text-slate-900 font-mono text-sm uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Accent Color (Join Button & Logo Dot)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 p-1 bg-white shrink-0"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    placeholder="#3b82f6"
                    className="flex-1 h-10 px-3 rounded-xl border border-slate-300 text-slate-900 font-mono text-sm uppercase"
                  />
                </div>
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

        {/* Section 4: Stay Updated (Newsletter via Email) */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                4. Stay Updated (Email Newsletter)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Visitors can submit their email to join your newsletter and receive updates.
              </p>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              <Users className="w-3.5 h-3.5" />
              <span>{subscribers.length} Subscribers</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Newsletter Title
              </label>
              <input
                type="text"
                name="newsletterTitle"
                value={newsletterTitle}
                onChange={(e) => setNewsletterTitle(e.target.value)}
                placeholder="e.g. Stay Updated"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Button Label
              </label>
              <input
                type="text"
                name="newsletterButtonText"
                value={newsletterButtonText}
                onChange={(e) => setNewsletterButtonText(e.target.value)}
                placeholder="e.g. Join"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Input Placeholder Text
              </label>
              <input
                type="text"
                name="newsletterPlaceholder"
                value={newsletterPlaceholder}
                onChange={(e) => setNewsletterPlaceholder(e.target.value)}
                placeholder="e.g. Enter your email address..."
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Newsletter Description / Incentive
              </label>
              <textarea
                name="newsletterDescription"
                rows={2}
                value={newsletterDescription}
                onChange={(e) => setNewsletterDescription(e.target.value)}
                placeholder="e.g. Subscribe to receive special offers, new collection announcements, and exclusive insider discounts."
                className="w-full p-3.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-600 outline-none resize-none"
              />
            </div>
          </div>

          {/* Subscribers Table Preview */}
          {subscribers.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Recent Newsletter Subscribers ({subscribers.length})
              </span>
              <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4">Email</th>
                      <th className="py-2.5 px-4">Subscribed Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {subscribers.map((sub, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2 px-4 font-medium text-slate-800">{sub.email}</td>
                        <td className="py-2 px-4 text-slate-500">
                          {new Date(sub.created_at).toLocaleDateString()} {new Date(sub.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Section 5: Sorted Quick Links Columns */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-indigo-600" />
              5. Quick Links & Navigation Columns (Sorted)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Organize footer columns and their links. Links are sorted in ascending order of their Order #.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((col, colIdx) => (
              <div key={col.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
                
                {/* Column Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Column {colIdx + 1} Title
                  </label>
                  <input
                    type="text"
                    value={col.title}
                    onChange={(e) => {
                      const updated = [...columns];
                      updated[colIdx].title = e.target.value;
                      setColumns(updated);
                    }}
                    className="w-full h-9 px-3 rounded-lg border border-slate-300 text-slate-900 font-bold text-xs bg-white"
                  />
                </div>

                {/* Column Links List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span>Links (Sorted by #)</span>
                    <button
                      type="button"
                      onClick={() => handleAddLink(colIdx)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-bold"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </div>

                  {col.links.map((link, linkIdx) => (
                    <div key={link.id} className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-2 shadow-2xs">
                      <div className="flex items-center gap-2">
                        {/* Order Input */}
                        <div className="w-12 shrink-0">
                          <input
                            type="number"
                            min={1}
                            max={99}
                            value={link.order}
                            onChange={(e) => handleUpdateLink(colIdx, linkIdx, "order", parseInt(e.target.value) || 1)}
                            className="w-full h-7 px-1 text-center rounded border border-slate-300 text-xs font-bold"
                            title="Sort order number"
                          />
                        </div>

                        {/* Link Label */}
                        <input
                          type="text"
                          value={link.name}
                          onChange={(e) => handleUpdateLink(colIdx, linkIdx, "name", e.target.value)}
                          placeholder="Link Name"
                          className="flex-1 h-7 px-2 text-xs rounded border border-slate-200"
                        />

                        {/* Remove Link */}
                        <button
                          type="button"
                          onClick={() => handleRemoveLink(colIdx, linkIdx)}
                          className="text-slate-400 hover:text-red-500 p-1"
                          title="Delete link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* URL Target */}
                      <input
                        type="text"
                        value={link.href}
                        onChange={(e) => handleUpdateLink(colIdx, linkIdx, "href", e.target.value)}
                        placeholder="e.g. #products or /orders"
                        className="w-full h-7 px-2 text-[11px] font-mono text-slate-600 rounded border border-slate-200 bg-slate-50"
                      />
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Submit Button Bar */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
          <button
            type="submit"
            disabled={isPending}
            className="h-12 px-8 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 min-h-11 cursor-pointer"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Saving Footer Settings...
              </span>
            ) : (
              "Save Footer Section Settings"
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
