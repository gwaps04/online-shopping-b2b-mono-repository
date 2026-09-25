import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Settings, Clock, User, Package, Store, 
  Lock, Bell, CreditCard, ShieldCheck 
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Store Mono",
  description: "Account settings and preferences (Coming Soon).",
};

export default async function SettingsPage() {
  // 1. Session Route Guard
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("store_session")?.value;

  if (!sessionId) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50/60 py-12 sm:py-16">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Coming Soon Hero Card */}
        <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-14 shadow-sm text-center space-y-6">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-b from-blue-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Under Development Badge */}
          <div className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>Under Active Development</span>
          </div>

          {/* Animated Gear Icon */}
          <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-linear-to-tr from-slate-900 via-slate-800 to-indigo-900 text-white flex items-center justify-center shadow-lg">
            <Settings className="w-10 h-10 sm:w-12 sm:h-12 animate-[spin_12s_linear_infinite]" />
          </div>

          {/* Copy & Status */}
          <div className="relative max-w-lg mx-auto space-y-3">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              Settings Page is Coming Soon
            </h1>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              We are building a comprehensive control center where you'll be able to fine-tune your account preferences, security credentials, notification channels, and payment defaults.
            </p>
          </div>

          {/* Quick Action Navigation Links */}
          <div className="relative pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/account"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
            >
              <User className="w-4 h-4 text-blue-400" />
              Manage Profile & Address
            </Link>

            <Link
              href="/orders"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
            >
              <Package className="w-4 h-4 text-slate-500" />
              View My Orders
            </Link>

            <Link
              href="/#hero"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors"
            >
              <Store className="w-4 h-4 text-slate-500" />
              Back to Store
            </Link>
          </div>
        </div>

        {/* Feature Preview Cards */}
        <div className="space-y-4">
          <div className="text-center sm:text-left">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Planned modules in upcoming release
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Lock className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-sm text-slate-900">Security & Credentials</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Update account password, review active browser sessions, and manage 2FA settings.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <Bell className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-sm text-slate-900">Notification Channels</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Configure delivery SMS alerts, order receipts, and marketing newsletter preferences.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <CreditCard className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-sm text-slate-900">Payment Preferences</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Manage saved payment options and default PayMongo checkout methods.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-sm text-slate-900">Privacy & Data</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Request an export of personal data records or review consent settings.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}