import { neon } from "@neondatabase/serverless";
import ProductDashboard from "./ProductDashboard";

export default async function ProductsCMSPage() {
  const sql = neon(process.env.DATABASE_URL!);
  
  let products: any[] = [];
  let categories: any[] = [];
  let settings = { title: "Featured Products", subtitle: "", currency: "USD", bg_color: "#ffffff", text_color: "#0f172a" };
  
  try {
    const [prodData, catData, setData] = await Promise.all([
      sql`SELECT * FROM products ORDER BY created_at DESC`,
      // Woz Fix: We must explicitly ask Postgres for the attribute_template column
      sql`SELECT id, name, attribute_template FROM categories ORDER BY name ASC`,
      // Woz Fix: Fetch the product section settings for currency/colors
      sql`SELECT * FROM product_settings WHERE id = 1`
    ]);
    
    products = prodData;
    categories = catData;
    if (setData.length > 0) settings = setData[0] as any;
  } catch (error) {
    console.error("Failed to fetch products data", error);
  }

  return <ProductDashboard products={products} categories={categories} settings={settings} />;
}