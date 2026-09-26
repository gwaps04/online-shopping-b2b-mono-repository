"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, FileText, Settings, Package, Zap, ChevronDown, 
  Menu, Sparkles, Grid, ShoppingBag, Users, CheckCircle2, HelpCircle 
} from "lucide-react";

export default function AdminNav() {
  const pathname = usePathname();

  const isContentActive = pathname?.startsWith("/admin/content");

  const contentLinks = [
    { name: "Navigation Bar", href: "/admin/content", icon: Menu },
    { name: "Hero Section", href: "/admin/content/hero", icon: Sparkles },
    { name: "Categories Grid", href: "/admin/content/categories", icon: Grid },
    { name: "Products Inventory", href: "/admin/content/products", icon: ShoppingBag },
    { name: "About Us Section", href: "/admin/content/about", icon: Users, badge: "Active" },
    { name: "FAQs Section", href: "/admin/content/faqs", icon: HelpCircle, badge: "Active" },
  ];

  return (
    <nav className="flex-1 py-6 flex flex-col gap-1.5 px-3 overflow-y-auto">
      {/* Dashboard */}
      <Link 
        href="/admin" 
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm min-h-11 ${
          pathname === "/admin" 
            ? "bg-slate-900 text-white font-bold" 
            : "text-slate-400 hover:bg-slate-900 hover:text-white"
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span>Dashboard</span>
      </Link>

      {/* Orders */}
      <Link 
        href="/admin/orders" 
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm min-h-11 ${
          pathname?.startsWith("/admin/orders") 
            ? "bg-slate-900 text-white font-bold" 
            : "text-slate-400 hover:bg-slate-900 hover:text-white"
        }`}
      >
        <Package className="w-5 h-5" />
        <span>Orders</span>
      </Link>

      {/* Automation */}
      <Link 
        href="/admin/automation" 
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm min-h-11 ${
          pathname?.startsWith("/admin/automation") 
            ? "bg-slate-900 text-white font-bold" 
            : "text-slate-400 hover:bg-slate-900 hover:text-white"
        }`}
      >
        <Zap className="w-5 h-5 text-amber-400" />
        <span>Automations & Webhooks</span>
      </Link>
      
      {/* Section Content Accordion */}
      <details className="group mt-2" open={isContentActive || true}>
        <summary className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden min-h-11">
          <div className="flex items-center gap-3 font-semibold text-sm">
            <FileText className="w-5 h-5 text-blue-400" />
            <span>Section Content</span>
          </div>
          <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180 opacity-60 group-hover:opacity-100" />
        </summary>
        
        <div className="flex flex-col gap-1 mt-1 pl-3 border-l border-slate-800 ml-5 py-1">
          {contentLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm transition-all min-h-10 ${
                  isActive 
                    ? "bg-blue-600/15 text-blue-400 font-bold border-l-2 border-blue-500 pl-2.5" 
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </details>

      {/* Global Settings */}
      <Link 
        href="/admin/settings" 
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm min-h-11 mt-2 ${
          pathname?.startsWith("/admin/settings") 
            ? "bg-slate-900 text-white font-bold" 
            : "text-slate-400 hover:bg-slate-900 hover:text-white"
        }`}
      >
        <Settings className="w-5 h-5" />
        <span>Settings</span>
      </Link>
    </nav>
  );
}
