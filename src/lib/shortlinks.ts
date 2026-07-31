import { getDb } from "~/lib/db";

/**
 * Enlaces virtuales para tarjetas NFC de clientes.
 *
 * El chip guarda SIEMPRE una URL corta de nuestro dominio (`/c/<slug>`) y el
 * destino real vive aquí. Así se puede cambiar a dónde apunta una tarjeta ya
 * entregada sin reprogramar nada.
 */
export interface ShortLink {
  slug: string;
  target: string;
  label: string;
  /** A quien pertenece la tarjeta. Sin esto no hay atribucion posible. */
  business: string;
  /** Vendedor o persona duena de la tarjeta fisica. */
  owner: string;
  /** Identificador de la unidad fisica: RW-CARLOS-018. */
  cardId: string;
  /** Donde vive la tarjeta: feria, camioneta, recepcion, vendedor, evento. */
  context: string;
  active: boolean;
  taps: number;
  createdAt: Date;
  updatedAt: Date;
  /** Destinos anteriores, para saber a qué apuntó la tarjeta en el pasado. */
  history: { target: string; changedAt: Date }[];
}

const COLLECTION = "links";

/** Minúsculas, sin acentos ni espacios. El slug acaba impreso y dictado por teléfono. */
export function normalizeSlug(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

export type TargetCheck = { ok: true; url: string } | { ok: false; reason: string };

/**
 * Solo HTTPS y nunca a nuestro propio dominio: un destino que apunte de vuelta
 * a `/c/...` crearía un bucle de redirecciones infinito.
 */
export function validateTarget(raw: string, ownHost?: string): TargetCheck {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return { ok: false, reason: "No es una URL válida." };
  }
  if (url.protocol !== "https:") return { ok: false, reason: "El destino debe ser https." };
  if (ownHost && url.host === ownHost && /^\/(c|nfc)\//.test(url.pathname)) {
    return { ok: false, reason: "El destino no puede ser otro enlace corto: crearía un bucle." };
  }
  return { ok: true, url: url.toString() };
}

async function col() {
  return (await getDb()).collection<ShortLink>(COLLECTION);
}

export async function findLink(slug: string): Promise<ShortLink | null> {
  return (await col()).findOne({ slug: normalizeSlug(slug) });
}

export async function listLinks(): Promise<ShortLink[]> {
  return (await col()).find({}).sort({ updatedAt: -1 }).limit(500).toArray();
}

/** Contador de toques. No debe bloquear ni romper la redirección si falla. */
export async function bumpTaps(slug: string): Promise<void> {
  try {
    await (await col()).updateOne({ slug }, { $inc: { taps: 1 } });
  } catch {
    /* la analítica nunca puede impedir que la tarjeta funcione */
  }
}

export async function createLink(input: {
  slug: string; target: string; label: string;
  business?: string; owner?: string; cardId?: string; context?: string;
}): Promise<{ ok: true } | { ok: false; reason: string }> {
  const slug = normalizeSlug(input.slug);
  if (!slug) return { ok: false, reason: "El nombre corto no puede quedar vacío." };
  if (RESERVED.has(slug)) return { ok: false, reason: `"${slug}" está reservado.` };

  const c = await col();
  if (await c.findOne({ slug })) return { ok: false, reason: `"${slug}" ya existe.` };

  const now = new Date();
  await c.insertOne({
    slug, target: input.target, label: input.label.trim().slice(0, 120),
    business: (input.business ?? "").trim().slice(0, 80),
    owner: (input.owner ?? "").trim().slice(0, 80),
    cardId: (input.cardId ?? "").trim().slice(0, 40),
    context: (input.context ?? "").trim().slice(0, 40),
    active: true, taps: 0, createdAt: now, updatedAt: now, history: [],
  });
  return { ok: true };
}

/** Cambia el destino guardando el anterior en el historial. */
export async function updateTarget(slug: string, target: string): Promise<void> {
  const c = await col();
  const current = await c.findOne({ slug });
  if (!current) return;
  await c.updateOne(
    { slug },
    {
      $set: { target, updatedAt: new Date() },
      $push: { history: { target: current.target, changedAt: new Date() } },
    },
  );
}

export async function setActive(slug: string, active: boolean): Promise<void> {
  await (await col()).updateOne({ slug }, { $set: { active, updatedAt: new Date() } });
}

/** Slugs que no se pueden asignar porque ya los usa el sitio. */
const RESERVED = new Set([
  "305", "admin", "api", "card", "nfc", "c", "l", "es", "contact", "contacto",
  "privacy", "privacidad", "about", "nosotros", "demo", "descargas",
]);
