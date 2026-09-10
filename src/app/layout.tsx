import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { neon } from "@neondatabase/serverless";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: "Store Mono | Premium E-Commerce",
  description: "Modern online shopping experience.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Woz Engine: Fetch Global Settings on the server before rendering the page
  const sql = neon(process.env.DATABASE_URL!);
  let navSettings = { company_name: "STORE.", theme_key: "light", font_key: "display", logo_url: "" };
  
  try {
    const data = await sql`SELECT * FROM global_settings WHERE id = 1`;
    if (data.length > 0) {
      navSettings = data[0] as any;
    }
  } catch (e) {
    console.error("Settings Table missing or error fetching data");
  }

  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="font-sans antialiased bg-white text-slate-900 min-h-screen flex flex-col">
        {/* Pass the secure database data as a prop to the Client Component */}
        <Navbar settings={navSettings} />
        
        <main className="grow pt-18"> 
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}