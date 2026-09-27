"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Bot, Sparkles, MessageSquare } from "lucide-react";
import { AIAssistantSettings, DEFAULT_AI_ASSISTANT_SETTINGS } from "@/lib/aiAssistantTypes";

interface FloatingAIAssistantProps {
  initialSettings?: AIAssistantSettings;
}

export default function FloatingAIAssistant({ initialSettings }: FloatingAIAssistantProps) {
  const pathname = usePathname();
  const [settings, setSettings] = useState<AIAssistantSettings>(
    initialSettings || DEFAULT_AI_ASSISTANT_SETTINGS
  );

  // Position state (null before client mount to avoid hydration mismatch)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDistance, setDragDistance] = useState(0);

  const dragStartRef = useRef<{ startX: number; startY: number; initialPosX: number; initialPosY: number }>({
    startX: 0,
    startY: 0,
    initialPosX: 0,
    initialPosY: 0,
  });

  const buttonRef = useRef<HTMLDivElement>(null);

  // Hide on Admin and inside the dedicated Chat tab itself
  const isHidden = pathname?.startsWith("/admin") || pathname?.startsWith("/ai-assistant");

  // Initialize position at bottom-right
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (initialSettings) {
      setSettings(initialSettings);
    }

    // Default position: bottom-right corner
    const initX = Math.max(16, window.innerWidth - 80);
    const initY = Math.max(16, window.innerHeight - 90);
    setPosition({ x: initX, y: initY });

    const handleResize = () => {
      setPosition((prev) => {
        if (!prev) return null;
        const clampedX = Math.min(Math.max(16, prev.x), window.innerWidth - 80);
        const clampedY = Math.min(Math.max(16, prev.y), window.innerHeight - 90);
        return { x: clampedX, y: clampedY };
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initialSettings]);

  // Pointer drag event handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return; // Only primary button
    e.preventDefault();

    setIsDragging(true);
    setDragDistance(0);

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialPosX: position?.x || (window.innerWidth - 80),
      initialPosY: position?.y || (window.innerHeight - 90),
    };

    if (buttonRef.current) {
      buttonRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;
    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    setDragDistance(dist);

    const newX = dragStartRef.current.initialPosX + deltaX;
    const newY = dragStartRef.current.initialPosY + deltaY;

    // Clamp inside viewport
    const clampedX = Math.min(Math.max(12, newX), window.innerWidth - 76);
    const clampedY = Math.min(Math.max(12, newY), window.innerHeight - 76);

    setPosition({ x: clampedX, y: clampedY });
  }, [isDragging]);

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    if (buttonRef.current && buttonRef.current.hasPointerCapture(e.pointerId)) {
      buttonRef.current.releasePointerCapture(e.pointerId);
    }

    // If movement was negligible (< 6px), treat as a deliberate click and open in a new tab!
    if (dragDistance < 6) {
      window.open("/ai-assistant", "_blank", "noopener,noreferrer");
    }
  };

  // Only render if enabled, webhook URL is configured, and not on excluded routes
  if (isHidden) return null;
  if (!settings.ai_assistant_active) return null;
  if (!settings.ai_assistant_webhook_url?.trim()) return null;
  if (!position) return null;

  const buttonText = settings.ai_assistant_button_text || "Talk with our AI Persona";

  // Determine if callout pill should sit on left or right based on screen position
  const isNearRight = position.x > (typeof window !== "undefined" ? window.innerWidth / 2 : 500);

  return (
    <div
      ref={buttonRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999,
        touchAction: "none",
        userSelect: "none",
      }}
      className={`group select-none transition-transform duration-75 ${
        isDragging ? "cursor-grabbing scale-105" : "cursor-grab"
      }`}
      title="Click to chat with our Business AI in a new tab • Drag to move"
    >
      <div className="relative flex items-center">
        
        {/* Interactive Callout Pill (Left or Right depending on screen position) */}
        <div
          className={`absolute pointer-events-none transition-all duration-300 transform hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/95 text-white border border-red-500/40 shadow-xl backdrop-blur-md whitespace-nowrap text-xs font-semibold ${
            isNearRight 
              ? "right-full mr-3.5" 
              : "left-full ml-3.5"
          } group-hover:scale-105`}
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <MessageSquare className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span>{buttonText}</span>
          <span className="text-[10px] text-slate-400 font-normal pl-1 border-l border-slate-700">
            Open Chat ↗
          </span>
        </div>

        {/* Pulsing Beacon Halo */}
        <div className="absolute -inset-1.5 rounded-full bg-red-600/30 animate-ping pointer-events-none" />

        {/* Primary Vivid Red Movable Floating Button */}
        <div className="relative w-15 h-15 rounded-full bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 text-white flex items-center justify-center shadow-2xl shadow-red-700/60 ring-4 ring-white/20 hover:scale-105 active:scale-95 transition-transform duration-200">
          
          {/* Main Bot Icon */}
          <Bot className="w-7 h-7 drop-shadow-sm" />

          {/* Sparkle accent */}
          <Sparkles className="w-3.5 h-3.5 absolute top-2.5 right-2.5 text-yellow-300 animate-pulse" />

          {/* Online green indicator badge */}
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
          </span>
        </div>

        {/* Mobile Mini Label underneath */}
        <div className="sm:hidden absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2 py-0.5 rounded-full bg-slate-900/90 text-white text-[9px] font-bold border border-red-500/40 whitespace-nowrap shadow-md">
          Chat AI
        </div>

      </div>
    </div>
  );
}
