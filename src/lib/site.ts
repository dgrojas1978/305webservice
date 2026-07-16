/**
 * Single source of truth for site-wide constants.
 *
 * Contact details are environment-driven so production values live in
 * Vercel env vars, never hardcoded in components:
 *   - VITE_WHATSAPP_NUMBER  digits only, incl. country code (e.g. 13055551234)
 *   - VITE_CONTACT_EMAIL    public contact email
 *
 * NOTE: the fallback WhatsApp number below is the value currently published
 * on the live site. It looks like a placeholder (305-123-4567) — verify and
 * set the real number in VITE_WHATSAPP_NUMBER before relying on it.
 */

export const SITE_URL = "https://www.305webservice.com";
export const SITE_NAME = "305 Web Service";

export const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP_NUMBER || "13051234567";
export const CONTACT_EMAIL =
  import.meta.env.VITE_CONTACT_EMAIL || "info@305webservice.com";

/** wa.me link with an optional prefilled message. */
export function waLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const WA_DEFAULT_MESSAGE =
  "Hi! I'd like to talk about a project for my business.";

export const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/web-design", label: "Web Design" },
  { href: "/custom-software", label: "Custom Software" },
  { href: "/it-infrastructure", label: "IT Infrastructure" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

/** Canonical URL for a route path ("/", "/services", ...). */
export function canonical(path: string): string {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}
