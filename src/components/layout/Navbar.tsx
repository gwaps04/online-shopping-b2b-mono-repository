"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { Menu, X, Trash2, Plus, Minus, ShoppingBag, Tag } from "lucide-react";
import SearchBar from "@/components/ui/SearchBar";
import CartIcon from "@/components/ui/CartIcon";
import { useCart } from "@/lib/CartContext";

const THEME_DICTIONARY: Record<string, { bg: string, text: string, hover: string }> = {
  "light": { bg: "bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm", text: "text-slate-900", hover: "hover:text-blue-600" },
  "dark": { bg: "bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-sm", text: "text-white", hover: "hover:text-blue-400" },
  "gradient-blue": { bg: "bg-linear-to-r from-blue-700/95 to-indigo-900/95 backdrop-blur-md border-b border-blue-800 shadow-md", text: "text-white", hover: "hover:text-blue-200" }
};

const FONT_DICTIONARY: Record<string, string> = {
  "display": "font-display font-black tracking-tight",
  "sans": "font-sans font-bold tracking-normal",
  "serif": "font-serif font-bold italic tracking-wide",
  "mono": "font-mono font-bold tracking-tighter uppercase",
};

const NAV_LINKS = [
  { name: "Home", href: "/#hero" },
  { name: "Categories", href: "/#categories" },
  { name: "Products", href: "/#products" },
  { name: "About Us", href: "/#about" },
  { name: "FAQs", href: "/#faqs" },
  { name: "Contact", href: "/#contact" },
];

export default function Navbar({ settings }: { settings: any }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter(); 
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  // Woz Fix: Destructure the dynamic formatting tool
  const { cart, removeFromCart, updateQuantity, totalPrice, formatPrice } = useCart();

  const activeTheme = THEME_DICTIONARY[settings?.theme_key] || THEME_DICTIONARY["light"];
  const fontFamily = FONT_DICTIONARY[settings?.font_key] || FONT_DICTIONARY["display"];
  const companyName = settings?.company_name || "STORE.";
  const logoUrl = settings?.logo_url;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false); 
    router.push("/checkout"); 
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${activeTheme.bg}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            
            <Link href="/#hero" className="shrink-0 flex items-center gap-3 min-w-11 min-h-11 max-w-[50vw] sm:max-w-none group">
              {logoUrl && <img src={logoUrl} alt="Logo" className="h-9 sm:h-10 w-auto object-contain shrink-0 group-hover:opacity-90 transition-opacity" />}
              {companyName && (
                <span className={`${fontFamily} text-lg sm:text-2xl ${activeTheme.text} truncate`}>
                  {companyName}<span className={settings?.theme_key === "light" ? "text-blue-600" : "text-blue-400"}>.</span>
                </span>
              )}
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <a key={link.name} href={link.href} className={`text-sm font-medium ${activeTheme.text} ${activeTheme.hover} transition-colors py-2`}>
                  {link.name}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <SearchBar />
              
              <CartIcon onClick={() => setIsCartOpen(true)} />
              
              <button
                className={`lg:hidden p-2 ${activeTheme.text} hover:bg-slate-500/10 rounded-md min-w-11 min-h-11 flex items-center justify-center`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className={`lg:hidden ${activeTheme.bg} absolute w-full`}>
            <nav className="flex flex-col px-4 py-4 space-y-2">
              {NAV_LINKS.map((link) => (
                <a key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className={`block px-4 py-3 text-base font-medium ${activeTheme.text} ${activeTheme.hover} hover:bg-slate-500/10 rounded-lg min-h-11`}>
                  {link.name}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} aria-hidden="true" />

          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="pointer-events-auto w-screen max-w-md transform transition-transform duration-500 ease-in-out">
              <div className="flex h-full flex-col bg-white shadow-2xl">
                
                <div className="flex items-start justify-between p-6 border-b border-slate-100">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" /> Your Cart
                  </h2>
                  <button onClick={() => setIsCartOpen(false)} className="rounded-md text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-6">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full opacity-50 space-y-4">
                      <ShoppingBag className="w-16 h-16 text-slate-300" />
                      <p className="text-lg font-medium text-slate-500">Your cart is empty.</p>
                    </div>
                  ) : (
                    <ul role="list" className="-my-6 divide-y divide-slate-100">
                      {cart.map((item) => (
                        <li key={item.id} className="flex py-6">
                          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center p-2">
                            {item.image ? <img src={item.image} alt={item.title} className="h-full w-full object-contain object-center" /> : <Tag className="w-8 h-8 text-slate-300" />}
                          </div>

                          <div className="ml-4 flex flex-1 flex-col justify-between">
                            <div>
                              <div className="flex justify-between text-base font-semibold text-slate-900">
                                <h3><Link href={`/product/${item.slug}`} onClick={() => setIsCartOpen(false)} className="hover:text-blue-600 transition-colors">{item.title}</Link></h3>
                                {/* Woz Dynamic Currency Render */}
                                <p className="ml-4 font-mono">{formatPrice(item.price * item.quantity)}</p>
                              </div>
                            </div>
                            
                            <div className="flex flex-1 items-end justify-between text-sm">
                              <div className="flex items-center border border-slate-200 rounded-md bg-slate-50">
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-slate-200 text-slate-600 transition-colors"><Minus className="w-4 h-4" /></button>
                                <span className="w-8 text-center font-semibold text-slate-900">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= 10} className="p-1 hover:bg-slate-200 text-slate-600 transition-colors disabled:opacity-50"><Plus className="w-4 h-4" /></button>
                              </div>

                              <button type="button" onClick={() => removeFromCart(item.id)} className="font-medium text-red-600 hover:text-red-500 p-2 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1">
                                <Trash2 className="w-4 h-4" /> Remove
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="border-t border-slate-100 px-6 py-6 sm:px-6 bg-slate-50">
                    <div className="flex justify-between text-lg font-bold text-slate-900 mb-2">
                      <p>Subtotal</p>
                      {/* Woz Dynamic Currency Render */}
                      <p className="font-mono">{formatPrice(totalPrice)}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-slate-500 mb-6">Shipping and taxes calculated at checkout.</p>
                    <div className="mt-6">
                      <button 
                        onClick={handleProceedToCheckout}
                        className="flex w-full items-center justify-center rounded-md border border-transparent bg-slate-900 px-6 py-4 text-base font-bold text-white shadow-sm hover:bg-slate-800 transition-colors"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                    <div className="mt-6 flex justify-center text-center text-sm text-slate-500">
                      <p>
                        or{' '}
                        <button type="button" onClick={() => setIsCartOpen(false)} className="font-medium text-blue-600 hover:text-blue-500">
                          Continue Shopping <span aria-hidden="true"> &rarr;</span>
                        </button>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}