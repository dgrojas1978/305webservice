import { For, Show, createSignal, onMount } from "solid-js";
import AnalyticsListener from "~/components/AnalyticsListener";
import { trackEvent } from "~/lib/analytics";
import { type CardLocale, type CardProfile } from "~/data/card";

/**
 * Tarjeta de CLIENTE con marca propia.
 *
 * El concierge de 305 (`DigitalCard`) es navy/turquesa, vende servicios web y
 * muestra proyectos. Un cliente como CN Brandings tiene otra marca (rojo),
 * otra estructura (tienda primero, sin concierge) y otro contacto. Este
 * componente renderiza esos tenants desde `profile.client`, con tema propio y
 * autónomo — no toca los tokens de 305.
 *
 * Reglas heredadas del sistema: una acción domina, un solo QR (al final, dentro
 * de compartir), y NADA se inventa: si el cliente no publica un canal, no
 * aparece.
 */

const LANG_KEY = "305_card_lang";

export default function ClientCard(props: { profile: CardProfile }) {
  const p = () => props.profile;
  const c = () => p().client!;
  const [lang, setLang] = createSignal<CardLocale>("en");
  const [copied, setCopied] = createSignal(false);

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

  const T = {
    en: { save: "Save contact", whatWeDo: "What we do", theShop: "The shop",
      getInTouch: "Get in touch", website: "Website", instagram: "Instagram",
      shareBody: "Let someone else open the shop instantly.", copy: "Copy link",
      copied: "Link copied", scan: "Scan to open" },
    es: { save: "Guardar contacto", whatWeDo: "Qué hacemos", theShop: "El taller",
      getInTouch: "Contacto", website: "Sitio web", instagram: "Instagram",
      shareBody: "Permite que otra persona abra la tienda al instante.", copy: "Copiar enlace",
      copied: "Enlace copiado", scan: "Escanea para abrir" },
  } as const;
  const t = () => T[lang()];

  return (
    <div class="cnc" style={{ "--accent": c().accent, "--accent-deep": c().accentDeep }}>
      <AnalyticsListener />
      <style>{`
        .cnc{--ink:#161514;--ink-2:#4a4744;--muted:#857f79;--paper:#faf8f5;--surface:#fff;
          --edge:rgba(22,21,20,.12);--edge-a:rgba(193,32,38,.28);
          min-height:100vh;background:var(--paper);color:var(--ink);
          font-family:Inter,system-ui,sans-serif;line-height:1.6}
        .cnc-page{max-width:440px;margin:0 auto;padding:20px 22px 44px}
        .cnc-top{display:flex;justify-content:flex-end}
        .cnc-lang{display:inline-flex;border:1px solid var(--edge);border-radius:999px;overflow:hidden;font-size:.7rem;font-weight:800}
        .cnc-lang button{min-height:32px;padding:0 11px;background:transparent;border:0;font:inherit;cursor:pointer;color:var(--muted)}
        .cnc-lang button[aria-pressed="true"]{background:var(--ink);color:#fff}
        .cnc-eyebrow{font-size:10.5px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin:0}
        .cnc-logo{width:82%;max-width:320px;margin:6px auto 0;display:block;height:auto}
        .cnc-avail{display:flex;align-items:center;justify-content:center;gap:9px;margin:18px 0 0}
        .cnc-avail i{width:6px;height:6px;border-radius:50%;background:var(--accent)}
        .cnc-avail p{margin:0;font-size:10px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}
        .cnc-hero{margin:26px 0 0;text-align:center}
        .cnc-hero h1{font-weight:800;font-size:clamp(26px,7.4vw,32px);line-height:1.08;letter-spacing:-.02em;margin:0;text-wrap:balance}
        .cnc-hero .sub{margin:12px auto 0;max-width:32ch;color:var(--ink-2);font-size:14.5px}
        .cnc-acts{margin:24px 0 0;display:flex;flex-direction:column;gap:10px}
        .cnc-cta{display:flex;align-items:center;justify-content:center;gap:9px;min-height:54px;
          font:inherit;font-size:12.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;
          text-decoration:none;cursor:pointer;border:1.5px solid transparent;border-radius:2px}
        .cnc-cta.primary{background:var(--accent);color:#fff}
        .cnc-cta.primary:hover{background:var(--accent-deep)}
        .cnc-cta.line{background:transparent;color:var(--ink);border-color:var(--edge);font-weight:700;min-height:48px}
        .cnc-cta.line:hover{border-color:var(--accent);color:var(--accent)}
        .cnc-cta:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
        .cnc-duo{display:flex;gap:10px}.cnc-duo>*{flex:1}
        .cnc-sec{margin:34px 0 0;padding-top:26px;border-top:1px solid var(--edge)}
        .cnc-caps{margin:18px 0 0;display:flex;flex-direction:column;gap:16px}
        .cnc-cap{display:grid;grid-template-columns:auto 1fr;gap:13px;align-items:start}
        .cnc-cap .bar{width:20px;height:3px;background:var(--accent);margin-top:9px;border-radius:2px}
        .cnc-cap h3{margin:0;font-size:14px;font-weight:800}
        .cnc-cap p{margin:5px 0 0;color:var(--ink-2);font-size:13.5px;line-height:1.55}
        .cnc-proof{margin:18px 0 0;padding:20px;background:var(--surface);border:1px solid var(--edge);border-radius:4px}
        .cnc-proof p{margin:0;font-size:14.5px;color:var(--ink-2)}
        .cnc-proof .who{margin:12px 0 0;font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
        .cnc-ch{margin:18px 0 0;display:flex;flex-direction:column}
        .cnc-ch a{display:flex;align-items:center;gap:14px;padding:15px 0;border-top:1px solid var(--edge);text-decoration:none;color:var(--ink)}
        .cnc-ch a:first-child{border-top:0}
        .cnc-ch svg{width:19px;height:19px;flex:none;fill:none;stroke:var(--accent);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
        .cnc-ch .k{font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);width:78px;flex:none}
        .cnc-ch .v{font-size:14.5px;font-weight:700}
        .cnc-ch a:hover .v{color:var(--accent)}
        .cnc-share{margin:18px 0 0;display:flex;gap:18px;align-items:center;padding:18px;border:1px solid var(--edge);border-radius:4px}
        .cnc-qr{width:104px;height:104px;flex:none;padding:6px;background:#fff;border:1px solid var(--edge);border-radius:3px}
        .cnc-qr img{width:100%;height:100%}
        .cnc-share p{margin:0;font-size:13.5px;color:var(--ink-2)}
        .cnc-copy{margin:11px 0 0;background:none;border:0;padding:0 0 3px;font:inherit;font-size:12px;font-weight:800;
          letter-spacing:.1em;text-transform:uppercase;color:var(--accent);cursor:pointer;border-bottom:1.5px solid var(--edge-a)}
        .cnc-foot{margin:30px 0 0;padding-top:18px;border-top:1px solid var(--edge);font-size:11px;color:var(--muted)}
      `}</style>

      <div class="cnc-page">
        <div class="cnc-top">
          <div class="cnc-lang" role="group" aria-label="Language">
            <button type="button" aria-pressed={lang() === "en"} onClick={() => switchLang("en")}>EN</button>
            <button type="button" aria-pressed={lang() === "es"} onClick={() => switchLang("es")}>ES</button>
          </div>
        </div>

        {/* IDENTIDAD */}
        <img class="cnc-logo" src={c().logoUrl} alt={c().logoAlt[lang()]} width="900" height="192" />
        <div class="cnc-avail"><i aria-hidden="true" /><p>{c().availability[lang()]}</p></div>

        {/* POSICIONAMIENTO */}
        <div class="cnc-hero">
          <h1>{c().taglineA[lang()]}<br />{c().taglineB[lang()]}</h1>
          <p class="sub">{c().sub[lang()]}</p>
        </div>

        {/* ACCIONES */}
        <div class="cnc-acts">
          <a class="cnc-cta primary" href={c().primaryHref} target="_blank" rel="noopener noreferrer"
            data-track="shop_click" data-card={p().id}>{c().primaryLabel[lang()]}</a>
          <div class="cnc-duo">
            <a class="cnc-cta line" href={`/card/${p().id}/vcard`} rel="external" download=""
              data-track="save_contact" data-card={p().id}>{t().save}</a>
            <Show when={c().instagram}>
              <a class="cnc-cta line" href={c().instagram!} target="_blank" rel="noopener noreferrer"
                data-track="instagram_click" data-card={p().id}>{t().instagram}</a>
            </Show>
          </div>
        </div>

        {/* CAPACIDADES */}
        <section class="cnc-sec">
          <p class="cnc-eyebrow">{t().whatWeDo}</p>
          <div class="cnc-caps">
            <For each={c().services}>
              {(s) => (
                <div class="cnc-cap"><span class="bar" aria-hidden="true" />
                  <div><h3>{s.title[lang()]}</h3><p>{s.body[lang()]}</p></div>
                </div>
              )}
            </For>
          </div>
        </section>

        {/* PRUEBA */}
        <section class="cnc-sec">
          <p class="cnc-eyebrow">{t().theShop}</p>
          <div class="cnc-proof">
            <p>{c().proof[lang()]}</p>
            <p class="who">{c().proofWho}</p>
          </div>
        </section>

        {/* CONTACTO + COMPARTIR */}
        <section class="cnc-sec">
          <p class="cnc-eyebrow">{t().getInTouch}</p>
          <nav class="cnc-ch" aria-label="Contact">
            <a href={c().primaryHref} target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></svg>
              <span class="k">{t().website}</span><span class="v">{p().company.websiteDisplay}</span>
            </a>
            <Show when={c().instagram}>
              <a href={c().instagram!} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="3.6" /><circle cx="17" cy="7" r="1" fill="var(--accent)" stroke="none" /></svg>
                <span class="k">{t().instagram}</span><span class="v">@cnbrandings</span>
              </a>
            </Show>
          </nav>

          <div class="cnc-share">
            <div class="cnc-qr">
              <img src={`/card/qr-${p().id}.svg`} alt={t().scan} width="184" height="184" loading="lazy" />
            </div>
            <div>
              <p>{t().shareBody}</p>
              <button type="button" class="cnc-copy" onClick={copyLink}>
                {copied() ? t().copied : t().copy}
              </button>
            </div>
          </div>
        </section>

        <footer class="cnc-foot">{p().company.name} · Custom Nation LLC · {c().proofWho.split("·").pop()!.trim()}</footer>
      </div>
    </div>
  );
}
