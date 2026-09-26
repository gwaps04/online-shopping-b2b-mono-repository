"use client";

import React, { useActionState, useState, useEffect } from "react";
import { 
  Phone, Eye, Palette, Type, Layers, CheckCircle2, 
  AlertCircle, PhoneCall, Mail, Clock, MapPin, 
  RotateCcw 
} from "lucide-react";
import { updateContactSettings, getContactSettingsAction } from "@/app/admin/content/actions";
import { DEFAULT_CONTACT_SETTINGS } from "@/lib/contactTypes";

const initialState = { success: "", error: "" };

const FONT_OPTIONS = [
  { key: "sans", name: "Modern Sans (Inter / Clean)", className: "font-sans" },
  { key: "display", name: "Bold Display (Impactful)", className: "font-display font-black tracking-tight" },
  { key: "serif", name: "Editorial Serif (Classic & Luxurious)", className: "font-serif italic" },
  { key: "mono", name: "Technical Mono (Modern Minimal)", className: "font-mono uppercase tracking-tight" },
];

const SOLID_BG_PRESETS = [
  { label: "Dark Obsidian (Default)", value: "#0f172a" },
  { label: "Pure Black", value: "#000000" },
  { label: "Midnight Blue", value: "#1e1b4b" },
  { label: "Slate Charcoal", value: "#1e293b" },
  { label: "Deep Forest", value: "#064e3b" },
  { label: "Pure White", value: "#ffffff" },
  { label: "Light Slate", value: "#f8fafc" },
];

const GRADIENT_PRESETS = [
  { label: "Obsidian to Slate", start: "#0f172a", end: "#1e293b" },
  { label: "Midnight to Charcoal", start: "#020617", end: "#0f172a" },
  { label: "Deep Indigo to Obsidian", start: "#1e1b4b", end: "#0f172a" },
  { label: "Emerald Night", start: "#064e3b", end: "#022c22" },
  { label: "Clean Silver to Mist", start: "#f8fafc", end: "#e2e8f0" },
  { label: "Royal Blue Gradient", start: "#1e3a8a", end: "#0f172a" },
];

