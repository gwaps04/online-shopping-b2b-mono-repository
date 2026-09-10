"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import SearchBar from "@/components/ui/SearchBar";
import CartIcon from "@/components/ui/CartIcon";

// Woz Design Dictionary: Theme & Colors
const THEME_DICTIONARY: Record<string, { bg: string, text: string, hover: string }> = {
  "light": {
    bg: "bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm",
    text: "text-slate-900",
    hover: "hover:text-blue-600"
  },
  "dark": {
    bg: "bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-sm",
    text: "text-white",
    hover: "hover:text-blue-400"
  },
  "gradient-blue": {
    // Woz Fix: Upgraded to Tailwind v4 canonical linear gradient
    bg: "bg-linear-to-r from-blue-700/95 to-indigo-900/95 backdrop-blur-md border-b border-blue-800 shadow-md",
    text: "text-white",
    hover: "hover:text-blue-200"
  }
};

// Woz Design Dictionary: Typographic Archetypes
const FONT_DICTIONARY: Record<string, string> = {
  "display": "font-display font-black tracking-tight",
  "sans": "font-sans font-bold tracking-normal",
  "serif": "font-serif font-bold italic tracking-wide",
  "mono": "font-mono font-bold tracking-tighter uppercase",
};

const NAV_LINKS = [
  { name: "Home", href: "#hero" },
  { name: "Categories", href: "#categories" },
  { name: "Products", href: "#products" },
  { name: "About Us", href: "#about" },
  { name: "FAQs", href: "#faqs" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar({ settings }: { settings: any }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Safely map database keys to the design dictionaries with fallbacks
  const activeTheme = THEME_DICTIONARY[settings?.theme_key] || THEME_DICTIONARY["light"];
  const fontFamily = FONT_DICTIONARY[settings?.font_key] || FONT_DICTIONARY["display"];
  const companyName = settings?.company_name || "STORE.";
  const logoUrl = settings?.logo_url;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${activeTheme.bg}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Dynamic Brand Composition with Layout Safety */}
          <Link 
            href="#hero" 
            className="shrink-0 flex items-center gap-3 min-w-11 min-h-11 max-w-[50vw] sm:max-w-none group"
            title={companyName}
          >
            {/* 1. Render Logo if it exists */}
            {logoUrl && (
              <img 
                src={logoUrl} 
                alt={`${companyName} Logo`} 
                className="h-9 sm:h-10 w-auto object-contain shrink-0 group-hover:opacity-90 transition-opacity" 
              />
            )}
            
            {/* 2. Render Text Alongside the Logo */}
            {companyName && (
              <span className={`${fontFamily} text-lg sm:text-2xl ${activeTheme.text} truncate`}>
                {companyName}
                <span className={settings?.theme_key === "light" ? "text-blue-600" : "text-blue-400"}>.</span>
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium ${activeTheme.text} ${activeTheme.hover} transition-colors py-2`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Utilities */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <SearchBar />
            <CartIcon itemCount={2} />
            
            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden p-2 ${activeTheme.text} hover:bg-slate-500/10 rounded-md min-w-11 min-h-11 flex items-center justify-center`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Matches active theme) */}
      {isMobileMenuOpen && (
        <div className={`lg:hidden ${activeTheme.bg} absolute w-full`}>
          <nav className="flex flex-col px-4 py-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 text-base font-medium ${activeTheme.text} ${activeTheme.hover} hover:bg-slate-500/10 rounded-lg min-h-11`}
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}