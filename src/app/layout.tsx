import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";
import "./globals.css";
import Navbar from "@/components/layout/Navbar"; // Ensure your path matches your project structure
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/lib/CartContext";
import { getFooterSettings } from "@/lib/footerStorage";
import FloatingAIAssistant from "@/components/common/FloatingAIAssistant";
import { getAIAssistantSettings } from "@/lib/aiAssistantStorage";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: "Store Mono | Premium E-Commerce",
  description: "Modern online shopping experience.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const dbUrl = process.env.DATABASE_URL;
  let navSettings = { company_name: "STORE.", theme_key: "light", font_key: "display", logo_url: "" };
  let storeCurrency = "USD"; // Default fallback
  
  if (dbUrl && dbUrl.startsWith("postgres")) {
    try {
      const sql = neon(dbUrl);
      const [globalData, prodData] = await Promise.all([
        sql`SELECT * FROM global_settings WHERE id = 1`,
        sql`SELECT currency FROM product_settings WHERE id = 1`
      ]);
      
      if (globalData.length > 0) navSettings = globalData[0] as any;
      if (prodData.length > 0) storeCurrency = prodData[0].currency;
    } catch (e) {
      console.error("Settings Table missing or error fetching data", e);
    }
  }

  // Fetch Footer persistent settings
  const footerSettings = await getFooterSettings();

  // Fetch AI Assistant settings
  const aiSettings = await getAIAssistantSettings();

  // Woz Engine: Identity Hydration
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("store_session");
  
  let isLoggedIn = false;
  let firstName = "";

  // If the secure cookie exists and db is configured, fetch the user's name
  if (sessionCookie?.value && dbUrl && dbUrl.startsWith("postgres")) {
    try {
      const sql = neon(dbUrl);
      const userRes = await sql`SELECT first_name FROM users WHERE id = ${sessionCookie.value}`;
      if (userRes.length > 0) {
        isLoggedIn = true;
        firstName = userRes[0].first_name;
      }
    } catch (e) {
      console.error("Failed to fetch user session data:", e);
    }
  }

  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="font-sans antialiased bg-white text-slate-900 min-h-screen flex flex-col">
        <CartProvider activeCurrency={storeCurrency}>
          
          {/* Woz Engine: Pass both the auth state AND the name to the Navbar */}
          <Navbar settings={navSettings} isLoggedIn={isLoggedIn} firstName={firstName} />
          
          <main className="grow pt-18"> 
            {children}
          </main>
          
          <Footer settings={footerSettings} companyName={navSettings.company_name} />
          <FloatingAIAssistant initialSettings={aiSettings} />
        </CartProvider>
      </body>
    </html>
  );
}