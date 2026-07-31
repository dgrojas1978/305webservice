import type { APIEvent } from "@solidjs/start/server";
import { getDb } from "~/lib/db";
import { RETENTION_DAYS, resolveVisitor } from "~/lib/tapLog";

/**
 * Recoge los eventos de comportamiento de la tarjeta digital.
 *
 * Hasta ahora `trackEvent` solo hablaba con gtag/plausible/dataLayer, ninguno
 * configurado: los eventos se registraban en el navegador y morían ahí. Sin
 * esto no hay embudo posible — se sabe cuánta gente toca la tarjeta, pero no
 * qué hace después.
 *
 * Reglas: nunca devuelve error al cliente, nunca bloquea la interfaz, y se
 * limita a lo que ya se declara en la política de privacidad.
 */
export interface CardEvent {
  event: string;
  card: string | null;
  at: Date;
  /** Mismo identificador anónimo del tap: permite unir toque y comportamiento. */
  visitorId: string | null;
  props: Record<string, string>;
  path: string | null;
  country: string | null;
  city: string | null;
}

const MAX_PROPS = 12;
let indexReady = false;

async function ensureRetention() {
  if (indexReady) return;
  indexReady = true;
  try {
    await (await getDb()).collection("events")
      .createIndex({ at: 1 }, { expireAfterSeconds: RETENTION_DAYS * 24 * 60 * 60 });
  } catch { /* se reintenta en el proximo arranque */ }
}

export async function POST({ request }: APIEvent) {
  // 204 pase lo que pase: un fallo de analitica no puede ensuciar la consola
  // del visitante ni bloquear una accion suya.
  const ok = () => new Response(null, { status: 204 });
  try {
    const body = await request.json() as { event?: unknown; props?: unknown; path?: unknown };
    const event = typeof body.event === "string" ? body.event.slice(0, 60) : null;
    if (!event) return ok();

    const props: Record<string, string> = {};
    if (body.props && typeof body.props === "object") {
      for (const [k, v] of Object.entries(body.props as Record<string, unknown>)) {
        if (Object.keys(props).length >= MAX_PROPS) break;
        if (v == null) continue;
        props[k.slice(0, 40)] = String(v).slice(0, 120);
      }
    }

    const h = request.headers;
    const city = h.get("x-vercel-ip-city");
    void ensureRetention();
    await (await getDb()).collection<CardEvent>("events").insertOne({
      event,
      card: props.card ?? null,
      at: new Date(),
      visitorId: resolveVisitor(h).id,
      props,
      path: typeof body.path === "string" ? body.path.slice(0, 200) : null,
      country: h.get("x-vercel-ip-country"),
      city: city ? decodeURIComponent(city) : null,
    });
  } catch {
    /* silencio deliberado */
  }
  return ok();
}
