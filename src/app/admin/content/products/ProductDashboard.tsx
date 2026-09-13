"use client";

import { useActionState, useState, useRef, useMemo, useEffect } from "react";
import { Upload, CheckCircle2, AlertCircle, Pencil, Trash2, Plus, Search, Tag, DollarSign, ListFilter, Settings, X, Package } from "lucide-react";
import { saveProduct, deleteProduct, updateProductSettings } from "./actions";

const CURRENCY_SYMBOLS: Record<string, string> = { "USD": "$", "PHP": "₱", "EUR": "€", "GBP": "£" };

export default function ProductDashboard({ products, categories, settings }: { products: any[], categories: any[], settings: any }) {
  const [activeTab, setActiveTab] = useState<'list' | 'form' | 'style'>('list');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [formState, formAction, isPending] = useActionState(saveProduct, { success: "", error: "" });
  const [styleState, styleFormAction, isStylePending] = useActionState(updateProductSettings, { success: "", error: "" });
  
  const [titleInput, setTitleInput] = useState("");
  const [slugInput, setSlugInput] = useState("");
  const [images, setImages] = useState({ img1: "", img2: "", img3: "" });
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  // Woz Engine: Streamlined Pricing State
  const [unitCostInput, setUnitCostInput] = useState<string>("0.00");
  const [basePriceInput, setBasePriceInput] = useState<string>("0.00"); // Maps to DB 'price'
  const [discountInput, setDiscountInput] = useState<string>("0.00");
  const [stockInput, setStockInput] = useState<string>("0");

  const [customAttributes, setCustomAttributes] = useState<{key: string, val: string}[]>([]);

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const fileInputRef3 = useRef<HTMLInputElement>(null);

  const activeCurrencySymbol = CURRENCY_SYMBOLS[settings?.currency] || "$";

  // Woz Engine: Simplified Derived Math
  const liveFinalPrice = useMemo(() => {
    const base = parseFloat(basePriceInput) || 0;
    const disc = parseFloat(discountInput) || 0;
    if (disc <= 0) return base;
    return base - (base * (disc / 100));
  }, [basePriceInput, discountInput]);

  const liveProfitMargin = useMemo(() => {
    const cost = parseFloat(unitCostInput) || 0;
    if (liveFinalPrice <= 0) return 0;
    return ((liveFinalPrice - cost) / liveFinalPrice) * 100;
  }, [liveFinalPrice, unitCostInput]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.slug.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [products, searchQuery]);

  const activeTemplate = useMemo(() => {
    if (!selectedCategoryId) return [];
    const cat = categories.find(c => c.id.toString() === selectedCategoryId);
    let rawTemplate = cat?.attribute_template;
    if (!rawTemplate) return [];
    if (typeof rawTemplate === 'string') {
      try { rawTemplate = JSON.parse(rawTemplate); } catch (e) { return []; }
    }
    return Array.isArray(rawTemplate) ? rawTemplate : [];
  }, [selectedCategoryId, categories]);

  const openAddForm = () => {
    setEditingProduct(null); setTitleInput(""); setSlugInput(""); setSelectedCategoryId("");
    setUnitCostInput("0.00"); setBasePriceInput("0.00"); setDiscountInput("0.00"); setStockInput("0"); 
    setCustomAttributes([]); setImages({ img1: "", img2: "", img3: "" }); setActiveTab('form');
  };

  const openEditForm = (prod: any) => {
    setEditingProduct(prod); setTitleInput(prod.title); setSlugInput(prod.slug);
    setSelectedCategoryId(prod.category_id?.toString() || "");
    setUnitCostInput(prod.unit_cost?.toString() || "0.00");
    setBasePriceInput(prod.price?.toString() || "0.00"); // Maps DB 'price' to Base Price
    setDiscountInput(prod.discount_percentage?.toString() || "0.00");
    setStockInput(prod.stock?.toString() || "0");
    setImages({ img1: prod.image_1 || "", img2: prod.image_2 || "", img3: prod.image_3 || "" });

    if (prod.attributes) {
      const catTemplateNames = activeTemplate.map((t: any) => t.name);
      const customAttrs = Object.keys(prod.attributes)
        .filter(k => !catTemplateNames.includes(k))
        .map(k => ({ key: k, val: prod.attributes[k] }));
      setCustomAttributes(customAttrs);
    } else {
      setCustomAttributes([]);
    }
    setActiveTab('form');
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this product?")) {
      await deleteProduct(id);
      window.location.reload();
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitleInput(newTitle);
    if (!editingProduct) {
      setSlugInput(newTitle.toLowerCase().trim().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, ''));
    }
  };

  const addCustomAttribute = () => setCustomAttributes([...customAttributes, { key: "", val: "" }]);
  const removeCustomAttribute = (index: number) => setCustomAttributes(customAttributes.filter((_, i) => i !== index));
  const updateCustomAttribute = (index: number, field: 'key' | 'val', value: string) => {
    const newAttrs = [...customAttributes];
    newAttrs[index][field] = value;
    setCustomAttributes(newAttrs);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, slot: 'img1' | 'img2' | 'img3') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 800;
        let width = img.width; let height = img.height;
        if (width > height && width > MAX_SIZE) { height = Math.round((height * MAX_SIZE) / width); width = MAX_SIZE; } 
        else if (height > MAX_SIZE) { width = Math.round((width * MAX_SIZE) / height); height = MAX_SIZE; }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        setImages(prev => ({ ...prev, [slot]: canvas.toDataURL("image/webp", 0.7) }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const ImageUploadBox = ({ slot, refObj, label }: { slot: 'img1'|'img2'|'img3', refObj: any, label: string }) => (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-slate-700">{label}</p>
      <input type="hidden" name={slot} value={images[slot]} />
      <input type="file" accept="image/*" className="hidden" ref={refObj} onChange={(e) => handleImageUpload(e, slot)} />
      {images[slot] ? (
        <div className="relative w-full aspect-square rounded-lg border border-slate-200 overflow-hidden group bg-white">
          <img src={images[slot]} className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <button type="button" onClick={() => refObj.current?.click()} className="bg-white px-3 py-1 rounded text-xs font-medium">Change</button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => refObj.current?.click()} className="w-full aspect-square border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">
          <Upload className="w-5 h-5 mb-1 opacity-50" />
          <span className="text-[10px] uppercase font-bold tracking-wider">Upload</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Product Inventory</h2>
          <p className="text-slate-500 mt-1">Manage pricing, details, and media for your catalog.</p>
        </div>
      </div>

      <div className="flex space-x-1 bg-slate-200/50 p-1 rounded-lg w-fit">
        <button onClick={() => setActiveTab('list')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>Inventory List</button>
        <button onClick={() => setActiveTab('form')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'form' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>Product Editor</button>
        <button onClick={() => setActiveTab('style')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'style' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>Section Settings</button>
      </div>

      {activeTab === 'list' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-10 pl-9 pr-4 rounded-md border border-slate-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
            <button onClick={openAddForm} className="shrink-0 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 h-10 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>
          
          <div className="divide-y divide-slate-100 max-h-[65vh] overflow-y-auto">
            {filteredProducts.length === 0 && <p className="p-8 text-center text-slate-500 italic">No products found.</p>}
            {filteredProducts.map(prod => {
              // Woz UI Fix: Accurate list display based on new logic
              const basePrice = Number(prod.price);
              const disc = Number(prod.discount_percentage);
              const finalPrice = disc > 0 ? basePrice - (basePrice * (disc / 100)) : basePrice;

              return (
                <div key={prod.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                      {prod.image_1 ? <img src={prod.image_1} className="w-full h-full object-contain p-1" /> : <Tag className="w-5 h-5 text-slate-300" />}
                    </div>
                    <div className="flex flex-col">
                      <h4 className="font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-sm">{prod.title}</h4>
                      <span className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                        <span className="font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{activeCurrencySymbol}{finalPrice.toFixed(2)}</span>
                        {disc > 0 && <span className="text-red-600 font-medium">-{disc}% OFF</span>}
                        <span className={`px-1.5 py-0.5 rounded font-semibold ${prod.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                          {prod.stock > 0 ? `${prod.stock} in stock` : 'Out of Stock'}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditForm(prod)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(prod.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'form' && (
        <form action={formAction} className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="text-lg font-semibold text-slate-900">{editingProduct ? "Edit Product" : "New Product Details"}</h3>
                {editingProduct && <input type="hidden" name="id" value={editingProduct.id} />}
              </div>

              {formState?.success && <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center gap-2 text-sm"><CheckCircle2 className="w-5 h-5 shrink-0" />{formState.success}</div>}
              {formState?.error && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center gap-2 text-sm"><AlertCircle className="w-5 h-5 shrink-0" />{formState.error}</div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">Product Title</label>
                  <input name="title" type="text" required value={titleInput} onChange={handleTitleChange} className="mt-1 block w-full h-11 rounded-md border border-slate-300 px-3 text-sm focus:ring-1 focus:ring-blue-500" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700">URL Slug</label>
                  <input name="slug" type="text" required value={slugInput} onChange={(e) => setSlugInput(e.target.value)} className="mt-1 block w-full h-11 rounded-md border border-slate-300 px-3 text-sm bg-slate-50 focus:ring-1 focus:ring-blue-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Category Assignment</label>
                  <select name="categoryId" value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)} className="mt-1 block w-full h-11 rounded-md border border-slate-300 px-3 text-sm bg-white focus:ring-1 focus:ring-blue-500 font-semibold text-blue-700">
                    <option value="">Uncategorized</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">Subtitle / Tagline (Optional)</label>
                  <input name="subtitle" type="text" defaultValue={editingProduct?.subtitle} className="mt-1 block w-full h-11 rounded-md border border-slate-300 px-3 text-sm focus:ring-1 focus:ring-blue-500" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">Full Description</label>
                  <textarea name="description" rows={5} defaultValue={editingProduct?.description} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
              <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ListFilter className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Product Attributes</h3>
                </div>
                <button type="button" onClick={addCustomAttribute} className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                  <Plus className="w-3 h-3" /> Custom Attribute
                </button>
              </div>
              
              <div className="space-y-6">
                {activeTemplate.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <div className="md:col-span-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Required by Category</div>
                    {activeTemplate.map((attr: any, idx: number) => {
                      const savedValue = editingProduct?.attributes?.[attr.name] || "";
                      const inputName = `attr_${attr.name}`;
                      return (
                        <div key={`strict_${idx}`}>
                          <label className="block text-sm font-medium text-slate-700">{attr.name}</label>
                          {attr.type === 'select' && (
                            <select name={inputName} defaultValue={savedValue} className="mt-1 block w-full h-10 rounded-md border border-slate-300 px-3 text-sm bg-white">
                              <option value="">Select...</option>
                              {attr.options?.map((opt: string, i: number) => <option key={i} value={opt}>{opt}</option>)}
                            </select>
                          )}
                          {attr.type === 'number' && <input name={inputName} type="number" defaultValue={savedValue} className="mt-1 block w-full h-10 rounded-md border border-slate-300 px-3 text-sm" />}
                          {attr.type === 'text' && <input name={inputName} type="text" defaultValue={savedValue} className="mt-1 block w-full h-10 rounded-md border border-slate-300 px-3 text-sm" />}
                        </div>
                      );
                    })}
                  </div>
                )}

                {customAttributes.length > 0 && (
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Flexible Attributes</div>
                    {customAttributes.map((attr, idx) => (
                      <div key={`custom_${idx}`} className="flex items-center gap-3">
                        <input type="text" name={`customAttrKey_${idx}`} placeholder="Name (e.g. Material)" value={attr.key} onChange={(e) => updateCustomAttribute(idx, 'key', e.target.value)} className="w-1/3 h-10 rounded-md border border-slate-300 px-3 text-sm" required />
                        <input type="text" name={`customAttrVal_${idx}`} placeholder="Value (e.g. Leather)" value={attr.val} onChange={(e) => updateCustomAttribute(idx, 'val', e.target.value)} className="flex-1 h-10 rounded-md border border-slate-300 px-3 text-sm" required />
                        <button type="button" onClick={() => removeCustomAttribute(idx)} className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"><X className="w-5 h-5" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <button type="submit" disabled={isPending} className="w-full h-12 bg-slate-900 text-white rounded-md font-bold hover:bg-slate-800 disabled:opacity-50 shadow-sm">
              {isPending ? "Saving Product..." : "Save Product to Catalog"}
            </button>
          </div>

          <div className="space-y-6">
            
            {/* Woz Engine: Upgraded Inventory & Costing Box */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
              
              <div className="space-y-4 border-b border-slate-100 pb-6">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Package className="w-4 h-4 text-blue-600" /> Inventory Tracking</h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Available Stock Qty</label>
                  <input name="stock" type="number" min="0" step="1" required value={stockInput} onChange={(e) => setStockInput(e.target.value)} className="block w-full h-11 rounded-md border border-slate-300 px-3 text-sm font-mono text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>

              {/* Woz Simplification: Clean Pricing Module */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><DollarSign className="w-4 h-4 text-emerald-600" /> Pricing Matrix</h3>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${liveProfitMargin > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    Margin: {liveProfitMargin.toFixed(1)}%
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Unit Cost (COGS)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">{activeCurrencySymbol}</span>
                      <input name="unitCost" type="number" step="0.01" min="0" value={unitCostInput} onChange={(e) => setUnitCostInput(e.target.value)} className="block w-full h-10 pl-7 rounded-md border border-slate-300 px-3 text-sm font-mono text-slate-500" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Base Price (SRP)</label>
                    <div className="relative">
                      {/* Note: This maps to 'price' in the database */}
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-900 font-medium">{activeCurrencySymbol}</span>
                      <input name="price" type="number" step="0.01" min="0" required value={basePriceInput} onChange={(e) => setBasePriceInput(e.target.value)} className="block w-full h-10 pl-7 rounded-md border border-slate-300 px-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono text-slate-900" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-slate-700 mb-1">Active Discount (%)</label>
                      <input name="discount" type="number" step="0.01" min="0" max="100" value={discountInput} onChange={(e) => setDiscountInput(e.target.value)} className="block w-full h-10 rounded-md border border-red-300 bg-red-50/30 px-3 text-sm font-mono text-red-700 focus:ring-1 focus:ring-red-500 focus:border-red-500" placeholder="e.g. 20" />
                    </div>
                    
                    <div className="flex flex-col items-end justify-end mt-4">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Final Price</span>
                      <span className="text-lg font-bold text-emerald-700 font-mono">
                        {activeCurrencySymbol}{liveFinalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Product Media</h3>
              <p className="text-xs text-slate-500 leading-relaxed">The first image is the primary thumbnail.</p>
              <ImageUploadBox slot="img1" refObj={fileInputRef1} label="Primary Photo 1 *" />
              <div className="grid grid-cols-2 gap-4 pt-2">
                <ImageUploadBox slot="img2" refObj={fileInputRef2} label="Detail Photo 2" />
                <ImageUploadBox slot="img3" refObj={fileInputRef3} label="Detail Photo 3" />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* --- TAB 3: STYLING & CURRENCY FORM --- */}
      {activeTab === 'style' && (
        <form action={styleFormAction} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-8 animate-in fade-in">
          {styleState?.success && <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center gap-2"><CheckCircle2 className="w-5 h-5" />{styleState.success}</div>}
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-500" /> Storefront Configuration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">Section Title</label>
                <input name="title" type="text" defaultValue={settings?.title} className="mt-1 block w-full h-11 rounded-md border border-slate-300 px-3 text-sm" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700">Store Currency</label>
                <select name="currency" defaultValue={settings?.currency} className="mt-1 block w-full h-11 rounded-md border border-slate-300 px-3 text-sm bg-white font-medium">
                  <option value="USD">USD - US Dollar ($)</option>
                  <option value="PHP">PHP - Philippine Peso (₱)</option>
                  <option value="EUR">EUR - Euro (€)</option>
                  <option value="GBP">GBP - British Pound (£)</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Section Subtitle</label>
                <input name="subtitle" type="text" defaultValue={settings?.subtitle} className="mt-1 block w-full h-11 rounded-md border border-slate-300 px-3 text-sm" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Theme Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Background Color (Hex)</label>
                <input name="bgColor" type="color" defaultValue={settings?.bg_color} className="h-11 w-full max-w-[100px] p-1 rounded border border-slate-300 cursor-pointer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Text Color (Hex)</label>
                <input name="textColor" type="color" defaultValue={settings?.text_color} className="h-11 w-full max-w-[100px] p-1 rounded border border-slate-300 cursor-pointer" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={isStylePending} className="w-full h-11 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800 disabled:opacity-50">
            {isStylePending ? "Saving Settings..." : "Save Product Settings"}
          </button>
        </form>
      )}
    </div>
  );
}