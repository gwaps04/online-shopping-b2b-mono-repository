export interface ContactSettings {
  title: string;
  subtitle: string;
  phone_number: string;
  phone_label?: string;
  email_address?: string;
  address?: string;
  operating_hours?: string;
  bg_type: "solid" | "gradient";
  bg_color: string;
  bg_gradient_end: string;
  bg_gradient_direction: string;
  text_color: string;
  font_key: string;
  card_bg?: string;
  card_border?: string;
  accent_color?: string;
}

export const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  title: "Get in Touch with Us",
  subtitle: "Have a question about an order, product inquiries, or feedback? Our team is always ready to assist you.",
  phone_number: "+1 (800) 555-0199",
  phone_label: "Direct Support & Inquiries Hotline",
  email_address: "concierge@storebrand.com",
  address: "742 Evergreen Avenue, Suite 400, New York, NY 10001",
  operating_hours: "Monday – Friday: 9:00 AM – 6:00 PM EST",
  bg_type: "solid",
  bg_color: "#0f172a", // Charcoal/Obsidian default
  bg_gradient_end: "#1e293b",
  bg_gradient_direction: "to-br",
  text_color: "#f8fafc", // White/Slate default
  font_key: "sans",
  card_bg: "rgba(255, 255, 255, 0.06)",
  card_border: "rgba(255, 255, 255, 0.12)",
  accent_color: "#3b82f6",
};
