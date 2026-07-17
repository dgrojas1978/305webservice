import { A } from "@solidjs/router";
import { createRenderEffect, createSignal, For, onCleanup, onMount } from "solid-js";
import Seo from "~/components/Seo";
import JsonLd from "~/components/JsonLd";
import Layout from "~/components/layout/Layout";
import Container from "~/components/ui/Container";
import { ButtonLink } from "~/components/ui/Button";
import ServiceAccordion from "~/components/sections/ServiceAccordion";
import { C } from "~/data/content";
import { PATHS, altPath, type Locale } from "~/lib/i18n";
import { CONTACT_EMAIL, PHONE_DISPLAY, PHONE_TEL, SITE_URL, WEB_DISPLAY } from "~/lib/site";

/** Solo datos reales y verificados — sin dirección postal (no publicada). */
const PROFESSIONAL_SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "305 Web Service",
  url: SITE_URL,
  telephone: "+13058332984",
  email: "305webservice@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Miami",
    addressRegion: "FL",
    addressCountry: "US",
  },
  areaServed: "Miami, Florida",
  knowsLanguage: ["en", "es"],
};

const INTRO_KEY = "305-intro-seen";

export default function HomePage(props: { locale: Locale }) {
  const t = () => C[props.locale];
  const [intro, setIntro] = createSignal<"done" | "run">("done");
  let monumentRef: HTMLDivElement | undefined;

  // intro una sola vez por sesión — createRenderEffect corre antes del paint
  createRenderEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && !sessionStorage.getItem(INTRO_KEY)) {
      setIntro("run");
      sessionStorage.setItem(INTRO_KEY, "1");
    }
  });

  // parallax muy sutil del monumento (desactivado con reduced motion)
  onMount(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (monumentRef) {
          monumentRef.style.transform = `translateY(${Math.min(window.scrollY * 0.06, 80)}px)`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onCleanup(() => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    });
  });

  return (
    <Layout locale={props.locale} page="home">
      <Seo
        title={t().meta.home.title}
        description={t().meta.home.description}
        path={PATHS.home[props.locale]}
        altPath={altPath("home", props.locale)}
        locale={props.locale}
      />
      <JsonLd data={PROFESSIONAL_SERVICE_SCHEMA} />

      {/* ================= HERO ================= */}
      <section
        data-surface="navy"
        data-intro={intro()}
        class="relative flex min-h-[100svh] items-center overflow-hidden bg-navy"
      >
        {/* 305 monumental, cortado por borde derecho e inferior */}
        <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div
            ref={monumentRef}
            class="intro-monument monument absolute -bottom-[0.14em] -right-[0.16em] text-[clamp(17rem,52vw,56rem)]"
          >
            305
          </div>
        </div>

        <Container class="relative z-10 pb-64 pt-32 md:py-40">
          <div class="intro-brand">
            <p class="micro-caps text-on-navy">{t().hero.eyebrow1}</p>
            <p class="micro-caps mt-1 text-turquoise">{t().hero.eyebrow2}</p>
            <div class="rule-t mt-6" />
          </div>

          <h1 class="mt-10 text-h1 uppercase text-paper">
            <span class="intro-line" data-l="1"><span class="li">{t().hero.lines[0]}</span></span>
            <span class="intro-line" data-l="2"><span class="li">{t().hero.lines[1]}</span></span>
            <span class="intro-line" data-l="3"><span class="li">{t().hero.lines[2]}</span></span>
          </h1>

          <div class="intro-late mt-10 max-w-lg">
            <p class="text-body-lg text-on-navy">{t().hero.text}</p>
            <div class="mt-10 flex flex-col gap-4 sm:flex-row">
              <ButtonLink href={PATHS.contact[props.locale]}>{t().hero.ctaPrimary}</ButtonLink>
              <ButtonLink href={PATHS.services[props.locale]} variant="outline">
                {t().hero.ctaSecondary}
              </ButtonLink>
            </div>
          </div>
        </Container>

        {/* indicador vertical */}
        <div
          class="intro-late scroll-indicator micro-caps absolute bottom-10 right-6 hidden text-on-navy-faint md:block lg:right-10"
          aria-hidden="true"
        >
          {t().hero.scroll}
        </div>
      </section>

      {/* ================= POSICIONAMIENTO ================= */}
      <section class="bg-paper py-section">
        <Container>
          <div class="grid grid-cols-1 gap-10 md:grid-cols-12">
            <div class="md:col-span-8">
              <p class="reveal micro-caps text-blue">{t().positioning.eyebrow}</p>
              <div class="rule-t reveal-rule mt-6" />
              <h2 class="reveal mt-8 max-w-[18ch] text-h2 uppercase text-navy" data-delay="1">
                {t().positioning.title}
              </h2>
            </div>
            <div class="flex md:col-span-4 md:items-end">
              <p class="reveal max-w-prose text-body-lg text-body" data-delay="2">
                {t().positioning.text}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ================= SERVICIOS ================= */}
      <section class="bg-paper pb-section">
        <Container>
          <p class="reveal micro-caps text-blue">{t().services.eyebrow}</p>
          <h2 class="reveal mt-6 text-h2 uppercase text-navy" data-delay="1">
            {t().services.title1}
            <br />
            {t().services.title2}
          </h2>
          <div class="reveal mt-14" data-delay="2">
            <ServiceAccordion locale={props.locale} />
          </div>
        </Container>
      </section>

      {/* ================= PROYECTOS ================= */}
      <section class="bg-paper pb-section">
        <Container>
          <p class="reveal micro-caps text-blue">{t().projects.eyebrow}</p>
          <h2 class="reveal-line mt-6 text-h2 uppercase text-navy" data-delay="1">
            <span class="ln"><span class="li">{t().projects.titleLines[0]}</span></span>
            <span class="ln"><span class="li">{t().projects.titleLines[1]}</span></span>
            <span class="ln"><span class="li">{t().projects.titleLines[2]}</span></span>
          </h2>
          <p class="reveal mt-8 max-w-prose text-body-lg text-body" data-delay="2">
            {t().projects.text}
          </p>

          <div class="mt-14 grid grid-cols-1 gap-px bg-hairline md:grid-cols-3">
            <For each={t().projects.slots}>
              {(slot, i) => (
                <div class="reveal bg-paper py-12 pr-8" data-delay={String(i() + 1)}>
                  <span class="monument monument-ghost block text-7xl">{`0${i() + 1}`}</span>
                  <p class="mt-8 text-xl font-extrabold uppercase tracking-tight text-navy">
                    {slot.name}
                  </p>
                  <p class="micro-caps mt-2 text-body">{slot.tag}</p>
                  <p class="micro-caps mt-6 inline-block border border-hairline px-3 py-1.5 text-blue">
                    {t().projects.comingSoon}
                  </p>
                </div>
              )}
            </For>
          </div>

          <div class="reveal mt-12">
            <A href={PATHS.projects[props.locale]} class="link-underline micro-caps text-blue">
              {t().nav.projects} →
            </A>
          </div>
        </Container>
      </section>

      {/* ================= PROCESO ================= */}
      <section data-surface="navy" class="bg-navy py-section">
        <Container>
          <p class="reveal micro-caps text-turquoise">{t().process.eyebrow}</p>
          <h2 class="reveal mt-6 text-h2 uppercase text-paper" data-delay="1">
            {t().process.title1}
            <br />
            {t().process.title2}
          </h2>

          <div class="mt-16 md:mt-20">
            <For each={t().process.steps}>
              {(step) => (
                <div class="reveal grid grid-cols-1 gap-6 border-t border-[rgba(247,249,252,0.14)] py-10 md:grid-cols-12 md:py-12">
                  <span class="outline-num text-7xl md:col-span-3 md:text-8xl" aria-hidden="true">
                    {step.no}
                  </span>
                  <h3 class="text-h3 uppercase text-paper md:col-span-4">
                    <span class="sr-only">{step.no} — </span>
                    {step.name}
                  </h3>
                  <p class="max-w-prose text-base leading-relaxed text-on-navy md:col-span-5">
                    {step.text}
                  </p>
                </div>
              )}
            </For>
            <div class="hr-line-navy" />
          </div>
        </Container>
      </section>

      {/* ================= DIFERENCIADORES ================= */}
      <section class="bg-paper py-section">
        <Container>
          <h2 class="reveal-line text-h2 uppercase text-navy">
            <span class="ln"><span class="li">{t().principles.title1}</span></span>
            <span class="ln"><span class="li">{t().principles.title2}</span></span>
            <span class="ln"><span class="li text-blue">{t().principles.title3}</span></span>
          </h2>

          <div class="mt-16 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
            <For each={t().principles.items}>
              {(item, i) => (
                <div class="reveal flex items-baseline gap-6 border-t border-hairline pt-6" data-delay={String(i() % 2)}>
                  <span class="text-sm font-bold text-blue">{item.no}</span>
                  <p class="text-lg font-extrabold uppercase tracking-tight text-navy md:text-xl">
                    {item.name}
                  </p>
                </div>
              )}
            </For>
          </div>
        </Container>
      </section>

      {/* ================= MIAMI ================= */}
      <section class="bg-blue py-section">
        <Container>
          <h2 class="reveal-line text-display uppercase leading-[0.95] text-navy">
            <span class="ln"><span class="li">{t().miami.line1}</span></span>
            <span class="ln"><span class="li">{t().miami.line2}</span></span>
          </h2>
          <div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-12">
            <p class="reveal max-w-prose text-body-lg font-medium text-navy md:col-span-6" data-delay="1">
              {t().miami.text}
            </p>
            <div class="flex md:col-span-6 md:items-end md:justify-end">
              <p class="reveal micro-caps text-navy" data-delay="2">{t().miami.micro}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* ================= CTA FINAL ================= */}
      <section data-surface="navy" class="relative overflow-hidden bg-navy py-section">
        <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <span class="monument monument-ghost-navy absolute -right-[0.1em] -top-[0.28em] text-[clamp(14rem,36vw,34rem)]">
            305
          </span>
        </div>
        <Container class="relative z-10">
          <h2 class="reveal-line text-h1 uppercase text-paper">
            <span class="ln"><span class="li">{t().finalCta.title1}</span></span>
            <span class="ln"><span class="li">{t().finalCta.title2}</span></span>
          </h2>
          <p class="reveal mt-8 max-w-lg text-body-lg text-on-navy" data-delay="1">
            {t().finalCta.text}
          </p>
          <div class="reveal mt-10" data-delay="2">
            <ButtonLink href={PATHS.contact[props.locale]}>{t().finalCta.button}</ButtonLink>
          </div>

          <div class="reveal mt-16 flex flex-col gap-3 border-t border-[rgba(247,249,252,0.14)] pt-8 sm:flex-row sm:items-center sm:gap-10" data-delay="3">
            <a href={`tel:${PHONE_TEL}`} class="link-underline text-lg font-bold text-paper">
              {PHONE_DISPLAY}
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} class="link-underline text-lg font-medium text-on-navy">
              {CONTACT_EMAIL}
            </a>
            <span class="micro-caps text-turquoise">{WEB_DISPLAY}</span>
          </div>
        </Container>
      </section>
    </Layout>
  );
}
