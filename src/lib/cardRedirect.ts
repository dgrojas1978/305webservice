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
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
const UTM_MAX = 120;

export function cardRedirect(slug: string, requestUrl: string): Response {
  const profile = CARD_PROFILES[slug];
  const url = new URL(requestUrl);

  // Slug desconocido → home. Nunca un destino roto.
  if (!profile) return Response.redirect(new URL("/", url.origin).toString(), 302);

  // El destino se resuelve contra el ORIGEN de la petición: en staging apunta
  // a staging y en producción a producción, sin hardcodear ningún host.
  const dest = new URL(profile.nfc.canonicalPath, url.origin);

  // La atribución que YA trae la petición manda. El QR impreso en la tarjeta
  // física llega con `utm_source=qr&utm_medium=physical-card`; si aquí se
  // reescribiera, un escaneo sería indistinguible de un toque NFC y la campaña
  // de la pieza impresa nunca aparecería en analítica.
  let carried = false;
  for (const key of UTM_KEYS) {
    const value = url.searchParams.get(key);
    if (value) {
      dest.searchParams.set(key, value.slice(0, UTM_MAX));
      carried = true;
    }
  }

  // Sin UTMs propias: valores por defecto del toque NFC (`?src=` los afina).
  if (!carried) {
    const src = url.searchParams.get("src") ?? "nfc";
    dest.searchParams.set("utm_source", SOURCES.has(src) ? src : "nfc");
    dest.searchParams.set("utm_medium", "digital-card");
    dest.searchParams.set("utm_campaign", `card-${profile.nfc.slug}`);
  }

  return Response.redirect(dest.toString(), 302);
}
