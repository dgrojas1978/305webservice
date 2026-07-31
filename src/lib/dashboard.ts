import { getDb } from "~/lib/db";

/**
 * Consultas del panel de tarjetas NFC.
 *
 * Todo sale de lo que ya se guarda solo: `taps` (toques y escaneos) y `events`
 * (comportamiento dentro de la tarjeta). Aquí no se inventa ni se estima nada:
 * si un dato no está, el bloque se queda vacío y lo dice.
 *
 * Dos reglas que gobiernan este archivo:
 *
 *  1. `visitorId` es lo único que une un toque con lo que la persona hizo
 *     después. Sin él hay dos tablas que no se hablan.
 *  2. La atribución de `taps` está CONGELADA en el momento del toque. Nunca se
 *     re-resuelve contra `links`: eso reescribiría la historia cada vez que se
 *     edita un enlace y las cifras de un vendedor cambiarían solas.
 */

/** Zona horaria del negocio. Sin esto, "hora del día" sale en UTC y miente. */
const TZ = "America/New_York";

/**
 * Base mínima para publicar un porcentaje. Por debajo se muestran los números
 * absolutos y se calla la tasa: un 33% sobre 3 eventos no es una tasa, es ruido
 * con símbolo de porcentaje.
 */
export const MIN_RATE_BASE = 30;

/**
 * Acciones de contacto. Son CUATRO nombres, no dos.
 *
 * `call_click` lo emite el `data-track` del botón de llamar de la tarjeta;
 * `phone_click` lo emite el detector genérico de AnalyticsListener para
 * cualquier `tel:` que no lleve `data-track` encima. Los dos existen de verdad
 * en la base. Contar solo uno pierde llamadas de forma silenciosa.
 */
export const CONTACT_EVENTS = ["call_click", "phone_click", "whatsapp_click", "email_click"];

/**
 * Tope de identificadores que se cruzan en memoria para el embudo. Si se pasa,
 * el embudo se calcula sobre una muestra y el panel lo DICE (`truncated`).
 * Un recorte silencioso se leería como "esto es todo" sin serlo.
 */
const VISITOR_CAP = 50_000;

export type RangeKey = "7" | "30" | "90" | "all";

export const RANGES: { key: RangeKey; label: string }[] = [
  { key: "7", label: "7 días" },
  { key: "30", label: "30 días" },
  { key: "90", label: "90 días" },
  { key: "all", label: "Todo" },
];

export function normalizeRange(raw: unknown): RangeKey {
  const v = String(raw ?? "30");
  return RANGES.some((r) => r.key === v) ? (v as RangeKey) : "30";
}

export interface Metric { label: string; n: number }

export interface AttributionRow {
  business: string | null;
  owner: string | null;
  cardId: string | null;
  context: string | null;
  taps: number;
  visitors: number;
  contacts: number;
}

export interface PlaceRow {
  city: string | null;
  region: string | null;
  country: string | null;
  n: number;
}

export interface DashboardData {
  range: RangeKey;
  /** ISO — nunca objetos Date ni ObjectId: no sobreviven la serialización. */
  from: string | null;
  business: string | null;
  businesses: string[];
  totals: { taps: number; visitors: number; contacts: number; events: number };
  funnel: {
    taps: number;
    visitors: number;
    /** Toques cuyo destino es una tarjeta NUESTRA: los únicos medibles. */
    measurable: number;
    cardView: number;
    projectVisit: number;
    contact: number;
  };
  events: Metric[];
  places: PlaceRow[];
  attribution: AttributionRow[];
  bySlug: Metric[];
  /** 24 posiciones, hora local de Miami. */
  hours: number[];
  /** 7 posiciones, domingo primero. */
  weekdays: number[];
  visitors: { fresh: number; returning: number };
  devices: Metric[];
  sources: Metric[];
  /** Contador histórico de `links`. Arrancó antes que el registro detallado. */
  linkCounters: { slug: string; taps: number }[];
  linkCountersTotal: number;
  /** Primer toque registrado con detalle. Antes de esta fecha no hay historia. */
  loggingSince: string | null;
  truncated: boolean;
}

let indexReady = false;

/**
 * Índices de lectura. Se crean una vez por proceso, con `void` y tragando el
 * error: si Mongo los rechaza, el panel va lento pero funciona.
 *
 * NO se crea `{at:-1}`. `taps` y `events` ya tienen un índice TTL sobre `{at:1}`
 * que hace cumplir la retención de 12 meses, y un índice de un solo campo se
 * recorre igual en los dos sentidos. Duplicarlo solo costaría escrituras.
 * Ese índice TTL no se toca jamás desde aquí.
 */
