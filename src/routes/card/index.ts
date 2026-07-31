import type { APIEvent } from "@solidjs/start/server";

/**
 * `/card` a secas → la tarjeta de 305.
 *
 * El sistema sirve a varios clientes, así que la ruta canónica lleva slug
 * (`/card/305`). Pero `/card` es más corta de decir en voz alta y de escribir
 * en un flyer, así que se conserva como atajo.
 *
 * 302, no 301: si algún día `/card` debe apuntar a otra cosa, un 301 quedaría
 * cacheado para siempre en los navegadores que ya lo visitaron.
 *
 * NO es la URL que se graba en los chips NFC: para eso está `/c/305`, que es
 * la única canónica y la que permite cambiar el destino sin reprogramar.
 */
export function GET({ request }: APIEvent) {
  const url = new URL(request.url);
  const dest = new URL("/card/305", url.origin);
  // Se conserva la atribución que trajera el enlace.
  url.searchParams.forEach((v, k) => dest.searchParams.set(k, v));
  return Response.redirect(dest.toString(), 302);
}