export default function ContactCMSPage({ initialData }: { initialData?: any }) {
  const [state, formAction, isPending] = useActionState(updateContactSettings, initialState);

  // Form & Live Preview States
  const [title, setTitle] = useState(initialData?.title || DEFAULT_CONTACT_SETTINGS.title);
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || DEFAULT_CONTACT_SETTINGS.subtitle);
  const [phoneNumber, setPhoneNumber] = useState(initialData?.phone_number || DEFAULT_CONTACT_SETTINGS.phone_number);
  const [phoneLabel, setPhoneLabel] = useState(initialData?.phone_label || DEFAULT_CONTACT_SETTINGS.phone_label);
  const [emailAddress, setEmailAddress] = useState(initialData?.email_address || DEFAULT_CONTACT_SETTINGS.email_address);
  const [address, setAddress] = useState(initialData?.address || DEFAULT_CONTACT_SETTINGS.address);
  const [operatingHours, setOperatingHours] = useState(initialData?.operating_hours || DEFAULT_CONTACT_SETTINGS.operating_hours);

  // Background Plain vs Gradient
  const [bgType, setBgType] = useState<"solid" | "gradient">(initialData?.bg_type || "solid");
  const [bgColor, setBgColor] = useState(initialData?.bg_color || "#0f172a");
  const [bgGradientEnd, setBgGradientEnd] = useState(initialData?.bg_gradient_end || "#1e293b");
  const [bgGradientDirection, setBgGradientDirection] = useState(initialData?.bg_gradient_direction || "to-br");

  // Typography & Font
  const [textColor, setTextColor] = useState(initialData?.text_color || "#f8fafc");
  const [fontKey, setFontKey] = useState(initialData?.font_key || "sans");

  // Accent & Card styles
  const [accentColor, setAccentColor] = useState(initialData?.accent_color || "#3b82f6");
  const [cardBg, setCardBg] = useState(initialData?.card_bg || "rgba(255, 255, 255, 0.06)");
  const [cardBorder, setCardBorder] = useState(initialData?.card_border || "rgba(255, 255, 255, 0.12)");

  // Load existing persistent settings on mount
  useEffect(() => {
    let isMounted = true;
    getContactSettingsAction().then((data) => {
      if (!isMounted || !data) return;
      if (data.title) setTitle(data.title);
      if (data.subtitle !== undefined) setSubtitle(data.subtitle);
      if (data.phone_number) setPhoneNumber(data.phone_number);
      if (data.phone_label) setPhoneLabel(data.phone_label);
      if (data.email_address !== undefined) setEmailAddress(data.email_address);
      if (data.address !== undefined) setAddress(data.address);
      if (data.operating_hours !== undefined) setOperatingHours(data.operating_hours);
      if (data.bg_type) setBgType(data.bg_type as any);
      if (data.bg_color) setBgColor(data.bg_color);
      if (data.bg_gradient_end) setBgGradientEnd(data.bg_gradient_end);
      if (data.bg_gradient_direction) setBgGradientDirection(data.bg_gradient_direction);
      if (data.text_color) setTextColor(data.text_color);
      if (data.font_key) setFontKey(data.font_key);
      if (data.accent_color) setAccentColor(data.accent_color);
      if (data.card_bg) setCardBg(data.card_bg);
      if (data.card_border) setCardBorder(data.card_border);
    }).catch((err) => console.warn("Failed to load initial contact settings:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  const handleResetDefaults = () => {
    if (window.confirm("Reset Contact section to defaults? Your customized edits will be replaced.")) {
      setTitle(DEFAULT_CONTACT_SETTINGS.title);
      setSubtitle(DEFAULT_CONTACT_SETTINGS.subtitle);
      setPhoneNumber(DEFAULT_CONTACT_SETTINGS.phone_number);
      setPhoneLabel(DEFAULT_CONTACT_SETTINGS.phone_label || "");
      setEmailAddress(DEFAULT_CONTACT_SETTINGS.email_address || "");
      setAddress(DEFAULT_CONTACT_SETTINGS.address || "");
      setOperatingHours(DEFAULT_CONTACT_SETTINGS.operating_hours || "");
      setBgType("solid");
      setBgColor("#0f172a");
      setBgGradientEnd("#1e293b");
      setBgGradientDirection("to-br");
      setTextColor("#f8fafc");
      setFontKey("sans");
      setAccentColor("#3b82f6");
    }
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

  return (
    <div className="max-w-6xl space-y-8 pb-16">
      
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <PhoneCall className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Contact Section Content & Styling</h1>
            <p className="text-sm text-slate-500">
              Manage section title & subtitle, business contact number, plain vs gradient background, and typography colors.
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
          <span className="text-xs text-slate-400">Live preview of your Contact section</span>
        </div>

        <div 
          className={`p-8 sm:p-12 transition-all duration-300 ${getFontClass()}`}
          style={{ ...getPreviewBackgroundStyle(), color: textColor }}
        >
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Header Preview */}
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-current opacity-70">
                Connect & Support
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {title || "Get in Touch with Us"}
              </h2>
              {subtitle && (
                <p className="text-base sm:text-lg opacity-80 max-w-2xl mx-auto leading-relaxed font-normal">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Business Contact Number Card Preview */}
            <div 
              className="p-6 rounded-2xl border transition-all"
              style={{ backgroundColor: cardBg, borderColor: cardBorder }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
                  >
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider opacity-70 block">
                      {phoneLabel || "Direct Support Hotline"}
                    </span>
                    <span className="text-2xl font-black tracking-tight block">
                      {phoneNumber || "+1 (800) 000-0000"}
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2">
                  <span 
                    className="px-4 py-2 rounded-lg font-bold text-xs text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    Call Now
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Secondary Channels Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div 
                className="p-4 rounded-xl border flex items-center gap-3"
                style={{ backgroundColor: cardBg, borderColor: cardBorder }}
              >
                <Mail className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
                <span className="truncate">{emailAddress || "concierge@storebrand.com"}</span>
              </div>
              <div 
                className="p-4 rounded-xl border flex items-center gap-3"
                style={{ backgroundColor: cardBg, borderColor: cardBorder }}
              >
                <Clock className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
                <span className="truncate">{operatingHours || "Mon – Fri: 9am – 6pm"}</span>
              </div>
              <div 
                className="p-4 rounded-xl border flex items-center gap-3"
                style={{ backgroundColor: cardBg, borderColor: cardBorder }}
              >
                <MapPin className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
                <span className="truncate">{address || "New York, NY"}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main CMS Editor Form */}
      <form action={formAction} className="space-y-8">
        
        {/* Hidden inputs to pass styling states into server action */}
        <input type="hidden" name="bgType" value={bgType} />
        <input type="hidden" name="bgColor" value={bgColor} />
        <input type="hidden" name="bgGradientEnd" value={bgGradientEnd} />
        <input type="hidden" name="bgGradientDirection" value={bgGradientDirection} />
        <input type="hidden" name="textColor" value={textColor} />
        <input type="hidden" name="fontKey" value={fontKey} />
        <input type="hidden" name="accentColor" value={accentColor} />
        <input type="hidden" name="cardBg" value={cardBg} />
        <input type="hidden" name="cardBorder" value={cardBorder} />

        {/* Section 1: Title & Subtitle */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                1. Section Title & Subtitle
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Customize the heading and subtitle text for your contact section.</p>
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
                placeholder="e.g. Get in Touch with Us"
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
                placeholder="e.g. Have a question about an order, product inquiries, or feedback? Our team is always ready to assist you."
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Business Contact Number & Details */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600" />
              2. Business Contact Number & Direct Channels
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter the main phone number that will be prominently highlighted with click-to-call functionality.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Business Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="phoneNumber"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. +1 (800) 555-0199"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 font-semibold text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
              />
              <span className="text-xs text-slate-400 mt-1 block">Customers can tap to call directly on mobile.</span>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Phone Label / Department Tag
              </label>
              <input
                type="text"
                name="phoneLabel"
                value={phoneLabel}
                onChange={(e) => setPhoneLabel(e.target.value)}
                placeholder="e.g. Direct Support Hotline"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Support Email Address
              </label>
              <input
                type="email"
                name="emailAddress"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="e.g. concierge@storebrand.com"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Operating Hours
              </label>
              <input
                type="text"
                name="operatingHours"
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                placeholder="e.g. Monday – Friday: 9:00 AM – 6:00 PM EST"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Physical Address / Showroom Location
              </label>
              <input
                type="text"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 742 Evergreen Avenue, Suite 400, New York, NY 10001"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Background Styling (Plain Solid vs Gradient) */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-600" />
              3. Section Background Color & Gradient Effect
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Switch between a plain solid background color or a rich flowing gradient with customizable angles and tones.
            </p>
          </div>

          <div className="space-y-6">
            {/* Mode: Solid vs Gradient */}
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

            {/* Gradient Preset Recommendations */}
            {bgType === "gradient" && (
              <div className="p-4 rounded-xl border border-purple-100 bg-purple-50/50 space-y-3">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                  Recommended Gradient Color Schemes
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

            {/* Color Pickers & Direction Controls */}
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
                    placeholder="#0f172a"
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

              {/* Gradient End Color & Flow Direction */}
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
                      placeholder="#1e293b"
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

        {/* Section 4: Font Color & Font Styles */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Type className="w-4 h-4 text-emerald-600" />
              4. Font Color & Font Styles
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize typography style and font color for headlines and descriptions across the contact section.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Font Color Picker */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Font / Text Color
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
                  placeholder="#f8fafc"
                  className="flex-1 h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 font-mono text-sm focus:ring-2 focus:ring-emerald-600 outline-none uppercase"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {[
                  { label: "Crisp White (Default)", value: "#f8fafc" },
                  { label: "Pure Black", value: "#000000" },
                  { label: "Dark Slate", value: "#0f172a" },
                  { label: "Warm Sand", value: "#fef3c7" },
                  { label: "Ice Cyan", value: "#e0f2fe" },
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

              {/* Accent Color Picker */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Call Button & Icon Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-1 bg-white shrink-0"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    placeholder="#3b82f6"
                    className="flex-1 h-10 px-3 rounded-lg border border-slate-300 text-slate-900 font-mono text-xs uppercase"
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
                Saving Contact Settings...
              </span>
            ) : (
              "Save Contact Section Settings"
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
