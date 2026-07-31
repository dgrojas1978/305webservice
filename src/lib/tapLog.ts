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
  /** Atribución CONGELADA en el momento del toque. Si mañana la tarjeta cambia
   *  de dueño, los taps antiguos siguen contando para quien la tenía entonces. */
  business: string | null;
  owner: string | null;
  cardId: string | null;
  context: string | null;
  /** IP de origen tal cual la reporta el proxy. Dato personal. */
  ip: string | null;
  /** Ubicación aproximada derivada de la IP por el edge. Nunca GPS. */
  country: string | null;
  region: string | null;
  city: string | null;
  timezone: string | null;
  /**
   * Las mismas coordenadas que el edge deriva de la IP, en número. NO es GPS:
   * es el centro aproximado de la ciudad que ya se guarda como texto, así que
   * no añade precisión sobre `city` — solo permite dibujarla en un mapa.
   * Un punto en un mapa NO señala dónde estaba una persona.
   */
  latitude: number | null;
  longitude: number | null;
  /** Identificador anonimo del navegador. NO identifica a una persona: solo
   *  permite separar "100 toques" de "68 dispositivos distintos". */
  visitorId: string | null;
  /** Primera vez que este navegador toca CUALQUIER tarjeta nuestra. */
  firstVisit: boolean;
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
  attribution?: { business?: string; owner?: string; cardId?: string; context?: string },
  visitor?: { id: string; isNew: boolean },
): TapEvent {
  const utm: Record<string, string> = {};
  for (const k of UTM_KEYS) {
    const v = url.searchParams.get(k);
    if (v) utm[k] = v.slice(0, 120);
  }
  const h = (name: string) => clip(headers.get(name), 120);
  // Vercel manda la latitud y la longitud de la MISMA búsqueda por IP que ya da
  // la ciudad. Si la cabecera no llega, queda en null: nunca se inventa un punto.
  const num = (name: string) => {
    const v = Number(headers.get(name));
    return Number.isFinite(v) ? v : null;
  };
  // x-forwarded-for puede traer una cadena de proxies: el cliente es el primero.
  const fwd = headers.get("x-forwarded-for");
  const city = h("x-vercel-ip-city");
  return {
    slug,
    at: new Date(),
    kind,
    business: attribution?.business || null,
    owner: attribution?.owner || null,
    cardId: attribution?.cardId || null,
    context: attribution?.context || null,
    visitorId: visitor?.id ?? null,
    firstVisit: visitor?.isNew ?? false,
    ip: (fwd ? fwd.split(",")[0]?.trim() : null) || h("x-real-ip"),
    country: h("x-vercel-ip-country"),
    region: h("x-vercel-ip-country-region"),
    city: city ? decodeURIComponent(city) : null,
    timezone: h("x-vercel-ip-timezone"),
    latitude: num("x-vercel-ip-latitude"),
    longitude: num("x-vercel-ip-longitude"),
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
/** Retencion declarada en la politica de privacidad: 12 meses. */
export const RETENTION_DAYS = 365;

let indexReady = false;

/**
 * Indice TTL: Mongo borra cada evento a los 12 meses por si solo.
 *
 * La retencion se APLICA, no se promete. Un texto legal que dice "12 meses"
 * mientras la base guarda todo para siempre es una declaracion falsa.
 * Se crea una vez por proceso y nunca bloquea el registro.
 */
async function ensureRetention(): Promise<void> {
  if (indexReady) return;
  indexReady = true;
  try {
    await (await getDb()).collection("taps")
      .createIndex({ at: 1 }, { expireAfterSeconds: RETENTION_DAYS * 24 * 60 * 60 });
  } catch {
    /* si falla, se reintenta en el proximo arranque */
  }
}

export async function logTap(event: TapEvent): Promise<void> {
  try {
    void ensureRetention();
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

const VISITOR_COOKIE = "305_v";
const VISITOR_MAX_AGE = 60 * 60 * 24 * 365; // 1 año

/**
 * Identificador anonimo de navegador. No lleva ningun dato personal: es un
 * numero aleatorio. Sirve para distinguir visitantes nuevos de recurrentes,
 * algo que la IP NO permite — en una red movil media ciudad comparte IP.
 */
export function resolveVisitor(headers: Headers): { id: string; isNew: boolean } {
  const raw = headers.get("cookie") ?? "";
  const existing = raw.split(";").map((c) => c.trim())
    .find((c) => c.startsWith(`${VISITOR_COOKIE}=`))?.slice(VISITOR_COOKIE.length + 1);
  if (existing && /^[a-zA-Z0-9_-]{10,64}$/.test(existing)) {
    return { id: existing, isNew: false };
  }
  return { id: crypto.randomUUID().replace(/-/g, "").slice(0, 24), isNew: true };
}

export function visitorCookie(id: string): string {
  return `${VISITOR_COOKIE}=${id}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${VISITOR_MAX_AGE}`;
}
