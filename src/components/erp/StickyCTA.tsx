import { createSignal, onMount, Show } from "solid-js";
import { A } from "@solidjs/router";
import { erpConfig, erpWhatsApp } from "~/config/erp.config";
import { erpEvents } from "~/lib/analytics";

export default function StickyCTA() {
  const [visible, setVisible] = createSignal(false);
  const [dismissed, setDismissed] = createSignal(false);

  onMount(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  });

  return (
    <Show when={visible() && !dismissed()}>
      <div class="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-2xl animate-fade-up">
        <div class="flex items-center justify-between gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border border-white/10"
          style="background: rgba(10,22,40,0.97); backdrop-filter: blur(20px)">

          <p class="text-white text-sm font-semibold hidden sm:block flex-shrink-0">
            ¿Listo para modernizar tu negocio?
          </p>

          <div class="flex items-center gap-2 flex-1 sm:flex-none justify-center sm:justify-start">
            <a
              href={erpConfig.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => erpEvents.clickDemo()}
              class="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
              style="background: linear-gradient(135deg,#3730A3,#0369A1)"
            >
              Probar Demo
            </a>

            <A
              href="/descargas"
              onClick={() => erpEvents.clickDownload("sticky-cta")}
              class="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 bg-white/8 hover:bg-white/12 border border-white/10 transition-colors hidden sm:block"
            >
              Descargar
            </A>

            <A
              href="/solicitar-cotizacion"
              onClick={() => erpEvents.clickQuote()}
              class="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 bg-white/8 hover:bg-white/12 border border-white/10 transition-colors hidden sm:block"
            >
              Cotización
            </A>
          </div>

          <button
            class="text-slate-600 hover:text-slate-400 transition-colors flex-shrink-0"
            onClick={() => setDismissed(true)}
            aria-label="Cerrar"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </Show>
  );
}
