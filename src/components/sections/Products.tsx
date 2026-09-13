import { neon } from "@neondatabase/serverless";
import Link from "next/link";
import { Tag } from "lucide-react";

const CURRENCY_SYMBOLS: Record<string, string> = { "USD": "$", "PHP": "₱", "EUR": "€", "GBP": "£" };

export default async function Products() {
  const sql = neon(process.env.DATABASE_URL!);
  
  let products: any[] = [];
  let settings = { title: "Featured Products", subtitle: "", currency: "USD", bg_color: "#ffffff", text_color: "#0f172a" };
  
  try {
    const [prodData, setData] = await Promise.all([
      sql`SELECT * FROM products ORDER BY created_at DESC LIMIT 8`,
      sql`SELECT * FROM product_settings WHERE id = 1`
    ]);
    products = prodData;
    if (setData.length > 0) settings = setData[0] as any;
  } catch (error) {
    console.error("Public Products DB Error");
  }

  const activeSymbol = CURRENCY_SYMBOLS[settings.currency] || "$";

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
              // Woz Math: Base Price (stored in the 'price' column) and derived Final Price
              const basePrice = Number(prod.price);
              const discount = Number(prod.discount_percentage);
              const finalPrice = discount > 0 ? basePrice - (basePrice * (discount / 100)) : basePrice;
              
              const isOutOfStock = Number(prod.stock) <= 0;

              return (
                <div key={prod.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 relative">
                  
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-20 flex items-center justify-center pointer-events-none">
                      <span className="bg-slate-900 text-white text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-md shadow-lg transform -rotate-12">Out of Stock</span>
                    </div>
                  )}

                  <Link href={isOutOfStock ? "#" : `/product/${prod.slug}`} className={`flex flex-col flex-1 ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className="relative w-full aspect-square bg-slate-50 flex items-center justify-center p-6 overflow-hidden">
                      
                      {/* Woz UX: The eye-catching Discount Badge */}
                      {discount > 0 && !isOutOfStock && (
                        <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm z-10">
                          -{discount}%
                        </div>
                      )}

                      {prod.image_1 ? (
                        <img src={prod.image_1} alt={prod.title} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <Tag className="w-12 h-12 text-slate-300" />
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-1 text-left">
                      <h3 className="font-semibold text-slate-900 text-lg leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{prod.title}</h3>
                      <div className="mt-auto pt-4 flex items-end justify-between">
                        <div className="flex flex-col">
                          
                          {/* Woz UX: Show original Base Price with a strikethrough ONLY if a discount exists */}
                          {discount > 0 && !isOutOfStock && (
                            <span className="text-sm text-slate-400 line-through mb-0.5">
                              {activeSymbol}{basePrice.toFixed(2)}
                            </span>
                          )}
                          
                          {/* Display the active selling price */}
                          <span className="text-xl font-bold text-slate-900 font-mono tracking-tight">
                            {activeSymbol}{finalPrice.toFixed(2)}
                          </span>
                          
                        </div>
                      </div>
                    </div>
                  </Link>
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