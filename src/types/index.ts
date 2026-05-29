export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Module {
  name: string;
  description: string;
  icon: string;
}

export interface Benefit {
  title: string;
  description: string;
  icon: string;
  metric?: string;
}

export interface UseCase {
  title: string;
  description: string;
  industry: string;
}

export interface Screenshot {
  url: string;
  alt: string;
  caption?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface PricingPlan {
  name: string;
  price: number | null;
  period?: "monthly" | "yearly" | "one-time";
  description: string;
  features: string[];
  isPopular?: boolean;
  cta: string;
}

export interface Pricing {
  type: "fixed" | "contact" | "subscription";
  plans?: PricingPlan[];
  contactText?: string;
  note?: string;
}

export interface Download {
  label: string;
  filename: string;
  url: string;
  type: "exe" | "zip" | "dmg" | "deb";
  platform: string;
  size?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  problem: string;
  solution: string;
  category: string;
  tags: string[];
  icon: string;
  colorFrom: string;
  colorTo: string;
  accentColor: string;
  features: Feature[];
  modules: Module[];
  benefits: Benefit[];
  useCases: UseCase[];
  screenshots: Screenshot[];
  faq: FAQItem[];
  pricing: Pricing;
  isHighlighted: boolean;
  status: "active" | "coming-soon";
  demoUrl?: string;
  ctaLabel?: string;
  whatsapp?: string;
  downloads?: Download[];
  downloadVersion?: string;
}

export interface Service {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  icon: string;
  features: string[];
  category: string;
}

export interface Industry {
  name: string;
  icon: string;
  description: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  product?: string;
}

export interface Lead {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  product?: string;
  reason: string;
  message: string;
  createdAt: Date;
  source?: string;
}
