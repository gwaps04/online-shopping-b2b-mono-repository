// FILE: src/components/sections/AboutUs.tsx
import React from "react";
import { Compass, Target, Sparkles, Award, ShieldCheck } from "lucide-react";

interface AboutSettings {
  title?: string;
  subtitle?: string;
  about_content?: string;
  vision_title?: string;
  vision_statement?: string;
  mission_title?: string;
  mission_statement?: string;
  bg_type?: string;
  bg_color?: string;
  bg_gradient_end?: string;
  bg_gradient_direction?: string;
  text_color?: string;
  font_key?: string;
}

export default function AboutUs({ settings }: { settings?: AboutSettings }) {
  const title = settings?.title || "About Our Store";
  const subtitle = settings?.subtitle || "Crafting exceptional experiences and curated essentials for the modern lifestyle.";
  const aboutContent = settings?.about_content || "Founded with a dedication to simplicity, reliability, and modern aesthetics, our store curates high-performing products designed to elevate everyday life. Every piece in our collection is carefully evaluated for durability, utility, and refined craftsmanship.";
  
  const visionTitle = settings?.vision_title || "Our Vision";
  const visionStatement = settings?.vision_statement || "To be the trusted destination for individuals who value quality craftsmanship, minimalist aesthetics, and timeless design in everyday products.";
  
  const missionTitle = settings?.mission_title || "Our Mission";
  const missionStatement = settings?.mission_statement || "Empowering our customers through meticulously designed, sustainably sourced, and enduring goods while delivering transparent, first-class service.";

  const bgType = settings?.bg_type || "solid";
  const bgColor = settings?.bg_color || "#f1f5f9"; // Silver White default
  const bgGradientEnd = settings?.bg_gradient_end || "#e2e8f0";
  const bgGradientDirection = settings?.bg_gradient_direction || "to-br";
  
  const textColor = settings?.text_color || "#000000"; // Black default
  const fontKey = settings?.font_key || "sans";

  const getBackgroundStyle = () => {
    if (bgType === "gradient") {
      let dir = "to bottom right";
      if (bgGradientDirection === "to-r") dir = "to right";
      if (bgGradientDirection === "to-b") dir = "to bottom";
      if (bgGradientDirection === "to-tr") dir = "to top right";
      return { background: `linear-gradient(${dir}, ${bgColor}, ${bgGradientEnd})` };
    }
    return { backgroundColor: bgColor };
  };

  const getFontFamily = () => {
    switch (fontKey) {
      case "display": return "font-display";
      case "serif": return "font-serif";
      case "mono": return "font-mono";
      default: return "font-sans";
    }
  };

  return (
    <div 
      className={`w-full py-20 sm:py-28 transition-colors duration-300 ${getFontFamily()}`}
      style={{ ...getBackgroundStyle(), color: textColor }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Title & Subtitle */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-current opacity-75 text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Who We Are</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            {title}
          </h2>

          {subtitle && (
            <p className="text-base sm:text-xl opacity-80 leading-relaxed font-normal">
              {subtitle}
            </p>
          )}
        </div>

        {/* Main Narrative Block */}
        {aboutContent && (
          <div className="max-w-4xl mx-auto mb-16">
            <div className="p-8 sm:p-12 rounded-3xl bg-white/60 backdrop-blur-md border border-black/5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider opacity-60">Our Story</h3>
              <p className="text-base sm:text-lg leading-relaxed whitespace-pre-line opacity-90">
                {aboutContent}
              </p>
            </div>
          </div>
        )}

        {/* Vision & Mission Sub-Contents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Vision Statement Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white/70 backdrop-blur-md border border-black/5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <Compass className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                {visionTitle}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed opacity-80">
                {visionStatement}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-black/5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-70">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Future-Forward Ambition</span>
            </div>
          </div>

          {/* Mission Statement Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white/70 backdrop-blur-md border border-black/5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <Target className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                {missionTitle}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed opacity-80">
                {missionStatement}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-black/5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-70">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Ethical Craftsmanship</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}