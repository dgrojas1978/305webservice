export const erpConfig = {
  productName: "Ventaro",
  slug: "ventaro",
  version: import.meta.env.VITE_ERP_VERSION || "2.1.0",
  releaseDate: "Junio 2025",

  demoUrl:  import.meta.env.VITE_ERP_DEMO_URL  || "https://demo.axiserp.com",
  demoUser: import.meta.env.VITE_ERP_DEMO_USER || "demo@empresa.com",
  demoPass: import.meta.env.VITE_ERP_DEMO_PASS || "Demo2024",

  downloads: {
    windows:   import.meta.env.VITE_ERP_WINDOWS_DOWNLOAD || "#",
    android:   import.meta.env.VITE_ERP_ANDROID_DOWNLOAD || "#",
    server:    import.meta.env.VITE_ERP_SERVER_DOWNLOAD  || "#",
    docs:      import.meta.env.VITE_ERP_DOCS_URL         || "#",
    video:     import.meta.env.VITE_ERP_VIDEO_URL        || "#",
    manual:    import.meta.env.VITE_ERP_MANUAL_URL       || "#",
    changelog: import.meta.env.VITE_ERP_CHANGELOG_URL    || "#",
  },

  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || "13051234567",

  pricing: {
    starter:      { monthly: 19,  annual: 190 },
    professional: { monthly: 39,  annual: 390 },
    restaurant:   { monthly: 59,  annual: 590 },
  },
} as const;

export function erpWhatsApp(topic?: string): string {
  const msg = topic
    ? `Hola, me interesa Ventaro — ${topic}. ¿Me pueden ayudar?`
    : "Hola, me interesa Ventaro. ¿Me pueden dar más información?";
  return `https://wa.me/${erpConfig.whatsappNumber}?text=${encodeURIComponent(msg)}`;
}
