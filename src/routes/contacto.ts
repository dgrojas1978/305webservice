import { permanentRedirect } from "~/lib/redirect";

// Legacy Spanish route → new English contact page
export function GET() {
  return permanentRedirect("/contact");
}
