/**
 * Datos estructurados Schema.org — SOLO datos verificados.
 * Sin dirección postal (no publicada), sin reseñas/ratings inventados.
 */
import { SITE_URL } from "~/lib/site";

const BASE = {
  name: "305 Web Service",
  url: `${SITE_URL}/`,
  telephone: "+13058332984",
  email: "305webservice@gmail.com",
  areaServed: ["Miami, Florida", "United States"],
  address: { "@type": "PostalAddress", addressLocality: "Miami", addressRegion: "FL", addressCountry: "US" },
  knowsLanguage: ["en", "es"],
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#business`,
  ...BASE,
  description:
    "Web design, custom software, automation, IT infrastructure and NFC business solutions for small and growing businesses in Miami and across the United States.",
};

export function serviceSchema(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${SITE_URL}${path}`,
    provider: { "@type": "ProfessionalService", "@id": `${SITE_URL}/#business`, name: BASE.name },
    areaServed: BASE.areaServed,
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path === "/" ? "/" : it.path}`,
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
