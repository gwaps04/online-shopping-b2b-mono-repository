"use client";

import { useActionState, useState, useRef } from "react";
import { Upload, CheckCircle2, AlertCircle, Armchair, Zap, Home, Gift, Laptop, Shirt, ShoppingBag, Dumbbell, Pencil, Trash2, Plus } from "lucide-react";
import { saveCategory, deleteCategory, updateCategorySettings } from "./actions";

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

const PRESET_GRADIENTS = [
  { label: "Ocean", value: "linear-gradient(to right, #1e3a8a, #312e81)" },
  { label: "Sunset", value: "linear-gradient(to right, #ea580c, #b91c1c)" },
  { label: "Soft Light", value: "linear-gradient(to right, #f8fafc, #e2e8f0)" },
];

export default function CategoryDashboard({ categories, settings }: { categories: any[], settings: any }) {
  // Tabs: 'list', 'form', 'style'
  const [activeTab, setActiveTab] = useState<'list' | 'form' | 'style'>('list');
  const [editingCategory, setEditingCategory] = useState<any>(null);

  // Forms State
  const [catState, catFormAction, isCatPending] = useActionState(saveCategory, { success: "", error: "" });
  const [styleState, styleFormAction, isStylePending] = useActionState(updateCategorySettings, { success: "", error: "" });
  
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handlers
  const openEditForm = (cat: any) => {
    setEditingCategory(cat);
    setImagePreview(cat.image_url || "");
    setActiveTab('form');
  };

  const openAddForm = () => {
    setEditingCategory(null);
    setImagePreview("");
    setActiveTab('form');
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category? Sub-categories will be un-parented.")) {
      await deleteCategory(id);
      window.location.reload(); // Quick refresh to sync UI
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 600;
        let width = img.width; let height = img.height;
        if (width > height && width > MAX_SIZE) { height = Math.round((height * MAX_SIZE) / width); width = MAX_SIZE; } 
        else if (height > MAX_SIZE) { width = Math.round((width * MAX_SIZE) / height); height = MAX_SIZE; }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        setImagePreview(canvas.toDataURL("image/webp", 0.8));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Categories & Styling</h2>
        <p className="text-slate-500 mt-1">Manage your product hierarchies and section design.</p>
      </div>

      {/* Woz Interface: Dashboard Tabs */}
      <div className="flex space-x-1 bg-slate-200/50 p-1 rounded-lg w-fit">
        <button onClick={() => setActiveTab('list')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>Manage Categories</button>
        <button onClick={() => setActiveTab('style')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'style' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>Section Styling</button>
      </div>

      {/* --- TAB 1: LIST CATEGORIES --- */}
      {activeTab === 'list' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h3 className="font-semibold text-slate-800">Active Categories ({categories.length})</h3>
            <button onClick={openAddForm} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors">
              <Plus className="w-4 h-4" /> Add Category
            </button>
          </div>
          <div className="divide-y divide-slate-100 max-h-[60vh] overflow-y-auto">
            {categories.length === 0 && <p className="p-8 text-center text-slate-500 italic">No categories created yet.</p>}
            {categories.map(cat => (
              <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                    {cat.image_url ? <img src={cat.image_url} className="w-full h-full object-cover" /> : <ShoppingBag className="w-5 h-5 text-slate-400" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{cat.name}</h4>
                    <p className="text-xs text-slate-500">/{cat.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEditForm(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 2: ADD/EDIT FORM --- */}
      {activeTab === 'form' && (
        <form action={catFormAction} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h3 className="text-lg font-semibold text-slate-900">{editingCategory ? "Edit Category" : "Add New Category"}</h3>
            <button type="button" onClick={() => setActiveTab('list')} className="text-sm text-slate-500 hover:text-slate-900">Cancel</button>
          </div>
          
          {catState?.success && <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center gap-2"><CheckCircle2 className="w-5 h-5" />{catState.success}</div>}
          {catState?.error && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center gap-2"><AlertCircle className="w-5 h-5" />{catState.error}</div>}

          {/* Hidden ID field for updates */}
          {editingCategory && <input type="hidden" name="id" value={editingCategory.id} />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">Name</label>
              <input name="name" type="text" defaultValue={editingCategory?.name} required className="mt-1 block w-full h-11 rounded-md border border-slate-300 px-3 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">URL Slug</label>
              <input name="slug" type="text" defaultValue={editingCategory?.slug} required className="mt-1 block w-full h-11 rounded-md border border-slate-300 px-3 text-sm bg-slate-50" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Parent Category</label>
              <select name="parentId" defaultValue={editingCategory?.parent_id || ""} className="mt-1 block w-full h-11 rounded-md border border-slate-300 px-3 text-sm bg-white">
                <option value="">None (Top-Level)</option>
                {categories.filter(c => c.id !== editingCategory?.id).map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Description</label>
              <textarea name="description" rows={3} defaultValue={editingCategory?.description} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm font-medium text-slate-900 mb-2">Thumbnail Image</h4>
              <input type="hidden" name="imageBase64" value={imagePreview} />
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
              {imagePreview ? (
                <div className="w-40 h-40 rounded-lg overflow-hidden border border-slate-200 relative group">
                  <img src={imagePreview} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white px-3 py-1 rounded text-sm">Change</button></div>
                </div>
              ) : (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-40 h-40 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50"><Upload className="w-6 h-6 mb-2 opacity-50" />Upload</button>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-900 mb-2">Fallback Icon</h4>
              <div className="grid grid-cols-4 gap-2">
                {AVAILABLE_ICONS.map((icon) => {
                  const Icon = icon.component;
                  return (
                    <label key={icon.id} className="flex flex-col items-center justify-center border border-slate-200 rounded-md p-2 cursor-pointer hover:border-blue-400 peer-checked:border-blue-600 bg-slate-50">
                      <input type="radio" name="iconName" value={icon.id} className="sr-only peer" defaultChecked={(editingCategory?.icon_name || "ShoppingBag") === icon.id} />
                      <Icon className="w-5 h-5 text-slate-500 peer-checked:text-blue-600" />
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
          <button type="submit" disabled={isCatPending} className="w-full h-11 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800 disabled:opacity-50">{isCatPending ? "Saving..." : "Save Category"}</button>
        </form>
      )}

      {/* --- TAB 3: STYLING FORM --- */}
      {activeTab === 'style' && (
        <form action={styleFormAction} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-2">
          
          {styleState?.success && <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center gap-2"><CheckCircle2 className="w-5 h-5" />{styleState.success}</div>}
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Header Typography</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Section Title</label>
                <input name="title" type="text" defaultValue={settings?.title} className="mt-1 block w-full h-11 rounded-md border border-slate-300 px-3 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Font Style</label>
                <select name="fontKey" defaultValue={settings?.font_key} className="mt-1 block w-full h-11 rounded-md border border-slate-300 px-3 text-sm bg-white">
                  <option value="sans">Inter (Clean & Minimal)</option>
                  <option value="display">Montserrat (Bold & Modern)</option>
                  <option value="serif">Serif (Editorial)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Subtitle</label>
                <input name="subtitle" type="text" defaultValue={settings?.subtitle} className="mt-1 block w-full h-11 rounded-md border border-slate-300 px-3 text-sm" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Section Background & Text Color</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Background Color or Gradient</label>
                <input name="bgValue" type="text" defaultValue={settings?.bg_value} placeholder="#f8fafc or linear-gradient(...)" className="block w-full h-11 rounded-md border border-slate-300 px-3 text-sm font-mono mb-2" />
                <div className="flex gap-2 text-xs">
                  {PRESET_GRADIENTS.map((grad, i) => (
                    <button key={i} type="button" onClick={() => {
                      const input = document.querySelector('input[name="bgValue"]') as HTMLInputElement;
                      if(input) input.value = grad.value;
                    }} className="px-2 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100">{grad.label}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Global Text Color (Hex)</label>
                <div className="flex items-center gap-3">
                  <input name="textColor" type="color" defaultValue={settings?.text_color} className="h-11 w-16 p-1 rounded border border-slate-300 cursor-pointer" />
                  <span className="text-xs text-slate-500">Applies to Title and Subtitle</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Category Card Styling</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Card Background Color (Hex)</label>
                <input name="cardBgColor" type="color" defaultValue={settings?.card_bg_color} className="h-11 w-16 p-1 rounded border border-slate-300 cursor-pointer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Card Text Color (Hex)</label>
                <input name="cardTextColor" type="color" defaultValue={settings?.card_text_color} className="h-11 w-16 p-1 rounded border border-slate-300 cursor-pointer" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={isStylePending} className="w-full h-11 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800 disabled:opacity-50">{isStylePending ? "Saving..." : "Save Section Styling"}</button>
        </form>
      )}
    </div>
  );
}