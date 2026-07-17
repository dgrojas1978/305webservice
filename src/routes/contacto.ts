import { permanentRedirect } from "~/lib/redirect";

// Ruta legacy → página española real
export function GET() {
  return permanentRedirect("/es/contacto");
}
