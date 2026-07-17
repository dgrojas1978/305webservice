import { permanentRedirect } from "~/lib/redirect";

// Página retirada en el rediseño — el detalle vive en /services.
export function GET() {
  return permanentRedirect("/services#web");
}
