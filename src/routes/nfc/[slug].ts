import type { APIEvent } from "@solidjs/start/server";
import { cardRedirect } from "~/lib/cardRedirect";

/** Alias equivalente de /c/<slug> (ya documentado en material previo). */
export async function GET({ params, request }: APIEvent) {
  return cardRedirect(params.slug, request.url);
}
