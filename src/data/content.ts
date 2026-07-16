/**
 * All marketing copy for the site, in US English.
 * Keep copy here — components stay presentational.
 */

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  href: string;
  price?: string;
  cta?: { label: string; href: string };
}

export const SERVICES: ServiceItem[] = [
  {
    id: "web-design",
    title: "Professional Web Design",
    description:
      "Modern, fast, secure and responsive websites designed to turn visitors into customers.",
    bullets: [
      "Custom design",
      "Mobile optimization",
      "Contact forms",
      "WhatsApp integration",
      "Domain configuration and SSL",
      "Basic SEO",
      "Social media integration",
    ],
    price: "Starting at $499",
    href: "/web-design",
    cta: { label: "View Website Plans", href: "/web-design" },
  },
  {
    id: "custom-software",
    title: "Custom Software",
    description:
      "Custom systems designed around your company's real workflows — not the other way around.",
    bullets: [
      "Administrative systems",
      "Customer portals",
      "Web and mobile applications",
      "Internal tools",
      "Reservation and membership platforms",
      "Inventory systems",
      "Management dashboards",
    ],
    href: "/custom-software",
    cta: { label: "Discuss Your Project", href: "/contact?service=custom-software" },
  },
  {
    id: "automation",
    title: "Business Automation",
    description:
      "Automate repetitive work and connect the tools your business already uses.",
    bullets: [
      "CRM integrations",
      "Smart forms",
      "Email automation and notifications",
      "Invoicing workflows",
      "WhatsApp automation",
      "AI-assisted workflows",
      "Internal approvals",
    ],
    href: "/services#automation",
  },
  {
    id: "networks",
    title: "Business Networks",
    description:
      "Design, installation and maintenance of reliable business networks.",
    bullets: [
      "Business Wi-Fi",
      "Routers and switches",
      "Cabling",
      "Network segmentation",
      "Troubleshooting",
      "Secure remote access",
      "Monitoring",
    ],
    href: "/it-infrastructure",
  },
  {
    id: "servers",
    title: "Servers & Infrastructure",
    description:
      "Configuration, protection, migration and maintenance of physical and cloud infrastructure.",
    bullets: [
      "Windows Server and Linux",
      "Active Directory",
      "File servers",
      "Backups",
      "Cloud migrations",
      "Domains and email",
      "Security",
    ],
    href: "/it-infrastructure",
  },
  {
    id: "support",
    title: "IT Support & Consulting",
    description:
      "Remote and on-site support, technology assessments, maintenance, security and project planning.",
    bullets: [
      "Remote and on-site support",
      "Technology assessments",
      "Preventive maintenance",
      "Security reviews",
      "Project planning",
    ],
    href: "/services#support",
  },
];

export interface Plan {
  id: string;
  name: string;
  price: string;
  tagline: string;
  features: string[];
  cta: { label: string; href: string };
  featured?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "Starting at $499",
    tagline: "A professional online presence, done right.",
    features: [
      "One-page website or landing page",
      "Responsive design",
      "Service sections",
      "Contact form",
      "WhatsApp button",
      "Social media integration",
      "Domain and SSL configuration",
      "Basic SEO",
      "One revision round",
    ],
    cta: { label: "Start My Website", href: "/contact?service=website&plan=starter" },
    featured: true,
  },
  {
    id: "business",
    name: "Business",
    price: "Custom quote",
    tagline: "A complete website for a growing business.",
    features: [
      "Up to five pages",
      "Custom design",
      "Advanced forms",
      "Google Maps",
      "Integrations",
      "Blog or news",
      "Analytics",
      "SEO optimization",
      "Basic training",
    ],
    cta: { label: "Request a Quote", href: "/contact?service=website&plan=business" },
  },
  {
    id: "professional",
    name: "Professional",
    price: "Custom quote",
    tagline: "Advanced functionality built around your operation.",
    features: [
      "Customer portals",
      "Reservations",
      "Online payments",
      "Product catalogs",
      "Memberships",
      "Automations",
      "Admin dashboard",
      "Custom functionality",
    ],
    cta: { label: "Request a Quote", href: "/contact?service=website&plan=professional" },
  },
];

export const PRICING_NOTE =
  "Final pricing depends on content, integrations and required functionality. Domain, hosting, maintenance and additional services will be clearly detailed in the quote.";

