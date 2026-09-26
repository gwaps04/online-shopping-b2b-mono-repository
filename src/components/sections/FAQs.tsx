"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQSettings, DEFAULT_FAQ_SETTINGS } from "@/lib/faqsStorage";

export default function FAQs({ settings }: { settings?: FAQSettings }) {
  const currentSettings = settings || DEFAULT_FAQ_SETTINGS;

  const {
    title = DEFAULT_FAQ_SETTINGS.title,
    subtitle = DEFAULT_FAQ_SETTINGS.subtitle,
    faqs = DEFAULT_FAQ_SETTINGS.faqs,
    bg_type = "solid",
    bg_color = "#ffffff",
    bg_gradient_end = "#f8fafc",
    bg_gradient_direction = "to-br",
    text_color = "#0f172a",
    font_key = "sans",
    accordion_bg = "#f8fafc",
    accordion_question_color = "#0f172a",
    accordion_answer_color = "#475569",
    accordion_border_color = "#e2e8f0",
    accordion_accent_color = "#2563eb",
    accordion_radius = "rounded-2xl",
    accordion_layout = "single-column",
  } = currentSettings;

  // Manage open FAQ item IDs (support toggling multiple or single)
  const [openIds, setOpenIds] = useState<Set<string>>(new Set([faqs[0]?.id || "faq-1"]));

  const toggleFAQ = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
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
      case "display":
        return "font-display";
      case "serif":
        return "font-serif";
      case "mono":
        return "font-mono";
      default:
        return "font-sans";
    }
  };

  const getRadiusClass = () => {
    switch (accordion_radius) {
      case "rounded-none":
        return "rounded-none";
      case "rounded-lg":
        return "rounded-lg";
      case "rounded-xl":
        return "rounded-xl";
      case "rounded-3xl":
        return "rounded-3xl";
      default:
        return "rounded-2xl";
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-black/5 dark:bg-white/10 backdrop-blur-xs border border-current/10">
            <HelpCircle className="w-3.5 h-3.5" style={{ color: accordion_accent_color }} />
            <span>Help & Answers</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            {title || "Frequently Asked Questions"}
          </h2>

          {subtitle && (
            <p className="text-base sm:text-lg opacity-80 leading-relaxed font-normal">
              {subtitle}
            </p>
          )}
        </div>

        {/* FAQs Accordion Container */}
        {faqs && faqs.length > 0 ? (
          <div
            className={
              accordion_layout === "two-column"
                ? "grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-start max-w-6xl mx-auto"
                : "max-w-3xl mx-auto space-y-4"
            }
          >
            {faqs.map((faq, index) => {
              const isOpen = openIds.has(faq.id);

              return (
                <div
                  key={faq.id || index}
                  className={`overflow-hidden border transition-all duration-200 shadow-xs ${getRadiusClass()}`}
                  style={{
                    backgroundColor: accordion_bg,
                    borderColor: isOpen ? accordion_accent_color : accordion_border_color,
                    boxShadow: isOpen
                      ? `0 4px 20px -2px ${accordion_accent_color}1a`
                      : "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
                  }}
                >
                  {/* Accordion Question Trigger */}
                  <button
                    type="button"
                    onClick={() => toggleFAQ(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full py-5 px-6 sm:px-7 text-left flex items-center justify-between gap-4 transition-colors min-h-12 focus:outline-hidden"
                  >
                    <span
                      className="font-bold text-base sm:text-lg leading-snug tracking-tight select-none"
                      style={{ color: accordion_question_color }}
                    >
                      {faq.question}
                    </span>

                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      style={{
                        backgroundColor: isOpen
                          ? `${accordion_accent_color}18`
                          : "rgba(0,0,0,0.04)",
                        color: isOpen ? accordion_accent_color : accordion_question_color,
                      }}
                    >
                      <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                    </span>
                  </button>

                  {/* Accordion Answer Content (Smooth CSS Grid Expand/Collapse) */}
                  <div
                    className={`grid transition-[grid-template-rows] duration-250 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div
                        className="px-6 sm:px-7 pb-6 pt-1 text-sm sm:text-base leading-relaxed border-t border-black/5"
                        style={{ color: accordion_answer_color }}
                      >
                        <p className="whitespace-pre-line">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 max-w-md mx-auto">
            <p className="opacity-70 text-sm">No FAQs available at this moment.</p>
          </div>
        )}

      </div>
    </div>
  );
}
