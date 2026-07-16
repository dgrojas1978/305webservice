/** Permanent-redirect response for legacy route handlers. */
export function permanentRedirect(location: string): Response {
  return new Response(null, { status: 301, headers: { Location: location } });
}
