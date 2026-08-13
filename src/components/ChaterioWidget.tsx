import { onMount } from "solid-js";

// Chat de 305 (Chaterío). La identidad visual llega del deployment del asistente
// (ast_305webservice) — aquí no se configura branding, solo se monta.
//
// Carga content-hashed, calcada del loader oficial (/web-service-305/mount.js):
// el manifest se lee sin caché y nombra el bundle inmutable; un deploy a medias
// del widget solo puede servir el build anterior completo, nunca una mezcla.
const WEBCHAT_ORIGIN = "https://d12x9m9st9e3q6.cloudfront.net";
const API_BASE_URL = "https://fcprpccfts.us-east-1.awsapprunner.com";
const ASSISTANT_ID = "ast_305webservice";

export default function ChaterioWidget() {
  let host!: HTMLDivElement;
  onMount(async () => {
    try {
      // Un botón de chat que no puede chatear es una mentira: si el API todavía no autoriza
      // este origen (CORS), no montamos nada. Cuando el origen se autorice, el widget aparece
      // solo en la próxima carga de página — sin redeploy del sitio.
      await fetch(new URL("/version", API_BASE_URL), { method: "GET" });
      const manifestUrl = new URL("/dist-bundle/build-manifest.json", WEBCHAT_ORIGIN);
      const manifest = await fetch(manifestUrl, { cache: "no-store" }).then((r) => r.json());
      const bundleUrl = new URL(manifest.bundle, manifestUrl);
      const { Chaterio } = await import(/* @vite-ignore */ bundleUrl.href);
      (window as unknown as { __CHATERIO_BUILD__?: string }).__CHATERIO_BUILD__ = manifest.commit;
      Chaterio.mount({
        element: host,
        assistantId: ASSISTANT_ID,
        apiBaseUrl: API_BASE_URL,
        startOpen: false,
      });
    } catch {
      // Sin red, o el origen aún no está autorizado en el API: la página vive igual, sin chat.
    }
  });
  // El widget (bundle Chaterío) NO se auto-posiciona: su `.cc-launcher` es
  // `position:relative; margin-left:auto` y su `:host{all:initial}` deja el
  // host en `static`. El loader oficial monta en un `#chat-host` que la página
  // ancla fijo; aquí hay que anclar el host a mano, o el widget cae al final
  // del flujo (se veía como un bloque debajo del footer). Inline gana sobre
  // `:host{all:initial}`.
  return (
    <div
      ref={host}
      style={{
        position: "fixed",
        right: "20px",
        bottom: "20px",
        "z-index": "2147483000",
      }}
    />
  );
}
