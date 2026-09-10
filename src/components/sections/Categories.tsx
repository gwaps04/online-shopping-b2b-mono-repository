import { neon } from "@neondatabase/serverless";
import Link from "next/link";
import { Armchair, Zap, Home, Gift, Laptop, Shirt, ShoppingBag, Dumbbell, Image as ImageIcon } from "lucide-react";

const FONT_DICTIONARY: Record<string, string> = {
  "display": "font-display font-black tracking-tight",
  "sans": "font-sans font-bold tracking-normal",
  "serif": "font-serif font-bold italic tracking-wide",
  "mono": "font-mono font-bold tracking-tighter uppercase",
};

const ICON_MAP: Record<string, React.ElementType> = {
  "ShoppingBag": ShoppingBag, "Laptop": Laptop, "Armchair": Armchair, "Zap": Zap,
  "Home": Home, "Gift": Gift, "Shirt": Shirt, "Dumbbell": Dumbbell
};

export default async function Categories() {
  const sql = neon(process.env.DATABASE_URL!);
  
  let settings = { 
    title: "Shop by Category", subtitle: "", 
    bg_value: "#f8fafc", text_color: "#0f172a", 
    card_bg_color: "#ffffff", card_text_color: "#0f172a", font_key: "sans" 
  };
  let categories: any[] = [];
  
  try {
    const [settingsData, catData] = await Promise.all([
      sql`SELECT * FROM category_settings WHERE id = 1`,
      sql`SELECT * FROM categories ORDER BY created_at ASC`
    ]);
    
    if (settingsData.length > 0) settings = settingsData[0] as any;
    categories = catData;
  } catch (error) {
    console.error("Categories DB Error");
  }

  const titleFont = FONT_DICTIONARY[settings.font_key] || FONT_DICTIONARY["sans"];

  return (
    <section 
      id="categories" 
      style={{ background: settings.bg_value, color: settings.text_color }} 
      className="w-full py-24 transition-colors duration-300"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 flex flex-col items-center">
          <h2 className={`${titleFont} text-3xl sm:text-4xl md:text-5xl mb-4`}>{settings.title}</h2>
          {settings.subtitle && <p className="text-lg max-w-2xl opacity-80 leading-relaxed">{settings.subtitle}</p>}
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {categories.map((cat) => {
              const IconComponent = ICON_MAP[cat.icon_name] || ImageIcon;

              return (
                <Link 
                  key={cat.id} 
                  href={`/category/${cat.slug}`}
                  // Woz Engine: Injecting custom card colors from CMS
                  style={{ backgroundColor: settings.card_bg_color, color: settings.card_text_color }}
                  className="group flex flex-col items-center text-center gap-4 p-4 sm:p-6 rounded-2xl hover:brightness-95 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div className="w-full aspect-square rounded-full overflow-hidden bg-black/5 flex items-center justify-center p-4 transition-transform duration-300 group-hover:scale-105">
                    {cat.image_url ? (
                      <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <IconComponent className="w-1/3 h-1/3 opacity-50" />
                    )}
                  </div>
                  <h3 className={`text-base sm:text-lg font-semibold truncate w-full ${titleFont.includes('font-mono') ? 'font-mono' : 'font-sans'}`}>
                    {cat.name}
                  </h3>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center opacity-60 italic py-12">No categories available.</div>
        )}

      </div>
    </section>
  );
}