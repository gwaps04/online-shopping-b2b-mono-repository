"use client";

import React, { useState } from "react";
import { 
  Phone, Mail, MapPin, Clock, Send, 
  Check, Copy, MessageSquare 
} from "lucide-react";
import { ContactSettings, DEFAULT_CONTACT_SETTINGS } from "@/lib/contactTypes";

export default function Contact({ settings }: { settings?: ContactSettings }) {
  const current = settings || DEFAULT_CONTACT_SETTINGS;

  const {
    title = DEFAULT_CONTACT_SETTINGS.title,
    subtitle = DEFAULT_CONTACT_SETTINGS.subtitle,
    phone_number = DEFAULT_CONTACT_SETTINGS.phone_number,
    phone_label = DEFAULT_CONTACT_SETTINGS.phone_label,
    email_address = DEFAULT_CONTACT_SETTINGS.email_address,
    address = DEFAULT_CONTACT_SETTINGS.address,
    operating_hours = DEFAULT_CONTACT_SETTINGS.operating_hours,
    bg_type = "solid",
    bg_color = "#0f172a",
    bg_gradient_end = "#1e293b",
    bg_gradient_direction = "to-br",
    text_color = "#f8fafc",
    font_key = "sans",
    accent_color = "#3b82f6",
    card_bg = "rgba(255, 255, 255, 0.06)",
    card_border = "rgba(255, 255, 255, 0.12)",
  } = current;

  // Form interactive feedback state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyPhone = () => {
    if (!phone_number) return;
    navigator.clipboard.writeText(phone_number);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  const getBackgroundStyle = () => {
    if (bg_type === "gradient") {
      let dir = "to bottom right";
      if (bg_gradient_direction === "to-r") dir = "to right";
      if (bg_gradient_direction === "to-b") dir = "to bottom";
      if (bg_gradient_direction === "to-tr") dir = "to top right";
      return { background: `linear-gradient(${dir}, ${bg_color}, ${bg_gradient_end})` };
    }
    return { backgroundColor: bg_color };
  };

  const getFontFamily = () => {
    switch (font_key) {
      case "display": return "font-display";
      case "serif": return "font-serif";
      case "mono": return "font-mono";
      default: return "font-sans";
    }
  };

  return (
    <div
      className={`w-full py-24 sm:py-32 transition-colors duration-300 ${getFontFamily()}`}
      style={{ ...getBackgroundStyle(), color: text_color }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 backdrop-blur-xs border border-current/15">
            <MessageSquare className="w-3.5 h-3.5" style={{ color: accent_color }} />
            <span>Connect & Support</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            {title || "Get in Touch with Us"}
          </h2>

          {subtitle && (
            <p className="text-base sm:text-lg opacity-80 leading-relaxed font-normal">
              {subtitle}
            </p>
          )}
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Phone & Business Channels (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Featured Business Contact Number Banner */}
            <div 
              className="p-6 sm:p-8 rounded-3xl border transition-all shadow-sm"
              style={{ 
                backgroundColor: card_bg,
                borderColor: card_border,
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner"
                    style={{ backgroundColor: `${accent_color}25`, color: accent_color }}
                  >
                    <Phone className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider opacity-70 block">
                      {phone_label || "Business Contact Number"}
                    </span>
                    <a 
                      href={`tel:${phone_number.replace(/[^0-9+]/g, '')}`}
                      className="text-2xl sm:text-3xl font-extrabold hover:underline tracking-tight block mt-0.5"
                      style={{ color: text_color }}
                    >
                      {phone_number}
                    </a>
                  </div>
                </div>

                {/* Call & Copy Quick Actions */}
                <div className="flex items-center gap-2 sm:self-center">
                  <a
                    href={`tel:${phone_number.replace(/[^0-9+]/g, '')}`}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center gap-2 shadow-xs transition-opacity hover:opacity-90 min-h-10"
                    style={{ backgroundColor: accent_color }}
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Now</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyPhone}
                    className="p-2.5 rounded-xl border border-current/20 hover:bg-white/10 transition-colors text-xs font-semibold flex items-center gap-1.5 min-h-10 min-w-10 justify-center"
                    title="Copy phone number"
                  >
                    {copiedPhone ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 opacity-75" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Grid of Secondary Channels (Email, Address, Hours) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Email Card */}
              {email_address && (
                <div 
                  className="p-6 rounded-2xl border transition-all"
                  style={{ backgroundColor: card_bg, borderColor: card_border }}
                >
                  <div className="flex items-start gap-3.5">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${accent_color}20`, color: accent_color }}
                    >
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider opacity-60 block">Email Us</span>
                      <a 
                        href={`mailto:${email_address}`}
                        className="text-sm font-semibold hover:underline mt-1 block truncate max-w-50"
                      >
                        {email_address}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Hours Card */}
              {operating_hours && (
                <div 
                  className="p-6 rounded-2xl border transition-all"
                  style={{ backgroundColor: card_bg, borderColor: card_border }}
                >
                  <div className="flex items-start gap-3.5">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${accent_color}20`, color: accent_color }}
                    >
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider opacity-60 block">Operating Hours</span>
                      <p className="text-sm font-medium mt-1 leading-snug">
                        {operating_hours}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Address Card */}
              {address && (
                <div 
                  className="sm:col-span-2 p-6 rounded-2xl border transition-all"
                  style={{ backgroundColor: card_bg, borderColor: card_border }}
                >
                  <div className="flex items-start gap-3.5">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${accent_color}20`, color: accent_color }}
                    >
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider opacity-60 block">Showroom & Headquarters</span>
                      <p className="text-sm font-medium mt-1 leading-relaxed">
                        {address}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Customer Message Form (5 Cols) */}
          <div className="lg:col-span-5">
            <div 
              className="p-6 sm:p-8 rounded-3xl border transition-all shadow-sm"
              style={{ 
                backgroundColor: card_bg,
                borderColor: card_border,
              }}
            >
              <h3 className="text-xl font-bold mb-1">Send Us a Direct Message</h3>
              <p className="text-xs opacity-75 mb-6">Leave your details and an advisor will reply within 24 hours.</p>

              {formSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-center space-y-2 animate-in fade-in">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                    <Check className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-emerald-200">Message Received!</h4>
                  <p className="text-xs text-emerald-300/80">Thank you for contacting us. We will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
                      Your Name
                    </label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Alex Morgan"
                      className="w-full h-11 px-3.5 rounded-xl border border-current/20 bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:opacity-40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      required 
                      placeholder="e.g. alex@example.com"
                      className="w-full h-11 px-3.5 rounded-xl border border-current/20 bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:opacity-40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
                      Message / Inquiry
                    </label>
                    <textarea 
                      rows={3} 
                      required 
                      placeholder="How can we assist you today?..."
                      className="w-full p-3.5 rounded-xl border border-current/20 bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:opacity-40 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-opacity hover:opacity-90 min-h-11 cursor-pointer"
                    style={{ backgroundColor: accent_color }}
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