export const CAPABILITIES = [
  "Corporate websites",
  "Landing pages",
  "Online stores",
  "Digital catalogs",
  "Customer portals",
  "Internal business systems",
  "Web and mobile applications",
  "Reservations and memberships",
  "Online payments",
  "Automations and integrations",
  "Dashboards and reports",
];

export interface ProcessStep {
  title: string;
  description: string;
}

export const PROCESS: ProcessStep[] = [
  {
    title: "Understand Your Needs",
    description: "We learn about your business, the problem and the desired outcome.",
  },
  {
    title: "Define the Solution",
    description: "We establish the scope, price, deliverables and project schedule.",
  },
  {
    title: "Design and Development",
    description: "We build the solution with clear reviews throughout the process.",
  },
  {
    title: "Launch and Support",
    description: "We configure, launch, train and provide ongoing support.",
  },
];

export const WHY_ITEMS = [
  {
    title: "Complete technology solutions",
    description: "Website, software, network and support — one team that sees the whole picture.",
  },
  {
    title: "Direct communication",
    description: "You talk directly with the people who build your solution.",
  },
  {
    title: "Custom development",
    description: "Built around your workflows, not a one-size-fits-all template.",
  },
  {
    title: "Technology explained clearly",
    description: "Plain-language recommendations, so you always know what you're paying for.",
  },
  {
    title: "Solutions designed to grow",
    description: "Start with what you need today and expand when your business is ready.",
  },
  {
    title: "Local in Miami, remote nationwide",
    description: "On-site service in Miami and remote service across the United States.",
  },
  {
    title: "Bilingual service",
    description: "Full service in English and Spanish, whichever your team prefers.",
  },
];

export const INFRA_ITEMS = [
  "Wi-Fi",
  "Cabling",
  "Routers and switches",
  "Servers",
  "Cloud infrastructure",
  "Backups",
  "Security",
  "Remote access",
  "Monitoring",
  "Maintenance",
];

export const TRUST_SIGNALS = [
  "Bilingual service in English and Spanish",
  "Local service in Miami",
  "Remote service across the United States",
  "Solutions tailored to each business",
  "Direct access to the technical team",
];

/** Quote form options */
export const FORM_SERVICES = [
  { value: "website", label: "Website" },
  { value: "online-store", label: "Online store" },
  { value: "custom-software", label: "Custom software" },
  { value: "app", label: "Web or mobile application" },
  { value: "automation", label: "Automation" },
  { value: "networks", label: "Networks" },
  { value: "servers", label: "Servers" },
  { value: "it-support", label: "IT support" },
  { value: "consulting", label: "Consulting" },
  { value: "other", label: "Other" },
];

export const FORM_BUDGETS = [
  { value: "500-1500", label: "$500–$1,500" },
  { value: "1500-5000", label: "$1,500–$5,000" },
  { value: "5000-15000", label: "$5,000–$15,000" },
  { value: "15000-plus", label: "More than $15,000" },
  { value: "not-sure", label: "Not sure" },
];

export const FORM_CONTACT_METHODS = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone call" },
  { value: "whatsapp", label: "WhatsApp" },
];

/** FAQ shown on the Web Design page (answers stick to verified facts). */
export const WEB_DESIGN_FAQ = [
  {
    question: "How much does a professional website cost?",
    answer:
      "Starter websites begin at $499 for a one-page site or landing page. Multi-page websites and sites with advanced functionality are quoted individually based on content, integrations and required features. Every quote clearly details domain, hosting, maintenance and any additional services.",
  },
  {
    question: "What is included in the $499 Starter website?",
    answer:
      "A one-page website or landing page with responsive design, service sections, a contact form, a WhatsApp button, social media integration, domain and SSL configuration, basic SEO and one revision round.",
  },
  {
    question: "How long does it take to build a website?",
    answer:
      "It depends on the scope of the project and how quickly content is ready. When we define your project, we agree on a clear schedule before work begins.",
  },
  {
    question: "Do you work with businesses outside Miami?",
    answer:
      "Yes. We serve Miami locally and work remotely with businesses across the United States, in English or Spanish.",
  },
  {
    question: "Can my website grow later?",
    answer:
      "Yes. We build websites so they can expand over time — more pages, online payments, customer portals, reservations or custom functionality can be added when your business needs them.",
  },
];
