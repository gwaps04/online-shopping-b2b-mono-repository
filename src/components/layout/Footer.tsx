"use client";

import React, { useActionState, useState } from "react";
import Link from "next/link";
import { Send, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { FooterSettings, DEFAULT_FOOTER_SETTINGS } from "@/lib/footerTypes";
import { subscribeNewsletterAction } from "@/app/admin/content/actions";

interface FooterProps {
  settings?: FooterSettings;
  companyName?: string;
}

const initialSubscribeState = { success: "", error: "" };

export default function Footer({ settings, companyName }: FooterProps) {
  const current = settings || DEFAULT_FOOTER_SETTINGS;
  const currentYear = new Date().getFullYear();

  const [state, formAction, isPending] = useActionState(
    subscribeNewsletterAction,
    initialSubscribeState
  );

  const [emailInput, setEmailInput] = useState("");

  const {
    company_name_override,
    tagline = DEFAULT_FOOTER_SETTINGS.tagline,
    copyright_text = DEFAULT_FOOTER_SETTINGS.copyright_text,
    bg_type = "solid",
    bg_color = "#020617",
    bg_gradient_end = "#0f172a",
    bg_gradient_direction = "to-b",
    font_key = "sans",
    text_color = "#94a3b8",
    heading_color = "#f8fafc",
    accent_color = "#3b82f6",
    newsletter_title = DEFAULT_FOOTER_SETTINGS.newsletter_title,
    newsletter_description = DEFAULT_FOOTER_SETTINGS.newsletter_description,
    newsletter_placeholder = DEFAULT_FOOTER_SETTINGS.newsletter_placeholder,
    newsletter_button_text = DEFAULT_FOOTER_SETTINGS.newsletter_button_text,
    columns = DEFAULT_FOOTER_SETTINGS.columns,
  } = current;

  // Resolve dynamic Company Name: explicit footer override > global admin setting > fallback "STORE."
  const resolvedCompanyName = (company_name_override || companyName || "STORE.").trim();

  // Split logo name if it ends with a dot to give it a colored accent dot
  const hasDot = resolvedCompanyName.endsWith(".");
  const brandDisplay = hasDot ? resolvedCompanyName.slice(0, -1) : resolvedCompanyName;

  const getBackgroundStyle = () => {
    if (bg_type === "gradient") {
      let dir = "to bottom";
      if (bg_gradient_direction === "to-r") dir = "to right";
      if (bg_gradient_direction === "to-br") dir = "to bottom right";
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
    <footer
      className={`w-full pt-16 pb-12 border-t border-white/10 transition-colors duration-300 ${getFontFamily()}`}
      style={{ ...getBackgroundStyle(), color: text_color }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-16">
          
          {/* Brand Info & Mission (4 cols on large screens) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="#hero" className="inline-block group">
              <span 
                className="text-2xl sm:text-3xl font-black tracking-tight flex items-baseline transition-opacity group-hover:opacity-90"
                style={{ color: heading_color }}
              >
                <span>{brandDisplay}</span>
                <span style={{ color: accent_color }}>.</span>
              </span>
            </Link>

            {tagline && (
              <p className="text-sm leading-relaxed max-w-sm opacity-85">
                {tagline}
              </p>
            )}

            <div className="pt-2 flex items-center gap-3 text-xs opacity-75">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                <Sparkles className="w-3.5 h-3.5" style={{ color: accent_color }} />
                <span>Verified Official Store</span>
              </span>
            </div>
          </div>

          {/* Sorted Quick Links Columns (5 cols split among dynamic columns) */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {columns.map((column) => {
              // Ensure links are properly sorted by 'order'
              const sortedLinks = [...column.links].sort((a, b) => (a.order || 0) - (b.order || 0));

              return (
                <div key={column.id} className="space-y-3.5">
                  <h3 
                    className="font-bold uppercase tracking-wider text-xs sm:text-sm"
                    style={{ color: heading_color }}
                  >
                    {column.title}
                  </h3>
                  <ul className="space-y-2.5">
                    {sortedLinks.map((link) => (
                      <li key={link.id}>
                        {link.href.startsWith("#") ? (
                          <a
                            href={link.href}
                            className="text-sm transition-opacity hover:opacity-100 opacity-80 block hover:underline"
                            style={{ color: text_color }}
                          >
                            {link.name}
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            className="text-sm transition-opacity hover:opacity-100 opacity-80 block hover:underline"
                            style={{ color: text_color }}
                          >
                            {link.name}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Stay Updated / Newsletter Subscription (3 cols on large screens) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 
              className="font-bold uppercase tracking-wider text-xs sm:text-sm"
              style={{ color: heading_color }}
            >
              {newsletter_title}
            </h3>

            {newsletter_description && (
              <p className="text-xs leading-relaxed opacity-80">
                {newsletter_description}
              </p>
            )}

            {/* Newsletter Subscription Form */}
            <form action={formAction} className="space-y-2.5">
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                <input
                  type="email"
                  name="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder={newsletter_placeholder}
                  className="w-full h-11 px-3.5 rounded-xl text-sm bg-white/5 border border-white/15 focus:outline-none focus:ring-2 placeholder:opacity-50 transition-all text-white"
                  style={{ color: heading_color }}
                />
                <button
                  type="submit"
                  disabled={isPending}
                  className="h-11 px-5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-xs transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer shrink-0"
                  style={{ backgroundColor: accent_color }}
                >
                  {isPending ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <React.Fragment>
                      <Send className="w-3.5 h-3.5" />
                      <span>{newsletter_button_text}</span>
                    </React.Fragment>
                  )}
                </button>
              </div>

              {/* Feedback messages */}
              {state?.success && (
                <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{state.success}</span>
                </div>
              )}

              {state?.error && (
                <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{state.error}</span>
                </div>
              )}
            </form>

            <span className="text-[11px] opacity-60 block">
              We respect your privacy. Unsubscribe at any time.
            </span>
          </div>

        </div>

        {/* Bottom Copyright & Legal Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs opacity-75">
          <p>
            &copy; {currentYear} {resolvedCompanyName}. {copyright_text}
          </p>

          <div className="flex items-center gap-6 text-xs">
            <a href="#hero" className="hover:underline">Back to top</a>
            <span>•</span>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
