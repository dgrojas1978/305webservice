import { A } from "@solidjs/router";
import { createSignal, For, Show } from "solid-js";
import Container from "~/components/ui/Container";
import SectionHeading from "~/components/ui/SectionHeading";
import { ButtonLink, WhatsAppIcon } from "~/components/ui/Button";
import { C } from "~/data/content";
import { PATHS, type Locale } from "~/lib/i18n";
import { quoteLink, waQuote } from "~/lib/links";
import { CONTACT_EMAIL, PHONE_DISPLAY, PHONE_TEL } from "~/lib/site";

/* ---------------- Trust strip ---------------- */
export function TrustStrip(props: { locale: Locale }) {
  const t = () => C[props.locale];
  return (
    <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
      <For each={t().hero.trust}>
        {(item, i) => (
          <>
            <Show when={i() > 0}>
              <span class="h-1 w-1 rounded-full bg-turquoise" aria-hidden="true" />
            </Show>
            <span class="micro-caps text-on-navy-faint">{item}</span>
          </>
        )}
      </For>
    </div>
  );
}

/* ---------------- Problem recognition ---------------- */
export function ProblemGrid(props: { locale: Locale }) {
  const t = () => C[props.locale];
  return (
    <section class="bg-paper py-section">
      <Container>
        <SectionHeading eyebrow={props.locale === "es" ? "El problema" : "The problem"} title={t().problems.heading} />
        <div class="mt-12 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
          <For each={t().problems.items}>
            {(p) => (
              <div class="reveal flex items-start gap-4 border-t border-hairline pt-6">
                <span class="mt-1 block h-[3px] w-6 shrink-0 bg-turquoise" aria-hidden="true" />
                <p class="text-lg font-semibold leading-snug text-navy">{p}</p>
              </div>
            )}
          </For>
        </div>
        <div class="mt-12">
          <ButtonLink href={quoteLink(props.locale)} track="problem_cta_click">{t().problems.cta}</ButtonLink>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Why custom (before/after) ---------------- */
export function WhyCustom(props: { locale: Locale }) {
  const t = () => C[props.locale].whyCustom;
  return (
    <section class="bg-navy py-section" data-surface="navy">
      <Container>
        <SectionHeading eyebrow={props.locale === "es" ? "Por qué a medida" : "Why custom"} title={t().heading} intro={t().sub} onDark />
        <div class="mt-14 grid grid-cols-1 items-stretch gap-6 md:grid-cols-[1fr_auto_1fr]">
          <div class="rounded-2xl border border-[rgba(247,249,252,0.14)] p-7">
            <p class="micro-caps text-on-navy-faint">{t().beforeLabel}</p>
            <ul class="mt-5 space-y-3">
              <For each={t().before}>
                {(b) => <li class="text-lg font-medium text-on-navy">{b}</li>}
              </For>
            </ul>
          </div>
          <div class="flex items-center justify-center">
            <span class="text-3xl text-turquoise md:rotate-0" aria-hidden="true">→</span>
          </div>
          <div class="rounded-2xl border border-blue bg-[rgba(20,108,255,0.08)] p-7">
            <p class="micro-caps text-turquoise">{t().afterLabel}</p>
            <ul class="mt-5 space-y-3">
              <For each={t().after}>
                {(a) => <li class="text-lg font-semibold text-paper">{a}</li>}
              </For>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Industries ---------------- */
export function Industries(props: { locale: Locale; heading?: boolean }) {
  const t = () => C[props.locale].industries;
  return (
    <section id="industries" class="bg-paper py-section">
      <Container>
        <Show when={props.heading !== false}>
          <SectionHeading eyebrow={t().eyebrow} title={t().heading} intro={t().note} />
        </Show>
        <div class="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <For each={t().items}>
            {(ind) => (
              <div class="card flex flex-col p-6">
                <h3 class="text-base font-extrabold uppercase tracking-tight text-navy">{ind.name}</h3>
                <div class="rule-t mt-3 !w-8" />
                <p class="mt-4 text-[0.9rem] leading-relaxed text-body">{ind.problem}</p>
                <p class="mt-auto pt-5 text-[0.82rem] font-semibold text-blue-ink">{ind.solutions}</p>
              </div>
            )}
          </For>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Process ---------------- */
export function ProcessSteps(props: { locale: Locale }) {
  const t = () => C[props.locale].process;
  return (
    <section id="process" class="bg-navy py-section" data-surface="navy">
      <Container>
        <SectionHeading eyebrow={t().eyebrow} title={t().heading} onDark />
        <div class="mt-14">
          <For each={t().steps}>
            {(s) => (
              <div class="reveal grid grid-cols-1 gap-4 border-t border-[rgba(247,249,252,0.14)] py-8 md:grid-cols-12 md:py-9">
                <span class="outline-num text-6xl md:col-span-3 md:text-7xl" aria-hidden="true">{s.no}</span>
                <h3 class="text-h3 uppercase text-paper md:col-span-4">
                  <span class="sr-only">{s.no} — </span>{s.name}
                </h3>
                <p class="max-w-prose text-base leading-relaxed text-on-navy md:col-span-5">{s.text}</p>
              </div>
            )}
          </For>
          <div class="hr-line-navy" />
        </div>
        <ul class="mt-10 flex flex-wrap gap-x-7 gap-y-3">
          <For each={t().emphasis}>
            {(e) => (
              <li class="flex items-center gap-2.5">
                <span class="h-[3px] w-4 bg-turquoise" aria-hidden="true" />
                <span class="micro-caps text-on-navy">{e}</span>
              </li>
            )}
          </For>
        </ul>
      </Container>
    </section>
  );
}

/* ---------------- Proof / what to expect ---------------- */
export function ProofExpect(props: { locale: Locale }) {
  const t = () => C[props.locale].proof;
  return (
    <section class="bg-paper py-section">
      <Container>
        <div class="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div class="md:col-span-5">
            <SectionHeading eyebrow={t().eyebrow} title={t().heading} intro={t().sub} />
          </div>
          <div class="md:col-span-6 md:col-start-7">
            <ul class="space-y-4">
              <For each={t().items}>
                {(item) => (
                  <li class="flex items-start gap-3 border-b border-hairline pb-4 text-lg font-medium text-navy">
                    <svg class="mt-1.5 h-4 w-4 shrink-0 text-blue" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    {item}
                  </li>
                )}
              </For>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Engagement options ---------------- */
export function Engagement(props: { locale: Locale }) {
  const t = () => C[props.locale].engagement;
  return (
    <section class="bg-paper pb-section">
      <Container>
        <SectionHeading title={t().heading} />
        <div class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <For each={t().options}>
            {(o, i) => (
              <div class="card flex flex-col p-7">
                <span class="text-sm font-bold text-blue-ink">{`0${i() + 1}`}</span>
                <h3 class="mt-3 text-lg font-extrabold tracking-tight text-navy">{o.name}</h3>
                <p class="mt-3 text-[0.9rem] leading-relaxed text-body">{o.text}</p>
              </div>
            )}
          </For>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- FAQ (accessible accordion) ---------------- */
export function Faq(props: { locale: Locale; items?: { q: string; a: string }[]; heading?: boolean }) {
  const t = () => C[props.locale].faq;
  const items = () => props.items ?? t().items;
  const [open, setOpen] = createSignal<number | null>(0);
  return (
    <section class="bg-paper py-section">
      <Container>
        <Show when={props.heading !== false}>
          <SectionHeading eyebrow={t().eyebrow} title={t().heading} />
        </Show>
        <div class="mx-auto mt-12 max-w-3xl">
          <div class="hr-line" />
          <For each={items()}>
            {(item, i) => {
              const isOpen = () => open() === i();
              return (
                <div>
                  <h3>
                    <button
                      type="button"
                      class="flex w-full items-center justify-between gap-6 py-5 text-left"
                      aria-expanded={isOpen()}
                      aria-controls={`faq-${i()}`}
                      onClick={() => setOpen(isOpen() ? null : i())}
                    >
                      <span class="text-base font-bold text-navy md:text-lg">{item.q}</span>
                      <span class={`shrink-0 text-2xl font-light text-blue transition-transform duration-300 ease-editorial ${isOpen() ? "rotate-45" : ""}`} aria-hidden="true">+</span>
                    </button>
                  </h3>
                  <div id={`faq-${i()}`} class="acc-panel" data-open={isOpen()} role="region">
                    <div>
                      <p class="max-w-prose pb-6 text-[0.95rem] leading-relaxed text-body">{item.a}</p>
                    </div>
                  </div>
                  <div class="hr-line" />
                </div>
              );
            }}
          </For>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Final CTA ---------------- */
export function FinalCta(props: { locale: Locale }) {
  const t = () => C[props.locale];
  return (
    <section class="relative overflow-hidden bg-navy py-section" data-surface="navy">
      <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span aria-hidden="true" class="monument monument-ghost-navy absolute -right-[0.1em] -top-[0.28em] text-[clamp(14rem,34vw,32rem)]">305</span>
      </div>
      <Container class="relative z-10">
        <h2 class="max-w-3xl text-[clamp(2rem,4vw,3.4rem)] font-extrabold leading-[1.08] tracking-tight text-paper">
          {t().finalCta.heading}
        </h2>
        <p class="mt-6 max-w-xl text-body-lg text-on-navy">{t().finalCta.text}</p>
        <div class="mt-10 flex flex-col gap-4 sm:flex-row">
          <ButtonLink href={quoteLink(props.locale)} track="final_cta_click">{t().finalCta.ctaPrimary}</ButtonLink>
          <ButtonLink href={waQuote(props.locale)} variant="outline" external>
            <WhatsAppIcon class="h-4 w-4" />
            {t().finalCta.ctaSecondary}
          </ButtonLink>
        </div>
        <div class="mt-14 flex flex-col gap-3 border-t border-[rgba(247,249,252,0.14)] pt-8 sm:flex-row sm:items-center sm:gap-10">
          <a href={`tel:${PHONE_TEL}`} class="link-underline text-lg font-bold text-paper">{PHONE_DISPLAY}</a>
          <a href={`mailto:${CONTACT_EMAIL}`} class="link-underline text-lg font-medium text-on-navy">{CONTACT_EMAIL}</a>
          <A href={PATHS.privacy[props.locale]} class="micro-caps text-on-navy-faint hover:text-paper">{t().finalCta.note}</A>
        </div>
      </Container>
    </section>
  );
}
