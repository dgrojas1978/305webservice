import { A, useSearchParams, useSubmission } from "@solidjs/router";
import { For, Show, createSignal, onCleanup, onMount } from "solid-js";
import { WhatsAppIcon } from "~/components/ui/Button";
import AnalyticsListener from "~/components/AnalyticsListener";
import LeadSheet, { submitCardLead, type SheetMode } from "~/components/card/LeadSheet";
import PaymentSheet from "~/components/card/PaymentSheet";
import { paymentsRenderable } from "~/lib/cardPayments";
import { GoogleReviews } from "~/components/card/CardModules";
import { trackEvent } from "~/lib/analytics";
import { waLink } from "~/lib/site";
import {
  CARD_COPY,
  cardHref,
  type CardLocale,
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
  const [sheetMode, setSheetMode] = createSignal<SheetMode>(null);
  const [sheetPreselect, setSheetPreselect] = createSignal<string | undefined>(undefined);
  const [sheetSuccess, setSheetSuccess] = createSignal(false);
  const [barVisible, setBarVisible] = createSignal(false);
  const [payOpen, setPayOpen] = createSignal(false);

  const t = () => CARD_COPY[lang()];
  const co = () => p().company;
  // Tres caminos, uno por grupo de capacidad de la identidad:
  // experiencias digitales / sistemas a medida / soluciones conectadas.
  const CARD_NEEDS = ["win-customers", "custom-software", "nfc-experience"];
  const needs = () => p().conversion.needs.filter((n) => CARD_NEEDS.includes(n.id));

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

    onCleanup(() => { heroObs?.disconnect(); workObs?.disconnect(); qrObs?.disconnect(); });
  });

  const scrollWork = (dir: 1 | -1) => {
    workUl?.scrollBy({ left: dir * workUl.clientWidth * 0.85, behavior: "smooth" });
  };


  
  return (
    <div class="relative min-h-screen bg-[#050d1a] text-paper" data-surface="navy">
      <AnalyticsListener />
      {/* Profundidad: iluminación radial a página completa, sin formas reconocibles. */}
      <div class="ambient pointer-events-none fixed inset-x-0 top-0 h-[70vh]" aria-hidden="true" />

      <div class="relative z-10">
        {/* ============ columna principal ============ */}
        <div class="relative mx-auto w-full max-w-md px-5 pb-28 sm:max-w-lg lg:pb-20">

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

            <h1 class="mt-5 text-[2.05rem] font-extrabold leading-[1.04] tracking-[-0.02em] text-paper">
              {t().hero.headline}
            </h1>
            <p class="mt-4 max-w-[34ch] text-[0.95rem] leading-relaxed text-on-navy">{t().hero.sub}</p>

            {/* Prueba: los CUATRO proyectos a la vez.
                Antes rotaban de uno en uno y habia que esperar —o tocar flechas—
                para ver el trabajo. En una tarjeta que se mira dos segundos, la
                rejilla enseña el rango completo sin pedir nada. */}
            <div class="order-2 mt-6">
              <ul class="grid grid-cols-2 gap-2.5">
                <For each={p().conversion.projects}>
                  {(w) => (
                    <li>
                      <a href={w.url} target="_blank" rel="noopener noreferrer"
                        data-track="project_visit" data-project={w.key}
                        class="group block overflow-hidden rounded-xl border border-[rgba(247,249,252,0.12)] transition-colors hover:border-[rgba(63,216,198,0.5)]">
                        <img src={w.img} alt={`${w.domain} — ${w.fact[lang()]}`}
                          width="800" height="500" loading="lazy" decoding="async"
                          class="block aspect-[8/5] w-full object-cover" />
                        <span class="block px-2.5 py-2">
                          <span class="block truncate text-[0.7rem] font-bold uppercase tracking-[0.1em] text-paper">
                            {w.domain}
                          </span>
                          <span class="mt-0.5 block text-[0.7rem] leading-snug text-on-navy-faint">
                            {w.fact[lang()]}
                          </span>
                        </span>
                      </a>
                    </li>
                  )}
                </For>
              </ul>
            </div>

            <p class="order-3 mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-on-navy-faint">
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
            {/* Las CINCO acciones visibles de golpe, sin nada colapsado: el
                visitante no deberia tener que descubrir como llamarte. */}
            <div class="order-1 mt-6">
              <button type="button" onClick={() => openSheet("project")}
                data-track="card_cta_primary" data-card={p().id}
                class="btn btn-primary w-full !py-3.5 text-[0.95rem] uppercase tracking-wide">
                {t().hero.ctaPrimary}
              </button>
              <div class="mt-2.5 grid grid-cols-2 gap-2.5">
                <a href={`/card/${p().id}/vcard`} rel="external" download=""
                  data-track="save_contact" data-card={p().id}
                  class="btn btn-outline !py-3 text-center text-[0.85rem]">
                  {t().hero.ctaSave}
                </a>
                <a href={waLink(t().waMessage)} target="_blank" rel="noopener noreferrer"
                  data-track="whatsapp_click" data-card={p().id}
                  class="btn btn-outline !py-3 text-center text-[0.85rem]">
                  {t().hero.quick.whatsapp}
                </a>
                <a href={`tel:${co().phoneTel}`} data-track="call_click" data-card={p().id}
                  class="btn btn-outline !py-3 text-center text-[0.85rem]">
                  {t().hero.quick.call}
                </a>
                <button type="button" onClick={share}
                  class="btn btn-outline !py-3 text-center text-[0.85rem]">
                  {t().hero.quick.share}
                </button>
                {/* Pagar entra en el grupo de acciones que YA existe, no crea uno
                    nuevo: la invariante es un solo grupo por viewport. Y no
                    aparece si el negocio no tiene datos de cobro reales. */}
                <Show when={paymentsRenderable(p().payments)}>
                  <button type="button" onClick={() => setPayOpen(true)}
                    class="btn btn-outline !py-3 text-center text-[0.85rem]">
                    {t().payments.open}
                  </button>
                </Show>
              </div>
              <p class="mt-2 text-center text-[0.7rem] font-semibold text-turquoise"
                role="status" aria-live="polite">
                <Show when={copied()}>{t().shareCopied}</Show>
              </p>
            </div>
          </section>

          {/* Conversion Panel en móvil: después del proyecto, antes del selector */}
          {/* El panel de conversion se queda SOLO en escritorio. En movil el
              dock del hero ya lleva el CTA primario y el concierge lleva el suyo
              con la necesidad elegida: eran tres CTA iguales en dos pantallas. */}

          {/* 2 · LO QUE CONSTRUIMOS — lista simple.
              Antes era un selector de pestañas con panel de recomendación: para
              elegir habia que tocar, leer y volver a tocar. En una tarjeta que
              se abre de pie y con una mano, la lista se lee de un vistazo. */}
          <section aria-labelledby="build-h" class="mt-10">
            <h2 id="build-h" class="text-[1.32rem] font-extrabold tracking-[-0.015em] text-paper">
              {t().concierge.heading}
            </h2>
            <ul class="mt-5 divide-y divide-[rgba(247,249,252,0.1)] border-y border-[rgba(247,249,252,0.1)]">
              <For each={needs()}>
                {(n) => (
                  <li class="flex gap-3.5 py-4">
                    <span class="mt-2 h-px w-5 flex-none bg-turquoise" aria-hidden="true" />
                    <div class="min-w-0">
                      <p class="text-[0.95rem] font-bold leading-snug text-paper">
                        {n.label[lang()]}
                      </p>
                      <p class="mt-1 text-[0.82rem] leading-relaxed text-on-navy">
                        {n.outcome[lang()]}
                      </p>
                    </div>
                  </li>
                )}
              </For>
            </ul>
          </section>

          {/* SELECTED WORK retirado: el reel del hero ya muestra los mismos
              cuatro proyectos. Repetirlos abajo era una pantalla de duplicado,
              no de prueba adicional. */}

          {/* 5 · TRUST: reseñas reales de Google (solo si hay Place ID + URL) */}
          <GoogleReviews profile={p()} lang={lang()} />

          {/* 6 · SHARE THIS CARD — el ÚNICO QR de toda la página, al final */}
          <section aria-labelledby="share-h" class="mt-8 rounded-2xl border border-[rgba(247,249,252,0.1)] px-5 py-7">
            <h2 id="share-h" class="text-[0.9rem] font-bold text-paper">{t().share.heading}</h2>

            <div class="mt-6 flex flex-col items-center">
              {/* módulo del QR ≥ 180px visuales (contenedor 208 − 24 de quiet zone) */}
              <div ref={qrRef} class="w-[208px] rounded-xl bg-white p-3">
                <img src={`/card/qr-${p().id}.svg`} alt={t().share.qrText}
                  width="184" height="184" loading="lazy" class="h-auto w-full" />
              </div>
              <p class="mt-3 text-[0.8rem] font-semibold text-on-navy">{t().share.qrText}</p>
            </div>

            {/* Los dos botones al mismo ancho y con el mismo peso: antes uno
                iba suelto a la izquierda y el otro a ancho completo, y el
                bloque se leia desalineado. */}
            <div class="mt-6 grid gap-2.5">
              <button type="button" onClick={copyLink}
                class="btn btn-outline w-full !px-4 !py-3 text-sm">
                {t().share.copy}
              </button>
              {/* Pedir el contacto del visitante pertenece a este momento, no a
                  una seccion aparte. */}
              <button type="button" onClick={() => openSheet("exchange")}
                class="btn btn-outline w-full !px-4 !py-3 text-sm">
                {t().exchange.cta}
              </button>
            </div>
            <p class="mt-2.5 min-h-[1rem] text-center text-[0.7rem] font-semibold text-turquoise"
              role="status" aria-live="polite">
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

      <PaymentSheet
        profile={p()}
        locale={lang()}
        open={payOpen()}
        onClose={() => setPayOpen(false)}
      />
    </div>
  );
}
