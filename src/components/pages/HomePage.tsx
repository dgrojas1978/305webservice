import { Show } from "solid-js";
import Seo from "~/components/Seo";
import SelectedWork from "~/components/sections/SelectedWork";
import JsonLd from "~/components/JsonLd";
import Layout from "~/components/layout/Layout";
import Container from "~/components/ui/Container";
import { ButtonLink } from "~/components/ui/Button";
import { FinalCta, TrustStrip } from "~/components/sections/HomeSections";
import { Capabilities, Approach } from "~/components/sections/Positioning";
import { C } from "~/data/content";
import { PATHS, altPath, type Locale } from "~/lib/i18n";
import { quoteLink } from "~/lib/links";
import { localBusinessSchema, faqSchema } from "~/lib/schema";

export default function HomePage(props: { locale: Locale }) {
  const t = () => C[props.locale];

  return (
    <Layout locale={props.locale} page="home">
      <Seo
        title={t().meta.home.title}
        description={t().meta.home.description}
        path={PATHS.home[props.locale]}
        altPath={altPath("home", props.locale)}
        locale={props.locale}
      />
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={faqSchema(t().faq.items)} />

      {/* ================= HERO ================= */}
      <section data-surface="navy"
        class="relative flex min-h-[100svh] items-center overflow-hidden bg-navy pb-20 pt-28 md:pb-28 md:pt-36">
        <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <span aria-hidden="true" class="monument absolute -right-[0.12em] top-[0.1em] text-[clamp(11rem,26vw,24rem)]" style={{ color: "rgba(20,108,255,0.16)" }}>305</span>
          {/* Composición de los 4 servicios (web/chat/NFC/marketing); bordes en
              fade a transparente para fundirse con el navy. Solo ≥xl: en móvil
              y tablet los CTAs mandan y la imagen empujaría el fold. */}
          <img
            src="/hero/hero-devices.webp"
            alt=""
            width="598"
            height="620"
            class="absolute right-[3vw] top-1/2 hidden w-[min(40vw,600px)] -translate-y-1/2 xl:block"
          />
        </div>
        <Container class="relative z-10">
          <div class="max-w-3xl">
            <p class="hero-rise micro-caps text-turquoise">{t().hero.eyebrow}</p>
            <h1 class="hero-rise mt-7 text-[clamp(2.5rem,6.4vw,5.25rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-balance text-paper"
              style={{ "--rise": "70ms" }}>
              {t().hero.h1}
            </h1>
            <p class="hero-rise mt-7 max-w-[46ch] text-body-lg leading-relaxed text-on-navy"
              style={{ "--rise": "140ms" }}>{t().hero.sub}</p>

            {/* El precio dejó de ser el mensaje maestro: vive en la página del
                paquete starter. Si algún locale lo deja vacío, no se pinta. */}
            <Show when={t().hero.priceLine}>
              <div class="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
                <span class="badge badge-onnavy !text-[0.8rem]">{t().hero.priceLine}</span>
              </div>
            </Show>
            <div class="hero-rise mt-10 flex flex-col gap-4 sm:flex-row" style={{ "--rise": "210ms" }}>
              <ButtonLink href={quoteLink(props.locale)} track="hero_cta_primary">{t().hero.ctaPrimary}</ButtonLink>
              <ButtonLink href="#selected-work" variant="outline">{t().hero.ctaSecondary}</ButtonLink>
            </div>
            <div class="hero-rise mt-10" style={{ "--rise": "280ms" }}>
              <TrustStrip locale={props.locale} />
            </div>
          </div>
        </Container>
      </section>

      {/* 2 · SELECTED WORK */}
      <SelectedWork locale={props.locale} />

      {/* 3 · CAPABILITIES — tres grupos, no un catalogo */}
      <Capabilities locale={props.locale} />

      {/* 4 · APPROACH — cuatro pasos */}
      <Approach locale={props.locale} />

      {/* Retirados por no estar en la estructura aprobada de cinco bloques:
          PackageSelector (4695 px, la seccion mas larga y con el precio como
          mensaje), WhyCustom, Industries, ProcessSteps (sustituido por
          Approach), ProofExpect, Engagement y Faq. El contenido sigue vivo en
          content.ts y en las paginas de servicio. */}

      {/* ================= FINAL CTA ================= */}
      <FinalCta locale={props.locale} />
    </Layout>
  );
}
