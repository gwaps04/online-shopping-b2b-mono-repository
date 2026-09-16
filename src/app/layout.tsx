import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { neon } from "@neondatabase/serverless";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/lib/CartContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: "Store Mono | Premium E-Commerce",
  description: "Modern online shopping experience.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const sql = neon(process.env.DATABASE_URL!);
  let navSettings = { company_name: "STORE.", theme_key: "light", font_key: "display", logo_url: "" };
  let storeCurrency = "USD"; // Default fallback
  
  try {
    // Woz Data Pipeline: Fetch both global settings and product settings simultaneously
    const [globalData, prodData] = await Promise.all([
      sql`SELECT * FROM global_settings WHERE id = 1`,
      sql`SELECT currency FROM product_settings WHERE id = 1` // Get the selected currency
    ]);
    
    if (globalData.length > 0) navSettings = globalData[0] as any;
    if (prodData.length > 0) storeCurrency = prodData[0].currency;

  } catch (e) {
    console.error("Settings Table missing or error fetching data");
  }

  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="font-sans antialiased bg-white text-slate-900 min-h-screen flex flex-col">
        
        {/* Woz Engine: Inject the database currency into the Global State Provider */}
        <CartProvider activeCurrency={storeCurrency}>
          <Navbar settings={navSettings} />
          
          <main className="grow pt-18"> 
            {children}
          </main>
          
          <Footer />
        </CartProvider>
        
      </body>
    </html>
  );
}