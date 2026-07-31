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

/**
 * Listado para el panel.
 *
 * `_id` FUERA de la proyección. Estos documentos viajan del servidor al
 * navegador, y un ObjectId no se puede serializar: el proceso reventaba después
 * de haber enviado el HTML, así que la página se veía bien y por debajo la
 * petición moría y la hidratación no llegaba nunca. Un fallo silencioso, del
 * peor tipo. El panel no usa `_id` para nada: la clave es el slug.
 */
export async function listLinks(): Promise<ShortLink[]> {
  return (await col())
    .find({}, { projection: { _id: 0 } })
    .sort({ updatedAt: -1 }).limit(500).toArray();
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

  // Negocio y dueño son OBLIGATORIOS. La atribución se congela en cada toque,
  // así que un enlace creado sin ellos genera toques que no se pueden asignar a
  // nadie NUNCA: no es que falte enseñarlos, es que el dato no se guarda y no
  // hay forma de reconstruirlo después. Pasó con los seis primeros enlaces.
  const attr = checkAttribution(input);
  if (!attr.ok) return attr;

  const now = new Date();
  await c.insertOne({
    slug, target: input.target, label: input.label.trim().slice(0, 120),
    ...attr.value,
    active: true, taps: 0, createdAt: now, updatedAt: now, history: [],
  });
  return { ok: true };
}

export interface Attribution {
  business: string;
  owner: string;
  cardId: string;
  context: string;
}

type AttrCheck = { ok: true; value: Attribution } | { ok: false; reason: string };

function checkAttribution(input: Partial<Attribution>): AttrCheck {
  const business = (input.business ?? "").trim().slice(0, 80);
  const owner = (input.owner ?? "").trim().slice(0, 80);
  if (!business) {
    return { ok: false, reason: "Falta el negocio. Sin él, los toques de esta tarjeta no se podrán asignar a nadie, y eso no tiene arreglo después." };
  }
  if (!owner) {
    return { ok: false, reason: "Falta el dueño de la tarjeta. Sin él no se puede saber qué vendedor genera qué." };
  }
  return {
    ok: true,
    value: {
      business, owner,
      cardId: (input.cardId ?? "").trim().slice(0, 40),
      context: (input.context ?? "").trim().slice(0, 40),
    },
  };
}

/**
 * Cambia la atribución de un enlace. Solo afecta a los toques FUTUROS: los ya
 * registrados guardaron su copia y no se tocan, que es justo lo que evita que
 * las cifras de un vendedor cambien solas al editar un enlace.
 */
export async function updateAttribution(
  rawSlug: string, input: Partial<Attribution>,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const check = checkAttribution(input);
  if (!check.ok) return check;
  const slug = normalizeSlug(rawSlug);
  const res = await (await col()).updateOne(
    { slug }, { $set: { ...check.value, updatedAt: new Date() } },
  );
  if (!res.matchedCount) return { ok: false, reason: `"${slug}" no existe.` };
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
