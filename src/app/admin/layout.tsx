import React from "react";
import { LogOut, Store, ShieldCheck, Clock } from "lucide-react";
import Link from "next/link";
import { logoutAction } from "./actions";
import AdminNav from "./AdminNav";
import AdminInactivityTracker from "./AdminInactivityTracker";
import { getAdminSession } from "@/lib/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  // If there is no active authenticated session, render purely the children (e.g. login page)
  // without the admin workspace sidebar, top navigation, or hardcoded email!
  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* 30-Minute Auto-Logout Inactivity Guard */}
      <AdminInactivityTracker />

      {/* CMS Sidebar */}
      <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col shrink-0">
        <div className="h-18 flex items-center px-6 border-b border-slate-900 shrink-0">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors">
            <Store className="w-5 h-5 text-red-500" />
            <span className="font-display font-bold tracking-wide">STORE CMS</span>
          </Link>
        </div>
        
        {/* Woz Modular Navigation with Active Link Detection */}
        <AdminNav />

        {/* Security / Session Info */}
        <div className="px-5 py-3 border-t border-slate-900/80 bg-slate-950/60">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>30m Inactivity Guard Active</span>
          </div>
        </div>

        {/* Secure Logout Form */}
        <div className="p-4 border-t border-slate-900 shrink-0">
          <form action={logoutAction}>
            <button 
              type="submit" 
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left text-sm font-medium cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main CMS Canvas */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-18 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-slate-900">Admin Workspace</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Authenticated Session
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-sm font-bold text-slate-900 block leading-tight">
                {session.email}
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">
                Store Administrator
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm border border-slate-700">
              {session.email.charAt(0)}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
