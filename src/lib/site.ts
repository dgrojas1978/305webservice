/**
 * Single source of truth for site-wide constants.
 *
 * Contact details are environment-driven so production values live in
 * Vercel env vars, never hardcoded in components:
 *   - VITE_WHATSAPP_NUMBER  digits only, incl. country code (e.g. 13055551234)
 *   - VITE_CONTACT_EMAIL    public contact email
 */

export const SITE_URL = "https://www.305webservice.com";
export const SITE_NAME = "305 Web Service";

export const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP_NUMBER || "13058332984";
/** Confirmado por Dany (jul 2026) para todas las piezas de marca. */
export const CONTACT_EMAIL =
  import.meta.env.VITE_CONTACT_EMAIL || "305webservice@gmail.com";
/** Número público en formato US. */
export const PHONE_DISPLAY = "(305) 833-2984";
export const PHONE_TEL = "+13058332984";
export const WEB_DISPLAY = "305WEBSERVICE.COM";

/** Redes verificadas. Solo se listan las que existen de verdad. */
export const FACEBOOK_URL = "https://www.facebook.com/305webservice";

/** wa.me link with an optional prefilled message. */
export function waLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Canonical URL for a route path ("/", "/services", ...). */
export function canonical(path: string): string {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}
