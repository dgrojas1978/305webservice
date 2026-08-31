import type { APIEvent } from "@solidjs/start/server";
import { aLaTarjeta } from "~/lib/cardsHome";

/**
 * URL corta grabada en los chips NFC y en las piezas impresas antiguas.
 * Las tarjetas viven en card.celerati.com; esto solo reenvía.
 */
export function GET({ params, request }: APIEvent) {
  return aLaTarjeta(params.slug, request.url);
}
