"use client";

import { useActionState, useState, useRef } from "react";
// Woz Fix: Replaced LayoutPanelRight/Left with universally available PanelRight/PanelLeft
import { Upload, CheckCircle2, AlertCircle, LayoutTemplate, PanelLeft, PanelRight, AlignCenter } from "lucide-react";
import { updateHeroSettings } from "../actions";

const initialState = { success: "", error: "" };

export default function HeroForm({ initialData }: { initialData: any }) {
  const [state, formAction, isPending] = useActionState(updateHeroSettings, initialState);
  const [imagePreview, setImagePreview] = useState<string>(initialData.image_url || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert("File is too large. Please upload an image under 8MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1920; 
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const optimizedBase64 = canvas.toDataURL("image/webp", 0.85);
        setImagePreview(optimizedBase64);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Hero Section Content</h2>
        <p className="text-slate-500 mt-1">Design the first impression of your storefront.</p>
      </div>

      {state?.success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" /><span>{state.success}</span>
        </div>
      )}

      <form action={formAction} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-8">
        
        {/* Layout Engine Selector */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-4">Hero Layout Positioning</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <label className="relative flex flex-col items-center cursor-pointer rounded-lg border border-slate-200 bg-slate-50 p-4 hover:border-blue-300 transition-colors">
              <input type="radio" name="layoutStyle" value="background" className="sr-only peer" defaultChecked={initialData.layout_style === 'background'} />
              <LayoutTemplate className="w-8 h-8 text-slate-400 mb-2 peer-checked:text-blue-600" />
              <span className="text-sm font-medium text-slate-700 peer-checked:text-blue-700">Full Background</span>
              <div className="absolute -inset-px rounded-lg border-2 border-transparent peer-checked:border-blue-600 pointer-events-none"></div>
            </label>

            <label className="relative flex flex-col items-center cursor-pointer rounded-lg border border-slate-200 bg-slate-50 p-4 hover:border-blue-300 transition-colors">
              <input type="radio" name="layoutStyle" value="split-right" className="sr-only peer" defaultChecked={initialData.layout_style === 'split-right'} />
              {/* Woz Fix: Using PanelRight */}
              <PanelRight className="w-8 h-8 text-slate-400 mb-2 peer-checked:text-blue-600" />
              <span className="text-sm font-medium text-slate-700 peer-checked:text-blue-700">Image Right</span>
              <div className="absolute -inset-px rounded-lg border-2 border-transparent peer-checked:border-blue-600 pointer-events-none"></div>
            </label>

            <label className="relative flex flex-col items-center cursor-pointer rounded-lg border border-slate-200 bg-slate-50 p-4 hover:border-blue-300 transition-colors">
              <input type="radio" name="layoutStyle" value="split-left" className="sr-only peer" defaultChecked={initialData.layout_style === 'split-left'} />
              {/* Woz Fix: Using PanelLeft */}
              <PanelLeft className="w-8 h-8 text-slate-400 mb-2 peer-checked:text-blue-600" />
              <span className="text-sm font-medium text-slate-700 peer-checked:text-blue-700">Image Left</span>
              <div className="absolute -inset-px rounded-lg border-2 border-transparent peer-checked:border-blue-600 pointer-events-none"></div>
            </label>

            <label className="relative flex flex-col items-center cursor-pointer rounded-lg border border-slate-200 bg-slate-50 p-4 hover:border-blue-300 transition-colors">
              <input type="radio" name="layoutStyle" value="center" className="sr-only peer" defaultChecked={initialData.layout_style === 'center'} />
              <AlignCenter className="w-8 h-8 text-slate-400 mb-2 peer-checked:text-blue-600" />
              <span className="text-sm font-medium text-slate-700 peer-checked:text-blue-700">Centered Stack</span>
              <div className="absolute -inset-px rounded-lg border-2 border-transparent peer-checked:border-blue-600 pointer-events-none"></div>
            </label>

          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Text Overlays */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-900">Typography Settings</label>
          <div>
            <label className="block text-sm font-medium text-slate-700">Main Title Overlay</label>
            <input name="title" type="text" defaultValue={initialData.title} required className="mt-1 block w-full h-11 rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:ring-1 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Subtitle Overlay</label>
            <textarea name="subtitle" rows={3} defaultValue={initialData.subtitle} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:ring-1 sm:text-sm" />
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Dynamic Buttons */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-900">Call to Action Buttons</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
            
            {/* Primary Button */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">Primary Button (Left)</label>
              <input name="btnPrimaryText" type="text" defaultValue={initialData.btn_primary_text} placeholder="e.g. Shop Now" className="block w-full h-10 rounded-md border border-slate-300 px-3 text-sm" />
              <select name="btnPrimaryTheme" defaultValue={initialData.btn_primary_theme} className="block w-full h-10 rounded-md border border-slate-300 px-3 text-sm bg-white">
                <option value="solid-blue">Solid Blue (Modern)</option>
                <option value="solid-dark">Solid Dark (Minimalist)</option>
                <option value="solid-white">Solid White (High Contrast)</option>
              </select>
            </div>

            {/* Secondary Button */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">Secondary Button (Right)</label>
              <input name="btnSecondaryText" type="text" defaultValue={initialData.btn_secondary_text} placeholder="e.g. Learn More" className="block w-full h-10 rounded-md border border-slate-300 px-3 text-sm" />
              <select name="btnSecondaryTheme" defaultValue={initialData.btn_secondary_theme} className="block w-full h-10 rounded-md border border-slate-300 px-3 text-sm bg-white">
                <option value="outline-light">Outline Light (For Dark/Images)</option>
                <option value="outline-dark">Outline Dark (For Light Backgrounds)</option>
                <option value="ghost">Ghost (Text Only)</option>
              </select>
            </div>
            
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Image Upload */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-900">Hero Image / Background</label>
          <div className="flex flex-col gap-4">
            <input type="hidden" name="imageBase64" value={imagePreview} />
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
            
            {imagePreview ? (
              <div className="relative w-full h-64 rounded-xl border border-slate-200 overflow-hidden group">
                <img src={imagePreview} className="object-cover w-full h-full" alt="Hero Preview" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white rounded-md text-sm font-medium text-slate-900 shadow-lg">Change Image</button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full h-64 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
                <Upload className="w-8 h-8 mb-2 opacity-50" />
                <span className="font-medium">Upload Hero Image</span>
                <span className="text-xs mt-1">Recommended: 1920x1080 (Landscape)</span>
              </button>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button type="submit" disabled={isPending} className="w-full h-11 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors">
            {isPending ? "Applying changes..." : "Save Hero Content & Layout"}
          </button>
        </div>
      </form>
    </div>
  );
}