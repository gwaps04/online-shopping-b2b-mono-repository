"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { verifyOrderPayment } from '../actions';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!orderId) {
      setStatus('error');
      setErrorMsg("No order reference found.");
      return;
    }

    // Woz Engine: Hit the server to verify the PayMongo transaction status!
    verifyOrderPayment(orderId).then(res => {
      if (res?.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMsg(res?.error || "Payment verification failed.");
      }
    });
  }, [orderId]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
          <div className="relative bg-white rounded-full p-4 border border-blue-100 shadow-xl">
             <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Verifying Payment...</h2>
          <p className="text-slate-500 mt-2">Please wait while we securely confirm your transaction.</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 text-center animate-in fade-in zoom-in">
        <div className="bg-red-50 rounded-full p-4 border border-red-100 shadow-sm">
           <AlertCircle className="w-12 h-12 text-red-600" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Payment Verification Failed</h2>
          <p className="text-slate-500 mt-2 max-w-md">{errorMsg}</p>
        </div>
        <Link href="/checkout" className="mt-4 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
          Return to Checkout
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-8 text-center animate-in fade-in zoom-in slide-in-from-bottom-4 duration-700">
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-100 rounded-full animate-pulse scale-150 opacity-50"></div>
        <div className="relative bg-emerald-500 rounded-full p-5 shadow-2xl shadow-emerald-500/30 text-white">
           <CheckCircle2 className="w-16 h-16" />
        </div>
      </div>
      
      <div>
        <h1 className="text-4xl font-display font-black text-slate-900 tracking-tight mb-3">Order Confirmed!</h1>
        <p className="text-lg text-slate-600 max-w-md mx-auto">
          Thank you for your purchase. We have received your order and payment successfully. A receipt has been sent to your email.
        </p>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 w-full max-w-sm flex items-center justify-between">
         <span className="text-slate-500 font-medium">Order Reference:</span>
         <span className="font-mono font-bold text-slate-900">{orderId?.split('-')[0].toUpperCase()}</span>
      </div>

      <Link href="/" className="group flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl">
        <ShoppingBag className="w-5 h-5" /> Continue Shopping
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50/50">
      <Suspense fallback={<Loader2 className="animate-spin text-slate-300 w-12 h-12" />}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}