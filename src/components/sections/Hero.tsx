import Link from "next/link";
import { neon } from "@neondatabase/serverless";

const BTN_DICT: Record<string, string> = {
  "solid-blue": "bg-blue-600 hover:bg-blue-700 text-white border-transparent",
  "solid-dark": "bg-slate-900 hover:bg-slate-800 text-white border-transparent",
  "solid-white": "bg-white hover:bg-slate-100 text-slate-900 border-transparent",
  "outline-light": "bg-transparent hover:bg-white/10 text-white border-white",
  "outline-dark": "bg-transparent hover:bg-slate-50 text-slate-900 border-slate-900",
  "ghost": "bg-transparent hover:bg-slate-100 text-slate-600 border-transparent underline decoration-transparent hover:decoration-slate-400"
};

export default async function Hero() {
  let data = {
    title: "Elevate Your Lifestyle", subtitle: "Premium curation for the modern world.",
    layout_style: "background", image_url: "",
    btn_primary_text: "Shop Now", btn_primary_theme: "solid-blue",
    btn_secondary_text: "Learn More", btn_secondary_theme: "outline-light"
  };

  // Safe Guard: Only initialize neon() when DATABASE_URL is provided
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && dbUrl.startsWith("postgres")) {
    try {
      const sql = neon(dbUrl);
      const res = await sql`SELECT * FROM hero_settings WHERE id = 1`;
      if (res.length > 0) data = res[0] as any;
    } catch (e) {
      console.warn("Hero DB query notice:", e);
    }
  }

  const primaryClass = BTN_DICT[data.btn_primary_theme] || BTN_DICT["solid-blue"];
  const secondaryClass = BTN_DICT[data.btn_secondary_theme] || BTN_DICT["outline-light"];

  const TextContent = ({ isDarkBg }: { isDarkBg: boolean }) => (
    <div className={`flex flex-col z-10 w-full ${data.layout_style === 'center' ? 'items-center text-center' : 'items-start text-left'} ${isDarkBg ? 'text-white' : 'text-slate-900'}`}>
      <h1 className="font-display font-black tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-6">
        {data.title}
      </h1>
      <p className={`text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed ${isDarkBg ? 'text-slate-200' : 'text-slate-600'}`}>
        {data.subtitle}
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        {data.btn_primary_text && (
          <Link href="#products" className={`w-full sm:w-auto px-8 h-14 flex items-center justify-center text-base font-semibold rounded-full border transition-all ${primaryClass}`}>
            {data.btn_primary_text}
          </Link>
        )}
        {data.btn_secondary_text && (
          <Link href="#about" className={`w-full sm:w-auto px-8 h-14 flex items-center justify-center text-base font-semibold rounded-full border transition-all ${secondaryClass}`}>
            {data.btn_secondary_text}
          </Link>
        )}
      </div>
    </div>
  );

  if (data.layout_style === "split-right" || data.layout_style === "split-left") {
    const isLeft = data.layout_style === "split-left";
    return (
      <div className="w-full bg-slate-50 min-h-[80vh] flex items-center overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className={`flex flex-col justify-center ${isLeft ? 'lg:order-2' : 'lg:order-1'}`}>
              <TextContent isDarkBg={false} />
            </div>
            {/* Woz Fix: Changed h-[400px] lg:h-[600px] to Canonical h-100 lg:h-150 */}
            <div className={`relative h-100 lg:h-150 w-full rounded-2xl overflow-hidden shadow-2xl ${isLeft ? 'lg:order-1' : 'lg:order-2'}`}>
              {data.image_url ? (
                <img src={data.image_url} alt={data.title} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-slate-200 flex items-center justify-center text-slate-400 font-medium">Image Placeholder</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (data.layout_style === "center") {
    return (
      <div className="w-full bg-white min-h-[80vh] flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl flex flex-col items-center">
          <TextContent isDarkBg={false} />
          {data.image_url && (
            <div className="mt-16 w-full rounded-2xl overflow-hidden shadow-xl max-h-[60vh]">
              <img src={data.image_url} alt={data.title} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[80vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
      {data.image_url ? (
        <img src={data.image_url} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-slate-900"></div>
      )}
      <div className="absolute inset-0 bg-slate-950/60 z-0"></div>
      <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-center text-center">
        <TextContent isDarkBg={true} />
      </div>
    </div>
  );
}