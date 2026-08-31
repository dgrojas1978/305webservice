import type { APIEvent } from "@solidjs/start/server";
import { aLaTarjeta } from "~/lib/cardsHome";

/** Ruta antigua en la que se servía la tarjeta. Ahora solo reenvía. */
export function GET({ params, request }: APIEvent) {
  return aLaTarjeta(params.slug, request.url);
}
