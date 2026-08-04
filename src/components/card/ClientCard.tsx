import { For, Show, createSignal, onMount } from "solid-js";
import AnalyticsListener from "~/components/AnalyticsListener";
import { trackEvent } from "~/lib/analytics";
import { type CardLocale, type CardProfile } from "~/data/card";

/**
 * Tarjeta de CLIENTE con marca propia — CN Brandings es el primer tenant.
 *
 * Personalidad: producción de ropa, no lujo silencioso. Rojo de marca fuerte
 * sobre crema cálido, titulares en negrita apretada, producto real en el primer
 * viewport. La prueba visual (bordado en bastidor, estampados, uniformes) manda
 * sobre el texto.
 *
 * Defensas contra el bug del escritorio desvanecido, deliberadas:
 *  - NINGÚN contenedor usa opacity para jerarquía (la jerarquía es color/peso).
 *  - Fondos sólidos explícitos en todos los niveles; nada hereda transparente.
 *  - `color-scheme: light` fijado: un visor en tema oscuro no invierte nada.
 *  - Sin blend modes, sin backdrop-filter, sin pseudo-elementos blancos.
 *
 * Reglas del sistema: una acción domina, un solo QR (plegado, al final), y nada
 * inventado — si el cliente no publica un canal o no hay foto real, no se pinta.
 */

const LANG_KEY = "305_card_lang";

