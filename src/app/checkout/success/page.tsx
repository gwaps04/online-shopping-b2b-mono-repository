"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200 max-w-lg w-full text-center animate-in fade-in slide-in-from-bottom-4">
        
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>

        <h1 className="text-3xl font-display font-black text-slate-900 mb-2 tracking-tight">Order Confirmed!</h1>
        <p className="text-slate-600 mb-8">Thank you for your purchase. Your order has been successfully placed and is now being processed.</p>

        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 text-left mb-8 space-y-4">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Order Reference</p>
            <p className="font-mono text-sm font-semibold text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-md break-all">
              {orderId || "Processing..."}
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm font-medium text-slate-700 bg-emerald-50 text-emerald-800 p-3 rounded-md border border-emerald-100">
             <Truck className="w-5 h-5 shrink-0" />
             <span>Payment Method: <strong>Cash on Delivery (COD)</strong></span>
          </div>
        </div>

        <Link href="/#products" className="inline-flex items-center justify-center gap-2 w-full h-12 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-sm">
          <ShoppingBag className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>
    </div>
  );
}