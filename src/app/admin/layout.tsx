import { LayoutDashboard, FileText, Settings, LogOut, Store, ChevronDown } from "lucide-react";
import Link from "next/link";
import { logoutAction } from "./actions";

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
        
        <nav className="flex-1 py-6 flex flex-col gap-1 px-3 overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-900 hover:text-white transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          
          {/* Woz Engine: Native HTML5 Accordion Menu (Zero JS) */}
          <details className="group" open>
            {/* The Summary acts as the clickable parent trigger */}
            <summary className="flex items-center justify-between px-3 py-2.5 rounded-md hover:bg-slate-900 hover:text-white transition-colors cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5" />
                Section Content
              </div>
              <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180 opacity-50 group-hover:opacity-100" />
            </summary>
            
            {/* Sub-menu Dropdown List */}
            <div className="flex flex-col gap-1 mt-1 pl-11">
              
              {/* Active Sub-Module: Navbar */}
              <Link href="/admin/content" className="block px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors">
                Navigation Bar
              </Link>
              
              {/* Active Sub-Module: Hero */}
              <Link href="/admin/content/hero" className="block px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors">
                Hero Section
              </Link>
              
              {/* Active Sub-Module: Categories (Unlocked) */}
              <Link href="/admin/content/categories" className="block px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors">
                Categories Grid
              </Link>
              
              {/* Future Scaling Placeholders (Locked) */}
              <div className="block px-3 py-2 text-sm text-slate-600 cursor-not-allowed">
                Products (Locked)
              </div>
            </div>
          </details>

          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-900 hover:text-white transition-colors mt-2">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

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