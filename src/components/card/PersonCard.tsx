import { For, Show, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { isServer } from "solid-js/web";
import AnalyticsListener from "~/components/AnalyticsListener";
import MagicBox, { type MagicBoxItem } from "~/components/card/MagicBox";
import { trackEvent } from "~/lib/analytics";
import { type CardLocale, type CardProfile } from "~/data/card";

/**
 * Tarjeta PERSONAL — Mabel Toledo es el primer perfil.
 *
 * Dos caras, igual que el objeto físico: la persona arriba y su negocio
 * (EL CLOSET) como acción dominante. El acento es el dorado REAL de la tienda:
 * con `#D4AF37` un solo tono pasa AA como texto sobre carbón (8.69:1) Y como
 * relleno con texto carbón encima, así que no hace falta rampa de dos tonos.
 *
 * Sin teléfono ni correo: no hay canal directo confirmado, y aquí no se
 * inventa ninguno. «Message» abre su LinkedIn público.
 */

const LANG_KEY = "305_card_lang";

export default function PersonCard(props: { profile: CardProfile }) {
  const p = () => props.profile;
  const c = () => p().personCard!;
  const [lang, setLang] = createSignal<CardLocale>("en");
  const [copied, setCopied] = createSignal(false);
  const [mbIndex, setMbIndex] = createSignal<number | null>(null);
  const [mbReturn, setMbReturn] = createSignal<HTMLElement | null>(null);

  /** Galería del MagicBox: las prendas reales de la tienda. */
  const gallery = createMemo<MagicBoxItem[]>(() =>
    c().shop.looks.map((l, i) => ({
      id: `look-${i}`,
      src: l.src,
      width: 480,
      height: 640,
      alt: l.alt,
      title: c().shop.kind,
    })),
  );

  const switchLang = (l: CardLocale) => {
    if (l === lang()) return;
    setLang(l);
    try { localStorage.setItem(LANG_KEY, l); } catch { /* opcional */ }
    document.documentElement.lang = l === "es" ? "es-US" : "en-US";
    trackEvent("card_language_change", { lang: l });
  };

  const openMagic = (index: number, ev?: MouseEvent) => {
    setMbReturn((ev?.currentTarget as HTMLElement) ?? null);
    setMbIndex(index);
    trackEvent("card_work_open", { card: p().id, index });
  };

  onMount(() => {
    try { if (localStorage.getItem(LANG_KEY) === "es") switchLang("es"); } catch { /* opcional */ }
    const search = new URLSearchParams(window.location.search);
    trackEvent("card_view", { card: p().id, src: search.get("utm_source") || "direct" });
  });
  onCleanup(() => {
    if (isServer) return;
    document.body.style.overflow = "";
  });

  const T = {
    en: { save: "Save Contact", message: "Message", share: "Share", copied: "Link copied", visit: "See the collection on Instagram" },
    es: { save: "Guardar contacto", message: "Mensaje", share: "Compartir", copied: "Enlace copiado", visit: "Ver la colección en Instagram" },
  } as const;
  const t = () => T[lang()];

  const copyLink = async () => {
    trackEvent("card_copy_link", { card: p().id });
    try {
      await navigator.clipboard.writeText(c().shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch { /* portapapeles no disponible */ }
  };
  const shareCard = async () => {
    trackEvent("card_native_share", { card: p().id });
    try {
      if (navigator.share) { await navigator.share({ title: p().person!.name, url: c().shareUrl }); return; }
    } catch { /* usuario canceló */ }
    copyLink();
  };
  const goShop = () => {
    trackEvent("card_primary_cta_click", { card: p().id, dest: "shop" });
    window.open(c().primaryHref, "_blank", "noopener");
  };
  const goTalk = () => {
    trackEvent("card_secondary_cta_click", { card: p().id, dest: "linkedin" });
    window.open(c().secondaryHref, "_blank", "noopener");
  };

  return (
    <div class="mtc" style={{ "--accent": c().accent, "--accent-deep": c().accentDeep }}>
      <AnalyticsListener />
      <style>{`
.mtc{
  --bg:#16141A; --panel:#1D1B22; --ink:#F4F1EE; --dim:#A49DA8;
  --hair:rgba(244,241,238,.14);
  background:var(--bg); color:var(--ink); min-height:100svh;
  font-family:Inter,system-ui,sans-serif; font-size:16px; line-height:1.6;
  -webkit-font-smoothing:antialiased; color-scheme:dark;
}
.mtc *{box-sizing:border-box}
.mtc [hidden]{display:none!important}
.mtc-serif{font-family:"Instrument Serif",Georgia,serif;font-weight:400}
@media (prefers-reduced-motion:reduce){.mtc *{animation:none!important;transition:none!important}}
@keyframes mtc-rise{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
.mtc-rise{animation:mtc-rise .3s ease-out both}

.mtc-shell{max-width:430px;margin:0 auto;padding:16px 22px 48px;position:relative}
@media (min-width:820px){
  .mtc{display:grid;place-items:center;padding:44px 0}
  .mtc-shell{background:var(--panel);border:1px solid var(--hair);border-radius:18px;padding:20px 30px 40px}
}

.mtc-top{display:flex;align-items:center;justify-content:space-between}
.mtc-word{font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase}
.mtc-lang{display:flex;gap:2px}
.mtc-lang button{min-height:44px;padding:0 9px;border:0;background:transparent;color:var(--dim);
  font:inherit;font-size:10.5px;font-weight:500;cursor:pointer;border-radius:8px}
.mtc-lang button[aria-pressed="true"]{color:var(--ink);background:rgba(244,241,238,.1)}
.mtc-lang button:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}

.mtc-hero{display:flex;align-items:flex-end;gap:18px;margin-top:26px}
.mtc-hero img{display:block;width:160px;height:200px;object-fit:cover;object-position:50% 34%;
  border-radius:12px;flex:0 0 auto}
.mtc-meta{padding-bottom:4px;min-width:0}
.mtc-desc{margin:0;font-size:10.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;
  color:var(--accent);line-height:1.5}
.mtc-place{margin:7px 0 0;font-size:12.5px;color:var(--dim)}

.mtc h1{font-family:"Instrument Serif",Georgia,serif;font-weight:400;
  font-size:clamp(44px,13vw,52px);line-height:1;letter-spacing:-.005em;margin:26px 0 0}
.mtc-support{margin:16px 0 0;font-size:14px;line-height:1.6;color:var(--dim);max-width:36ch}

.mtc-cta{display:flex;align-items:center;justify-content:center;width:100%;min-height:54px;
  margin-top:26px;background:var(--accent);color:var(--bg);border:0;border-radius:10px;cursor:pointer;
  text-decoration:none;font:inherit;font-size:12.5px;font-weight:600;letter-spacing:.06em;
  text-transform:uppercase;text-align:center;padding:8px 18px}
.mtc-cta:hover{background:var(--accent-deep)}
.mtc-cta:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
.mtc-cta.ghost{background:transparent;color:var(--ink);border:1px solid var(--hair)}
.mtc-cta.ghost:hover{background:transparent;border-color:var(--accent)}

.mtc-utils{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:9px}
.mtc-utils button,.mtc-utils a{display:flex;align-items:center;justify-content:center;min-height:44px;
  padding:4px 8px;background:transparent;border:1px solid var(--hair);border-radius:10px;
  color:var(--dim);cursor:pointer;text-decoration:none;font:inherit;font-size:11.5px;
  font-weight:500;text-align:center}
.mtc-utils button:hover,.mtc-utils a:hover{border-color:var(--accent);color:var(--ink)}
.mtc-utils button:focus-visible,.mtc-utils a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.mtc-status{margin:8px 0 0;min-height:17px;font-size:12px;color:var(--accent);text-align:center}

.mtc-shop{margin-top:40px;padding:24px 20px 22px;border:1px solid rgba(212,175,55,.3);border-radius:14px;
  background:linear-gradient(180deg,rgba(212,175,55,.07),rgba(212,175,55,.02));text-align:center}
.mtc-eyebrow{margin:0;font-size:10.5px;font-weight:600;letter-spacing:.16em;
  text-transform:uppercase;color:var(--accent)}
.mtc-mark{display:block;width:132px;height:132px;margin:14px auto 0;object-fit:contain}
.mtc-lockup{margin:16px 0 0}
.mtc-lockup .n{font-family:"Instrument Serif",Georgia,serif;font-size:34px;line-height:1;
  letter-spacing:.1em;color:var(--accent);display:block}
.mtc-lockup .s{display:block;margin-top:7px;font-size:11px;letter-spacing:.44em;color:var(--ink)}
.mtc-kind{margin:14px 0 0;font-size:10.5px;font-weight:600;letter-spacing:.18em;
  text-transform:uppercase;color:var(--dim)}
.mtc-line{margin:10px auto 0;font-size:14px;line-height:1.6;color:var(--ink);max-width:32ch}
.mtc-handle{display:inline-flex;align-items:center;min-height:44px;margin-top:6px;padding:0 10px;
  font-size:12.5px;color:var(--dim);text-decoration:none}
.mtc-handle:hover{color:var(--accent)}

.mtc-looks{margin-top:22px}
.mtc-looks h3{margin:0 0 12px;font-size:10.5px;font-weight:600;letter-spacing:.16em;
  text-transform:uppercase;color:var(--dim)}
.mtc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}
.mtc-look{padding:0;border:1px solid var(--hair);border-radius:10px;overflow:hidden;background:none;
  cursor:pointer;aspect-ratio:3/4;min-height:0}
.mtc-look img{width:100%;height:100%;object-fit:cover;display:block}
.mtc-look:hover{border-color:var(--accent)}
.mtc-look:focus-visible{outline:2px solid var(--accent);outline-offset:2px}

.mtc-sec{margin-top:44px;padding-top:22px;border-top:1px solid var(--hair)}
.mtc-prod{margin:18px 0 0}
.mtc-prod h3{font-family:"Instrument Serif",Georgia,serif;font-weight:400;
  font-size:clamp(24px,6.6vw,29px);line-height:1.1;margin:0}
.mtc-prod .pmeta{margin:5px 0 0;font-size:12px;color:var(--dim)}
.mtc-prod .role{margin:4px 0 0;font-size:13px;font-weight:500;color:var(--ink)}

.mtc-pillars{margin:30px 0 0;padding:16px 0;border-top:1px solid var(--hair);border-bottom:1px solid var(--hair);
  font-size:11.5px;font-weight:600;letter-spacing:.13em;text-transform:uppercase;text-align:center}
.mtc-note{margin:16px 0 0;font-size:15px;line-height:1.7;color:var(--dim)}
.mtc-final{margin-top:34px}
.mtc-foot{margin:8px 0 0;display:flex;align-items:center;justify-content:center;gap:6px;
  font-size:12px;color:var(--dim)}
.mtc-foot a{display:inline-flex;align-items:center;min-height:44px;padding:0 8px;color:var(--ink);
  text-decoration:underline;text-underline-offset:3px}
.mtc-foot a:hover{color:var(--accent)}
      `}</style>

      <main class="mtc-shell">
        <div class="mtc-top mtc-rise">
          <span class="mtc-word">{p().person!.name}</span>
          <span class="mtc-lang">
            <button type="button" aria-pressed={lang() === "en"} onClick={() => switchLang("en")}>EN</button>
            <button type="button" aria-pressed={lang() === "es"} onClick={() => switchLang("es")}>ES</button>
          </span>
        </div>

        <div class="mtc-hero mtc-rise" style={{ "animation-delay": ".05s" }}>
          <img src={c().portrait.src} alt={c().portrait.alt[lang()]} width={160} height={200} />
          <div class="mtc-meta">
            <p class="mtc-desc">{p().person!.role[lang()]}</p>
            <p class="mtc-place">{p().company.location[lang()]}</p>
          </div>
        </div>

        <h1 class="mtc-rise" style={{ "animation-delay": ".1s" }}>
          {c().hookA[lang()]}<br />{c().hookB[lang()]}
        </h1>
        <p class="mtc-support mtc-rise" style={{ "animation-delay": ".14s" }}>{c().support[lang()]}</p>

        <button class="mtc-cta mtc-rise" type="button" onClick={goShop} style={{ "animation-delay": ".18s" }}>
          {c().primaryLabel[lang()]}
        </button>
        <div class="mtc-utils mtc-rise" style={{ "animation-delay": ".2s" }}>
          <a href={`/card/${p().id}/vcard`}>{t().save}</a>
          <a href={c().secondaryHref} target="_blank" rel="noopener noreferrer">{t().message}</a>
          <button type="button" onClick={shareCard}>{t().share}</button>
        </div>
        <p class="mtc-status" role="status" aria-live="polite">{copied() ? t().copied : ""}</p>

        <section class="mtc-shop">
          <p class="mtc-eyebrow">{c().shop.eyebrow[lang()]}</p>
          <Show
            when={c().shop.markUrl}
            fallback={
              <p class="mtc-lockup">
                <span class="n">{c().shop.name}</span>
                <span class="s">{c().shop.sub}</span>
              </p>
            }
          >
            <img class="mtc-mark" src={c().shop.markUrl} alt={c().shop.markAlt?.[lang()] ?? c().shop.name} width={132} height={132} />
          </Show>
          <p class="mtc-kind">{c().shop.kind[lang()]}</p>
          <p class="mtc-line">{c().shop.line[lang()]}</p>
          <a class="mtc-handle" href={c().shop.href} target="_blank" rel="noopener noreferrer"
             aria-label={`${t().visit} — ${c().shop.handle}`}>{c().shop.handle}</a>

          <Show when={c().shop.looks.length > 0}>
            <div class="mtc-looks">
              <h3>{c().shop.looksTitle[lang()]}</h3>
              <div class="mtc-grid">
                <For each={c().shop.looks}>
                  {(l, i) => (
                    <button type="button" class="mtc-look" aria-label={l.alt[lang()]}
                            onClick={(e) => openMagic(i(), e)}>
                      <img src={l.src} alt={l.alt[lang()]} loading="lazy" width={480} height={640} />
                    </button>
                  )}
                </For>
              </div>
            </div>
          </Show>
        </section>

        <section class="mtc-sec">
          <p class="mtc-eyebrow">{c().productionsEyebrow[lang()]}</p>
          <For each={c().productions}>
            {(prod) => (
              <article class="mtc-prod">
                <h3>{prod.title}</h3>
                <p class="pmeta">{prod.meta[lang()]}</p>
                <p class="role">{prod.role[lang()]}</p>
              </article>
            )}
          </For>
        </section>

        <p class="mtc-pillars">{c().pillars[lang()]}</p>

        <section style={{ "margin-top": "28px" }}>
          <p class="mtc-eyebrow">{c().noteEyebrow[lang()]}</p>
          <p class="mtc-note">{c().note[lang()]}</p>
        </section>

        <div class="mtc-final">
          <button class="mtc-cta ghost" type="button" onClick={goTalk}>{c().secondaryLabel[lang()]}</button>
          <p class="mtc-foot">
            <a href={c().secondaryHref} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <span>·</span>
            <span>{p().company.location[lang()]}</span>
          </p>
        </div>
      </main>

      <MagicBox
        items={gallery()}
        activeIndex={mbIndex()}
        lang={lang()}
        onClose={() => setMbIndex(null)}
        onChange={(i) => setMbIndex(i)}
        returnFocus={mbReturn()}
      />
    </div>
  );
}
