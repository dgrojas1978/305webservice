// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";
import { getRequestEvent } from "solid-js/web";

/** Idioma del documento según la ruta: /es/* → es, resto → en. */
function docLang(): string {
  const event = getRequestEvent();
  if (!event) return "en";
  const path = new URL(event.request.url).pathname;
  return path === "/es" || path.startsWith("/es/") ? "es" : "en";
}

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang={docLang()}>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {/* Verificación de dominio para Meta Business (no quitar) */}
          <meta name="facebook-domain-verification" content="4tkwuuyphwl54a12rkui584j2i4i41" />
          {/* marca JS temprano: los reveals solo se ocultan con .js presente */}
          <script>{`document.documentElement.classList.add("js")`}</script>
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
