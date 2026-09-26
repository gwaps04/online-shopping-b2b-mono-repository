export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQSettings {
  title: string;
  subtitle: string;
  faqs: FAQItem[];
  bg_type: "solid" | "gradient";
  bg_color: string;
  bg_gradient_end: string;
  bg_gradient_direction: string;
  text_color: string;
  font_key: string;
  // Accordion styling & color schemes
  accordion_bg: string;
  accordion_question_color: string;
  accordion_answer_color: string;
  accordion_border_color: string;
  accordion_accent_color: string;
  accordion_radius: "rounded-lg" | "rounded-xl" | "rounded-2xl" | "rounded-3xl" | "rounded-none";
  accordion_layout: "single-column" | "two-column";
}

export const DEFAULT_FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "What are your shipping options and delivery timelines?",
    answer: "We offer Standard Shipping (3–5 business days) and Express Courier (1–2 business days). Orders over $75 qualify for complimentary standard shipping worldwide. You will receive real-time carrier tracking upon dispatch.",
  },
  {
    id: "faq-2",
    question: "What is your return and exchange policy?",
    answer: "We offer a 30-day hassle-free return window for unworn and unused products in their original packaging. Prepaid digital return labels are provided through our automated self-serve return portal.",
  },
  {
    id: "faq-3",
    question: "How can I track my order once it has shipped?",
    answer: "Once your package leaves our fulfillment center, you will immediately receive an email and SMS confirmation containing your tracking number and a live carrier status link.",
  },
  {
    id: "faq-4",
    question: "What payment methods and currencies do you accept?",
    answer: "We support Visa, MasterCard, American Express, Apple Pay, Google Pay, PayPal, and interest-free installment plans via Klarna. Currencies are automatically converted based on your checkout locale.",
  },
  {
    id: "faq-5",
    question: "Do you ship internationally to countries outside the US?",
    answer: "Yes, we ship to over 65 countries worldwide. International shipping options, duties, and local taxes are calculated with transparent upfront pricing at checkout.",
  },
  {
    id: "faq-6",
    question: "Are your materials sustainably and ethically sourced?",
    answer: "Every item in our collection is crafted with certified ethical manufacturing standards, recycled packaging, and responsibly sourced materials designed for long-lasting durability.",
  },
  {
    id: "faq-7",
    question: "Can I cancel or modify my order after placing it?",
    answer: "Orders are processed rapidly to ensure quick delivery. If you need to make changes or cancel, please contact customer care within 60 minutes of placing your order.",
  },
  {
    id: "faq-8",
    question: "What warranty or guarantee comes with purchases?",
    answer: "All premium hardware, watches, tech gear, and leather essentials include a complimentary 1-year manufacturer guarantee protecting against defects in workmanship.",
  },
  {
    id: "faq-9",
    question: "Do you offer wholesale, bulk orders, or corporate gifting?",
    answer: "Yes! For orders of 15 units or more, or bespoke corporate gifting packages, our sales concierge provides tiered pricing and custom packaging options.",
  },
  {
    id: "faq-10",
    question: "How do I contact customer support if I need assistance?",
    answer: "Our dedicated support team is available Monday through Friday from 9 AM to 6 PM EST via live concierge chat or email. Typical response time is under two hours.",
  },
];

export const DEFAULT_FAQ_SETTINGS: FAQSettings = {
  title: "Frequently Asked Questions",
  subtitle: "Everything you need to know about our products, delivery, warranty, and customer care.",
  faqs: DEFAULT_FAQS,
  bg_type: "solid",
  bg_color: "#ffffff",
  bg_gradient_end: "#f8fafc",
  bg_gradient_direction: "to-br",
  text_color: "#0f172a",
  font_key: "sans",
  accordion_bg: "#f8fafc",
  accordion_question_color: "#0f172a",
  accordion_answer_color: "#475569",
  accordion_border_color: "#e2e8f0",
  accordion_accent_color: "#2563eb",
  accordion_radius: "rounded-2xl",
  accordion_layout: "single-column",
};
