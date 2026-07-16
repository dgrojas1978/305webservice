import { permanentRedirect } from "~/lib/redirect";

// The site no longer lists products — all legacy product URLs go home.
export function GET() {
  return permanentRedirect("/");
}
