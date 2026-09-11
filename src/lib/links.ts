import { PATHS, type Locale } from "~/lib/i18n";
import { waLink } from "~/lib/site";

/** Enlace al formulario de cotización, llevando el servicio preseleccionado. */
export function quoteLink(locale: Locale, service?: string): string {
  const base = PATHS.contact[locale];
  return service ? `${base}?service=${encodeURIComponent(service)}` : base;
}

/**
 * Mensaje de WhatsApp por idioma, opcionalmente con el servicio. Dice que llega
 * desde el sitio (la tarjeta digital manda el suyo) y termina en «Mi nombre es»
 * para que quien escribe se presente.
 */
export function waQuote(locale: Locale, serviceLabel?: string): string {
  const msg =
    locale === "es"
      ? `¡Hola 305 Web Service! Les escribo desde su sitio web.${serviceLabel ? ` Me interesa: ${serviceLabel}.` : ""} Mi nombre es `
      : `Hi 305 Web Service! I'm writing from your website.${serviceLabel ? ` I'm interested in: ${serviceLabel}.` : ""} My name is `;
  return waLink(msg);
}
