import { permanentRedirect } from "~/lib/redirect";

// Sin proyectos reales publicados todavía: la capacidad se demuestra
// en la sección «What we build» de la home.
export function GET() {
  return permanentRedirect("/#what-we-build");
}
