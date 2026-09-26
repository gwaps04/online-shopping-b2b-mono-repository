import React from "react";
import Link from "next/link";
import { 
  Users, Sparkles, ShoppingBag, Grid, Menu, ArrowRight, 
  Layers, Package, Zap 
} from "lucide-react";

export default function AdminDashboard() {
  const contentModules = [
    {
      title: "About Us Section",
      description: "Manage section title, subtitle, story narrative, vision & mission cards, plus background color and gradient effects.",
      href: "/admin/content/about",
      icon: Users,
      badge: "Newly Added",
      accent: "from-blue-600 to-indigo-600 text-white",
    },
    {
      title: "Hero Section",
      description: "Customize storefront headline, call-to-action buttons, and hero background media.",
      href: "/admin/content/hero",
      icon: Sparkles,
      accent: "bg-slate-900 text-white",
    },
    {
      title: "Products Inventory",
      description: "Manage product catalog, pricing, stock levels, and custom merchandising badges.",
      href: "/admin/content/products",
      icon: ShoppingBag,
      accent: "bg-slate-900 text-white",
    },
    {
      title: "Categories Grid",
      description: "Organize catalog taxonomy, category banners, and navigation filters.",
      href: "/admin/content/categories",
      icon: Grid,
      accent: "bg-slate-900 text-white",
    },
    {
      title: "Navigation Bar",
      description: "Control branding, storefront logo, theme mode, and global typography.",
      href: "/admin/content",
      icon: Menu,
      accent: "bg-slate-900 text-white",
    },
    {
      title: "Customer Orders",
      description: "Review pending transactions, update fulfillment statuses, and tracking numbers.",
      href: "/admin/orders",
      icon: Package,
      accent: "bg-slate-900 text-white",
    },
  ];

  return (
    <div className="max-w-5xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Overview & Content Management</h1>
        <p className="text-slate-500 mt-1">Welcome back. Select a content section below or navigate using the sidebar.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-500">Active Sections</h3>
            <Layers className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">7</p>
          <p className="text-xs text-slate-400 mt-1">All CMS modules synced</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-500">Live Products</h3>
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">124</p>
          <p className="text-xs text-slate-400 mt-1">Active inventory count</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-500">Order System</h3>
            <Zap className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">Live</p>
          <p className="text-xs text-slate-400 mt-1">COD & PayMongo integrated</p>
        </div>
      </div>

      {/* Content Modules Quick Access */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Storefront Section Modules</h2>
          <span className="text-xs text-slate-400 font-medium">Click to edit and live-preview</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contentModules.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-500/50 hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:bg-blue-600 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed pl-13">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-end text-xs font-bold text-slate-600 group-hover:text-blue-600 transition-colors gap-1 pt-2 border-t border-slate-100">
                  <span>Open Editor</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
