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
  return <div ref={host} />;
}
