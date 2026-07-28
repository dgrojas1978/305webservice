import { onCleanup, onMount } from "solid-js";
import { persistAttribution, trackEvent } from "~/lib/analytics";

/**
 * Captura eventos de conversión por delegación, sin datos personales:
 * - cualquier elemento con [data-track] → evento con nombre + props data-*
 * - enlaces wa.me / tel: / mailto: → eventos estándar
 */
export default function AnalyticsListener() {
  onMount(() => {
    persistAttribution(); // primer toque: conserva UTM del QR hasta el envío del formulario

    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest<HTMLElement>("[data-track], a[href]");
      if (!el) return;

      const tracked = el.closest<HTMLElement>("[data-track]");
      if (tracked) {
        const name = tracked.dataset.track!;
        const props: Record<string, string> = {};
        for (const [k, v] of Object.entries(tracked.dataset)) {
          if (k !== "track" && typeof v === "string") props[k] = v;
        }
        trackEvent(name, props);
        return;
      }

      const href = (el as HTMLAnchorElement).getAttribute?.("href") ?? "";
      if (href.includes("wa.me")) trackEvent("whatsapp_click");
      else if (href.startsWith("tel:")) trackEvent("phone_click");
      else if (href.startsWith("mailto:")) trackEvent("email_click");
    };
    document.addEventListener("click", onClick, { passive: true });
    onCleanup(() => document.removeEventListener("click", onClick));
  });

  return null;
}
