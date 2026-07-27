import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import Container from "~/components/ui/Container";
import SectionHeading from "~/components/ui/SectionHeading";
import { C } from "~/data/content";
import { OFFERS } from "~/data/offers";
import { PATHS, OFFER_PAGE, type Locale, type PageKey } from "~/lib/i18n";
import { quoteLink } from "~/lib/links";

function offerPageKey(id: string): PageKey {
  return OFFER_PAGE[id] ?? "services";
}

/**
 * Selector de las 7 ofertas. No son 7 tarjetas idénticas: la oferta destacada
 * (Website Starter $499) tiene tratamiento propio y cada tarjeta lleva su CTA
 * específico y su selección al formulario.
 */
export default function PackageSelector(props: { locale: Locale; heading?: boolean }) {
  const t = () => C[props.locale];
  const offers = () => OFFERS[props.locale];

  return (
    <section id="packages" class="bg-paper py-section">
      <Container>
        <Show when={props.heading !== false}>
          <SectionHeading eyebrow={t().selector.eyebrow} title={t().selector.heading} intro={t().selector.sub} />
        </Show>

        <div class="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <For each={offers()}>
            {(o) => (
              <article
                class={`card card-hover flex flex-col p-7 ${o.featured ? "card-featured lg:col-span-1" : ""}`}
              >
                <div class="flex items-start justify-between gap-3">
                  <h3 class="text-xl font-extrabold tracking-tight text-navy">{o.name}</h3>
                  <Show when={o.featured}>
                    <span class="badge badge-blue shrink-0">$499</span>
                  </Show>
                </div>

                <p class="mt-2 text-sm font-semibold text-blue-ink">{o.priceState}</p>

                <p class="mt-4 text-[0.9rem] leading-relaxed text-body">{o.outcome}</p>

                <div class="mt-5">
                  <p class="micro-caps text-body !text-[0.62rem]">{t().selector.bestForLabel}</p>
                  <p class="mt-1.5 text-[0.85rem] leading-snug text-navy">{o.bestFor}</p>
                </div>

                <ul class="mt-5 space-y-2 border-t border-hairline pt-5">
                  <For each={o.inclusions.slice(0, 5)}>
                    {(inc) => (
                      <li class="flex items-start gap-2.5 text-[0.85rem] text-body">
                        <svg class="mt-1 h-3.5 w-3.5 shrink-0 text-blue" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        {inc}
                      </li>
                    )}
                  </For>
                </ul>

                <div class="mt-7 flex items-center justify-between gap-3 pt-1">
                  <A
                    href={quoteLink(props.locale, o.id)}
                    class="btn btn-primary !min-h-[42px] !px-5 !py-2.5 !text-[0.72rem]"
                    data-track="package_cta_click"
                    data-package={o.id}
                  >
                    {o.ctaLabel}
                  </A>
                  <A
                    href={PATHS[offerPageKey(o.id)][props.locale]}
                    class="link-underline micro-caps !text-[0.62rem] text-body hover:text-navy"
                  >
                    {props.locale === "es" ? "Detalles" : "Details"} →
                  </A>
                </div>
              </article>
            )}
          </For>
        </div>
      </Container>
    </section>
  );
}
