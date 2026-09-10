"use client"; // <-- Woz Correction: This tells Next.js to ship JS to the browser for this component

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-4">
            <Link href="#hero" className="inline-block">
              <span className="font-display font-black text-2xl tracking-tight text-white">
                STORE<span className="text-blue-500">.</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Premium quality products designed for modern life. Experience the difference in every detail.
            </p>
          </div>

          <div>
            <h3 className="font-display font-bold text-white mb-4 uppercase tracking-wider text-sm">Shop</h3>
            <ul className="space-y-3">
              <li><a href="#categories" className="text-sm hover:text-blue-400 transition-colors">Categories</a></li>
              <li><a href="#products" className="text-sm hover:text-blue-400 transition-colors">Featured Products</a></li>
              <li><a href="#" className="text-sm hover:text-blue-400 transition-colors">New Arrivals</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-white mb-4 uppercase tracking-wider text-sm">Support</h3>
            <ul className="space-y-3">
              <li><a href="#faqs" className="text-sm hover:text-blue-400 transition-colors">FAQs</a></li>
              <li><a href="#contact" className="text-sm hover:text-blue-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-sm hover:text-blue-400 transition-colors">Shipping & Returns</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-white mb-4 uppercase tracking-wider text-sm">Stay Updated</h3>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-slate-900 border border-slate-800 text-white text-sm rounded-md px-4 py-2 w-full h-11 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                required
              />
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 font-medium rounded-md h-11 transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {currentYear} Store Mono. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}