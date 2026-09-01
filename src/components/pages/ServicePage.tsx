import { For, Show } from "solid-js";
import Seo from "~/components/Seo";
import JsonLd from "~/components/JsonLd";
import Layout from "~/components/layout/Layout";
import Container from "~/components/ui/Container";
import PageHero from "~/components/pages/PageHero";
import { ButtonLink } from "~/components/ui/Button";
import { ProcessSteps, Faq, FinalCta } from "~/components/sections/HomeSections";
import SelectedWork from "~/components/sections/SelectedWork";
import { C } from "~/data/content";
import { OFFERS, type Offer, type OfferId } from "~/data/offers";
import { PATHS, altPath, type Locale, type PageKey } from "~/lib/i18n";
import { quoteLink } from "~/lib/links";
import { serviceSchema, breadcrumbSchema, faqSchema } from "~/lib/schema";
import { SITE_NAME } from "~/lib/site";

interface Props {
  locale: Locale;
  page: PageKey;
  metaKey: string;
  offerIds: OfferId[];
  heroTitle: string;
  heroIntro: string;
  heroPrice?: string;
  heroService?: OfferId;
  showWork?: boolean;
}

function OfferBlock(props: { locale: Locale; offer: Offer; index: number }) {
  const t = () => C[props.locale].servicePage;
  const o = () => props.offer;
  const alt = () => props.index % 2 === 1;
  return (
    <article id={o().id} class={`scroll-mt-24 py-16 md:py-20 ${alt() ? "bg-white" : "bg-paper"}`}>
      <Container>
        <div class="flex flex-wrap items-baseline justify-between gap-3 border-b border-hairline pb-6">
          <h2 class="text-[clamp(1.6rem,3vw,2.6rem)] font-extrabold tracking-tight text-navy">{o().name}</h2>
          <span class="badge badge-blue">{o().priceState}</span>
        </div>

        <div class="mt-10 grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-12">
          <div class="lg:col-span-5">
            <p class="text-body-lg leading-relaxed text-navy">{o().outcome}</p>

            <div class="mt-8">
              <h3 class="micro-caps text-blue-ink">{t().whoForLabel}</h3>
              <p class="mt-3 max-w-prose text-[0.95rem] leading-relaxed text-body">{o().detail.whoFor}</p>
            </div>

            <div class="mt-8">
              <h3 class="micro-caps text-blue-ink">{t().problemsLabel}</h3>
              <ul class="mt-3 space-y-2.5">
                <For each={o().detail.problems}>
                  {(p) => (
                    <li class="flex items-start gap-3 text-[0.95rem] leading-snug text-navy">
                      <span class="mt-1.5 block h-[3px] w-4 shrink-0 bg-turquoise" aria-hidden="true" />
                      {p}
                    </li>
                  )}
                </For>
              </ul>
            </div>

            <div class="mt-8">
              <h3 class="micro-caps text-blue-ink">{t().pricingLabel}</h3>
              <p class="mt-3 max-w-prose text-[0.95rem] leading-relaxed text-body">{o().detail.pricingMethod}</p>
            </div>

            <div class="mt-9">
              <ButtonLink href={quoteLink(props.locale, o().id)} track="service_offer_cta" trackData={{ package: o().id }}>
                {o().ctaLabel}
              </ButtonLink>
            </div>
          </div>

          <div class="lg:col-span-6 lg:col-start-7">
            <div class="card p-7">
              <h3 class="micro-caps text-body">{t().deliverablesLabel}</h3>
              <ul class="mt-4">
                <For each={o().detail.deliverables}>
                  {(d) => (
                    <li class="flex items-start gap-3 border-b border-hairline py-2.5 text-[0.9rem] font-medium text-navy last:border-0">
                      <svg class="mt-1 h-3.5 w-3.5 shrink-0 text-blue" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      {d}
                    </li>
                  )}
                </For>
              </ul>
            </div>

            <div class="mt-6">
              <h3 class="micro-caps text-blue-ink">{t().useCasesLabel}</h3>
              <ul class="mt-3 flex flex-wrap gap-2">
                <For each={o().detail.useCases}>
                  {(u) => <li class="rounded-full border border-hairline bg-white px-3.5 py-1.5 text-[0.78rem] text-body">{u}</li>}
                </For>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </article>
  );
}

