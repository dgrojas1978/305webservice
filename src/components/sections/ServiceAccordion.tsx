import { A } from "@solidjs/router";
import { createSignal, For, Show } from "solid-js";
import { C } from "~/data/content";
import { PATHS, type Locale } from "~/lib/i18n";

/**
 * Lista editorial numerada de servicios (home).
 * Acordeón accesible: botón con aria-expanded + panel que crece
 * sin saltos de layout (grid-template-rows). Navegable con teclado.
 */
export default function ServiceAccordion(props: { locale: Locale }) {
  const t = () => C[props.locale];
  const [open, setOpen] = createSignal<string | null>(null);

  return (
    <div>
      <div class="hr-line" />
      <For each={t().services.items}>
        {(svc) => {
          const isOpen = () => open() === svc.id;
          return (
            <div class="group">
              <h3>
                <button
                  type="button"
                  class="flex w-full items-baseline gap-6 py-6 text-left transition-colors duration-200 ease-editorial md:gap-10 md:py-7"
                  aria-expanded={isOpen()}
                  aria-controls={`svc-panel-${svc.id}`}
                  onClick={() => setOpen(isOpen() ? null : svc.id)}
                >
                  <span class="text-sm font-bold text-blue md:text-base">{svc.no}</span>
                  <span class="flex-1 text-xl font-extrabold uppercase tracking-tight text-navy transition-transform duration-200 ease-editorial group-hover:translate-x-2 md:text-3xl">
                    {svc.name}
                  </span>
                  <span
                    aria-hidden="true"
                    class={`text-2xl font-light text-blue transition-transform duration-300 ease-editorial ${
                      isOpen() ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
              </h3>
              <div
                id={`svc-panel-${svc.id}`}
                class="acc-panel"
                data-open={isOpen()}
                role="region"
                aria-label={svc.name}
              >
                <div>
                  <div class="grid grid-cols-1 gap-6 pb-8 pl-10 pr-4 md:grid-cols-12 md:pl-16">
                    <p class="max-w-prose text-base leading-relaxed text-body md:col-span-7">
                      {svc.short}
                    </p>
                    <div class="md:col-span-5 md:justify-self-end">
                      <A
                        href={`${PATHS.services[props.locale]}#${svc.id}`}
                        class="link-underline micro-caps text-blue"
                      >
                        {t().services.labels.cta} →
                      </A>
                    </div>
                  </div>
                </div>
              </div>
              <div class="hr-line" />
            </div>
          );
        }}
      </For>
    </div>
  );
}
