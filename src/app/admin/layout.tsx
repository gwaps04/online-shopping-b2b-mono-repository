import { LogOut, Store } from "lucide-react";
import Link from "next/link";
import { logoutAction } from "./actions";
import AdminNav from "./AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* CMS Sidebar */}
      <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col shrink-0">
        <div className="h-18 flex items-center px-6 border-b border-slate-900 shrink-0">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors">
            <Store className="w-5 h-5" />
            <span className="font-display font-bold tracking-wide">STORE CMS</span>
          </Link>
        </div>
        
        {/* Woz Modular Navigation with Active Link Detection */}
        <AdminNav />

        {/* Secure Logout Form */}
        <div className="p-4 border-t border-slate-900 shrink-0">
          <form action={logoutAction}>
            <button type="submit" className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-red-400 hover:bg-red-500/10 transition-colors text-left">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main CMS Canvas */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-18 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-lg font-semibold text-slate-900">Admin Workspace</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-600">admin@macrotek.com</span>
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300"></div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}