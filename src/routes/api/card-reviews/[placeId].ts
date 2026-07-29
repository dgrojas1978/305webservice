import type { APIEvent } from "@solidjs/start/server";

/**
 * Google Places API (New) — Place Details, SIEMPRE server-side.
 *
 * · La API key vive en GOOGLE_PLACES_API_KEY y nunca se expone al cliente.
 * · Se piden solo los campos que se usan (FieldMask).
 * · Caché en memoria con TTL corto: únicamente el Place ID es un dato que el
 *   producto persiste; el contenido de Google se trata como efímero.
 * · Si Google falla, se devuelve un estado y la tarjeta sigue funcionando.
 * · Nunca se modifica ni se traduce el texto de una reseña: se devuelven el
 *   texto mostrado y el original para que la UI pueda declarar la traducción.
 */

const FIELD_MASK = [
  "id",
  "displayName",
  "rating",
  "userRatingCount",
  "reviews",
  "googleMapsUri",
  "reviewsUri",
  "formattedAddress",
  "shortFormattedAddress",
  "location",
  "regularOpeningHours",
  "businessStatus",
  "pureServiceAreaBusiness",
].join(",");

/** TTL del caché en memoria (documentado en CARD-SYSTEM.md). */
const TTL_MS = 6 * 60 * 60 * 1000; // 6 h
const TIMEOUT_MS = 5000;
const MAX_REVIEWS = 3;

type CacheEntry = { at: number; body: unknown };
const cache = new Map<string, CacheEntry>();

/** Rate limit simple en memoria por IP (protege la cuota de Places). */
const RATE_LIMIT = 30; // peticiones
const RATE_WINDOW_MS = 60 * 1000;
const hits = new Map<string, { n: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const cur = hits.get(ip);
  if (!cur || now > cur.reset) {
    hits.set(ip, { n: 1, reset: now + RATE_WINDOW_MS });
    return false;
  }
  cur.n += 1;
  return cur.n > RATE_LIMIT;
}

function json(body: unknown, status = 200, cacheSeconds = 0) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": cacheSeconds ? `public, max-age=${cacheSeconds}` : "no-store",
    },
  });
}

export async function GET({ params, request }: APIEvent) {
  const placeId = (params.placeId || "").trim();
  const key = process.env.GOOGLE_PLACES_API_KEY;

  if (!placeId) return json({ status: "not-configured" }, 200);
  if (!key) {
    // Falta configuración: el visitante simplemente no ve el módulo.
    return json({ status: "not-configured" }, 200);
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) return json({ status: "unavailable" }, 429);

  const cached = cache.get(placeId);
  if (cached && Date.now() - cached.at < TTL_MS) return json(cached.body, 200);

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      signal: ctrl.signal,
    });

    if (res.status === 429) return json({ status: "quota" }, 200);
    if (!res.ok) {
      console.error("[305WS] Places API error:", res.status);
      return json({ status: "unavailable" }, 200);
    }

    const d = await res.json();

    const reviews = Array.isArray(d.reviews)
      ? d.reviews.slice(0, MAX_REVIEWS).map((r: Record<string, any>) => ({
          id: r.name,
          rating: r.rating,
          // Texto mostrado por Google + original: la UI declara si hubo traducción.
          text: r.text?.text ?? "",
          textLanguage: r.text?.languageCode ?? "",
          originalLanguage: r.originalText?.languageCode ?? "",
          relativeTime: r.relativePublishTimeDescription ?? "",
          authorName: r.authorAttribution?.displayName ?? "",
          authorUri: r.authorAttribution?.uri ?? "",
          authorPhoto: r.authorAttribution?.photoUri ?? "",
          googleMapsUri: r.googleMapsUri ?? "",
        }))
      : [];

    const body = {
      status: d.rating || reviews.length ? "ok" : "no-reviews",
      placeId: d.id ?? placeId,
      name: d.displayName?.text ?? "",
      rating: d.rating ?? null,
      userRatingCount: d.userRatingCount ?? 0,
      googleMapsUri: d.googleMapsUri ?? "",
      reviewsUri: d.reviewsUri ?? "",
      formattedAddress: d.formattedAddress ?? "",
      shortFormattedAddress: d.shortFormattedAddress ?? "",
      openingHours: d.regularOpeningHours?.weekdayDescriptions ?? [],
      businessStatus: d.businessStatus ?? "",
      pureServiceAreaBusiness: !!d.pureServiceAreaBusiness,
      reviews,
    };

    cache.set(placeId, { at: Date.now(), body });
    return json(body, 200);
  } catch (err) {
    console.error("[305WS] Places API request failed:", (err as Error).name);
    return json({ status: "unavailable" }, 200);
  } finally {
    clearTimeout(timer);
  }
}