export default function ClientCard(props: { profile: CardProfile }) {
  const p = () => props.profile;
  const c = () => p().client!;
  const [lang, setLang] = createSignal<CardLocale>("en");
  const [copied, setCopied] = createSignal(false);
  const [qrOpen, setQrOpen] = createSignal(false);

  const switchLang = (l: CardLocale) => {
    if (l === lang()) return;
    setLang(l);
    try { localStorage.setItem(LANG_KEY, l); } catch { /* opcional */ }
    document.documentElement.lang = l === "es" ? "es-US" : "en-US";
    trackEvent("language_change", { lang: l });
  };

  onMount(() => {
    try { if (localStorage.getItem(LANG_KEY) === "es") switchLang("es"); } catch { /* opcional */ }
    const src = new URLSearchParams(window.location.search).get("utm_source") || "direct";
    trackEvent("card_view", { card: p().id, src });
  });

  const copyLink = async () => {
    trackEvent("copy_link", { card: p().id });
    try {
      await navigator.clipboard.writeText(c().shareUrl);
      setCopied(true); setTimeout(() => setCopied(false), 2200);
    } catch { /* clipboard no disponible */ }
  };

  const shareCard = async () => {
    trackEvent("share_click", { card: p().id });
    try {
      if (navigator.share) { await navigator.share({ title: p().company.name, url: c().shareUrl }); return; }
    } catch { /* usuario canceló */ }
    copyLink();
  };

  const toggleQr = () => {
    const next = !qrOpen();
    setQrOpen(next);
    if (next) trackEvent("qr_view", { card: p().id });
  };

  const T = {
    en: {
      workEyebrow: "Recent work", workHeadA: "Made to represent", workHeadB: "your brand properly.",
      workSub: "A closer look at apparel, decoration and branded products produced for real organizations and teams.",
      capsEyebrow: "Capabilities",
      howEyebrow: "How to get started",
      catEyebrow: "Build your order",
      catSub: "Explore apparel and products ready to be customized around your brand.",
      credHeadA: "Built with care.", credHeadB: "Finished with precision.",
      contactHeadA: "Ready to create", contactHeadB: "your next order?",
      contactSub: "Tell us what you need, how many pieces you are considering and when you need them.",
      save: "Save contact", instagram: "Instagram",
      shareHead: "Share this card", shareSub: "Let someone else open CN Brandings instantly.",
      showQr: "Show QR", hideQr: "Hide QR", copy: "Copy link", copied: "Link copied", share: "Share",
      qrAlt: "QR code that opens the CN Brandings card", scan: "Scan to open this card",
    },
    es: {
      workEyebrow: "Trabajo reciente", workHeadA: "Hecho para representar", workHeadB: "bien tu marca.",
      workSub: "Una mirada de cerca a la ropa, la decoración y los productos de marca producidos para organizaciones y equipos reales.",
      capsEyebrow: "Capacidades",
      howEyebrow: "Cómo empezar",
      catEyebrow: "Arma tu pedido",
      catSub: "Explora prendas y productos listos para personalizarse con tu marca.",
      credHeadA: "Hecho con cuidado.", credHeadB: "Terminado con precisión.",
      contactHeadA: "¿Listo para crear", contactHeadB: "tu próximo pedido?",
      contactSub: "Cuéntanos qué necesitas, cuántas piezas estás considerando y para cuándo las necesitas.",
      save: "Guardar contacto", instagram: "Instagram",
      shareHead: "Compartir esta tarjeta", shareSub: "Permite que otra persona abra CN Brandings al instante.",
      showQr: "Mostrar QR", hideQr: "Ocultar QR", copy: "Copiar enlace", copied: "Enlace copiado", share: "Compartir",
      qrAlt: "Código QR que abre la tarjeta de CN Brandings", scan: "Escanea para abrir esta tarjeta",
    },
  } as const;
  const t = () => T[lang()];

  return (
    <div class="cnc" style={{ "--accent": c().accent, "--accent-deep": c().accentDeep }}>
      <AnalyticsListener />
      <style>{`
        /* Tokens explícitos. Jerarquía por color y peso, NUNCA por opacity. */
        .cnc{--cream:#F4F0E8;--ink:#151513;--ink-2:#403b34;--muted:#6b645c;
          --panel:#ffffff;--edge:#dcd5c9;--edge-strong:#151513;
          color-scheme:light;min-height:100vh;background:var(--cream);color:var(--ink);
          font-family:Inter,system-ui,sans-serif;line-height:1.6;font-size:16px}
        .cnc *{box-sizing:border-box}
        .cnc img{display:block;max-width:100%}
        .cnc a{color:inherit}
        .cnc-shell{max-width:1240px;margin:0 auto;padding:0 24px 48px;background:var(--cream)}

        .cnc-top{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:18px 0 0}
        /* 54vw deja sitio al selector EN/ES incluso a 320px de ancho. */
        .cnc-logo{width:min(54vw,250px);height:auto;flex:none}
        .cnc-lang{display:inline-flex;border:1.5px solid var(--edge-strong);overflow:hidden;font-size:.7rem;font-weight:800}
        .cnc-lang button{min-height:34px;padding:0 12px;background:var(--cream);border:0;font:inherit;font-weight:800;cursor:pointer;color:var(--ink)}
        .cnc-lang button[aria-pressed="true"]{background:var(--ink);color:var(--cream)}
        .cnc-lang button:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}

        .cnc-eyebrow{font-size:11px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:var(--accent);margin:0}

        /* HERO — móvil: identidad → producto → titular → acciones. Texto a la izquierda. */
        .cnc-hero{padding:20px 0 0}
        .cnc-hero .avail{font-size:10.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin:0 0 14px}
        .cnc-heroimg{margin:0;border:2px solid var(--ink)}
        .cnc-heroimg img{width:100%;height:auto;aspect-ratio:4/3;object-fit:cover}
        .cnc-hero h1{font-weight:900;font-size:clamp(34px,9.6vw,44px);line-height:1.0;letter-spacing:-.025em;margin:20px 0 0;text-transform:uppercase}
        .cnc-hero h1 em{font-style:normal;color:var(--accent)}
        .cnc-hero .sub{margin:12px 0 0;max-width:38ch;color:var(--ink-2);font-size:16px}

        /* Acciones — jerarquía 1 catálogo · 2 Instagram · 3 guardar */
        .cnc-acts{margin:20px 0 0;display:flex;flex-direction:column;gap:10px}
        .cnc-cta{display:flex;align-items:center;justify-content:center;gap:10px;min-height:56px;
          font:inherit;font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;
          text-decoration:none;cursor:pointer;border:2px solid var(--ink)}
        .cnc-cta.primary{background:var(--accent);color:#fff;border-color:var(--accent)}
        .cnc-cta.primary:hover{background:var(--accent-deep);border-color:var(--accent-deep)}
        .cnc-cta.mid{background:var(--ink);color:var(--cream)}
        .cnc-cta.mid:hover{background:#000}
        .cnc-cta.ghost{background:var(--cream);color:var(--ink);min-height:50px;font-weight:700}
        .cnc-cta.ghost:hover{border-color:var(--accent);color:var(--accent)}
        .cnc-cta:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
        .cnc-duo{display:grid;grid-template-columns:1fr 1fr;gap:10px}

        .cnc-sec{margin:44px 0 0}
        .cnc-h2{font-weight:900;font-size:clamp(24px,6.4vw,32px);line-height:1.04;letter-spacing:-.02em;margin:10px 0 0;text-transform:uppercase}
        .cnc-subline{margin:10px 0 0;color:var(--ink-2);font-size:15px;max-width:52ch}

        /* Trabajo real */
        .cnc-work{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:20px 0 0}
        .cnc-work figure{margin:0;background:var(--panel);border:1.5px solid var(--ink)}
        .cnc-work img{width:100%;aspect-ratio:4/5;object-fit:cover}
        .cnc-work figcaption{padding:10px 12px 12px}
        .cnc-work .wt{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.06em}
        .cnc-work .wm2{margin:3px 0 0;font-size:12px;color:var(--muted)}

        /* Capacidades con foto */
        .cnc-caps{display:flex;flex-direction:column;gap:16px;margin:20px 0 0}
        .cnc-capb{background:var(--panel);border:1.5px solid var(--ink);display:grid;grid-template-columns:104px 1fr}
        .cnc-capb img{width:104px;height:100%;object-fit:cover}
        .cnc-capb .tx{padding:14px 16px}
        .cnc-capb h3{margin:0;font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:.04em}
        .cnc-capb p{margin:6px 0 0;font-size:13.5px;color:var(--ink-2);line-height:1.5}
        /* Sin foto honesta de este servicio → placa de marca deliberada, no una
           tarjeta rota. Jerarquía por peso tipográfico, nunca por opacity. */
        .cnc-capb.nophoto{grid-template-columns:1fr;background:var(--accent);border-color:var(--accent);
          display:flex;align-items:center}
        .cnc-capb.nophoto .tx{padding:20px 18px}
        .cnc-capb.nophoto h3{color:#fff}
        .cnc-capb.nophoto p{color:#fff;font-weight:500}

        /* Proceso */
        .cnc-steps{display:grid;grid-template-columns:1fr 1fr;gap:18px 16px;margin:20px 0 0}
        .cnc-step .n{font-size:12px;font-weight:900;color:var(--accent);letter-spacing:.08em}
        .cnc-step h3{margin:4px 0 0;font-size:13.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em}
        .cnc-step p{margin:6px 0 0;font-size:13px;color:var(--ink-2);line-height:1.5}

        /* Categorías reales */
        .cnc-cats{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:18px 0 0}
        .cnc-cats a{display:flex;align-items:center;justify-content:space-between;gap:8px;
          min-height:52px;padding:0 14px;border:1.5px solid var(--ink);background:var(--panel);
          text-decoration:none;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:.03em}
        .cnc-cats a:hover{background:var(--accent);border-color:var(--accent);color:#fff}
        .cnc-cats a span:last-child{color:var(--accent)}
        .cnc-cats a:hover span:last-child{color:#fff}

        /* Credibilidad de producción */
        .cnc-cred{margin:20px 0 0;background:var(--ink);color:var(--cream);border:2px solid var(--ink)}
        .cnc-cred img{width:100%;aspect-ratio:16/10;object-fit:cover}
        .cnc-cred .tx{padding:20px 22px 24px}
        .cnc-cred h2{margin:0;font-weight:900;font-size:clamp(22px,5.8vw,28px);line-height:1.06;letter-spacing:-.015em;text-transform:uppercase}
        .cnc-cred h2 em{font-style:normal;color:var(--accent)}
        .cnc-cred p{margin:10px 0 0;font-size:14.5px;color:#d9d4cb;line-height:1.6;max-width:52ch}

        /* Contacto */
        .cnc-contact{margin:44px 0 0;border-top:3px solid var(--ink);padding-top:26px}

        /* Compartir — QR plegado */
        .cnc-share{margin:40px 0 0;border-top:1.5px solid var(--edge);padding-top:22px}
        .cnc-share .row{display:flex;flex-wrap:wrap;gap:10px;margin:14px 0 0}
        .cnc-share .row .cnc-cta{flex:1 1 auto;min-height:46px;font-size:12px;padding:0 14px}
        .cnc-qrbox{display:none;margin:18px 0 0}
        .cnc-qrbox[data-open="true"]{display:block}
        .cnc-qrbox .qr{width:196px;padding:10px;background:#fff;border:1.5px solid var(--ink)}
        .cnc-qrbox img{width:100%;height:auto}
        .cnc-qrbox p{margin:8px 0 0;font-size:12px;color:var(--muted)}
        .cnc-status{min-height:1.2em;margin:8px 0 0;font-size:12px;font-weight:800;color:var(--accent)}

        .cnc-foot{margin:36px 0 0;border-top:1.5px solid var(--edge);padding-top:16px;
          font-size:11.5px;color:var(--muted);display:flex;flex-wrap:wrap;gap:6px 16px;justify-content:space-between}

        /* ============ DESKTOP: composición editorial, no columna centrada ============ */
        @media (min-width:900px){
          .cnc-shell{padding:0 48px 64px}
          .cnc-hero{display:grid;grid-template-columns:45fr 55fr;grid-template-areas:"avail img" "copy img";
            grid-template-rows:auto 1fr;column-gap:40px;align-items:center;padding:34px 0 0}
          .cnc-hero .avail{grid-area:avail;align-self:end}
          .cnc-heroimg{grid-area:img}
          .cnc-hero .copy{grid-area:copy;align-self:start}
          .cnc-heroimg img{aspect-ratio:11/9}
          .cnc-hero h1{font-size:clamp(44px,4.6vw,62px);margin-top:6px}
          .cnc-acts{flex-direction:row;flex-wrap:wrap}
          .cnc-acts .cnc-cta.primary{flex:2 1 260px}
          .cnc-duo{flex:1 1 300px}
          .cnc-sec{margin-top:64px}
          .cnc-workhead{display:grid;grid-template-columns:1fr 1fr;align-items:end;gap:30px}
          .cnc-workhead .cnc-subline{margin:0;justify-self:end}
          .cnc-work{grid-template-columns:repeat(4,1fr);gap:18px}
          .cnc-work figure:nth-child(2){transform:translateY(22px)}
          .cnc-work figure:nth-child(4){transform:translateY(22px)}
          .cnc-caps{display:grid;grid-template-columns:repeat(3,1fr);align-items:stretch}
          /* 200px y centrado: a 150px las placas bordadas salían decapitadas. */
          .cnc-capb{grid-template-columns:1fr;grid-template-rows:200px auto}
          .cnc-capb img{width:100%;height:200px;object-position:center}
          .cnc-capb.nophoto{grid-template-rows:none}
          .cnc-steps{grid-template-columns:repeat(4,1fr)}
          .cnc-cats{grid-template-columns:repeat(3,1fr)}
          .cnc-cred{display:grid;grid-template-columns:55fr 45fr}
          .cnc-cred img{height:100%;aspect-ratio:auto}
          .cnc-cred .tx{padding:30px 32px;display:flex;flex-direction:column;justify-content:center}
          .cnc-contact{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:start}
          .cnc-contact .cnc-acts{margin-top:0}
          .cnc-share .row .cnc-cta{flex:0 1 auto}
        }
        @media (prefers-reduced-motion:reduce){
          .cnc-work figure{transform:none!important}
        }
      `}</style>

      <div class="cnc-shell">
        {/* IDENTIDAD */}
        <header class="cnc-top">
          <img class="cnc-logo" src={c().logoUrl} alt={c().logoAlt[lang()]} width="1000" height="213" />
          <div class="cnc-lang" role="group" aria-label="Language">
            <button type="button" aria-pressed={lang() === "en"} onClick={() => switchLang("en")}>EN</button>
            <button type="button" aria-pressed={lang() === "es"} onClick={() => switchLang("es")}>ES</button>
          </div>
        </header>

        {/* HERO — móvil: identidad → producto real → titular → acciones.
            Desktop: copy 45% izquierda, imagen 55% derecha (grid areas). */}
        <section class="cnc-hero">
          <p class="avail">{c().availability[lang()]}</p>
          <figure class="cnc-heroimg">
            <img src={c().heroImg.src} alt={c().heroImg.alt[lang()]} width="1100" height="820"
              fetchpriority="high" decoding="async" />
          </figure>
          <div class="copy">
            <h1>{c().taglineA[lang()]}<br /><em>{c().taglineB[lang()]}</em></h1>
            <p class="sub">{c().sub[lang()]}</p>
            <div class="cnc-acts">
              <a class="cnc-cta primary" href={c().primaryHref} target="_blank" rel="noopener noreferrer"
                data-track="shop_click" data-card={p().id}>{c().primaryLabel[lang()]}</a>
              <div class="cnc-duo">
                <Show when={c().instagram}>
                  <a class="cnc-cta mid" href={c().instagram!} target="_blank" rel="noopener noreferrer"
                    data-track="instagram_click" data-card={p().id}>{t().instagram}</a>
                </Show>
                <a class="cnc-cta ghost" href={`/card/${p().id}/vcard`} rel="external" download=""
                  data-track="save_contact" data-card={p().id}>{t().save}</a>
              </div>
            </div>
          </div>
        </section>

        {/* TRABAJO REAL */}
        <section class="cnc-sec" aria-labelledby="work-h">
          <div class="cnc-workhead">
            <div>
              <p class="cnc-eyebrow">{t().workEyebrow}</p>
              <h2 id="work-h" class="cnc-h2">{t().workHeadA}<br />{t().workHeadB}</h2>
            </div>
            <p class="cnc-subline">{t().workSub}</p>
          </div>
          <div class="cnc-work">
            <For each={c().work}>
              {(w) => (
                <figure>
                  <img src={w.src} alt={w.alt[lang()]} width="760" height="950" loading="lazy" decoding="async" />
                  <figcaption>
                    <p class="wt">{w.type[lang()]}</p>
                    <p class="wm2">{w.method[lang()]}</p>
                  </figcaption>
                </figure>
              )}
            </For>
          </div>
        </section>

        {/* CAPACIDADES */}
        <section class="cnc-sec" aria-labelledby="caps-h">
          <p class="cnc-eyebrow" id="caps-h">{t().capsEyebrow}</p>
          <div class="cnc-caps">
            <For each={c().capabilities}>
              {(cap) => (
                <div class={`cnc-capb${cap.src ? "" : " nophoto"}`}>
                  <Show when={cap.src}>
                    <img src={cap.src} alt={cap.alt?.[lang()] ?? ""} width="700" height="520" loading="lazy" decoding="async" />
                  </Show>
                  <div class="tx">
                    <h3>{cap.title[lang()]}</h3>
                    <p>{cap.body[lang()]}</p>
                  </div>
                </div>
              )}
            </For>
          </div>
        </section>

        {/* CÓMO EMPEZAR */}
        <section class="cnc-sec" aria-labelledby="how-h">
          <p class="cnc-eyebrow" id="how-h">{t().howEyebrow}</p>
          <div class="cnc-steps">
            <For each={c().steps}>
              {(s, i) => (
                <div class="cnc-step">
                  <p class="n">0{i() + 1}</p>
                  <h3>{s.title[lang()]}</h3>
                  <p>{s.body[lang()]}</p>
                </div>
              )}
            </For>
          </div>
        </section>

        {/* CATEGORÍAS REALES */}
        <section class="cnc-sec" aria-labelledby="cat-h">
          <p class="cnc-eyebrow" id="cat-h">{t().catEyebrow}</p>
          <p class="cnc-subline">{t().catSub}</p>
          <nav class="cnc-cats" aria-label={t().catEyebrow}>
            <For each={c().categories}>
              {(cat) => (
                <a href={cat.href} target="_blank" rel="noopener noreferrer"
                  data-track="category_click" data-card={p().id}>
                  <span>{cat.label[lang()]}</span><span aria-hidden="true">→</span>
                </a>
              )}
            </For>
          </nav>
        </section>

        {/* CREDIBILIDAD DE PRODUCCIÓN */}
        <section class="cnc-sec" aria-labelledby="cred-h">
          <div class="cnc-cred">
            <Show when={c().credibility.src}>
              <img src={c().credibility.src} alt={c().credibility.alt?.[lang()] ?? ""} width="900" height="660" loading="lazy" decoding="async" />
            </Show>
            <div class="tx">
              <h2 id="cred-h">{t().credHeadA}<br /><em>{t().credHeadB}</em></h2>
              <p>{c().credibility.body[lang()]}</p>
            </div>
          </div>
        </section>

        {/* CONTACTO */}
        <section class="cnc-contact" aria-labelledby="contact-h">
          <div>
            <h2 id="contact-h" class="cnc-h2">{t().contactHeadA}<br />{t().contactHeadB}</h2>
            <p class="cnc-subline">{t().contactSub}</p>
          </div>
          <div class="cnc-acts">
            <a class="cnc-cta primary" href={c().primaryHref} target="_blank" rel="noopener noreferrer"
              data-track="shop_click" data-card={p().id}>{c().primaryLabel[lang()]}</a>
            <div class="cnc-duo">
              <Show when={c().instagram}>
                <a class="cnc-cta mid" href={c().instagram!} target="_blank" rel="noopener noreferrer"
                  data-track="instagram_click" data-card={p().id}>{t().instagram}</a>
              </Show>
              <a class="cnc-cta ghost" href={`/card/${p().id}/vcard`} rel="external" download=""
                data-track="save_contact" data-card={p().id}>{t().save}</a>
            </div>
          </div>
        </section>

        {/* COMPARTIR — el único QR, plegado por defecto */}
        <section class="cnc-share" aria-labelledby="share-h">
          <p class="cnc-eyebrow" id="share-h">{t().shareHead}</p>
          <p class="cnc-subline">{t().shareSub}</p>
          <div class="row">
            <button type="button" class="cnc-cta ghost" aria-expanded={qrOpen()} onClick={toggleQr}>
              {qrOpen() ? t().hideQr : t().showQr}
            </button>
            <button type="button" class="cnc-cta ghost" onClick={copyLink}>{t().copy}</button>
            <button type="button" class="cnc-cta ghost" onClick={shareCard}>{t().share}</button>
          </div>
          <p class="cnc-status" role="status" aria-live="polite">
            <Show when={copied()}>{t().copied}</Show>
          </p>
          <div class="cnc-qrbox" data-open={qrOpen() ? "true" : "false"}>
            <div class="qr">
              <img src={`/card/qr-${p().id}.svg`} alt={t().qrAlt} width="184" height="184" loading="lazy" />
            </div>
            <p>{t().scan}</p>
          </div>
        </section>

        <footer class="cnc-foot">
          <span>{p().company.name} · Custom Nation LLC</span>
          <span>{p().company.location[lang()]}</span>
        </footer>
      </div>
    </div>
  );
}