async function ensureIndexes(): Promise<void> {
  if (indexReady) return;
  indexReady = true;
  try {
    const db = await getDb();
    await Promise.all([
      db.collection("taps").createIndex({ slug: 1, at: -1 }),
      db.collection("taps").createIndex({ owner: 1, at: -1 }),
      db.collection("taps").createIndex({ visitorId: 1 }),
      db.collection("events").createIndex({ visitorId: 1 }),
      db.collection("events").createIndex({ event: 1, at: -1 }),
    ]);
  } catch {
    /* se reintenta en el próximo arranque */
  }
}

function since(range: RangeKey): Date | null {
  if (range === "all") return null;
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - Number(range));
  return d;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Coincide con los destinos alojados en nuestro propio dominio. */
function ownTargetRe(host: string): RegExp {
  const bare = escapeRe(host.replace(/^www\./, ""));
  return new RegExp(`^https?://(www\\.)?${bare}/`, "i");
}

const UA = { $ifNull: ["$userAgent", ""] };
const re = (pattern: string) => ({ $regexMatch: { input: UA, regex: pattern, options: "i" } });

/** Cuatro expresiones regulares. No hace falta una librería para esto. */
const DEVICE = {
  $switch: {
    branches: [
      { case: { $eq: [UA, ""] }, then: "Desconocido" },
      { case: re("iPad|Tablet"), then: "Tableta" },
      { case: re("iPhone|iPod"), then: "iPhone" },
      { case: re("Android"), then: "Android" },
      { case: re("Windows NT|Macintosh|X11|Linux"), then: "Escritorio" },
    ],
    default: "Otro",
  },
};

function count(rows: { n: number }[] | undefined): number {
  return rows?.[0]?.n ?? 0;
}

function overlap(a: string[], b: Set<string>): number {
  let n = 0;
  for (const id of a) if (b.has(id)) n++;
  return n;
}

