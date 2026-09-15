"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useEffect, useState } from "react";

export default function CartIcon({ onClick }: { onClick?: () => void }) {
  const { totalItems } = useCart();
  const [mounted, setMounted] = useState(false);
  const [isBumping, setIsBumping] = useState(false);

  // Next.js Hydration guard
  useEffect(() => setMounted(true), []);

  // Woz UX: Animate the cart icon when items are added
  useEffect(() => {
    if (totalItems > 0 && mounted) {
      setIsBumping(true);
      const timer = setTimeout(() => setIsBumping(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems, mounted]);

  if (!mounted) return (
    <button className="relative p-2 rounded-full flex items-center justify-center min-w-11 min-h-11 opacity-50"><ShoppingCart className="w-5 h-5" /></button>
  );

  return (
    <button 
      onClick={onClick}
      className={`relative p-2 rounded-full hover:bg-slate-100 transition-all duration-300 flex items-center justify-center min-w-11 min-h-11 ${isBumping ? 'scale-110 bg-slate-100' : 'scale-100'}`}
      aria-label="Open Cart"
    >
      <ShoppingCart className="w-5 h-5 text-slate-900" />
      {totalItems > 0 && (
        <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-red-600 rounded-full border-2 border-white shadow-sm">
          {totalItems}
        </span>
      )}
    </button>
  );
}