"use client";

import { useActionState, useState, useRef } from "react";
import { Upload, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { updateNavbarSettings } from "./actions";

const initialState = { success: "", error: "" };

export default function ContentForm({ initialData }: { initialData: any }) {
  const [state, formAction, isPending] = useActionState(updateNavbarSettings, initialState);
  const [logoPreview, setLogoPreview] = useState<string>(initialData.logo_url || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Please upload an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_HEIGHT = 100;
        let width = img.width;
        let height = img.height;

        if (height > MAX_HEIGHT) {
          width = Math.round((width * MAX_HEIGHT) / height);
          height = MAX_HEIGHT;
        }

        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, width, height);
        ctx?.drawImage(img, 0, 0, width, height);

        const optimizedBase64 = canvas.toDataURL("image/webp", 0.9);
        setLogoPreview(optimizedBase64);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Navigation Bar Settings</h2>
        <p className="text-slate-500 mt-1">Configure your public storefront branding, colors, and typography.</p>
      </div>

      {state?.success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{state.success}</span>
        </div>
      )}
      
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <form action={formAction} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-8">
        
        {/* Logo Upload Section */}
        <div className="space-y-4">
          <label className="block text-base font-semibold text-slate-900">Company Logo (Optional)</label>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 items-start">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 leading-relaxed">
              <strong>Design Recommendation:</strong> Please upload an image with a <strong>transparent background</strong> (PNG or WEBP).
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <div className="w-32 h-20 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center bg-[url('https://transparenttextures.com/patterns/cubes.png')] bg-slate-100 overflow-hidden relative shadow-inner">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo Preview" className="object-contain w-full h-full p-2" />
              ) : (
                <span className="text-xs text-slate-400 font-medium px-2">No Logo</span>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <input type="hidden" name="logoBase64" value={logoPreview} />
              <input type="file" accept="image/png, image/webp, image/svg+xml" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 px-4 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors text-sm font-medium w-fit border border-slate-200"
              >
                <Upload className="w-4 h-4" />
                Upload Transparent Logo
              </button>
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Text & Typography Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-slate-700">Company Name (Fallback Text)</label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              defaultValue={initialData.company_name}
              required
              className="mt-1 block w-full h-11 rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="fontKey" className="block text-sm font-medium text-slate-700">Fallback Font Style</label>
            <select
              id="fontKey"
              name="fontKey"
              defaultValue={initialData.font_key}
              className="mt-1 block w-full h-11 rounded-md border border-slate-300 px-3 py-2 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            >
              <option value="display">Montserrat (Bold & Modern)</option>
              <option value="sans">Inter (Clean & Minimal)</option>
              <option value="serif">Serif (Luxury & Editorial)</option>
              <option value="mono">Mono (Tech & Brutalist)</option>
            </select>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Theme Settings */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Navbar Theme (Colors & Gradients)</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <label className="relative flex cursor-pointer rounded-lg border border-slate-200 bg-white p-4 shadow-sm focus:outline-none hover:border-blue-300 transition-colors">
              <input type="radio" name="themeKey" value="light" className="sr-only peer" defaultChecked={initialData.theme_key === 'light'} />
              <div className="w-full">
                <div className="w-full h-8 rounded bg-white border border-slate-200 mb-2"></div>
                <span className="text-sm font-medium text-slate-900">Pristine Light</span>
              </div>
              <div className="absolute -inset-px rounded-lg border-2 border-transparent peer-checked:border-blue-600 pointer-events-none"></div>
            </label>

            <label className="relative flex cursor-pointer rounded-lg border border-slate-200 bg-white p-4 shadow-sm focus:outline-none hover:border-blue-300 transition-colors">
              <input type="radio" name="themeKey" value="dark" className="sr-only peer" defaultChecked={initialData.theme_key === 'dark'} />
              <div className="w-full">
                <div className="w-full h-8 rounded bg-slate-950 border border-slate-800 mb-2"></div>
                <span className="text-sm font-medium text-slate-900">Midnight Dark</span>
              </div>
              <div className="absolute -inset-px rounded-lg border-2 border-transparent peer-checked:border-blue-600 pointer-events-none"></div>
            </label>

            <label className="relative flex cursor-pointer rounded-lg border border-slate-200 bg-white p-4 shadow-sm focus:outline-none hover:border-blue-300 transition-colors">
              <input type="radio" name="themeKey" value="gradient-blue" className="sr-only peer" defaultChecked={initialData.theme_key === 'gradient-blue'} />
              <div className="w-full">
                {/* Woz Fix: Changed bg-gradient-to-r to Canonical bg-linear-to-r */}
                <div className="w-full h-8 rounded bg-linear-to-r from-blue-700 to-indigo-900 mb-2 border border-blue-800"></div>
                <span className="text-sm font-medium text-slate-900">Ocean Gradient</span>
              </div>
              <div className="absolute -inset-px rounded-lg border-2 border-transparent peer-checked:border-blue-600 pointer-events-none"></div>
            </label>

          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-11 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isPending ? "Saving configuration..." : "Save Navigation Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}