import { A, useSearchParams, useSubmission } from "@solidjs/router";
import { For, Show, createSignal, onCleanup, onMount } from "solid-js";
import { WhatsAppIcon } from "~/components/ui/Button";
import AnalyticsListener from "~/components/AnalyticsListener";
import LeadSheet, { submitCardLead, type SheetMode } from "~/components/card/LeadSheet";
import { GoogleReviews, WhereWeWork } from "~/components/card/CardModules";
import { trackEvent } from "~/lib/analytics";
import { waLink } from "~/lib/site";
import {
  CARD_COPY,
  cardHref,
  type CardLocale,
  type CardNeed,
  type CardProfile,
} from "~/data/card";

/**
 * Tarjeta digital v2 — «digital business concierge» (orden super premium).
 * Dos recorridos: Meet 305 (guardar/llamar/WhatsApp/compartir) y Start a
 * Project (necesidad → prueba real → conversación). Hero de una pantalla,
 * prueba protagonista, conversión compacta en bottom sheet, barra móvil.
 * Sin app, sin registro, sin popups antes de ver la tarjeta.
 */

const LANG_KEY = "305_card_lang";

export default function DigitalCard(props: { profile: CardProfile }) {
  const p = () => props.profile;
  const [params] = useSearchParams();
  const submission = useSubmission(submitCardLead);

  const [lang, setLang] = createSignal<CardLocale>("en");
  const [copied, setCopied] = createSignal(false);
  const [needId, setNeedId] = createSignal("win-customers");
  const [sheetMode, setSheetMode] = createSignal<SheetMode>(null);
  const [sheetPreselect, setSheetPreselect] = createSignal<string | undefined>(undefined);
  const [sheetSuccess, setSheetSuccess] = createSignal(false);
  const [barVisible, setBarVisible] = createSignal(false);
  const [reelIdx, setReelIdx] = createSignal(0);
  const [moreOpen, setMoreOpen] = createSignal(false);

  const t = () => CARD_COPY[lang()];
  const co = () => p().company;
  // El panel de conversion existe dos veces por responsive. Solo una debe
  // anunciarse a tecnologia asistiva.
  const [isNarrow, setIsNarrow] = createSignal(true);
  onMount(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const sync = () => setIsNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    onCleanup(() => mq.removeEventListener("change", sync));
  });

  const need = () => p().conversion.needs.find((n) => n.id === needId())!;
  const needProject = () => {
    const key = need().projectKey;
    return key ? p().conversion.projects.find((w) => w.key === key) : undefined;
  };
  const serviceFor = (n: CardNeed) => p().conversion.services.find((s) => s.id === n.serviceId)!;
  const cardUrl = () => `${co().website}${p().nfc.canonicalPath}`;

  let heroRef: HTMLElement | undefined;
  let workUl: HTMLUListElement | undefined;
  let qrRef: HTMLDivElement | undefined;

  const switchLang = (l: CardLocale) => {
    if (l === lang()) return;
    setLang(l);
    try { localStorage.setItem(LANG_KEY, l); } catch { /* opcional */ }
    document.documentElement.lang = l === "es" ? "es-US" : "en-US";
    trackEvent("language_change", { lang: l });
  };

  const openSheet = (mode: SheetMode, preselect?: string) => {
    setSheetPreselect(preselect);
    setSheetSuccess(false);
    setSheetMode(mode);
    if (mode === "project") trackEvent("start_project", { card: p().id });
  };

  const share = async () => {
    trackEvent("share_click", { card: p().id });
    const data = { title: co().name, text: co().positioning[lang()], url: cardUrl() };
    try {
      if (navigator.share) { await navigator.share(data); return; }
    } catch { /* usuario canceló */ }
    copyLink();
  };
  const copyLink = async () => {
    trackEvent("copy_link", { card: p().id });
    try {
      await navigator.clipboard.writeText(cardUrl());
      setCopied(true); setTimeout(() => setCopied(false), 2500);
    } catch { /* clipboard no disponible */ }
  };

  onMount(() => {
    try {
      if (localStorage.getItem(LANG_KEY) === "es") switchLang("es");
    } catch { /* opcional */ }
    const src = new URLSearchParams(window.location.search).get("utm_source") || "direct";
    trackEvent("card_view", { card: p().id, src });

    // éxito del formulario tras redirect
    if (params.submitted) { setSheetSuccess(true); setSheetMode("project"); }

    // error tras POST nativo (sin interceptación JS): reabrir el sheet con el error
    if (!params.submitted && submission.result?.error) {
      let mode: SheetMode = "project";
      try {
        const fd = submission.input?.[0];
        if (fd instanceof FormData && fd.get("mode") === "exchange") mode = "exchange";
      } catch { /* modo por defecto */ }
      setSheetMode(mode);
    }

    // barra inferior cuando el hero sale del viewport
    let heroObs: IntersectionObserver | undefined;
    if (heroRef && "IntersectionObserver" in window) {
      heroObs = new IntersectionObserver(([e]) => setBarVisible(!e.isIntersecting), { threshold: 0.05 });
      heroObs.observe(heroRef);
    }

    // project_view (una vez por proyecto visible en el carrusel)
    const seen = new Set<string>();
    let workObs: IntersectionObserver | undefined;
    if (workUl && "IntersectionObserver" in window) {
      workObs = new IntersectionObserver((entries) => {
        for (const e of entries) {
          const key = (e.target as HTMLElement).dataset.project;
          if (e.isIntersecting && key && !seen.has(key)) {
            seen.add(key);
            trackEvent("project_view", { project: key });
          }
        }
      }, { threshold: 0.6 });
      workUl.querySelectorAll("[data-project]").forEach((el) => workObs!.observe(el));
    }

    // qr_view: el único QR de la página entra en pantalla (una sola vez)
    let qrObs: IntersectionObserver | undefined;
    if (qrRef && "IntersectionObserver" in window) {
      qrObs = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          trackEvent("qr_view", { card: p().id });
          qrObs?.disconnect();
        }
      }, { threshold: 0.5 });
      qrObs.observe(qrRef);
    }

    // reel del hero: crossfade suave, pausado con prefers-reduced-motion
    let timer: ReturnType<typeof setInterval> | undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!reduced.matches) {
      timer = setInterval(() => setReelIdx((i) => (i + 1) % p().conversion.projects.length), 4200);
    }

    onCleanup(() => { heroObs?.disconnect(); workObs?.disconnect(); qrObs?.disconnect(); if (timer) clearInterval(timer); });
  });

  const scrollWork = (dir: 1 | -1) => {
    workUl?.scrollBy({ left: dir * workUl.clientWidth * 0.85, behavior: "smooth" });
  };

  const quickLink =
    "t-card inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-[rgba(247,249,252,0.18)] px-3.5 py-2 text-[0.72rem] font-bold uppercase tracking-wide text-on-navy hover:text-paper";

  /**
   * Conversion Panel — el único bloque de venta del primer viewport desktop.
   * Se instancia en la columna derecha (desktop) o tras el proyecto (móvil);
   * solo uno es visible a la vez.
   */
  const conversionPanel = () => {
    const cp = () => t().convertPanel;
    return (
      <div class="rounded-[26px] border border-[rgba(247,249,252,0.09)] bg-[#0a1728] px-9 py-10 shadow-[0_30px_80px_-40px_rgba(2,8,18,0.9)]">
        <p class="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-turquoise">{cp().eyebrow}</p>
        <h2 class="font-editorial mt-4 text-[1.32rem] font-semibold leading-[1.15] tracking-tight text-paper">
          {cp().heading}
        </h2>
        <p class="mt-3 text-[0.85rem] leading-relaxed text-on-navy">{cp().sub}</p>

        <ul class="mt-6 space-y-3">
          <For each={cp().outcomes}>
            {(o) => (
              <li class="flex items-start gap-2.5 text-[0.85rem] font-medium leading-snug text-paper">
                <svg viewBox="0 0 16 16" class="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-turquoise" fill="none" aria-hidden="true">
                  <path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                {o}
              </li>
            )}
          </For>
        </ul>

        <button type="button" onClick={() => openSheet("project")}
          class="btn btn-primary mt-7 w-full !py-3.5 uppercase tracking-wide">
          {t().hero.ctaPrimary}
        </button>
        <a href={waLink(t().waMessage)} target="_blank" rel="noopener noreferrer"
          data-track="whatsapp_click" data-card={p().id}
          class="btn btn-outline mt-2.5 w-full !py-3.5 text-center uppercase tracking-wide">
          <WhatsAppIcon class="h-4 w-4 text-green" /> {t().convert.ctaWhatsApp}
        </a>

        <p class="mt-6 text-[0.7rem] font-semibold leading-relaxed text-on-navy-faint">{cp().trust}</p>
        <p class="mt-3 border-t border-[rgba(247,249,252,0.08)] pt-3 text-[0.72rem] leading-relaxed text-on-navy-faint">
          {cp().price}
        </p>
      </div>
    );
  };

  return (
    <div class="relative min-h-screen bg-[#050d1a] text-paper" data-surface="navy">
      <AnalyticsListener />
      {/* Profundidad: iluminación radial a página completa, sin formas reconocibles. */}
      <div class="ambient pointer-events-none fixed inset-x-0 top-0 h-[70vh]" aria-hidden="true" />

      <div class="relative z-10 lg:mx-auto lg:grid lg:max-w-[1040px] lg:grid-cols-[minmax(0,640px)_360px] lg:justify-center lg:gap-10 lg:px-8">
        {/* ============ columna principal ============ */}
        <div class="relative mx-auto w-full max-w-md px-5 pb-28 sm:max-w-lg lg:max-w-none lg:px-0 lg:pb-16">

          {/* 1 · HERO (una pantalla) — una identidad, una promesa, una prueba,
               un grupo de acciones. Sin monograma extra ni número de fondo. */}
          <section ref={heroRef} class="relative flex flex-col pb-7 pt-5">
            <div class="relative flex items-start justify-between gap-4">
              <p class="text-lg font-black uppercase tracking-tight">
                <span class="text-blue-navy">{p().brand.wordmarkAccent}</span> {p().brand.wordmarkRest}
              </p>
              <div role="group" aria-label={t().langLabel} class="inline-flex overflow-hidden rounded-full border border-[rgba(247,249,252,0.22)] text-[0.68rem] font-bold">
                <button type="button" onClick={() => switchLang("en")} aria-pressed={lang() === "en"}
                  class={`t-card min-h-[32px] px-2.5 ${lang() === "en" ? "bg-paper text-navy" : "text-on-navy"}`}>EN</button>
                <button type="button" onClick={() => switchLang("es")} aria-pressed={lang() === "es"}
                  class={`t-card min-h-[32px] px-2.5 ${lang() === "es" ? "bg-paper text-navy" : "text-on-navy"}`}>ES</button>
              </div>
            </div>

            <p class="mt-7 inline-flex w-fit items-center gap-2 rounded-full border border-[rgba(32,215,197,0.3)] px-3 py-1 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-turquoise">
              <span class="h-1.5 w-1.5 rounded-full bg-turquoise" aria-hidden="true" />
              {t().hero.avail}
            </p>

            <h1 class="font-editorial mt-5 text-[1.95rem] font-semibold leading-[1.06] tracking-tight text-paper">
              {t().hero.headline}
            </h1>
            <p class="mt-4 max-w-[34ch] text-[0.95rem] leading-relaxed text-on-navy">{t().hero.sub}</p>

            {/* Prueba destacada. En móvil va DESPUÉS de las acciones (orden del
                brief); en desktop antes. Ligeramente más estrecha que el texto. */}
            <div class="glass relative order-2 mt-6 overflow-hidden rounded-2xl lg:order-1 lg:max-w-[540px]">
              <div class="relative aspect-[16/9]">
                <For each={p().conversion.projects}>
                  {(w, i) => (
                    // Monta cada imagen solo cuando el reel la necesita (activa o
                    // siguiente): la carga inicial trae 2 imágenes, no 4.
                    <Show when={i() <= Math.min(reelIdx() + 1, p().conversion.projects.length - 1) || reelIdx() > 0}>
                      <img
                        src={`/work/${w.key}-960.webp`}
                        srcset={`/work/${w.key}-640.webp 640w, /work/${w.key}-960.webp 960w`}
                        sizes="(min-width: 640px) 560px, 92vw"
                        alt={w.alt[lang()]}
                        width="960" height="600"
                        loading={i() === 0 ? "eager" : "lazy"}
                        fetchpriority={i() === 0 ? "high" : "auto"}
                        class="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700"
                        style={{ opacity: reelIdx() === i() ? 1 : 0 }}
                      />
                    </Show>
                  )}
                </For>
                {/* overlay editorial: nombre + una línea + View Project */}
                <div class="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(2,8,18,0.97)] via-[rgba(2,8,18,0.82)] to-transparent px-4 pb-3 pt-14">
                  <p class="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-paper">{p().conversion.projects[reelIdx()].domain}</p>
                  <p class="mt-0.5 text-[0.72rem] leading-snug text-on-navy">{p().conversion.projects[reelIdx()].fact[lang()]}</p>
                  <a href={p().conversion.projects[reelIdx()].url} target="_blank" rel="noopener noreferrer"
                    data-track="project_visit" data-project={p().conversion.projects[reelIdx()].key}
                    class="pointer-events-auto mt-1 inline-block text-[0.7rem] font-bold text-turquoise hover:underline">
                    {t().hero.viewProject} →
                  </a>
                </div>
              </div>
              {/* controles discretos */}
              <div class="flex items-center justify-between gap-3 border-t border-[rgba(247,249,252,0.1)] px-3.5 py-1.5">
                <span class="flex gap-1.5" aria-hidden="true">
                  <For each={p().conversion.projects}>
                    {(_, i) => <span class={`t-card h-1 w-4 rounded-full ${reelIdx() === i() ? "bg-turquoise" : "bg-[rgba(247,249,252,0.2)]"}`} />}
                  </For>
                </span>
                <span class="flex gap-1">
                  <button type="button" aria-label={t().work.prev}
                    onClick={() => setReelIdx((i) => (i - 1 + p().conversion.projects.length) % p().conversion.projects.length)}
                    class="t-card flex h-7 w-7 items-center justify-center rounded-full text-on-navy-faint hover:text-paper">
                    <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" aria-hidden="true"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                  <button type="button" aria-label={t().work.next}
                    onClick={() => setReelIdx((i) => (i + 1) % p().conversion.projects.length)}
                    class="t-card flex h-7 w-7 items-center justify-center rounded-full text-on-navy-faint hover:text-paper">
                    <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                </span>
              </div>
            </div>

            <p class="order-3 mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-on-navy-faint lg:order-2">
              <For each={t().hero.proof}>
                {(item, i) => (<>
                  <Show when={i() > 0}><span class="h-1 w-1 rounded-full bg-turquoise" aria-hidden="true" /></Show>
                  <span>{item}</span>
                </>)}
              </For>
            </p>

            {/* Acciones de tarjeta — SOLO móvil (en desktop convierte el panel
                derecho). START A PROJECT domina: es la conversión. Save Contact
                queda al lado con menos peso — es cortesía, no conversión. */}
            <div class="order-1 mt-6 flex flex-wrap items-center gap-2.5 lg:hidden">
              <button type="button" onClick={() => openSheet("project")}
                data-track="card_cta_primary" data-card={p().id}
                class="btn btn-primary w-full !py-3.5 text-[0.95rem] uppercase tracking-wide">
                {t().hero.ctaPrimary}
              </button>
              <a href={`/card/${p().id}/vcard`} rel="external" download="" data-track="save_contact" data-card={p().id}
                class="btn btn-outline flex-1 !py-3 text-center text-[0.9rem]">
                {t().hero.ctaSave}
              </a>
              <a href={waLink(t().waMessage)} target="_blank" rel="noopener noreferrer"
                data-track="whatsapp_click" data-card={p().id} class={quickLink}>
                <WhatsAppIcon class="h-3.5 w-3.5 text-green" /> {t().hero.quick.whatsapp}
              </a>
              <button type="button" onClick={() => setMoreOpen((v) => !v)} aria-expanded={moreOpen()}
                aria-controls="hero-more" class={quickLink}>
                {t().more}
              </button>
              <div id="hero-more" class="flex w-full items-center gap-2" style={{ display: moreOpen() ? "flex" : "none" }}>
                <a href={`tel:${co().phoneTel}`} data-track="call_click" data-card={p().id} class={quickLink}>
                  {t().hero.quick.call}
                </a>
                <button type="button" onClick={share} class={quickLink}>{t().hero.quick.share}</button>
                <span class="text-[0.7rem] font-semibold text-turquoise" role="status" aria-live="polite">
                  <Show when={copied()}>{t().shareCopied}</Show>
                </span>
              </div>
            </div>
          </section>

          {/* Conversion Panel en móvil: después del proyecto, antes del selector */}
          <div class="mt-9 lg:hidden" aria-hidden={!isNarrow()}>{conversionPanel()}</div>

          {/* 2 · PROJECT CONCIERGE (el precio y el alcance viven aquí, no en el hero) */}
          <section aria-labelledby="concierge-h" class="mt-10">
            <h2 id="concierge-h" class="font-editorial text-[1.4rem] font-semibold tracking-tight text-paper">
              {t().concierge.heading}
            </h2>
            <div class="mt-4 flex flex-wrap gap-2" role="tablist" aria-label={t().concierge.heading}>
              <For each={p().conversion.needs}>
                {(n) => (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={needId() === n.id}
                    aria-controls="concierge-panel"
                    onClick={() => { setNeedId(n.id); trackEvent("concierge_select", { need: n.id }); }}
                    class={`t-card min-h-[44px] rounded-full border px-3.5 py-2 text-[0.78rem] font-bold ${
                      needId() === n.id
                        ? "border-blue bg-[rgba(20,108,255,0.16)] text-paper"
                        : "border-[rgba(247,249,252,0.16)] text-on-navy hover:text-paper"
                    }`}
                  >
                    {n.label[lang()]}
                  </button>
                )}
              </For>
            </div>

            <div id="concierge-panel" role="tabpanel" class="glass mt-4 rounded-2xl p-5">
              <p class="text-[0.95rem] font-semibold leading-relaxed text-paper">{need().recommendation[lang()]}</p>
              <p class="mt-2.5 text-[0.85rem] leading-relaxed text-on-navy">{need().outcome[lang()]}</p>

              <Show when={needProject()}>
                {(w) => (
                  <a href={w().url} target="_blank" rel="noopener noreferrer"
                    data-track="project_visit" data-project={w().key}
                    class="t-card mt-4 flex items-center gap-3 rounded-xl border border-[rgba(247,249,252,0.12)] p-2.5 hover:border-[rgba(32,215,197,0.4)]">
                    <img src={`/work/${w().key}-4x3-480.webp`} alt="" width="480" height="360" loading="lazy"
                      class="h-14 w-[74px] flex-shrink-0 rounded-lg object-cover object-top" />
                    <span class="min-w-0">
                      <span class="block text-[0.62rem] font-bold uppercase tracking-[0.12em] text-turquoise">{t().concierge.proofLabel}</span>
                      <span class="block truncate text-[0.8rem] font-bold text-paper">{w().domain}</span>
                      <span class="block truncate text-[0.72rem] text-on-navy-faint">{w().fact[lang()]}</span>
                    </span>
                  </a>
                )}
              </Show>
              <Show when={need().proofNote}>
                <p class="mt-4 rounded-xl border border-[rgba(32,215,197,0.25)] px-3.5 py-2.5 text-[0.8rem] font-medium leading-relaxed text-turquoise">
                  {need().proofNote![lang()]}
                </p>
              </Show>

              <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
                <Show when={need().price} fallback={<span class="text-[0.75rem] font-semibold uppercase tracking-wide text-on-navy-faint">{serviceFor(need()).price[lang()]}</span>}>
                  <span class="font-editorial text-lg font-semibold text-paper">{need().price![lang()]}</span>
                </Show>
                <button type="button" onClick={() => openSheet("project", serviceFor(need()).formService)}
                  class="btn btn-primary !px-5 !py-2.5 text-sm">
                  {t().concierge.cta}
                </button>
              </div>
            </div>

            {/* precio y alcance: reubicados fuera del primer viewport */}
            <p class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-on-navy-faint">
              <For each={t().ribbon}>
                {(item, i) => (<>
                  <Show when={i() > 0}><span class="h-1 w-1 rounded-full bg-blue" aria-hidden="true" /></Show>
                  <span>{item}</span>
                </>)}
              </For>
            </p>
          </section>

          {/* 4 · SELECTED WORK (protagonista) */}
          <section aria-labelledby="work-h" class="mt-10">
            <div class="flex items-end justify-between gap-4">
              <div>
                <h2 id="work-h" class="font-editorial text-[1.4rem] font-semibold tracking-tight text-paper">{t().work.heading}</h2>
                <p class="mt-1 text-[0.8rem] text-on-navy-faint">{t().work.sub}</p>
              </div>
              <div class="flex gap-2">
                <button type="button" onClick={() => scrollWork(-1)} aria-label={t().work.prev}
                  class="t-card flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(247,249,252,0.18)] text-on-navy hover:text-paper">
                  <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" aria-hidden="true"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                <button type="button" onClick={() => scrollWork(1)} aria-label={t().work.next}
                  class="t-card flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(247,249,252,0.18)] text-on-navy hover:text-paper">
                  <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              </div>
            </div>

            <ul ref={workUl} class="scrollbar-none -mx-5 mt-4 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-5 pb-1 lg:mx-0 lg:px-0" role="list">
              <For each={p().conversion.projects}>
                {(w) => (
                  <li data-project={w.key} class="w-[252px] flex-shrink-0 snap-start">
                    <a href={w.url} target="_blank" rel="noopener noreferrer"
                      data-track="project_visit" data-project={w.key}
                      class="glass-line t-card group block overflow-hidden rounded-2xl bg-[rgba(10,22,40,0.6)] hover:border-[rgba(32,215,197,0.35)]">
                      <img
                        src={`/work/${w.key}-4x3-800.webp`}
                        srcset={`/work/${w.key}-4x3-480.webp 480w, /work/${w.key}-4x3-800.webp 800w`}
                        sizes="252px"
                        alt={w.alt[lang()]}
                        width="800" height="600" loading="lazy"
                        class="aspect-[4/3] w-full object-cover object-top"
                      />
                      <span class="block p-3.5">
                        <span class="block text-[0.66rem] font-bold uppercase tracking-[0.12em] text-turquoise">{w.industry[lang()]}</span>
                        <span class="mt-1 block text-[0.85rem] font-bold text-paper">{w.fact[lang()]}</span>
                        <span class="mt-2 block text-[0.72rem] font-semibold text-on-navy-faint group-hover:text-turquoise">{w.domain} →</span>
                      </span>
                    </a>
                  </li>
                )}
              </For>
            </ul>
            <p class="mt-2.5 text-[0.72rem] italic text-on-navy-faint">{t().work.note}</p>
          </section>

          {/* 5 · TRUST: reseñas reales de Google (solo si hay Place ID + URL) */}
          <GoogleReviews profile={p()} lang={lang()} />

          {/* 6 · DÓNDE TRABAJAMOS: física / zona / híbrida / multi-sucursal */}
          <WhereWeWork profile={p()} lang={lang()} onCheckArea={() => openSheet("project")} />

          {/* 7 · EXCHANGE (premium, mismo sheet) */}
          <section class="mt-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[rgba(247,249,252,0.1)] px-5 py-4">
            <p class="text-[0.8rem] leading-relaxed text-on-navy">{t().exchange.explain}</p>
            <button type="button" onClick={() => openSheet("exchange")} class="btn btn-outline !px-4 !py-2.5 text-sm">
              {t().exchange.cta}
            </button>
          </section>

          {/* 6 · SHARE THIS CARD — el ÚNICO QR de toda la página, al final */}
          <section aria-labelledby="share-h" class="mt-6 rounded-2xl border border-[rgba(247,249,252,0.1)] px-5 py-6">
            <h2 id="share-h" class="text-[0.9rem] font-bold text-paper">{t().share.heading}</h2>

            <div class="mt-5 flex flex-col items-center">
              {/* módulo del QR ≥ 180px visuales (contenedor 208 − 24 de quiet zone) */}
              <div ref={qrRef} class="w-[208px] rounded-xl bg-white p-3">
                <img src={`/card/qr-${p().id}.svg`} alt={t().share.qrText}
                  width="184" height="184" loading="lazy" class="h-auto w-full" />
              </div>
              <p class="mt-3 text-[0.8rem] font-semibold text-on-navy">{t().share.qrText}</p>
            </div>

            <div class="mt-5 grid grid-cols-2 gap-2.5">
              <button type="button" onClick={copyLink} class="btn btn-outline !px-4 !py-2.5 text-sm">{t().share.copy}</button>
              <button type="button" onClick={share} class="btn btn-outline !px-4 !py-2.5 text-sm">{t().share.native}</button>
            </div>
            <p class="mt-3 text-center text-[0.7rem] font-semibold text-turquoise" role="status" aria-live="polite">
              <Show when={copied()}>{t().shareCopied}</Show>
            </p>

            <ul class="mt-6 divide-y divide-[rgba(247,249,252,0.08)] border-t border-[rgba(247,249,252,0.08)] pt-1">
              <For each={t().share.links}>
                {(l) => (
                  <li>
                    <A href={l.href} class="t-card flex min-h-[44px] items-center justify-between py-2 text-[0.85rem] font-medium text-on-navy hover:text-paper">
                      {l.label} <span aria-hidden="true">→</span>
                    </A>
                  </li>
                )}
              </For>
            </ul>
          </section>

          {/* pie */}
          <footer class="mt-8 border-t border-[rgba(247,249,252,0.1)] pt-5">
            <p class="text-[0.8rem] font-bold text-paper">{co().name}</p>
            <p class="mt-1 text-[0.72rem] text-on-navy-faint">{co().location[lang()]}</p>
            <p class="mt-2.5 text-[0.72rem] italic text-on-navy-faint">{t().footerNote}</p>
          </footer>
        </div>

        {/* ============ columna derecha desktop: CONVERSION PANEL ============
             Vende (beneficio → acción → confianza → precio). Sin QR, sin logo,
             sin capturas, sin acciones duplicadas. */}
        <aside class="hidden self-start lg:block" aria-label={t().convertPanel.eyebrow}>
          <div class="mt-16" aria-hidden={isNarrow()}>{conversionPanel()}</div>
        </aside>
      </div>

      {/* 8 · BARRA DE ACCIÓN MÓVIL (sticky, safe-area, oculta con sheet abierto) */}
      <Show when={barVisible() && sheetMode() === null}>
        <nav aria-label="Quick actions"
          class="glass safe-bottom fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-[rgba(247,249,252,0.12)] px-4 pt-2.5 lg:hidden">
          <button type="button" onClick={() => openSheet("project")} class="btn btn-primary min-h-[46px] flex-[2] !py-2.5 text-sm">
            {t().barStart}
          </button>
          <a href={waLink(t().waMessage)} target="_blank" rel="noopener noreferrer" data-track="whatsapp_click" data-card={p().id}
            aria-label={t().hero.quick.whatsapp}
            class="t-card flex h-[46px] w-[52px] items-center justify-center rounded-lg border border-[rgba(37,184,105,0.5)] text-green">
            <WhatsAppIcon class="h-5 w-5" />
          </a>
          <a href={`/card/${p().id}/vcard`} rel="external" download="" data-track="save_contact" data-card={p().id}
            class="t-card flex h-[46px] items-center justify-center rounded-lg border border-[rgba(247,249,252,0.22)] px-3.5 text-[0.78rem] font-bold text-paper">
            {t().barSave}
          </a>
        </nav>
      </Show>

      <LeadSheet
        profile={p()}
        lang={lang()}
        mode={sheetMode()}
        preselect={sheetPreselect()}
        success={sheetSuccess()}
        onClose={() => { setSheetMode(null); setSheetSuccess(false); }}
      />
    </div>
  );
}