/** La tarjeta 305 real (frente y reverso) — prueba tangible, solo en la página NFC. */
function NfcShowcase(props: { locale: Locale }) {
  const t = () => C[props.locale].nfcShowcase;
  const card = (img: string, label: string) => (
    <figure>
      <div class="overflow-hidden rounded-2xl border border-hairline shadow-sm">
        <img
          src={img}
          alt={`305 Web Service NFC card — ${label}`}
          width="1011"
          height="639"
          loading="lazy"
          class="w-full"
        />
      </div>
      <figcaption class="mt-3 micro-caps text-body">{label}</figcaption>
    </figure>
  );
  return (
    <section class="bg-paper py-section">
      <Container>
        <div class="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div class="lg:col-span-4">
            <p class="micro-caps text-blue-ink">{t().eyebrow}</p>
            <h2 class="mt-4 text-[clamp(1.6rem,3vw,2.6rem)] font-extrabold leading-tight tracking-tight text-navy">{t().heading}</h2>
            <p class="mt-5 max-w-prose leading-relaxed text-body">{t().text}</p>
          </div>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {card("/nfc/305-card-front.png", t().frontLabel)}
            {card("/nfc/305-card-back.png", t().backLabel)}
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Bloque de honestidad NFC — solo en la página NFC. */
function NfcCompliance(props: { locale: Locale }) {
  const t = () => C[props.locale].nfcCompliance;
  return (
    <section class="bg-navy py-section" data-surface="navy">
      <Container>
        <h2 class="text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold tracking-tight text-paper">{t().heading}</h2>
        <div class="rule-t mt-6" />
        <ul class="mt-10 grid grid-cols-1 gap-x-12 gap-y-5 md:grid-cols-2">
          <For each={t().items}>
            {(item) => (
              <li class="flex items-start gap-3 border-t border-[rgba(247,249,252,0.14)] pt-5 text-[0.95rem] leading-relaxed text-on-navy">
                <svg class="mt-1 h-4 w-4 shrink-0 text-turquoise" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                {item}
              </li>
            )}
          </For>
        </ul>
      </Container>
    </section>
  );
}

export default function ServicePage(props: Props) {
  const t = () => C[props.locale];
  const meta = () => t().meta[props.metaKey];
  const offers = () => props.offerIds.map((id) => OFFERS[props.locale].find((o) => o.id === id)!);
  const isNfc = () => props.offerIds.includes("nfc");
  const allFaq = () => offers().flatMap((o) => o.detail.faq);

  const breadcrumbs = () => [
    { name: SITE_NAME, path: PATHS.home[props.locale] },
    { name: t().nav.services, path: PATHS.services[props.locale] },
    { name: props.heroTitle, path: PATHS[props.page][props.locale] },
  ];

  return (
    <Layout locale={props.locale} page={props.page}>
      <Seo title={meta().title} description={meta().description} path={PATHS[props.page][props.locale]} altPath={altPath(props.page, props.locale)} locale={props.locale} />
      <JsonLd data={serviceSchema(props.heroTitle, meta().description, PATHS[props.page][props.locale])} />
      <JsonLd data={breadcrumbSchema(breadcrumbs())} />
      <Show when={allFaq().length > 0}><JsonLd data={faqSchema(allFaq())} /></Show>

      <PageHero
        eyebrow={t().selector.eyebrow}
        intro={props.heroIntro}
        priceLine={props.heroPrice}
        cta={{ locale: props.locale, service: props.heroService, serviceLabel: props.heroTitle }}
      >
        {props.heroTitle}
      </PageHero>

      <Show when={props.showWork}><SelectedWork locale={props.locale} /></Show>

      <Show when={isNfc()}><NfcShowcase locale={props.locale} /></Show>

      <For each={offers()}>{(o, i) => <OfferBlock locale={props.locale} offer={o} index={i()} />}</For>

      <Show when={isNfc()}><NfcCompliance locale={props.locale} /></Show>

      <ProcessSteps locale={props.locale} />

      <Show when={allFaq().length > 0}>
        <Faq locale={props.locale} items={allFaq()} />
      </Show>

      <FinalCta locale={props.locale} />
    </Layout>
  );
}
