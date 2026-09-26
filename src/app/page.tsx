import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";
import Products from "@/components/sections/Products";
import AboutUs from "@/components/sections/AboutUs";
import FAQs from "@/components/sections/FAQs";
import Contact from "@/components/sections/Contact";
import { getAboutSettings } from "@/lib/aboutStorage";
import { getFaqsSettings } from "@/lib/faqsStorage";
import { getContactSettings } from "@/lib/contactStorage";
import { neon } from "@neondatabase/serverless";

export default async function HomeSPA() {
  let products: any[] = [];
  let productSettings = { 
    title: "Featured Products", 
    subtitle: "", 
    currency: "USD", 
    bg_color: "#ffffff", 
    text_color: "#0f172a" 
  };
  
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && dbUrl.startsWith("postgres")) {
    try {
      const sql = neon(dbUrl);
      const [prodData, setData] = await Promise.all([
        sql`SELECT * FROM products ORDER BY created_at DESC LIMIT 8`,
        sql`SELECT * FROM product_settings WHERE id = 1`
      ]);
      products = prodData;
      if (setData.length > 0) productSettings = setData[0] as any;
    } catch (error) {
      console.error("Public Products DB Error", error);
    }
  }

  // Woz Data Pipeline: Always fetch the latest persistent settings across sections
  const [aboutSettings, faqsSettings, contactSettings] = await Promise.all([
    getAboutSettings(),
    getFaqsSettings(),
    getContactSettings(),
  ]);

  return (
    <div className="flex flex-col w-full">
      <section id="hero" className="min-h-[80vh] flex items-center bg-slate-50">
        <Hero />
      </section>

      <section id="categories" className="py-20 bg-white">
        <Categories />
      </section>

      <section id="products" className="py-20 bg-slate-50">
        <Products products={products} settings={productSettings} />
      </section>

      <section id="about">
        <AboutUs settings={aboutSettings} />
      </section>

      <section id="faqs">
        <FAQs settings={faqsSettings} />
      </section>

      <section id="contact">
        <Contact settings={contactSettings} />
      </section>
    </div>
  );
}
