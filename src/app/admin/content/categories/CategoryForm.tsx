"use client";

import { useActionState, useState, useRef } from "react";
import { Upload, CheckCircle2, AlertCircle, Armchair, Zap, Home, Gift, Laptop, Shirt, ShoppingBag, Dumbbell } from "lucide-react";
import { createCategory } from "./actions";

const initialState = { success: "", error: "" };

// Woz Semantic Icon Dictionary
const AVAILABLE_ICONS = [
  { id: "ShoppingBag", label: "Generic", component: ShoppingBag },
  { id: "Laptop", label: "Electronics", component: Laptop },
  { id: "Armchair", label: "Furniture", component: Armchair },
  { id: "Zap", label: "Electrical", component: Zap },
  { id: "Home", label: "Homecare", component: Home },
  { id: "Gift", label: "Gifts", component: Gift },
  { id: "Shirt", label: "Apparel", component: Shirt },
  { id: "Dumbbell", label: "Fitness", component: Dumbbell },
];

export default function CategoryForm({ existingCategories }: { existingCategories: any[] }) {
  const [state, formAction, isPending] = useActionState(createCategory, initialState);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate URL slug from Name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slugInput = document.getElementById("slug") as HTMLInputElement;
    if (slugInput && !slugInput.value) {
      slugInput.value = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert("File is too large. Max 3MB for category thumbnails.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 600; // Categories don't need massive images
        let width = img.width;
        let height = img.height;

        if (width > height && width > MAX_SIZE) {
          height = Math.round((height * MAX_SIZE) / width);
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width = Math.round((width * MAX_SIZE) / height);
          height = MAX_SIZE;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        setImagePreview(canvas.toDataURL("image/webp", 0.8));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Add New Category</h2>
        <p className="text-slate-500 mt-1">Create product groupings and structural hierarchies.</p>
      </div>

      {state?.success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" /><span>{state.success}</span>
        </div>
      )}
      
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" /><span>{state.error}</span>
        </div>
      )}

      <form action={formAction} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Relational Data */}
        <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-4">Category Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">Category Name</label>
              <input id="name" name="name" type="text" required onChange={handleNameChange} className="mt-1 block w-full h-11 rounded-md border border-slate-300 px-3 text-sm focus:ring-1 focus:ring-blue-500" placeholder="e.g. Smart Home" />
            </div>
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-slate-700">URL Slug (Unique)</label>
              <input id="slug" name="slug" type="text" required className="mt-1 block w-full h-11 rounded-md border border-slate-300 px-3 text-sm focus:ring-1 focus:ring-blue-500 bg-slate-50" placeholder="e.g. smart-home" />
            </div>
          </div>

          <div>
            <label htmlFor="parentId" className="block text-sm font-medium text-slate-700">Parent Category</label>
            <select id="parentId" name="parentId" className="mt-1 block w-full h-11 rounded-md border border-slate-300 px-3 text-sm bg-white focus:ring-1 focus:ring-blue-500">
              <option value="">None (Make this a Top-Level Category)</option>
              {existingCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <p className="mt-2 text-xs text-slate-500">Nesting categories allows you to build drop-down menus.</p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
            <textarea id="description" name="description" rows={4} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500" placeholder="Brief description for SEO and category headers." />
          </div>
        </div>

        {/* Right Column: Media Assets */}
        <div className="space-y-6">
          
          {/* Image Upload */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Thumbnail Image</h3>
            <div className="flex flex-col gap-4">
              <input type="hidden" name="imageBase64" value={imagePreview} />
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
              
              {imagePreview ? (
                <div className="relative w-full aspect-square rounded-lg border border-slate-200 overflow-hidden group">
                  <img src={imagePreview} className="object-cover w-full h-full" alt="Preview" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white rounded-md text-sm font-medium text-slate-900 shadow-lg">Change</button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full aspect-square border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
                  <Upload className="w-6 h-6 mb-2 opacity-50" />
                  <span className="text-sm font-medium">Upload Image</span>
                </button>
              )}
            </div>
          </div>

          {/* Icon Picker */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Fallback Icon</h3>
            <p className="text-xs text-slate-500 mb-3">Used in menus if no image is provided.</p>
            
            <div className="grid grid-cols-4 gap-2">
              {AVAILABLE_ICONS.map((iconData) => {
                const IconComponent = iconData.component;
                return (
                  <label key={iconData.id} className="relative flex flex-col items-center justify-center cursor-pointer rounded-lg border border-slate-200 bg-slate-50 aspect-square hover:border-blue-300 transition-colors group">
                    <input type="radio" name="iconName" value={iconData.id} className="sr-only peer" defaultChecked={iconData.id === "ShoppingBag"} />
                    <IconComponent className="w-6 h-6 text-slate-400 group-hover:text-blue-500 peer-checked:text-blue-600 transition-colors" />
                    <span className="text-[10px] font-medium text-slate-500 mt-1 truncate w-full text-center px-1 peer-checked:text-blue-700">{iconData.label}</span>
                    <div className="absolute -inset-px rounded-lg border-2 border-transparent peer-checked:border-blue-600 pointer-events-none"></div>
                  </label>
                );
              })}
            </div>
          </div>

        </div>

        <div className="lg:col-span-3 pt-4 border-t border-slate-200">
          <button type="submit" disabled={isPending} className="w-full h-12 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors">
            {isPending ? "Creating Category..." : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
}