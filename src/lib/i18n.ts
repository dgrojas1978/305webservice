/**
 * i18n — inglés por defecto en la raíz, español bajo /es/*.
 * Rutas y metadatos separados por idioma; el selector EN/ES
 * enlaza siempre a la página equivalente.
 */

export type Locale = "en" | "es";

export type PageKey =
  | "home"
  | "services"
  | "websitePackages"
  | "customSoftware"
  | "automation"
  | "itInfrastructure"
  | "nfc"
  | "industries"
  | "process"
  | "about"
  | "contact"
  | "privacy";

export const PATHS: Record<PageKey, Record<Locale, string>> = {
  home: { en: "/", es: "/es" },
  services: { en: "/services", es: "/es/servicios" },
  websitePackages: { en: "/website-packages", es: "/es/paquetes-web" },
  customSoftware: { en: "/custom-software", es: "/es/software-a-medida" },
  automation: { en: "/automation-integrations", es: "/es/automatizacion-integraciones" },
  itInfrastructure: { en: "/it-infrastructure", es: "/es/infraestructura-it" },
  nfc: { en: "/nfc-business-solutions", es: "/es/soluciones-nfc" },
  industries: { en: "/industries", es: "/es/industrias" },
  process: { en: "/process", es: "/es/proceso" },
  about: { en: "/about", es: "/es/nosotros" },
  contact: { en: "/contact", es: "/es/contacto" },
  privacy: { en: "/privacy", es: "/es/privacidad" },
};

/** Página equivalente en el otro idioma (para el selector y hreflang). */
export function altPath(page: PageKey, locale: Locale): string {
  return PATHS[page][locale === "en" ? "es" : "en"];
}

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "es" : "en";
}

/** Mapea el id de una oferta a la PageKey de su página de detalle. */
export const OFFER_PAGE: Record<string, PageKey> = {
  "website-starter": "websitePackages",
  "business-website": "websitePackages",
  "online-store": "websitePackages",
  "custom-software": "customSoftware",
  automation: "automation",
  "it-infrastructure": "itInfrastructure",
  nfc: "nfc",
};

export const HTML_LANG: Record<Locale, string> = { en: "en", es: "es" };
