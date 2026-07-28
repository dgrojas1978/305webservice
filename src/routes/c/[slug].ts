import type { APIEvent } from "@solidjs/start/server";
import { cardRedirect } from "~/lib/cardRedirect";

/**
 * URL corta CANÓNICA para tarjetas físicas: https://www.305webservice.com/c/305
 * Es la única que debe grabarse en un chip NFC o imprimirse en un QR final.
 */
export function GET({ params, request }: APIEvent) {
  return cardRedirect(params.slug, request.url);
}
