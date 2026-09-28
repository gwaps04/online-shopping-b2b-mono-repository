"use client";

import React, { useActionState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Store, AlertCircle, Shield, Clock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { loginAction } from "../actions";

const initialState = {
  error: "",
};

function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const redirectTarget = searchParams.get("redirect") || "/admin";

  return (
    <div className="bg-white py-8 px-5 sm:px-10 shadow-sm border border-slate-200 sm:rounded-2xl">
      <form className="space-y-5" action={formAction}>
        <input type="hidden" name="redirect" value={redirectTarget} />
        
        {/* Inactivity Timeout Banner */}
        {reason === "timeout" && !state?.error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3.5 rounded-xl text-xs flex items-start gap-2.5 animate-in fade-in">
            <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="block font-semibold">Session Expired (30m Inactivity)</strong>
              <span>You were automatically signed out due to 30 minutes of inactivity. Please sign in again.</span>
            </div>
          </div>
        )}

        {/* Unauthorized Route Banner */}
        {reason === "unauthorized" && !state?.error && (
          <div className="bg-slate-50 border border-slate-200 text-slate-700 p-3.5 rounded-xl text-xs flex items-start gap-2.5 animate-in fade-in">
            <Shield className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <span>Admin workspace access requires an active, verified session. Please authenticate.</span>
          </div>
        )}

        {/* Manual Logout Banner */}
        {reason === "manual_logout" && !state?.error && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>You have securely signed out of the Administrator Workspace.</span>
          </div>
        )}

        {/* Form Error Banner */}
        {state?.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Admin Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="off"
            required
            placeholder="admin@macrotek.com"
            className="block w-full h-11 appearance-none rounded-xl border border-slate-300 px-3.5 text-slate-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 text-sm bg-white"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            placeholder="••••••••"
            className="block w-full h-11 appearance-none rounded-xl border border-slate-300 px-3.5 text-slate-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 text-sm bg-white"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isPending}
            className="flex w-full h-11 justify-center items-center rounded-xl bg-slate-900 py-2 px-4 text-sm font-bold text-white shadow-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? "Authenticating Session..." : "Secure Sign In"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Return to Storefront Link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Storefront</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg mb-4">
          <Store className="w-7 h-7 text-red-500" />
        </div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
          CMS Administrator
        </h2>
        <p className="mt-1.5 text-center text-xs text-slate-500">
          Authorized personnel only • Protected with 30m Inactivity Guard
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense fallback={
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            Loading security console...
          </div>
        }>
          <LoginForm />
        </Suspense>

        <p className="mt-4 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted HS256 Token • HttpOnly Session Isolation</span>
        </p>
      </div>
    </div>
  );
}
