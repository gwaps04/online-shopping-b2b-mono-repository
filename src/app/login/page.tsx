"use client";

import { useState, useEffect, useActionState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Loader2, AlertCircle, CheckCircle2, User, Mail } from "lucide-react";
import { processLogin } from "./actions";
import Link from "next/link";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [formState, formAction, isPending] = useActionState(processLogin, undefined);

  // Woz Engine: Advanced URL Parameter Sniffing
  const isNewlyRegistered = searchParams.get("registered") === "true";
  const needsVerification = searchParams.get("check_email") === "true";
  const isVerifiedSuccess = searchParams.get("verified") === "true";
  const urlError = searchParams.get("error");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (formState?.success && formState.redirectUrl) {
      router.push(formState.redirectUrl);
    }
  }, [formState, router]);

  if (!mounted) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4">
        
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-slate-900/20">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Log in to access your saved details and orders.</p>
        </div>

        <form action={formAction} className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          
          {/* Banner: Check Email */}
          {needsVerification && (
            <div className="m-6 mb-0 bg-blue-50 border border-blue-200 p-4 rounded-xl flex gap-3 text-blue-800 animate-in fade-in">
              <Mail className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">Account created! We've sent a verification link to your email. Please click it to activate your account.</p>
            </div>
          )}

          {/* Banner: Verification Success */}
          {isVerifiedSuccess && (
            <div className="m-6 mb-0 bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex gap-3 text-emerald-700 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">Email successfully verified! You may now securely log in.</p>
            </div>
          )}

          {/* Banner: URL Magic Link Errors */}
          {urlError === 'invalid_token' && (
            <div className="m-6 mb-0 bg-red-50 border border-red-200 p-4 rounded-xl flex gap-3 text-red-700 animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">The verification link is invalid or has already been used.</p>
            </div>
          )}
          {urlError === 'expired_token' && (
            <div className="m-6 mb-0 bg-red-50 border border-red-200 p-4 rounded-xl flex gap-3 text-red-700 animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">The verification link has expired (24-hour limit). Please request a new one.</p>
            </div>
          )}

          {/* Standard Login Error Banner */}
          {formState?.error && (
            <div className="m-6 mb-0 bg-red-50 border border-red-200 p-4 rounded-xl flex gap-3 text-red-700 animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{formState.error}</p>
            </div>
          )}

          <div className="p-6 md:p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email" 
                  name="email" 
                  required 
                  autoComplete="email"
                  className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-slate-900" 
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="password" 
                  name="password" 
                  required 
                  autoComplete="current-password"
                  className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-slate-900" 
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-200">
            <button 
              type="submit" 
              disabled={isPending}
              className={`w-full h-12 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-md ${isPending ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5'}`}
            >
              {isPending ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</> : "Sign In Securely"}
            </button>
            <p className="text-center mt-6 text-sm text-slate-600">
              Don't have an account? <Link href="/register" className="font-bold text-blue-600 hover:text-blue-700">Create one now</Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}>
      <LoginContent />
    </Suspense>
  );
}