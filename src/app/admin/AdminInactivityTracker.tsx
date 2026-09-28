"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Clock, RefreshCw, LogOut } from "lucide-react";
import { logoutAction, touchSessionAction } from "./actions";

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const WARNING_THRESHOLD_MS = 2 * 60 * 1000;  // Warn when 2 minutes remain (at 28 mins)

export default function AdminInactivityTracker() {
  const router = useRouter();
  const lastActiveRef = useRef<number>(Date.now());
  const [secondsRemaining, setSecondsRemaining] = useState<number>(1800);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Register user interaction to reset timer
  const recordActivity = useCallback(() => {
    lastActiveRef.current = Date.now();
    if (showWarning) {
      setShowWarning(false);
    }
  }, [showWarning]);

  // Periodic heartbeat / ping to server to refresh session when actively working
  const pingServerSession = useCallback(async () => {
    try {
      setIsRefreshing(true);
      await touchSessionAction();
      lastActiveRef.current = Date.now();
      setShowWarning(false);
    } catch {
      // Ignore background heartbeat errors
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Event listeners for user activity
  useEffect(() => {
    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    const handleEvent = () => recordActivity();

    events.forEach((evt) => window.addEventListener(evt, handleEvent, { passive: true }));

    // Heartbeat every 5 minutes if actively working to keep server cookie fresh
    const heartbeatInterval = setInterval(() => {
      const idleTime = Date.now() - lastActiveRef.current;
      if (idleTime < 5 * 60 * 1000) {
        touchSessionAction().catch(() => {});
      }
    }, 5 * 60 * 1000);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, handleEvent));
      clearInterval(heartbeatInterval);
    };
  }, [recordActivity]);

  // Inactivity countdown loop (runs every 1 second)
  useEffect(() => {
    const timer = setInterval(async () => {
      const now = Date.now();
      const elapsed = now - lastActiveRef.current;
      const remainingMs = INACTIVITY_TIMEOUT_MS - elapsed;
      const remainingSecs = Math.max(0, Math.floor(remainingMs / 1000));

      setSecondsRemaining(remainingSecs);

      // Trigger warning dialog when within 2 minutes of timeout
      if (remainingMs <= WARNING_THRESHOLD_MS && remainingMs > 0) {
        setShowWarning(true);
      } else if (remainingMs > WARNING_THRESHOLD_MS) {
        setShowWarning(false);
      }

      // Hard timeout reached: trigger logout
      if (remainingMs <= 0) {
        clearInterval(timer);
        try {
          await logoutAction();
        } finally {
          router.push("/admin/login?reason=timeout");
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  if (!showWarning) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in fade-in slide-in-from-bottom-5">
      <div className="bg-slate-900 border-2 border-amber-500/80 text-white p-5 rounded-2xl shadow-2xl space-y-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">Session Inactivity Warning</h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Security Policy
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              No activity has been detected. For admin security, your account will be automatically logged out in:
            </p>
          </div>
        </div>

        {/* Countdown Timer Display */}
        <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-mono text-lg font-bold">
          <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
          <span>
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800">
          <button
            type="button"
            onClick={async () => {
              await logoutAction();
              router.push("/admin/login?reason=manual_logout");
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Now</span>
          </button>

          <button
            type="button"
            onClick={pingServerSession}
            disabled={isRefreshing}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isRefreshing ? (
              <React.Fragment>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" />
                <span>Extending Session...</span>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <RefreshCw className="w-3.5 h-3.5 text-slate-950" />
                <span>Stay Signed In</span>
              </React.Fragment>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
