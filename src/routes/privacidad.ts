import { permanentRedirect } from "~/lib/redirect";

export function GET() {
  return permanentRedirect("/privacy");
}
