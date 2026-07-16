import { permanentRedirect } from "~/lib/redirect";

// The site no longer lists products — the legacy catalog URL goes home.
export function GET() {
  return permanentRedirect("/");
}
