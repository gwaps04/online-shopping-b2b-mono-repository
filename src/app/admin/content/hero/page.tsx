import { neon } from "@neondatabase/serverless";
import HeroForm from "./HeroForm";

export default async function HeroCMSPage() {
  const sql = neon(process.env.DATABASE_URL!);
  let settings = { 
    title: "Elevate Your Lifestyle", 
    subtitle: "Discover premium products curated for the modern world.", 
    layout_style: "background", 
    image_url: "",
    btn_primary_text: "Shop Now", btn_primary_theme: "solid-blue",
    btn_secondary_text: "Learn More", btn_secondary_theme: "outline-light"
  };
  
  try {
    const data = await sql`SELECT * FROM hero_settings WHERE id = 1`;
    if (data.length > 0) settings = data[0] as any;
  } catch (error) {
    console.error("Hero Settings error", error);
  }

  return <HeroForm initialData={settings} />;
}