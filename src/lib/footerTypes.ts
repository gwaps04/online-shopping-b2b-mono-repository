export interface FooterLink {
  id: string;
  name: string;
  href: string;
  order: number;
}

export interface FooterColumn {
  id: string;
  title: string;
  links: FooterLink[];
}

export interface FooterSettings {
  company_name_override?: string; // Optional override, otherwise falls back to global company_name
  tagline: string;
  copyright_text: string;
  
  // Background Styling
  bg_type: "solid" | "gradient";
  bg_color: string;
  bg_gradient_end: string;
  bg_gradient_direction: string;

  // Font and Typography
  font_key: string;
  text_color: string;
  heading_color: string;
  accent_color: string;

  // Newsletter Section ("Stay Updated")
  newsletter_title: string;
  newsletter_description: string;
  newsletter_placeholder: string;
  newsletter_button_text: string;

  // Sorted Quick Links Columns
  columns: FooterColumn[];
}

export const DEFAULT_FOOTER_SETTINGS: FooterSettings = {
  tagline: "Premium quality products designed for modern life. Experience the difference in every detail.",
  copyright_text: "All rights reserved.",
  bg_type: "solid",
  bg_color: "#020617", // slate-950
  bg_gradient_end: "#0f172a", // slate-900
  bg_gradient_direction: "to-b",
  font_key: "sans",
  text_color: "#94a3b8", // slate-400
  heading_color: "#f8fafc", // slate-50
  accent_color: "#3b82f6", // blue-500
  newsletter_title: "Stay Updated",
  newsletter_description: "Subscribe to receive special offers, new collection announcements, and exclusive insider discounts.",
  newsletter_placeholder: "Enter your email address...",
  newsletter_button_text: "Join",
  columns: [
    {
      id: "shop",
      title: "Shop & Collections",
      links: [
        { id: "s1", name: "Featured Products", href: "#products", order: 1 },
        { id: "s2", name: "Categories Grid", href: "#categories", order: 2 },
        { id: "s3", name: "Back to Top", href: "#hero", order: 3 },
      ],
    },
    {
      id: "support",
      title: "Support & Story",
      links: [
        { id: "c1", name: "About Our Story", href: "#about", order: 1 },
        { id: "c2", name: "Help & FAQs", href: "#faqs", order: 2 },
        { id: "c3", name: "Contact & Concierge", href: "#contact", order: 3 },
      ],
    },
    {
      id: "account",
      title: "Account & Portal",
      links: [
        { id: "a1", name: "Customer Sign In", href: "/login", order: 1 },
        { id: "a2", name: "Create Account", href: "/register", order: 2 },
        { id: "a3", name: "Track My Orders", href: "/orders", order: 3 },
        { id: "a4", name: "Staff Admin Login", href: "/admin/login", order: 4 },
      ],
    },
  ],
};
