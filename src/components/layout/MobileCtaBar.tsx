import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { WhatsAppIcon } from "~/components/ui/Button";
import { quoteLink, waQuote } from "~/lib/links";
import type { Locale } from "~/lib/i18n";

/**
 * Barra de acción fija en móvil: WhatsApp + cotización, siempre a un toque.
 * Aparece pasado el hero (~480px de scroll) para no duplicar sus CTAs, y solo
 * en pantallas < md — en desktop el header ya mantiene el CTA visible.
 */
export default function MobileCtaBar(props: { locale: Locale }) {
  const [visible, setVisible] = createSignal(false);

  onMount(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    onCleanup(() => window.removeEventListener("scroll", onScroll));
  });

  const es = () => props.locale === "es";

  return (
    <Show when={visible()}>
      <div
        data-surface="navy"
        class="fixed inset-x-0 bottom-0 z-40 border-t border-[rgba(247,249,252,0.14)] bg-navy/95 backdrop-blur md:hidden"
        style={{ "padding-bottom": "env(safe-area-inset-bottom)" }}
      >
        <div class="mx-auto flex max-w-md gap-2 px-3 py-2.5">
          <a
            href={waQuote(props.locale)}
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-outline flex-1 !px-3 !py-2.5 text-sm"
            data-track="mobile_bar_whatsapp"
          >
            <WhatsAppIcon class="h-4 w-4" />
            WhatsApp
          </a>
          <a
            href={quoteLink(props.locale)}
            class="btn btn-primary flex-1 !px-3 !py-2.5 text-sm"
            data-track="mobile_bar_quote"
          >
            {es() ? "Cotización gratis" : "Get a Free Quote"}
          </a>
        </div>
      </div>
    </Show>
  );
}
