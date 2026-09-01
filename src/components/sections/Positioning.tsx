import { For } from "solid-js";
import Container from "~/components/ui/Container";
import SectionHeading from "~/components/ui/SectionHeading";
import { ButtonLink } from "~/components/ui/Button";
import { C } from "~/data/content";
import type { Locale } from "~/lib/i18n";
import { quoteLink } from "~/lib/links";

/**
 * Secciones de posicionamiento aprobado.
 *
 * Sustituyen al catálogo: tres grupos de capacidad y cuatro pasos de proceso.
 * El texto vive en `content.ts` para que la web, los flyers y la tarjeta
 * digital citen exactamente las mismas frases.
 */

/** «What we do.» — los 4 servicios que vendemos, cada uno con enlace a su página. */
export function Capabilities(props: { locale: Locale }) {
  const t = () => C[props.locale].capabilities;
  // pb-section sin pt: viene despues de Selected Work, que ya es bg-paper y
  // aporta su propio padding inferior. Con los dos se abria un hueco de 192 px.
  return (
    <section id="capabilities" class="bg-paper pb-section">
      <Container>
        <SectionHeading title={t().heading} />
        <div class="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          <For each={t().groups}>
            {(g) => (
              <a href={g.href} class="group block">
                <span class="block h-px w-10 bg-turquoise transition-all duration-300 group-hover:w-16" aria-hidden="true" />
                <h3 class="mt-5 text-sm font-extrabold uppercase tracking-[0.14em] text-navy">
                  {g.name}
                </h3>
                <p class="mt-3 leading-relaxed text-body">{g.text}</p>
                <span class="mt-4 inline-block text-sm font-semibold text-turquoise">
                  {t().linkLabel} →
                </span>
              </a>
            )}
          </For>
        </div>
      </Container>
    </section>
  );
}

/** «Built around the business — not around a template.» — cuatro pasos. */
export function Approach(props: { locale: Locale }) {
  const t = () => C[props.locale].approach;
  return (
    <section id="approach" class="bg-navy py-section">
      <Container>
        <SectionHeading title={t().heading} onDark />
        <ol class="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          <For each={t().steps}>
            {(s) => (
              <li>
                <span class="block h-px w-10 bg-turquoise" aria-hidden="true" />
                <h3 class="mt-5 text-sm font-extrabold uppercase tracking-[0.14em] text-paper">
                  {s.name}
                </h3>
                <p class="mt-3 leading-relaxed text-on-navy">{s.text}</p>
              </li>
            )}
          </For>
        </ol>
        <div class="mt-14">
          <ButtonLink href={quoteLink(props.locale)} track="approach_cta_click">{t().cta}</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
