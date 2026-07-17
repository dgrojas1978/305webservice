/**
 * i18n — inglés por defecto en la raíz, español bajo /es/*.
 * Rutas y metadatos separados por idioma; el selector EN/ES
 * enlaza siempre a la página equivalente.
 */

export type Locale = "en" | "es";

export type PageKey =
  | "home"
  | "services"
  | "process"
  | "about"
  | "contact"
  | "privacy";

export const PATHS: Record<PageKey, Record<Locale, string>> = {
  home: { en: "/", es: "/es" },
  services: { en: "/services", es: "/es/servicios" },
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

export const HTML_LANG: Record<Locale, string> = { en: "en", es: "es" };
