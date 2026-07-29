import { Show } from "solid-js";
import Seo from "~/components/Seo";
import SelectedWork from "~/components/sections/SelectedWork";
import JsonLd from "~/components/JsonLd";
import Layout from "~/components/layout/Layout";
import Container from "~/components/ui/Container";
import { ButtonLink } from "~/components/ui/Button";
import PackageSelector from "~/components/sections/PackageSelector";
import {
  ProblemGrid, WhyCustom, Industries, ProcessSteps, ProofExpect, Engagement, Faq, FinalCta, TrustStrip,
} from "~/components/sections/HomeSections";
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
      <section data-surface="navy" class="relative overflow-hidden bg-navy pb-16 pt-28 md:pb-24 md:pt-36">
        <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <span aria-hidden="true" class="monument absolute -right-[0.12em] top-[0.1em] text-[clamp(11rem,26vw,24rem)]" style={{ color: "rgba(20,108,255,0.16)" }}>305</span>
        </div>
        <Container class="relative z-10">
          <div class="max-w-3xl">
            <p class="micro-caps text-turquoise">{t().hero.eyebrow}</p>
            <h1 class="mt-6 text-[clamp(2.2rem,5.2vw,4.2rem)] font-black leading-[1.03] tracking-tight text-paper">
              {t().hero.h1}
            </h1>
            <p class="mt-6 max-w-2xl text-body-lg leading-relaxed text-on-navy">{t().hero.sub}</p>

            {/* El precio dejó de ser el mensaje maestro: vive en la página del
                paquete starter. Si algún locale lo deja vacío, no se pinta. */}
            <Show when={t().hero.priceLine}>
              <div class="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
                <span class="badge badge-onnavy !text-[0.8rem]">{t().hero.priceLine}</span>
              </div>
            </Show>
            <div class="mt-8 flex flex-col gap-4 sm:flex-row">
              <ButtonLink href={quoteLink(props.locale)} track="hero_cta_primary">{t().hero.ctaPrimary}</ButtonLink>
              <ButtonLink href="#selected-work" variant="outline">{t().hero.ctaSecondary}</ButtonLink>
            </div>
            <div class="mt-9">
              <TrustStrip locale={props.locale} />
            </div>
          </div>
        </Container>
      </section>

      {/* ============ SELECTED WORK (destino de "View our work") ============ */}
      <SelectedWork locale={props.locale} />

      {/* ================= PROBLEM ================= */}
      <ProblemGrid locale={props.locale} />

      {/* ================= PACKAGE SELECTOR ================= */}
      <PackageSelector locale={props.locale} />

      {/* ================= WHY CUSTOM ================= */}
      <WhyCustom locale={props.locale} />

      {/* ================= INDUSTRIES ================= */}
      <Industries locale={props.locale} />

      {/* ================= PROCESS ================= */}
      <ProcessSteps locale={props.locale} />

      {/* ================= PROOF / EXPECT ================= */}
      <ProofExpect locale={props.locale} />

      {/* ================= ENGAGEMENT ================= */}
      <Engagement locale={props.locale} />

      {/* ================= FAQ ================= */}
      <Faq locale={props.locale} />

      {/* ================= FINAL CTA ================= */}
      <FinalCta locale={props.locale} />
    </Layout>
  );
}
