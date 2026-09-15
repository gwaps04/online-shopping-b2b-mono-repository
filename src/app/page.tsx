import { neon } from "@neondatabase/serverless";
import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";
import Products from "@/components/sections/Products";
import AboutUs from "@/components/sections/AboutUs";
import FAQs from "@/components/sections/FAQs";
import Contact from "@/components/sections/Contact";

export default async function HomeSPA() {
  // Woz Engine: Fetch data securely on the Server, avoiding Client Component restrictions
  const sql = neon(process.env.DATABASE_URL!);
  
  let products: any[] = [];
  let productSettings = { title: "Featured Products", subtitle: "", currency: "USD", bg_color: "#ffffff", text_color: "#0f172a" };
  
  try {
    const [prodData, setData] = await Promise.all([
      sql`SELECT * FROM products ORDER BY created_at DESC LIMIT 8`,
      sql`SELECT * FROM product_settings WHERE id = 1`
    ]);
    products = prodData;
    if (setData.length > 0) productSettings = setData[0] as any;
  } catch (error) {
    console.error("Public Products DB Error", error);
  }

  return (
    <div className="flex flex-col w-full">
      <section id="hero" className="min-h-[80vh] flex items-center bg-slate-50">
        <Hero />
      </section>

      <section id="categories" className="py-20 bg-white">
        <Categories />
      </section>

      <section id="products" className="py-20 bg-slate-50">
        {/* Woz Data Pipeline: Pass the fetched database data down to the Client Component */}
        <Products products={products} settings={productSettings} />
      </section>

      <section id="about" className="py-20 bg-blue-600 text-white">
        <AboutUs />
      </section>

      <section id="faqs" className="py-20 bg-white">
        <FAQs />
      </section>

      <section id="contact" className="py-20 bg-slate-900 text-white">
        <Contact />
      </section>
    </div>
  );
}