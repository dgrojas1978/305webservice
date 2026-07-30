import { For } from "solid-js";
import Container from "~/components/ui/Container";
import SectionHeading from "~/components/ui/SectionHeading";
import { C } from "~/data/content";
import type { Locale } from "~/lib/i18n";

/**
 * Secciones de posicionamiento aprobado.
 *
 * Sustituyen al catálogo: tres grupos de capacidad y cuatro pasos de proceso.
 * El texto vive en `content.ts` para que la web, los flyers y la tarjeta
 * digital citen exactamente las mismas frases.
 */

/** «What we build.» — tres grupos, nunca una lista de servicios. */
export function Capabilities(props: { locale: Locale }) {
  const t = () => C[props.locale].capabilities;
  return (
    <section id="capabilities" class="bg-paper py-section">
      <Container>
        <SectionHeading title={t().heading} />
        <div class="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          <For each={t().groups}>
            {(g) => (
              <div>
                <span class="block h-px w-10 bg-turquoise" aria-hidden="true" />
                <h3 class="mt-5 text-sm font-extrabold uppercase tracking-[0.14em] text-navy">
                  {g.name}
                </h3>
                <p class="mt-3 leading-relaxed text-body">{g.text}</p>
              </div>
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
      </Container>
    </section>
  );
}
