/**
 * Las tarjetas ya no viven aquí.
 *
 * El sistema de tarjetas nació en este repositorio y se mudó a
 * `celerati-cards` (card.celerati.com) el 23 de agosto de 2026. Lo que quedó
 * aquí era una copia congelada: mismo código sin mantener, sirviendo a los
 * mismos clientes desde un segundo sitio. Dos verdades para el mismo dato.
 *
 * Se borra la copia, pero NO las URLs: `/c/<slug>` está documentada como la
 * dirección canónica para grabar en un chip NFC, y un chip no se reprograma.
 * Quien llegue por una pieza impresa antigua tiene que acabar en su tarjeta,
 * no en un 404.
 *
 * Antes de esto, `/c/<slug>` reenviaba a `card.305webservice.com`, que
 * respondía **500 en todo**. Ninguna tarjeta impresa apuntaba ahí —se
 * comprobaron los 13 códigos QR del repositorio y todos llevan a
 * card.celerati.com—, pero cualquier enlace viejo moría en un error.
 */

const CASA = "https://card.celerati.com";

/** Reenvía a la tarjeta, conservando la atribución que traiga el enlace. */
export function aLaTarjeta(slug: string, url: string): Response {
  const origen = new URL(url);
  const dest = new URL(`/c/${encodeURIComponent(slug)}`, CASA);
  origen.searchParams.forEach((v, k) => dest.searchParams.set(k, v));
  // 301: el destino es definitivo. Que el navegador lo recuerde es lo deseable
  // —una tarjeta se toca muchas veces— y ahorra el salto en los siguientes.
  return new Response(null, { status: 301, headers: { Location: dest.toString() } });
}

/** `/card` a secas: atajo hablado, va al inicio de las tarjetas. */
export function alInicioDeTarjetas(): Response {
  return new Response(null, { status: 301, headers: { Location: CASA } });
}
