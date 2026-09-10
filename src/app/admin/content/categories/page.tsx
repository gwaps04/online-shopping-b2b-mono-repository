import { neon } from "@neondatabase/serverless";
import CategoryDashboard from "./CategoryDashboard";

export default async function CategoriesCMSPage() {
  const sql = neon(process.env.DATABASE_URL!);
  
  let categories: any[] = [];
  let settings = { 
    title: "Shop by Category", subtitle: "", 
    bg_value: "#f8fafc", text_color: "#0f172a", 
    card_bg_color: "#ffffff", card_text_color: "#0f172a", font_key: "sans" 
  };
  
  try {
    const [catData, settingsData] = await Promise.all([
      sql`SELECT * FROM categories ORDER BY created_at DESC`,
      sql`SELECT * FROM category_settings WHERE id = 1`
    ]);
    
    categories = catData;
    if (settingsData.length > 0) settings = settingsData[0] as any;
  } catch (error) {
    console.error("Failed to fetch dashboard data", error);
  }

  return <CategoryDashboard categories={categories} settings={settings} />;
}