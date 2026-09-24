"use client";

import { useCart } from "@/lib/CartContext";
import { useState, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Truck, ShieldCheck, Tag, Loader2, MapPin, CheckCircle2, ShoppingCart, AlertCircle } from "lucide-react";
import { processCheckout } from "./actions";

export default function CheckoutPage() {
  const { cart, totalPrice, totalItems, clearCart, formatPrice } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'PAYMONGO'>('COD'); 
  const [baseUrl, setBaseUrl] = useState("");

  const [formState, formAction, isPending] = useActionState(processCheckout, undefined);

  // Woz Engine: Controlled states for Form Persistence
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [barangays, setBarangays] = useState<any[]>([]);

  const [selectedProv, setSelectedProv] = useState({ code: "", name: "" });
  const [selectedCity, setSelectedCity] = useState({ code: "", name: "" });
  const [selectedBrgy, setSelectedBrgy] = useState({ code: "", name: "" });
  const [streetAddress, setStreetAddress] = useState("");
  const [zipCode, setZipCode] = useState("");

  // 1. HYDRATION: Load Draft from LocalStorage on Mount
  useEffect(() => {
    setMounted(true);
    setBaseUrl(window.location.origin);
    
    const draft = localStorage.getItem("checkout_draft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.firstName) setFirstName(parsed.firstName);
        if (parsed.lastName) setLastName(parsed.lastName);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.streetAddress) setStreetAddress(parsed.streetAddress);
        if (parsed.zipCode) setZipCode(parsed.zipCode);
        if (parsed.selectedProv) setSelectedProv(parsed.selectedProv);
        if (parsed.selectedCity) setSelectedCity(parsed.selectedCity);
        if (parsed.selectedBrgy) setSelectedBrgy(parsed.selectedBrgy);
      } catch(e) {}
    }

    fetch('https://psgc.gitlab.io/api/provinces/')
      .then(res => res.json())
      .then(data => setProvinces(data.sort((a: any, b: any) => a.name.localeCompare(b.name))))
      .catch(err => console.error("Failed to load provinces", err));
  }, []);

  // 2. PERSISTENCE: Save Draft to LocalStorage on Change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("checkout_draft", JSON.stringify({
        firstName, lastName, email, phone, streetAddress, zipCode, 
        selectedProv, selectedCity, selectedBrgy
      }));
    }
  }, [firstName, lastName, email, phone, streetAddress, zipCode, selectedProv, selectedCity, selectedBrgy, mounted]);

  // PSGC APIs
  useEffect(() => {
    if (!selectedProv.code) return;
    fetch(`https://psgc.gitlab.io/api/provinces/${selectedProv.code}/cities-municipalities/`)
      .then(res => res.json())
      .then(data => setCities(data.sort((a: any, b: any) => a.name.localeCompare(b.name))))
      .catch(err => console.error("Failed to load cities", err));
  }, [selectedProv.code]);

  useEffect(() => {
    if (!selectedCity.code) return;
    fetch(`https://psgc.gitlab.io/api/cities-municipalities/${selectedCity.code}/barangays/`)
      .then(res => res.json())
      .then(data => setBarangays(data.sort((a: any, b: any) => a.name.localeCompare(b.name))))
      .catch(err => console.error("Failed to load barangays", err));
  }, [selectedCity.code]);

  const fullAddress = `${streetAddress}, Brgy. ${selectedBrgy.name}, ${selectedCity.name}, ${selectedProv.name}, ${zipCode}`;

  useEffect(() => {
    if (formState?.success && formState.redirectUrl) {
      if (formState.method === 'COD') {
        clearCart();
        localStorage.removeItem("checkout_draft"); // Wipe draft on success
      }
      window.location.href = formState.redirectUrl; 
    }
  }, [formState, clearCart]);

  if (!mounted) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <ShoppingCart className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
        <button onClick={() => router.push('/#products')} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 animate-in fade-in slide-in-from-bottom-4">
      <h1 className="text-3xl font-display font-black text-slate-900 mb-8 tracking-tight">Secure Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Checkout Form */}
        <div className="lg:col-span-7">
          <form action={formAction} className="space-y-8">
            
            <input type="hidden" name="cart_data" value={JSON.stringify(cart)} />
            <input type="hidden" name="payment_method" value={paymentMethod} />
            <input type="hidden" name="address" value={fullAddress} />
            <input type="hidden" name="baseUrl" value={baseUrl} />

            {formState?.error && (
              <div className="bg-red-50 text-red-700 p-5 rounded-xl border border-red-200 font-medium flex gap-3 shadow-sm">
                <AlertCircle className="w-6 h-6 shrink-0 text-red-600" />
                <div>
                  <h4 className="font-bold mb-1">Transaction Failed</h4>
                  <p className="text-sm opacity-90">{formState.error}</p>
                </div>
              </div>
            )}

            {/* 1. Contact Information */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs">1</span> 
                Contact Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">First Name</label>
                  <input name="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Last Name</label>
                  <input name="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                  <input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Mobile Number</label>
                  <input name="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
                </div>
              </div>
            </div>

            {/* 2. Advanced Shipping Address */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs">2</span> 
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Province</label>
                  <select 
                    required 
                    value={selectedProv.code} 
                    onChange={(e) => {
                      const name = e.target.options[e.target.selectedIndex].text;
                      setSelectedProv({ code: e.target.value, name });
                      setSelectedCity({ code: "", name: "" }); // Woz Fix: Reset children properly
                      setBarangays([]);
                      setSelectedBrgy({ code: "", name: "" });
                    }}
                    className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none bg-white"
                  >
                    <option value="">Select Province</option>
                    {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">City / Municipality</label>
                  <select 
                    required 
                    disabled={!selectedProv.code}
                    value={selectedCity.code} 
                    onChange={(e) => {
                      const name = e.target.options[e.target.selectedIndex].text;
                      setSelectedCity({ code: e.target.value, name });
                      setSelectedBrgy({ code: "", name: "" }); // Woz Fix: Reset children properly
                    }}
                    className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none bg-white disabled:opacity-50"
                  >
                    <option value="">Select City</option>
                    {cities.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Barangay</label>
                  <select 
                    required 
                    disabled={!selectedCity.code}
                    value={selectedBrgy.code} 
                    onChange={(e) => {
                      const name = e.target.options[e.target.selectedIndex].text;
                      setSelectedBrgy({ code: e.target.value, name });
                    }}
                    className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none bg-white disabled:opacity-50"
                  >
                    <option value="">Select Barangay</option>
                    {barangays.map(b => <option key={b.code} value={b.code}>{b.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Zip Code</label>
                  <input type="text" required value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="w-full h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Street Name, Building, House No.</label>
                  <textarea required rows={2} value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} className="w-full p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" placeholder="e.g. Unit 1202, Alpha Condominium, Rizal St." />
                </div>

                <div className="md:col-span-2 bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">
                    {selectedProv.name && selectedCity.name && selectedBrgy.name && streetAddress ? fullAddress : "Complete the fields above to verify your delivery address."}
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs">3</span> 
                Payment Method
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <label className={`relative flex cursor-pointer rounded-xl border p-4 focus:outline-none transition-all ${paymentMethod === 'PAYMONGO' ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-600' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                  <input type="radio" name="payment_choice" value="PAYMONGO" className="sr-only" checked={paymentMethod === 'PAYMONGO'} onChange={() => setPaymentMethod('PAYMONGO')} />
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="block text-sm font-bold text-slate-900 flex items-center gap-2"><CreditCard className="w-4 h-4 text-blue-600" /> Secure Online Payment</span>
                      <span className="mt-1 flex items-center text-xs text-slate-500">GCash, Maya, QR Ph, Card via PayMongo</span>
                    </span>
                  </span>
                  <CheckCircle2 className={`h-5 w-5 text-blue-600 ${paymentMethod === 'PAYMONGO' ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
                </label>

                <label className={`relative flex cursor-pointer rounded-xl border p-4 focus:outline-none transition-all ${paymentMethod === 'COD' ? 'bg-emerald-50 border-emerald-600 ring-1 ring-emerald-600' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                  <input type="radio" name="payment_choice" value="COD" className="sr-only" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="block text-sm font-bold text-slate-900 flex items-center gap-2"><Truck className="w-4 h-4 text-emerald-600" /> Cash on Delivery</span>
                      <span className="mt-1 flex items-center text-xs text-slate-500">Pay directly when your order arrives</span>
                    </span>
                  </span>
                  <CheckCircle2 className={`h-5 w-5 text-emerald-600 ${paymentMethod === 'COD' ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
                </label>

              </div>
            </div>

            <button 
              type="submit" 
              disabled={isPending || !selectedBrgy.code || !streetAddress}
              className={`w-full h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${isPending || !selectedBrgy.code || !streetAddress ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5'}`}
            >
              {isPending ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing Securely...</>
              ) : (
                <><ShieldCheck className="w-5 h-5" /> {paymentMethod === 'COD' ? 'Place Order Now' : 'Proceed to Payment'}</>
              )}
            </button>

            <p className="text-center text-xs text-slate-500 font-medium flex items-center justify-center gap-1 mt-4">
              <ShieldCheck className="w-3 h-3" /> Encrypted and Secure Checkout
            </p>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
            
            <div className="flow-root mb-6 max-h-[40vh] overflow-y-auto pr-2">
              <ul role="list" className="-my-4 divide-y divide-slate-200">
                {cart.map((item) => (
                  <li key={item.id} className="flex py-4 gap-4">
                    <div className="h-16 w-16 shrink-0 rounded-md border border-slate-200 bg-white flex items-center justify-center p-1">
                      {item.image ? <img src={item.image} alt={item.title} className="h-full w-full object-contain" /> : <Tag className="w-6 h-6 text-slate-300" />}
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <div className="flex justify-between text-sm font-semibold text-slate-900">
                        <h3 className="line-clamp-2 pr-4">{item.title}</h3>
                        <p className="font-mono">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">Qty {item.quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-slate-200 pt-6 space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <p>Subtotal ({totalItems} items)</p>
                <p className="font-mono font-medium">{formatPrice(totalPrice)}</p>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <p>Shipping</p>
                <p className="font-mono font-medium">Calculated next step</p>
              </div>
              
              <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                <p className="text-base font-bold text-slate-900">Total to Pay</p>
                <p className="text-2xl font-black text-slate-900 font-mono tracking-tight">{formatPrice(totalPrice)}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}