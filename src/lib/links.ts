import { PATHS, type Locale } from "~/lib/i18n";
import { waLink } from "~/lib/site";

/** Enlace al formulario de cotización, llevando el servicio preseleccionado. */
export function quoteLink(locale: Locale, service?: string): string {
  const base = PATHS.contact[locale];
  return service ? `${base}?service=${encodeURIComponent(service)}` : base;
}

/** Mensaje de WhatsApp por idioma, opcionalmente con el servicio. */
export function waQuote(locale: Locale, serviceLabel?: string): string {
  const msg =
    locale === "es"
      ? serviceLabel
        ? `Hola, me interesa: ${serviceLabel}. Quisiera una cotización.`
        : "Hola, me gustaría hablar de un proyecto para mi negocio."
      : serviceLabel
        ? `Hi! I'm interested in: ${serviceLabel}. I'd like a quote.`
        : "Hi! I'd like to talk about a project for my business.";
  return waLink(msg);
}
