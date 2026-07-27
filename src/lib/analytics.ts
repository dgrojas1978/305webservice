/**
 * Analítica agnóstica de plataforma. NO envía información personal.
 *
 * Si hay `gtag` (GA4) o `plausible` en window, reenvía el evento; si no,
 * hace no-op silencioso. Así el sitio queda cableado y solo falta conectar
 * la plataforma (ver README / REDESIGN-NOTES). Los `data-track` en el DOM
 * se capturan por delegación desde AnalyticsListener.
 */
export type TrackProps = Record<string, string | number | boolean | undefined>;

export function trackEvent(event: string, props: TrackProps = {}): void {
  if (typeof window === "undefined") return;
  const w = window as typeof window & {
    gtag?: (...a: unknown[]) => void;
    plausible?: (name: string, opts?: { props?: TrackProps }) => void;
    dataLayer?: unknown[];
  };
  try {
    if (typeof w.gtag === "function") w.gtag("event", event, props);
    else if (typeof w.plausible === "function") w.plausible(event, { props });
    else if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event, ...props });
  } catch {
    /* la analítica nunca debe romper la UI */
  }
}

/** Lee parámetros UTM, gclid y referrer, con consentimiento implícito del envío. */
export function captureAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const out: Record<string, string> = {};
  const p = new URLSearchParams(window.location.search);
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"]) {
    const v = p.get(k);
    if (v) out[k] = v.slice(0, 120);
  }
  if (document.referrer && !document.referrer.includes(window.location.host)) {
    out.referrer = document.referrer.slice(0, 200);
  }
  return out;
}
