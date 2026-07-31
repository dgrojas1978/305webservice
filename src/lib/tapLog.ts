import { getDb } from "~/lib/db";

/**
 * Registro de toques NFC y escaneos de QR de TODAS las tarjetas.
 *
 * Se registra en las dos rutas de redirección: la de perfiles fijos en código
 * (`/c/305`) y la de enlaces de cliente guardados en la BD (`/c/aguiar-flooring`).
 * Si solo se cubriera una, faltarían tarjetas.
 *
 * Reglas duras:
 *  - NUNCA bloquea ni retrasa la redirección. Si falla, la tarjeta funciona igual.
 *  - Solo datos que llegan solos en la petición. No se pide geolocalización
 *    precisa: eso exige permiso explícito y no tiene sentido en un redirect.
 *  - La ubicación es la que deriva el edge de la IP: país, región y ciudad.
 *    Es aproximada por definición; no ubica a una persona.
 *
 * La IP es dato personal. Se guarda porque el propietario lo pidió, y eso
 * obliga a declararlo en la política de privacidad.
 */
export interface TapEvent {
  slug: string;
  at: Date;
  /** Perfil fijo en código o enlace de cliente en la BD. */
  kind: "profile" | "link";
  /** IP de origen tal cual la reporta el proxy. Dato personal. */
  ip: string | null;
  /** Ubicación aproximada derivada de la IP por el edge. Nunca GPS. */
  country: string | null;
  region: string | null;
  city: string | null;
  timezone: string | null;
  userAgent: string | null;
  referer: string | null;
  /** Atribución del enlace: distingue toque NFC de escaneo QR. */
  utm: Record<string, string>;
  target: string;
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

function clip(v: string | null, max: number): string | null {
  return v ? v.slice(0, max) : null;
}

/** Construye el evento a partir de la petición. No toca la base. */
export function buildTapEvent(
  slug: string, kind: TapEvent["kind"], target: string, url: URL, headers: Headers,
): TapEvent {
  const utm: Record<string, string> = {};
  for (const k of UTM_KEYS) {
    const v = url.searchParams.get(k);
    if (v) utm[k] = v.slice(0, 120);
  }
  const h = (name: string) => clip(headers.get(name), 120);
  // x-forwarded-for puede traer una cadena de proxies: el cliente es el primero.
  const fwd = headers.get("x-forwarded-for");
  const city = h("x-vercel-ip-city");
  return {
    slug,
    at: new Date(),
    kind,
    ip: (fwd ? fwd.split(",")[0]?.trim() : null) || h("x-real-ip"),
    country: h("x-vercel-ip-country"),
    region: h("x-vercel-ip-country-region"),
    city: city ? decodeURIComponent(city) : null,
    timezone: h("x-vercel-ip-timezone"),
    userAgent: clip(headers.get("user-agent"), 300),
    referer: clip(headers.get("referer"), 300),
    utm,
    target,
  };
}

/**
 * Guarda el evento sin esperar. Se llama con `void`: la redirección sale ya.
 * Cualquier fallo se traga a propósito — la analítica jamás puede impedir que
 * una tarjeta que alguien tiene en la mano funcione.
 */
export async function logTap(event: TapEvent): Promise<void> {
  try {
    await (await getDb()).collection<TapEvent>("taps").insertOne(event);
  } catch {
    /* silencio deliberado */
  }
}

/** Últimos toques de un enlace, para el panel. */
export async function recentTaps(slug: string, limit = 20): Promise<TapEvent[]> {
  try {
    return await (await getDb()).collection<TapEvent>("taps")
      .find({ slug }).sort({ at: -1 }).limit(limit).toArray();
  } catch {
    return [];
  }
}
