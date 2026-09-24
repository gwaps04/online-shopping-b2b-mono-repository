import { neon } from "@neondatabase/serverless";
import RegisterClientForm from "./RegisterClientForm";

export default async function RegisterPage() {
  // Woz Engine: Establish secure serverless connection to Neon RDBMS
  const sql = neon(process.env.DATABASE_URL!);
  
  // Default fallback in case the database is completely empty
  let storeCurrency = "PHP"; 

  try {
    // 1. Fetch the global store currency setting from the CMS
    const settings = await sql`SELECT currency FROM product_settings WHERE id = 1`;
    
    if (settings.length > 0) {
      storeCurrency = settings[0].currency;
    }
  } catch (error) {
    console.error("Failed to fetch store settings for registration:", error);
  }

  // 2. Pass the securely fetched data down to the interactive Client Boundary
  return <RegisterClientForm storeCurrency={storeCurrency} />;
}