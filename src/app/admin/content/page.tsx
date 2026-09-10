import { neon } from "@neondatabase/serverless";
import ContentForm from "./ContentForm";

export default async function ContentManagerPage() {
  // Woz Engine: Fetch truth from DB on the Server before rendering the CMS form
  const sql = neon(process.env.DATABASE_URL!);
  let settings = { company_name: "STORE.", theme_key: "light", font_key: "display", logo_url: "" };
  
  try {
    const data = await sql`SELECT * FROM global_settings WHERE id = 1`;
    if (data.length > 0) {
      settings = data[0] as any;
    }
  } catch (error) {
    console.error("Failed to fetch settings for CMS form:", error);
  }

  return <ContentForm initialData={settings} />;
}