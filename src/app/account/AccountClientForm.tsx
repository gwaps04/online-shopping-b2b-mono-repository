"use client";

import { useState, useTransition } from "react";
import { 
  User, Mail, Phone, Calendar, MapPin, ShieldCheck, 
  CheckCircle2, AlertCircle, Save, Package, Lock, 
  Building, Home, Check, Loader2, ExternalLink
} from "lucide-react";
import { updateUserProfile } from "@/app/actions/profile";

export interface UserProfile {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birthdate: string;
  address_province: string;
  address_province_code: string;
  address_city: string;
  address_city_code: string;
  address_barangay: string;
  address_barangay_code: string;
  address_zip: string;
  address_street: string;
  is_verified: boolean;
}

export default function AccountClientForm({ initialUser }: { initialUser: UserProfile }) {
  const [formData, setFormData] = useState<UserProfile>(initialUser);
  const [activeTab, setActiveTab] = useState<"profile" | "address" | "security">("profile");
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    startTransition(async () => {
      try {
        const result = await updateUserProfile(formData);
        if (result.success) {
          setStatusMessage({ type: "success", text: "Profile and shipping address updated in Neon!" });
        } else {
          setStatusMessage({ type: "error", text: result.error || "Failed to update profile." });
        }
      } catch (err: any) {
        setStatusMessage({ type: "error", text: err.message || "An unexpected error occurred." });
      }
    });
  };

  const initials = `${formData.first_name?.[0] || ""}${formData.last_name?.[0] || ""}`.toUpperCase() || "U";

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header Profile Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl font-bold tracking-tight shadow-md">
              {initials}
            </div>
            {formData.is_verified && (
              <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-white rounded-full ring-2 ring-white">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">{formData.first_name} {formData.last_name}</h1>
              {formData.is_verified ? (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Verified
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  Unverified
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
              <Mail className="w-4 h-4 text-slate-400" /> {formData.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-sm transition-all disabled:opacity-50 cursor-pointer"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div className={`p-4 rounded-xl text-sm flex items-center gap-3 border ${
          statusMessage.type === "success" 
            ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
            : "bg-red-50 border-red-200 text-red-800"
        }`}>
          {statusMessage.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span className="font-medium">{statusMessage.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === "profile" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Personal Details
        </button>
        <button
          onClick={() => setActiveTab("address")}
          className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === "address" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Shipping Address (PSGC)
        </button>
      </div>

      {/* Form Details */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">First Name</label>
              <input
                type="text"
                required
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Last Name</label>
              <input
                type="text"
                required
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Email (Locked)</label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Phone Number</label>
              <input
                type="tel"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+63 917 123 4567"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Birthdate</label>
              <input
                type="date"
                value={formData.birthdate || ""}
                onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
              />
            </div>
          </div>
        )}

        {activeTab === "address" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Province</label>
                <input
                  type="text"
                  value={formData.address_province || ""}
                  onChange={(e) => setFormData({ ...formData, address_province: e.target.value })}
                  placeholder="e.g. Metro Manila"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">City / Municipality</label>
                <input
                  type="text"
                  value={formData.address_city || ""}
                  onChange={(e) => setFormData({ ...formData, address_city: e.target.value })}
                  placeholder="e.g. Quezon City"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Barangay</label>
                <input
                  type="text"
                  value={formData.address_barangay || ""}
                  onChange={(e) => setFormData({ ...formData, address_barangay: e.target.value })}
                  placeholder="e.g. Batasan Hills"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">ZIP Code</label>
                <input
                  type="text"
                  value={formData.address_zip || ""}
                  onChange={(e) => setFormData({ ...formData, address_zip: e.target.value })}
                  placeholder="e.g. 1100"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Street Address / House / Unit</label>
              <input
                type="text"
                value={formData.address_street || ""}
                onChange={(e) => setFormData({ ...formData, address_street: e.target.value })}
                placeholder="e.g. Unit 402 Pine Crest, Aurora Blvd"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-colors cursor-pointer"
          >
            {isPending ? "Saving..." : "Save Profile Details"}
          </button>
        </div>
      </form>
    </div>
  );
}