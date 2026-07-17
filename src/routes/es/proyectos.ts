import { permanentRedirect } from "~/lib/redirect";

export function GET() {
  return permanentRedirect("/es#what-we-build");
}
