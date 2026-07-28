/**
 * Módulos configurables por negocio de la tarjeta digital:
 * reseñas de Google, ubicación / zonas de servicio y media del vCard.
 *
 * Reglas duras (no negociables, ver CARD-SYSTEM.md):
 *  - Nunca se inventan Place IDs, reseñas, ratings, direcciones ni zonas.
 *  - Una reseña pública de Google SIEMPRE termina en la interfaz oficial de
 *    Google; aquí jamás se publica ni se simula el envío.
 *  - Prohibido el "review gating": todos los visitantes ven el mismo CTA.
 *  - Un módulo sin datos válidos NO se renderiza (nada de bloques vacíos).
 */

/* ---------------- Reseñas ---------------- */

export interface BusinessReviewConfig {
  enabled: boolean;
  provider: "google";
  /** Place ID real del Business Profile. Sin él, el módulo no se muestra. */
  placeId?: string;
  /** URL oficial "escribir reseña" del Business Profile. */
  requestReviewUrl?: string;
  displayReviews: boolean;
  maxDisplayedReviews: 1 | 2 | 3;
  sortDisclosure: "Most relevant" | "Newest";
}

/* ---------------- Ubicación ---------------- */

export type LocationMode = "none" | "physical" | "service-area" | "hybrid" | "multiple-locations";

/** Horario semanal en texto ya formateado por el negocio (no se calcula). */
export interface BusinessHours {
  /** Líneas tal como el negocio las publica, p. ej. "Mon–Fri · 9:00–18:00". */
  lines: string[];
  /** Zona horaria IANA; requerida si algún día se quiere calcular "Open now". */
  timeZone?: string;
}

export interface BusinessLocation {
  id: string;
  label: string;
  publicName?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
  phone?: string;
  hours?: BusinessHours;
  appointmentRequired?: boolean;
  /** Place ID propio de esta sucursal (las reseñas nunca se mezclan). */
  placeId?: string;
}

export interface ServiceArea {
  label: string;
  /** Etiqueta en español cuando difiere (la tarjeta es bilingüe). */
  labelEs?: string;
  kind: "city" | "county" | "region" | "state" | "radius-description";
}

export interface CardLocationConfig {
  mode: LocationMode;
  locations?: BusinessLocation[];
  serviceAreas?: ServiceArea[];
  headquartersLabel?: string;
  /** Si es false, nunca se imprime la dirección exacta (p. ej. domicilio). */
  showExactAddress: boolean;
}

/* ---------------- vCard media ---------------- */

export interface VCardMediaConfig {
  kind: "person" | "organization";
  /** Ruta pública de la foto de la persona (cuadrada, ~600×600). */
  photoUrl?: string;
  /** Ruta pública del logo de la organización (cuadrado, ~600×600). */
  logoUrl?: string;
  /** Si es false, el vCard se genera sin imagen embebida. */
  embedImage: boolean;
}

/* ---------------- Validación ---------------- */

export interface ModuleIssue {
  module: "reviews" | "location" | "vcard";
  level: "error" | "info";
  message: string;
}

/**
 * Valida configuraciones incompatibles. Devuelve problemas para el panel de
 * administración; el visitante nunca ve estos mensajes.
 */
export function validateReviewConfig(c?: BusinessReviewConfig): ModuleIssue[] {
  const out: ModuleIssue[] = [];
  if (!c || !c.enabled) return out;
  if (!c.placeId) out.push({ module: "reviews", level: "error", message: "Reviews enabled but no Google Place ID configured." });
  if (!c.requestReviewUrl) out.push({ module: "reviews", level: "error", message: "Reviews enabled but no official 'write a review' URL configured." });
  return out;
}

export function validateLocationConfig(c?: CardLocationConfig): ModuleIssue[] {
  const out: ModuleIssue[] = [];
  if (!c || c.mode === "none") return out;
  const locs = c.locations ?? [];
  const areas = c.serviceAreas ?? [];
  if (c.mode === "physical") {
    if (locs.length !== 1) out.push({ module: "location", level: "error", message: "Mode 'physical' requires exactly one location." });
    if (!locs[0]?.address) out.push({ module: "location", level: "error", message: "Mode 'physical' requires a public address." });
  }
  if (c.mode === "service-area") {
    if (!areas.length) out.push({ module: "location", level: "error", message: "Mode 'service-area' requires at least one service area." });
    if (locs.some((l) => l.address) && c.showExactAddress) {
      out.push({ module: "location", level: "info", message: "Service-area business: exact address will not be published." });
    }
  }
  if (c.mode === "hybrid") {
    if (!locs.length) out.push({ module: "location", level: "error", message: "Mode 'hybrid' requires at least one location." });
    if (!areas.length) out.push({ module: "location", level: "error", message: "Mode 'hybrid' requires at least one service area." });
  }
  if (c.mode === "multiple-locations" && locs.length < 2) {
    out.push({ module: "location", level: "error", message: "Mode 'multiple-locations' requires at least two locations." });
  }
  return out;
}

export function validateVCardMedia(c?: VCardMediaConfig): ModuleIssue[] {
  const out: ModuleIssue[] = [];
  if (!c || !c.embedImage) return out;
  if (c.kind === "person" && !c.photoUrl) out.push({ module: "vcard", level: "error", message: "Person vCard: embedImage is on but no photoUrl." });
  if (c.kind === "organization" && !c.logoUrl && !c.photoUrl) out.push({ module: "vcard", level: "error", message: "Organization vCard: embedImage is on but no logoUrl/photoUrl." });
  return out;
}

/* ---------------- Reglas de render (visitante) ---------------- */

/** El módulo de reseñas solo se renderiza con Place ID + URL oficial. */
export function reviewsRenderable(c?: BusinessReviewConfig): boolean {
  return !!c?.enabled && !!c.placeId && !!c.requestReviewUrl;
}

/** El módulo de ubicación solo se renderiza si el modo aporta datos reales. */
export function locationRenderable(c?: CardLocationConfig): boolean {
  if (!c || c.mode === "none") return false;
  return validateLocationConfig(c).every((i) => i.level !== "error");
}
