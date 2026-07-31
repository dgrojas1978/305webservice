import { CARD_PROFILES } from "~/data/card";
import { bumpTaps, findLink, normalizeSlug } from "~/lib/shortlinks";
import { buildTapEvent, logTap } from "~/lib/tapLog";

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

export async function cardRedirect(
  slug: string, requestUrl: string, headers?: Headers,
): Promise<Response> {
  const profile = CARD_PROFILES[slug];
  const url = new URL(requestUrl);

  // Sin perfil fijo: puede ser un enlace virtual de cliente guardado en la BD.
  // Los perfiles en código mandan, para que /c/305 nunca dependa de la BD.
  if (!profile) return dbRedirect(slug, url, headers);

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

  if (headers) {
    void logTap(buildTapEvent(profile.nfc.slug, "profile", dest.toString(), url, headers));
  }
  return Response.redirect(dest.toString(), 302);
}

/**
 * Enlace virtual de cliente. El chip NFC guarda /c/<slug> y el destino real
 * vive en la BD, asi que se puede cambiar sin reprogramar la tarjeta.
 *
 * SIEMPRE 302, nunca 301: un 301 se cachea de forma permanente en el navegador
 * y dejaria el destino congelado, que es justo lo contrario de lo que buscamos.
 */
async function dbRedirect(
  rawSlug: string, url: URL, headers?: Headers,
): Promise<Response> {
  const home = new URL("/", url.origin).toString();
  const slug = normalizeSlug(rawSlug);
  if (!slug) return Response.redirect(home, 302);

  let link;
  try {
    link = await findLink(slug);
  } catch {
    // Si la BD no responde, la tarjeta lleva a la home en vez de a un error.
    return Response.redirect(home, 302);
  }
  if (!link || !link.active) return Response.redirect(home, 302);

  void bumpTaps(slug);
  if (headers) {
    void logTap(buildTapEvent(slug, "link", link.target, url, headers, {
      business: link.business, owner: link.owner,
      cardId: link.cardId, context: link.context,
    }));
  }

  // La atribucion que trae la peticion se conserva: un escaneo QR y un toque
  // NFC deben poder distinguirse en la analitica del destino.
  const dest = new URL(link.target);
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const value = url.searchParams.get(key);
    if (value) dest.searchParams.set(key, value.slice(0, 120));
  }
  return Response.redirect(dest.toString(), 302);
}
