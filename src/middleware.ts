import { createMiddleware } from "@solidjs/start/middleware";
import { resolveVisitor, visitorCookie } from "~/lib/tapLog";

/**
 * Entrega la cookie de visitante en la propia página.
 *
 * Sin esto el embudo NO EXISTE. `/api/track` llama a `resolveVisitor()`, y esa
 * función inventa un identificador nuevo cuando no encuentra cookie — pero el
 * beacon nunca devuelve un `Set-Cookie`. Resultado medido en producción el 31
 * de julio: 32 eventos con 32 identificadores distintos, uno por evento. Cada
 * clic parecía una persona nueva, así que ningún toque se podía unir con lo que
 * esa persona hizo después.
 *
 * Solo la emitía el redirect de `/c/<slug>`, así que quien llegaba directo a
 * `/card/305` —el caso normal— no tenía cookie nunca.
 *
 * Se emite en la respuesta del documento: para cuando la página ejecuta su
 * primer beacon, el navegador ya la tiene y la manda.
 */
const SKIP = /^\/(api|_|assets|favicon)/;

export default createMiddleware({
  onRequest: [
    (event) => {
      const { request } = event;
      if (request.method !== "GET") return;
      // Solo navegaciones a documentos: ni recursos ni llamadas de datos.
      if (!request.headers.get("accept")?.includes("text/html")) return;

      const path = new URL(request.url).pathname;
      if (SKIP.test(path)) return;
      // `/c/` y `/nfc/` ya emiten la suya junto al tap. Si aquí se emitiera otra,
      // el tap quedaría registrado con un identificador y el navegador guardaría
      // el otro: el embudo se rompería de forma silenciosa.
      if (path.startsWith("/c/") || path.startsWith("/nfc/")) return;
      if (/\.[a-z0-9]+$/i.test(path)) return;

      const visitor = resolveVisitor(request.headers);
      if (visitor.isNew) {
        event.response.headers.append("Set-Cookie", visitorCookie(visitor.id));
      }
    },
  ],
});