export async function loadDashboard(
  range: RangeKey, business: string | null, ownHost: string,
): Promise<DashboardData> {
  void ensureIndexes();
  const db = await getDb();
  const taps = db.collection("taps");
  const events = db.collection("events");

  const from = since(range);
  const tapMatch: Record<string, unknown> = {};
  if (from) tapMatch.at = { $gte: from };
  if (business) tapMatch.business = business;

  // Los `events` no llevan atribución de negocio: solo se pueden filtrar por
  // los visitantes que ese negocio generó. Es la única unión honesta que hay.
  const allTapVisitors: string[] = await taps.distinct("visitorId", {
    ...tapMatch, visitorId: { $ne: null },
  });
  const truncated = allTapVisitors.length > VISITOR_CAP;
  const tapVisitors = truncated ? allTapVisitors.slice(0, VISITOR_CAP) : allTapVisitors;

  const eventMatch: Record<string, unknown> = {};
  if (from) eventMatch.at = { $gte: from };
  if (business) eventMatch.visitorId = { $in: tapVisitors };

  const [
    eventsByName, eventsTotal, contactIds, cardViewIds, projectIds, linkDocs, businesses,
  ] = await Promise.all([
    events.aggregate<{ _id: string; n: number }>([
      { $match: eventMatch },
      { $group: { _id: "$event", n: { $sum: 1 } } },
      { $sort: { n: -1 } },
    ]).toArray(),
    events.countDocuments(eventMatch),
    events.distinct("visitorId", { ...eventMatch, event: { $in: CONTACT_EVENTS } }) as Promise<string[]>,
    events.distinct("visitorId", { ...eventMatch, event: "card_view" }) as Promise<string[]>,
    events.distinct("visitorId", { ...eventMatch, event: "project_visit" }) as Promise<string[]>,
    // `_id` fuera de la proyección: un ObjectId no sobrevive la serialización
    // al cliente y reventaría la página entera al enviarla.
    db.collection<{ slug: string; taps: number }>("links")
      .find({}, { projection: { _id: 0, slug: 1, taps: 1 } })
      .sort({ taps: -1 }).limit(200).toArray(),
    taps.distinct("business", { business: { $nin: [null, ""] } }) as Promise<string[]>,
  ]);

  const contactSet = new Set(contactIds);
  const cardViewSet = new Set(cardViewIds);
  const projectSet = new Set(projectIds);

  // Una sola pasada sobre los toques del rango. Con 200 000 documentos importa.
  const [facet] = await taps.aggregate<Record<string, { n: number }[] | Record<string, unknown>[]>>([
    { $match: tapMatch },
    {
      $facet: {
        total: [{ $count: "n" }],
        visitors: [
          { $match: { visitorId: { $ne: null } } },
          { $group: { _id: "$visitorId" } }, { $count: "n" },
        ],
        measurable: [{ $match: { target: ownTargetRe(ownHost) } }, { $count: "n" }],
        places: [
          { $group: { _id: { city: "$city", region: "$region", country: "$country" }, n: { $sum: 1 } } },
          { $sort: { n: -1 } }, { $limit: 25 },
        ],
        attribution: [
          {
            $group: {
              _id: { business: "$business", owner: "$owner", cardId: "$cardId", context: "$context" },
              n: { $sum: 1 },
              visitors: { $addToSet: "$visitorId" },
              contacts: {
                $sum: { $cond: [{ $in: ["$visitorId", contactIds] }, 1, 0] },
              },
            },
          },
          { $sort: { n: -1 } }, { $limit: 50 },
        ],
        bySlug: [
          { $group: { _id: "$slug", n: { $sum: 1 } } }, { $sort: { n: -1 } }, { $limit: 50 },
        ],
        hours: [{ $group: { _id: { $hour: { date: "$at", timezone: TZ } }, n: { $sum: 1 } } }],
        weekdays: [{ $group: { _id: { $dayOfWeek: { date: "$at", timezone: TZ } }, n: { $sum: 1 } } }],
        freshness: [{ $group: { _id: "$firstVisit", n: { $sum: 1 } } }],
        devices: [{ $group: { _id: DEVICE, n: { $sum: 1 } } }, { $sort: { n: -1 } }],
        sources: [
          { $group: { _id: { $ifNull: ["$utm.utm_source", null] }, n: { $sum: 1 } } },
          { $sort: { n: -1 } }, { $limit: 15 },
        ],
        first: [{ $sort: { at: 1 } }, { $limit: 1 }, { $project: { _id: 0, at: 1 } }],
      },
    },
  ]).toArray();

  const f = (facet ?? {}) as {
    total?: { n: number }[]; visitors?: { n: number }[]; measurable?: { n: number }[];
    places?: { _id: { city: string | null; region: string | null; country: string | null }; n: number }[];
    attribution?: {
      _id: { business: string | null; owner: string | null; cardId: string | null; context: string | null };
      n: number; visitors: (string | null)[]; contacts: number;
    }[];
    bySlug?: { _id: string; n: number }[];
    hours?: { _id: number; n: number }[];
    weekdays?: { _id: number; n: number }[];
    freshness?: { _id: boolean; n: number }[];
    devices?: { _id: string; n: number }[];
    sources?: { _id: string | null; n: number }[];
    first?: { at: Date }[];
  };

  const hours = Array<number>(24).fill(0);
  for (const h of f.hours ?? []) if (h._id >= 0 && h._id < 24) hours[h._id] = h.n;

  const weekdays = Array<number>(7).fill(0);
  for (const d of f.weekdays ?? []) if (d._id >= 1 && d._id <= 7) weekdays[d._id - 1] = d.n;

  const fresh = f.freshness?.find((x) => x._id === true)?.n ?? 0;
  const returning = f.freshness?.find((x) => x._id !== true)?.n ?? 0;

  return {
    range,
    from: from ? from.toISOString() : null,
    business,
    businesses: businesses.filter(Boolean).sort(),
    totals: {
      taps: count(f.total),
      visitors: count(f.visitors),
      contacts: (eventsByName ?? [])
        .filter((e) => CONTACT_EVENTS.includes(e._id))
        .reduce((a, e) => a + e.n, 0),
      events: eventsTotal,
    },
    funnel: {
      taps: count(f.total),
      visitors: count(f.visitors),
      measurable: count(f.measurable),
      cardView: overlap(tapVisitors, cardViewSet),
      projectVisit: overlap(tapVisitors, projectSet),
      contact: overlap(tapVisitors, contactSet),
    },
    events: (eventsByName ?? []).map((e) => ({ label: e._id, n: e.n })),
    places: (f.places ?? []).map((p) => ({ ...p._id, n: p.n })),
    attribution: (f.attribution ?? []).map((a) => ({
      ...a._id,
      taps: a.n,
      visitors: new Set(a.visitors.filter(Boolean)).size,
      contacts: a.contacts,
    })),
    bySlug: (f.bySlug ?? []).map((s) => ({ label: s._id, n: s.n })),
    hours,
    weekdays,
    visitors: { fresh, returning },
    devices: (f.devices ?? []).map((d) => ({ label: d._id, n: d.n })),
    sources: (f.sources ?? []).map((s) => ({ label: s._id ?? "", n: s.n })),
    linkCounters: linkDocs.map((l) => ({ slug: l.slug, taps: l.taps ?? 0 })),
    linkCountersTotal: linkDocs.reduce((a, l) => a + (l.taps ?? 0), 0),
    loggingSince: f.first?.[0]?.at ? new Date(f.first[0].at).toISOString() : null,
    truncated,
  };
}
