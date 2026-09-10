"use client";

import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative w-full max-w-sm hidden md:flex items-center">
      <input
        type="text"
        placeholder="Search products..."
        className="w-full h-10 pl-10 pr-4 rounded-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm outline-none"
      />
      <Search className="absolute left-3 text-slate-400 w-4 h-4" />
    </div>
  );
}