"use client";

import { useState, useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, UserPlus, Loader2, AlertCircle, Calendar, Check, X } from "lucide-react";
import { processRegistration } from "./actions";
import Link from "next/link";

export default function RegisterClientForm({ storeCurrency }: { storeCurrency: string }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [formState, formAction, isPending] = useActionState(processRegistration, undefined);

  // PSGC State
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [barangays, setBarangays] = useState<any[]>([]);

  const [selectedProv, setSelectedProv] = useState({ code: "", name: "" });
  const [selectedCity, setSelectedCity] = useState({ code: "", name: "" });
  const [selectedBrgy, setSelectedBrgy] = useState({ code: "", name: "" });
  
  const [streetAddress, setStreetAddress] = useState("");
  const [zipCode, setZipCode] = useState("");

  // Woz Engine: Password Real-Time State
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password Validation Logic
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isPasswordValid = hasLength && hasUpper && hasNumber && hasSpecial;
  
  const isTypingConfirm = confirmPassword.length > 0;
  const doPasswordsMatch = password !== "" && password === confirmPassword;

  const getPhonePlaceholder = () => {
    switch(storeCurrency) {
      case 'USD': return "(555) 000-0000";
      case 'PHP': return "09xx xxx xxxx";
      case 'GBP': return "+44 7xxx xxxxxx";
      case 'EUR': return "+xx xxxxxxxxx";
      default: return "Phone number";
    }
  };

  useEffect(() => {
    setMounted(true);
    fetch('https://psgc.gitlab.io/api/provinces/')
      .then(res => res.json())
      .then(data => setProvinces(data.sort((a: any, b: any) => a.name.localeCompare(b.name))))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!selectedProv.code) {
      setCities([]); setBarangays([]); setSelectedCity({ code: "", name: "" }); setSelectedBrgy({ code: "", name: "" });
      return;
    }
    fetch(`https://psgc.gitlab.io/api/provinces/${selectedProv.code}/cities-municipalities/`)
      .then(res => res.json())
      .then(data => setCities(data.sort((a: any, b: any) => a.name.localeCompare(b.name))))
      .catch(err => console.error(err));
  }, [selectedProv]);

  useEffect(() => {
    if (!selectedCity.code) {
      setBarangays([]); setSelectedBrgy({ code: "", name: "" });
      return;
    }
    fetch(`https://psgc.gitlab.io/api/cities-municipalities/${selectedCity.code}/barangays/`)
      .then(res => res.json())
      .then(data => setBarangays(data.sort((a: any, b: any) => a.name.localeCompare(b.name))))
      .catch(err => console.error(err));
  }, [selectedCity]);

  useEffect(() => {
    if (formState?.success && formState.redirectUrl) {
      router.push(formState.redirectUrl);
    }
  }, [formState, router]);

  if (!mounted) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      
      <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4">
        
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-600/20">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">Create an Account</h1>
          <p className="text-slate-500 mt-2">Save your details for faster checkouts and track your orders.</p>
        </div>

        <form action={formAction} className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          
          <input type="hidden" name="provCode" value={selectedProv.code} />
          <input type="hidden" name="provName" value={selectedProv.name} />
          <input type="hidden" name="cityCode" value={selectedCity.code} />
          <input type="hidden" name="cityName" value={selectedCity.name} />
          <input type="hidden" name="brgyCode" value={selectedBrgy.code} />
          <input type="hidden" name="brgyName" value={selectedBrgy.name} />

          {formState?.error && (
            <div className="m-6 mb-0 bg-red-50 border border-red-200 p-4 rounded-xl flex gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{formState.error}</p>
            </div>
          )}

          <div className="p-6 md:p-8 space-y-8">
            
            {/* Section 1: Personal Info */}
            <div>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">First Name</label>
                  <input type="text" name="firstName" required autoFocus className="w-full h-11 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Last Name</label>
                  <input type="text" name="lastName" required className="w-full h-11 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Birthdate</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="date" name="birthdate" required className="w-full h-11 pl-10 pr-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none transition-all text-slate-700" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Mobile Number</label>
                  <input type="tel" name="phone" required placeholder={getPhonePlaceholder()} className="w-full h-11 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                </div>
              </div>
            </div>

            {/* Section 2: Account Security */}
            <div>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Account Security</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                  <input type="email" name="email" required className="w-full h-11 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                </div>
                
                {/* Woz Engine: Real-time Password Complexity Checker */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Secure Password</label>
                  <input 
                    type="password" 
                    name="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    className="w-full h-11 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none transition-all" 
                    placeholder="Create a password" 
                  />
                  <div className="mt-2 space-y-1">
                    <p className={`text-xs flex items-center gap-1 ${hasLength ? 'text-emerald-600 font-medium' : 'text-slate-500'}`}>
                      <Check className={`w-3.5 h-3.5 ${hasLength ? 'opacity-100' : 'opacity-30'}`} /> At least 8 characters
                    </p>
                    <p className={`text-xs flex items-center gap-1 ${hasUpper ? 'text-emerald-600 font-medium' : 'text-slate-500'}`}>
                      <Check className={`w-3.5 h-3.5 ${hasUpper ? 'opacity-100' : 'opacity-30'}`} /> One uppercase letter
                    </p>
                    <p className={`text-xs flex items-center gap-1 ${hasNumber ? 'text-emerald-600 font-medium' : 'text-slate-500'}`}>
                      <Check className={`w-3.5 h-3.5 ${hasNumber ? 'opacity-100' : 'opacity-30'}`} /> One number
                    </p>
                    <p className={`text-xs flex items-center gap-1 ${hasSpecial ? 'text-emerald-600 font-medium' : 'text-slate-500'}`}>
                      <Check className={`w-3.5 h-3.5 ${hasSpecial ? 'opacity-100' : 'opacity-30'}`} /> One special symbol (@, #, $ etc.)
                    </p>
                  </div>
                </div>
                
                {/* Woz Engine: Real-time Match Checker */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-semibold text-slate-700">Confirm Password</label>
                    {isTypingConfirm && (
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${doPasswordsMatch ? 'text-emerald-600' : 'text-red-500'}`}>
                        {doPasswordsMatch ? 'Matches' : 'Does not match'}
                      </span>
                    )}
                  </div>
                  <input 
                    type="password" 
                    name="confirmPassword" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                    className={`w-full h-11 px-3 rounded-lg border outline-none transition-all ${isTypingConfirm ? (doPasswordsMatch ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-500' : 'border-red-400 focus:ring-2 focus:ring-red-500') : 'border-slate-300 focus:ring-2 focus:ring-blue-600'}`} 
                    placeholder="Retype password" 
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Default Shipping Address */}
            <div>
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Default Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Province</label>
                  <select required value={selectedProv.code} onChange={(e) => {
                      setSelectedProv({ code: e.target.value, name: e.target.options[e.target.selectedIndex].text });
                      setSelectedCity({ code: "", name: "" }); setBarangays([]); setSelectedBrgy({ code: "", name: "" });
                    }}
                    className="w-full h-11 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none bg-white"
                  >
                    <option value="">Select Province</option>
                    {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">City / Municipality</label>
                  <select required disabled={!selectedProv.code} value={selectedCity.code} onChange={(e) => {
                      setSelectedCity({ code: e.target.value, name: e.target.options[e.target.selectedIndex].text });
                      setSelectedBrgy({ code: "", name: "" });
                    }}
                    className="w-full h-11 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none bg-white disabled:opacity-50"
                  >
                    <option value="">Select City</option>
                    {cities.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Barangay</label>
                  <select required disabled={!selectedCity.code} value={selectedBrgy.code} onChange={(e) => {
                      setSelectedBrgy({ code: e.target.value, name: e.target.options[e.target.selectedIndex].text });
                    }}
                    className="w-full h-11 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none bg-white disabled:opacity-50"
                  >
                    <option value="">Select Barangay</option>
                    {barangays.map(b => <option key={b.code} value={b.code}>{b.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Zip Code</label>
                  <input type="text" name="zipCode" required value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="w-full h-11 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Street Name, Building, House No.</label>
                  <textarea name="streetAddress" required rows={2} value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none transition-all resize-none" placeholder="e.g. Unit 1202, Alpha Condominium, Rizal St." />
                </div>
              </div>
            </div>

          </div>

          <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-200">
            {/* Woz Guard: Button disabled unless ALL password rules AND fields are met */}
            <button 
              type="submit" 
              disabled={isPending || !selectedBrgy.code || !streetAddress || !isPasswordValid || !doPasswordsMatch}
              className={`w-full h-12 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-md ${isPending || !selectedBrgy.code || !streetAddress || !isPasswordValid || !doPasswordsMatch ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'}`}
            >
              {isPending ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating Account...</> : <><ShieldCheck className="w-5 h-5" /> Securely Register Account</>}
            </button>
            <p className="text-center mt-4 text-sm text-slate-600">
              Already have an account? <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700">Log in here</Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}