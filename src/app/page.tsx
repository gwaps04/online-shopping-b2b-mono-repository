import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";
import Products from "@/components/sections/Products";
import AboutUs from "@/components/sections/AboutUs";
import FAQs from "@/components/sections/FAQs";
import Contact from "@/components/sections/Contact";

export default function HomeSPA() {
  return (
    <div className="flex flex-col w-full">
      {/* 
        Each section must have a corresponding ID matching the Navbar links.
        Woz Rule: Min-height constraints ensure sections feel substantial.
      */}
      <section id="hero" className="min-h-[80vh] flex items-center bg-slate-50">
        <Hero />
      </section>

      <section id="categories" className="py-20 bg-white">
        <Categories />
      </section>

      <section id="products" className="py-20 bg-slate-50">
        <Products />
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