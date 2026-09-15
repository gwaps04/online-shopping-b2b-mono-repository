"use client"; // Woz Engine: Changed to Client Component to support Cart Interactions

import { useCart } from "@/lib/CartContext";
import Link from "next/link";
import { Tag, ShoppingCart, Check } from "lucide-react";
import { useState } from "react";

const CURRENCY_SYMBOLS: Record<string, string> = { "USD": "$", "PHP": "₱", "EUR": "€", "GBP": "£" };

// Because we moved to "use client", we receive the DB data via props from the parent page
export default function Products({ products, settings }: { products: any[], settings: any }) {
  const { addToCart } = useCart();
  const [addingId, setAddingId] = useState<string | null>(null);

  const activeSymbol = CURRENCY_SYMBOLS[settings.currency] || "$";

  const handleAddToCart = (e: React.MouseEvent, prod: any, finalPrice: number) => {
    e.preventDefault(); // Prevent navigating to the product page
    
    const result = addToCart({
      id: prod.id,
      title: prod.title,
      slug: prod.slug,
      price: finalPrice,
      image: prod.image_1 || "",
    });

    if (result.success) {
      // Woz UX: Temporary success state feedback
      setAddingId(prod.id);
      setTimeout(() => setAddingId(null), 1500);
    } else {
      alert(result.message); // Will fire if they try to add an 11th item
    }
  };

  return (
    <section id="products" style={{ backgroundColor: settings.bg_color, color: settings.text_color }} className="w-full py-24 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 flex flex-col items-center">
          <h2 className="font-display font-black tracking-tight text-3xl sm:text-4xl md:text-5xl mb-4">{settings.title}</h2>
          {settings.subtitle && <p className="text-lg max-w-2xl opacity-80 leading-relaxed">{settings.subtitle}</p>}
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((prod) => {
              const basePrice = Number(prod.price);
              const discount = Number(prod.discount_percentage);
              const finalPrice = discount > 0 ? basePrice - (basePrice * (discount / 100)) : basePrice;
              const isOutOfStock = Number(prod.stock) <= 0;
              const isAdding = addingId === prod.id;

              return (
                <div key={prod.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 relative">
                  
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-20 flex items-center justify-center pointer-events-none">
                      <span className="bg-slate-900 text-white text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-md shadow-lg transform -rotate-12">Out of Stock</span>
                    </div>
                  )}

                  <Link href={isOutOfStock ? "#" : `/product/${prod.slug}`} className={`flex flex-col flex-1 ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className="relative w-full aspect-square bg-slate-50 flex items-center justify-center p-6 overflow-hidden">
                      {discount > 0 && !isOutOfStock && <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm z-10">-{discount}%</div>}
                      {prod.image_1 ? <img src={prod.image_1} alt={prod.title} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" /> : <Tag className="w-12 h-12 text-slate-300" />}
                    </div>

                    <div className="p-6 flex flex-col flex-1 text-left">
                      <h3 className="font-semibold text-slate-900 text-lg leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{prod.title}</h3>
                      <div className="mt-auto pt-4 flex items-end justify-between">
                        <div className="flex flex-col">
                          {discount > 0 && !isOutOfStock && <span className="text-sm text-slate-400 line-through mb-0.5">{activeSymbol}{basePrice.toFixed(2)}</span>}
                          <span className="text-xl font-bold text-slate-900 font-mono tracking-tight">{activeSymbol}{finalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Woz Add to Cart Button Footer */}
                  {!isOutOfStock && (
                    <div className="px-6 pb-6 pt-0">
                      <button 
                        onClick={(e) => handleAddToCart(e, prod, finalPrice)}
                        disabled={isAdding}
                        className={`w-full h-11 flex items-center justify-center gap-2 rounded-lg font-bold text-sm transition-all ${isAdding ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-900 hover:bg-slate-900 hover:text-white'}`}
                      >
                        {isAdding ? <><Check className="w-4 h-4" /> Added</> : <><ShoppingCart className="w-4 h-4" /> Add to Cart</>}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center opacity-60 italic py-12">No products available in the catalog yet.</div>
        )}
      </div>
    </section>
  );
}