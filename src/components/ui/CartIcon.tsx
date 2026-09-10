"use client";

import { ShoppingCart } from "lucide-react";

export default function CartIcon({ itemCount = 3 }: { itemCount?: number }) {
  return (
    <button 
      className="relative p-2 rounded-full hover:bg-slate-100 transition-colors flex items-center justify-center min-w-11 min-h-11"
      aria-label="Open Cart"
    >
      <ShoppingCart className="w-5 h-5 text-slate-900" />
      {itemCount > 0 && (
        <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-600 rounded-full border-2 border-white">
          {itemCount}
        </span>
      )}
    </button>
  );
}