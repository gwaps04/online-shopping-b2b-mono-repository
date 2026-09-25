"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { 
  Menu, X, Trash2, Plus, Minus, ShoppingBag, Tag, 
  User, Settings, LogOut, Package, ChevronDown, 
  AlertCircle, ExternalLink 
} from "lucide-react";
import SearchBar from "@/components/ui/SearchBar";
import CartIcon from "@/components/ui/CartIcon";
import { useCart } from "@/lib/CartContext";
import { logoutUser } from "@/app/actions/auth";

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
];

export default function Navbar({ settings, isLoggedIn = false, firstName = "" }: { settings: any, isLoggedIn?: boolean, firstName?: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter(); 
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart, removeFromCart, updateQuantity, totalPrice, formatPrice } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeTheme = THEME_DICTIONARY[settings?.theme_key] || THEME_DICTIONARY["light"];
  const fontFamily = FONT_DICTIONARY[settings?.font_key] || FONT_DICTIONARY["display"];
  const companyName = settings?.company_name || "STORE.";
  const logoUrl = settings?.logo_url;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
              
              {isLoggedIn ? (
                <div className="relative hidden sm:block" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`flex items-center gap-2 p-2 px-3 text-emerald-700 hover:bg-emerald-500/10 rounded-lg transition-colors border border-transparent ${isUserMenuOpen ? 'bg-emerald-500/10 border-emerald-500/20' : ''}`}
                    aria-expanded={isUserMenuOpen}
                  >
                    <User className="w-5 h-5 fill-emerald-600/20 text-emerald-600" />
                    <span className="text-sm font-bold truncate max-w-[100px]">Hi, {firstName}</span>
                    <ChevronDown className={`w-4 h-4 text-emerald-600 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-slate-100 mb-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account</p>
                      </div>
                      
                      {/* OPENS MY PROFILE IN A NEW TAB */}
                      <Link 
                        href="/account" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => setIsUserMenuOpen(false)} 
                        className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors group"
                      >
                        <span className="flex items-center gap-3">
                          <User className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" /> 
                          My Profile
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                      </Link>

                      <Link href="/orders" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                        <Package className="w-4 h-4 text-slate-400" /> My Orders
                      </Link>
                      <Link href="/settings" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                        <Settings className="w-4 h-4 text-slate-400" /> Settings
                      </Link>
                      <div className="border-t border-slate-100 my-1"></div>
                      <form action={logoutUser}>
                        <button type="submit" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className={`p-2 ${activeTheme.text} ${activeTheme.hover} hover:bg-slate-500/10 rounded-md transition-colors hidden sm:flex items-center gap-2`}
                  title="Sign In / Register"
                >
                  <User className="w-5 h-5" />
                </Link>
              )}
              
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

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className={`lg:hidden ${activeTheme.bg} absolute w-full shadow-xl border-b border-slate-200 max-h-[calc(100vh-4.5rem)] overflow-y-auto`}>
            <nav className="flex flex-col px-4 py-4 space-y-2">
              {NAV_LINKS.map((link) => (
                <a key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className={`block px-4 py-3 text-base font-medium ${activeTheme.text} ${activeTheme.hover} hover:bg-slate-500/10 rounded-lg min-h-11`}>
                  {link.name}
                </a>
              ))}
              
              <div className="pt-4 mt-2 border-t border-slate-200/20">
                {isLoggedIn ? (
                  <div className="flex flex-col space-y-1 bg-slate-50/50 p-2 rounded-xl">
                    <div className="px-3 py-2 mb-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Logged in as</p>
                      <p className="text-lg font-bold text-emerald-700 truncate">Hi, {firstName}</p>
                    </div>

                    {/* OPENS MY PROFILE IN A NEW TAB ON MOBILE */}
                    <Link 
                      href="/account" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="flex items-center justify-between px-3 py-3 text-base font-bold text-slate-700 hover:bg-slate-200/50 rounded-lg"
                    >
                      <span className="flex items-center gap-3">
                        <User className="w-5 h-5 text-slate-400" /> My Profile
                      </span>
                      <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        New Tab <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    </Link>

                    <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-base font-bold text-slate-700 hover:bg-slate-200/50 rounded-lg">
                      <Package className="w-5 h-5 text-slate-400" /> My Orders
                    </Link>
                    <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-base font-bold text-slate-700 hover:bg-slate-200/50 rounded-lg">
                      <Settings className="w-5 h-5 text-slate-400" /> Settings
                    </Link>
                    <form action={logoutUser} className="w-full mt-2">
                      <button type="submit" className="w-full flex items-center gap-3 px-3 py-3 text-base font-bold text-red-600 hover:bg-red-100 rounded-lg border border-red-100">
                        <LogOut className="w-5 h-5" /> Sign Out
                      </button>
                    </form>
                  </div>
                ) : (
                  <Link 
                    href="/login" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 text-base font-bold ${activeTheme.text} ${activeTheme.hover} hover:bg-slate-500/10 rounded-lg min-h-11`}
                  >
                    <User className="w-5 h-5" />
                    Sign In / Create Account
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}