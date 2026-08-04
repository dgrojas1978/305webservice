import type { APIEvent } from "@solidjs/start/server";
import { CARD_PROFILES } from "~/data/card";
import { saveLead } from "~/lib/db";

/**
 * Cotización de una tarjeta de cliente (tenant). POST nativo del formulario →
 * lead REAL en la colección `leads`, con `source: card-<slug>`.
 *
 * Existe porque el sitio de CN Brandings no tiene ruta de pedido (su página de
 * contacto es un placeholder): el backend de leads de 305 es el destino real y
 * probado. El dueño los ve igual que los del formulario del sitio.
 *
 * La escritura se ESPERA: en Vercel, una función se congela al responder y un
 * `void` pierde el dato (lección medida con los taps el 31 jul).
 */

/** Valores permitidos: el formulario es un select, pero el POST no se fía. */
const PRODUCTS = new Set([
  "t-shirts", "polos", "woven-shirts", "sweatshirts-fleece", "headwear",
  "uniforms", "promotional", "not-sure",
]);
const METHODS = new Set(["embroidery", "screen-printing", "dtf", "not-sure"]);
const CONTACT = new Set(["email", "phone", "whatsapp"]);

/**
 * Freno básico por IP (por instancia serverless; entre instancias no comparte
 * estado — es un freno, no un muro). Complementa al honeypot y al tiempo mínimo.
 */
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function limited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX_PER_WINDOW) return true;
  list.push(now);
  hits.set(ip, list);
  return false;
}

export async function POST({ params, request }: APIEvent) {
  const profile = CARD_PROFILES[params.slug];
  // Solo tarjetas de cliente tienen este flujo.
  if (!profile?.client) return new Response("Not found", { status: 404 });

  const back = (q: string) =>
    new Response(null, {
      status: 303,
      headers: { Location: `${profile.nfc.canonicalPath}?quote=${q}#quote` },
    });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return back("error");
  }
  const get = (k: string) => String(form.get(k) ?? "").trim();

  // Honeypot: un humano nunca rellena este campo oculto.
  if (get("website_url")) return back("sent");
  // Tiempo mínimo: un envío en <3 s desde el render no es una persona.
  const ts = Number(get("ts"));
  if (!Number.isFinite(ts) || Date.now() - ts < 3000) return back("error");

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return back("error");

  const name = get("name").slice(0, 120);
  const email = get("email").slice(0, 160);
  const phone = get("phone").slice(0, 40);
  const product = get("product");
  const contactMethod = get("contactMethod");
  const consent = get("consent") === "on";

  // Validación de requeridos en el servidor: el `required` del navegador se salta.
  if (!name || !PRODUCTS.has(product) || !consent) return back("error");
  if (!email && !phone) return back("error");
  if (contactMethod && !CONTACT.has(contactMethod)) return back("error");

  const method = METHODS.has(get("method")) ? get("method") : "not-sure";
  const qty = get("qty").slice(0, 40);
  const needBy = get("needBy").slice(0, 40);
  const notes = get("notes").slice(0, 1500);

  let attribution: Record<string, string> = {};
  try {
    const raw = get("attribution");
    if (raw) attribution = JSON.parse(raw);
  } catch { /* atribución opcional */ }

  try {
    await saveLead({
      name,
      company: get("org").slice(0, 120) || undefined,
      email: email || undefined,
      phone: phone || undefined,
      contactMethod: contactMethod || undefined,
      service: product,
      message: [
        `Quantity: ${qty || "—"}`,
        `Method: ${method}`,
        `Needed by: ${needBy || "—"}`,
        notes ? `Notes: ${notes}` : "",
      ].filter(Boolean).join("\n"),
      consent,
      locale: get("locale") === "es" ? "es" : "en",
      attribution,
      createdAt: new Date(),
      source: `card-${profile.id}`,
    });
  } catch {
    // La base no respondió: se dice error de verdad, no un éxito fingido.
    return back("error");
  }
  return back("sent");
}
