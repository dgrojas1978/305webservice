import type { JSX } from "solid-js";
import { Show } from "solid-js";
import Container from "~/components/ui/Container";
import { ButtonLink, WhatsAppIcon } from "~/components/ui/Button";
import type { Locale } from "~/lib/i18n";
import { quoteLink, waQuote } from "~/lib/links";
import { C } from "~/data/content";

interface Props {
  eyebrow?: string;
  children: JSX.Element; // título (h1)
  intro?: string;
  priceLine?: string;
  /** Muestra CTA principal + WhatsApp con el servicio preseleccionado. */
  cta?: { locale: Locale; service?: string; serviceLabel?: string };
}

/** Cabecera navy de páginas interiores — el header transparente vive sobre ella. */
export default function PageHero(props: Props) {
  return (
    <section data-surface="navy" class="bg-navy pb-16 pt-32 md:pb-20 md:pt-40">
      <Container>
        {props.eyebrow && <p class="micro-caps text-turquoise">{props.eyebrow}</p>}
        <h1 class="mt-6 max-w-4xl text-[clamp(2rem,4.6vw,3.8rem)] font-black leading-[1.05] tracking-tight text-paper">
          {props.children}
        </h1>
        {props.intro && <p class="mt-7 max-w-2xl text-body-lg leading-relaxed text-on-navy">{props.intro}</p>}
        <Show when={props.priceLine}>
          <div class="mt-7"><span class="badge badge-onnavy !text-[0.78rem]">{props.priceLine}</span></div>
        </Show>
        <Show when={props.cta}>
          {(cta) => (
            <div class="mt-8 flex flex-col gap-4 sm:flex-row">
              <ButtonLink href={quoteLink(cta().locale, cta().service)} track="service_hero_cta" trackData={cta().service ? { package: cta().service! } : {}}>
                {C[cta().locale].nav.cta}
              </ButtonLink>
              <ButtonLink href={waQuote(cta().locale, cta().serviceLabel)} variant="outline" external>
                <WhatsAppIcon class="h-4 w-4" />
                {C[cta().locale].nav.whatsapp}
              </ButtonLink>
            </div>
          )}
        </Show>
      </Container>
    </section>
  );
}
