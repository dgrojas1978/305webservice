import { CARD_PROFILES } from "~/data/card";

/**
 * Redirección corta y estable para tarjetas físicas.
 *
 * El chip NFC y el QR impreso guardan SIEMPRE una URL corta del dominio
 * definitivo (`/c/<slug>`), nunca la URL del perfil ni una URL temporal de
 * despliegue. Así el destino se puede cambiar sin reprogramar tarjetas.
 *
 * `/nfc/<slug>` se mantiene como alias equivalente (ya documentado).
 */
const SOURCES = new Set(["nfc", "qr", "share"]);

export function cardRedirect(slug: string, requestUrl: string): Response {
  const profile = CARD_PROFILES[slug];
  const url = new URL(requestUrl);

  // Slug desconocido → home. Nunca un destino roto.
  if (!profile) return Response.redirect(new URL("/", url.origin).toString(), 302);

  const src = url.searchParams.get("src") ?? "nfc";
  const source = SOURCES.has(src) ? src : "nfc";

  // El destino se resuelve contra el ORIGEN de la petición: en staging apunta
  // a staging y en producción a producción, sin hardcodear ningún host.
  const dest = new URL(profile.nfc.canonicalPath, url.origin);
  dest.searchParams.set("utm_source", source);
  dest.searchParams.set("utm_medium", "digital-card");
  dest.searchParams.set("utm_campaign", `card-${profile.nfc.slug}`);

  return Response.redirect(dest.toString(), 302);
}
