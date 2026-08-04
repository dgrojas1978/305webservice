import { For, Show, createSignal, onCleanup, onMount } from "solid-js";
import { isServer } from "solid-js/web";
import AnalyticsListener from "~/components/AnalyticsListener";
import { captureAttribution, trackEvent } from "~/lib/analytics";
import { type CardLocale, type CardProfile } from "~/data/card";

/**
 * Tarjeta de CLIENTE con marca propia — CN Brandings es el primer tenant.
 *
 * Vende un PEDIDO, no describe servicios: la acción primaria es «Request a
 * quote» (formulario propio contra el backend real de leads de 305; el sitio de
 * CN no tiene ruta de pedido), el catálogo es secundario, Instagram y guardar
 * contacto terciarios. Producto real en el primer viewport: imagen dominante
 * más dos macros de textura (puntadas, impresión) del mismo trabajo real.
 *
 * Defensas contra el escritorio desvanecido (medidas, no supuestas): ningún
 * contenedor usa opacity para jerarquía, fondos sólidos explícitos en todos los
 * niveles, `color-scheme:light`, sin blend modes ni backdrop-filter.
 *
 * Reglas del sistema: una acción domina, un solo QR (plegado, al final, hacia la
 * ruta canónica de la tarjeta — no hacia la tienda), y nada inventado.
 */

const LANG_KEY = "305_card_lang";

export default function ClientCard(props: { profile: CardProfile }) {
  const p = () => props.profile;
  const c = () => p().client!;
  const [lang, setLang] = createSignal<CardLocale>("en");
  const [copied, setCopied] = createSignal(false);
  const [qrOpen, setQrOpen] = createSignal(false);
  const [quoteOpen, setQuoteOpen] = createSignal(false);
  const [sending, setSending] = createSignal(false);
  const [quoteState, setQuoteState] = createSignal<"" | "sent" | "error">("");
  const [attribution, setAttribution] = createSignal("{}");
  const [ts, setTs] = createSignal(0);
  let drawerRef: HTMLDivElement | undefined;

  const switchLang = (l: CardLocale) => {
    if (l === lang()) return;
    setLang(l);
    try { localStorage.setItem(LANG_KEY, l); } catch { /* opcional */ }
    document.documentElement.lang = l === "es" ? "es-US" : "en-US";
    trackEvent("language_change", { lang: l });
  };

  const openQuote = () => {
    setQuoteOpen(true);
    trackEvent("quote_open", { card: p().id });
    if (!isServer) {
      document.body.style.overflow = "hidden";
      queueMicrotask(() => drawerRef?.querySelector("input")?.focus());
    }
  };
  const closeQuote = () => {
    setQuoteOpen(false);
    setSending(false);
    if (!isServer) document.body.style.overflow = "";
  };
  const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeQuote(); };

  onMount(() => {
    try { if (localStorage.getItem(LANG_KEY) === "es") switchLang("es"); } catch { /* opcional */ }
    const search = new URLSearchParams(window.location.search);
    trackEvent("card_view", { card: p().id, src: search.get("utm_source") || "direct" });
    setAttribution(JSON.stringify(captureAttribution()));
    setTs(Date.now());
    // resultado del POST nativo del formulario
    const q = search.get("quote");
    if (q === "sent") setQuoteState("sent");
    if (q === "error") { setQuoteState("error"); openQuote(); }
    document.addEventListener("keydown", onKey);
  });
  onCleanup(() => {
    if (isServer) return;
    document.removeEventListener("keydown", onKey);
    document.body.style.overflow = "";
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
      quote: "Request a quote", save: "Save contact", instagram: "Instagram",
      workEyebrow: "Selected work", workHeadA: "Made for teams,", workHeadB: "built around brands.",
      workSub: "A closer look at apparel, decoration and branded products produced for real organizations and teams.",
      capsEyebrow: "What we produce",
      howEyebrow: "From idea to finished order",
      catEyebrow: "Explore apparel",
      contactHeadA: "Let's build", contactHeadB: "your next order.",
      contactSub: "Tell us what you need, how many pieces you are considering and when you need them.",
      shareHead: "Share this card", shareSub: "Let someone else open this card instantly.",
      showQr: "Show QR", hideQr: "Hide QR", copy: "Copy link", copied: "Link copied", share: "Share",
      qrAlt: "QR code that opens the CN Brandings digital card", scan: "Scan to open this card",
      sent: "Quote request sent. CN Brandings will get back to you.",
      error: "The request could not be sent. Check the required fields and try again.",
      f: {
        title: "Request a quote", close: "Close",
        name: "Name", org: "Business / organization", email: "Email", phone: "Phone",
        product: "Product type", qty: "Estimated quantity", method: "Decoration method",
        needBy: "Needed by", notes: "Project notes", contact: "Preferred contact method",
        consent: "I agree to be contacted about this request.",
        submit: "Send request", sending: "Sending…",
        oneOf: "Provide an email or a phone number.",
        products: [
          ["t-shirts", "T-shirts"], ["polos", "Polos"], ["woven-shirts", "Woven / dress shirts"],
          ["sweatshirts-fleece", "Sweatshirts / fleece"], ["headwear", "Headwear"],
          ["uniforms", "Uniforms"], ["promotional", "Promotional products"], ["not-sure", "Not sure yet"],
        ] as [string, string][],
        methods: [
          ["not-sure", "Not sure yet"], ["embroidery", "Embroidery"],
          ["screen-printing", "Screen printing"], ["dtf", "DTF"],
        ] as [string, string][],
        contacts: [["email", "Email"], ["phone", "Phone"], ["whatsapp", "WhatsApp"]] as [string, string][],
      },
    },
    es: {
      quote: "Solicitar cotización", save: "Guardar contacto", instagram: "Instagram",
      workEyebrow: "Trabajo seleccionado", workHeadA: "Hecho para equipos,", workHeadB: "construido para marcas.",
      workSub: "Una mirada de cerca a la ropa, la decoración y los productos de marca producidos para organizaciones y equipos reales.",
      capsEyebrow: "Qué producimos",
      howEyebrow: "De la idea al pedido terminado",
      catEyebrow: "Explorar prendas",
      contactHeadA: "Construyamos", contactHeadB: "su próximo pedido.",
      contactSub: "Cuéntenos qué necesita, cuántas piezas está considerando y para cuándo las necesita.",
      shareHead: "Compartir esta tarjeta", shareSub: "Permita que otra persona abra esta tarjeta al instante.",
      showQr: "Mostrar QR", hideQr: "Ocultar QR", copy: "Copiar enlace", copied: "Enlace copiado", share: "Compartir",
      qrAlt: "Código QR que abre la tarjeta digital de CN Brandings", scan: "Escanee para abrir esta tarjeta",
      sent: "Solicitud enviada. CN Brandings se pondrá en contacto.",
      error: "No se pudo enviar. Revise los campos requeridos e intente de nuevo.",
      f: {
        title: "Solicitar cotización", close: "Cerrar",
        name: "Nombre", org: "Empresa / organización", email: "Correo", phone: "Teléfono",
        product: "Tipo de producto", qty: "Cantidad estimada", method: "Método de decoración",
        needBy: "Fecha necesaria", notes: "Notas del proyecto", contact: "Método de contacto preferido",
        consent: "Acepto ser contactado sobre esta solicitud.",
        submit: "Enviar solicitud", sending: "Enviando…",
        oneOf: "Indique un correo o un teléfono.",
        products: [
          ["t-shirts", "Camisetas"], ["polos", "Polos"], ["woven-shirts", "Camisas"],
          ["sweatshirts-fleece", "Sudaderas / abrigo"], ["headwear", "Gorras"],
          ["uniforms", "Uniformes"], ["promotional", "Productos promocionales"], ["not-sure", "Aún no lo sé"],
        ] as [string, string][],
        methods: [
          ["not-sure", "Aún no lo sé"], ["embroidery", "Bordado"],
          ["screen-printing", "Serigrafía"], ["dtf", "DTF"],
        ] as [string, string][],
        contacts: [["email", "Correo"], ["phone", "Teléfono"], ["whatsapp", "WhatsApp"]] as [string, string][],
      },
    },
  } as const;
  const t = () => T[lang()];

  return (
    <div class="cnc" style={{ "--accent": c().accent, "--accent-deep": c().accentDeep }}>
      <AnalyticsListener />
      <style>{`
        .cnc{--cream:#F4F0E8;--ink:#151513;--ink-2:#403b34;--muted:#6b645c;
          --panel:#ffffff;--edge:#dcd5c9;--edge-strong:#151513;
          color-scheme:light;min-height:100vh;background:var(--cream);color:var(--ink);
          font-family:Inter,system-ui,sans-serif;line-height:1.6;font-size:16px}
        .cnc *{box-sizing:border-box}
        .cnc img{display:block;max-width:100%}
        .cnc a{color:inherit}
        .cnc-shell{max-width:1240px;margin:0 auto;padding:0 24px 48px;background:var(--cream)}
        .cnc-top{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:18px 0 0}
        .cnc-logo{width:min(54vw,250px);height:auto;flex:none}
        .cnc-lang{display:inline-flex;border:1.5px solid var(--edge-strong);overflow:hidden;font-size:.7rem;font-weight:800}
        .cnc-lang button{min-height:34px;padding:0 12px;background:var(--cream);border:0;font:inherit;font-weight:800;cursor:pointer;color:var(--ink)}
        .cnc-lang button[aria-pressed="true"]{background:var(--ink);color:var(--cream)}
        .cnc-lang button:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}
        .cnc-eyebrow{font-size:11px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:var(--accent);margin:0}

        .cnc-hero{padding:20px 0 0}
        .cnc-hero .avail{font-size:10.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin:0 0 14px}
        .cnc-heroimg{margin:0;border:2px solid var(--ink)}
        .cnc-heroimg img{width:100%;height:auto;aspect-ratio:4/3;object-fit:cover}
        .cnc-crops{display:none}
        .cnc-hero h1{font-weight:900;font-size:clamp(33px,9.2vw,44px);line-height:1.0;letter-spacing:-.025em;margin:20px 0 0;text-transform:uppercase}
        .cnc-hero h1 em{font-style:normal;color:var(--accent)}
        .cnc-hero .sub{margin:12px 0 0;max-width:38ch;color:var(--ink-2);font-size:16px}

        .cnc-acts{margin:20px 0 0;display:flex;flex-direction:column;gap:10px}
        .cnc-cta{display:flex;align-items:center;justify-content:center;gap:10px;min-height:56px;
          font:inherit;font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;
          text-decoration:none;cursor:pointer;border:2px solid var(--ink)}
        .cnc-cta.primary{background:var(--accent);color:#fff;border-color:var(--accent)}
        .cnc-cta.primary:hover{background:var(--accent-deep);border-color:var(--accent-deep)}
        .cnc-cta.mid{background:var(--ink);color:var(--cream)}
        .cnc-cta.mid:hover{background:#000}
        .cnc-cta.ghost{background:var(--cream);color:var(--ink);min-height:48px;font-weight:700;font-size:12.5px}
        .cnc-cta.ghost:hover{border-color:var(--accent);color:var(--accent)}
        .cnc-cta:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
        .cnc-cta[disabled]{cursor:wait}
        .cnc-duo{display:grid;grid-template-columns:1fr 1fr;gap:10px}

        .cnc-banner{margin:16px 0 0;padding:13px 16px;font-size:14px;font-weight:600;border:2px solid var(--ink);background:var(--panel)}
        .cnc-banner.ok{border-color:#1c6b33;color:#1c6b33}
        .cnc-banner.bad{border-color:var(--accent);color:var(--accent-deep)}

        .cnc-sec{margin:44px 0 0}
        .cnc-h2{font-weight:900;font-size:clamp(24px,6.4vw,32px);line-height:1.04;letter-spacing:-.02em;margin:10px 0 0;text-transform:uppercase}
        .cnc-subline{margin:10px 0 0;color:var(--ink-2);font-size:15px;max-width:52ch}

        .cnc-work{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:20px 0 0}
        .cnc-work figure{margin:0;background:var(--panel);border:1.5px solid var(--ink)}
        .cnc-work img{width:100%;aspect-ratio:4/5;object-fit:cover}
        .cnc-work figcaption{padding:10px 12px 12px}
        .cnc-work .wt{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;margin:0}
        .cnc-work .wm2{margin:3px 0 0;font-size:12px;color:var(--muted)}

        .cnc-caps{display:flex;flex-direction:column;gap:16px;margin:20px 0 0}
        .cnc-capb{background:var(--panel);border:1.5px solid var(--ink);display:grid;grid-template-columns:104px 1fr}
        .cnc-capb img{width:104px;height:100%;object-fit:cover}
        .cnc-capb .tx{padding:14px 16px}
        .cnc-capb h3{margin:0;font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:.04em}
        .cnc-capb p{margin:6px 0 0;font-size:13.5px;color:var(--ink-2);line-height:1.5}
        .cnc-capb.nophoto{grid-template-columns:1fr;background:var(--accent);border-color:var(--accent);display:flex;align-items:center}
        .cnc-capb.nophoto .tx{padding:20px 18px}
        .cnc-capb.nophoto h3{color:#fff}
        .cnc-capb.nophoto p{color:#fff;font-weight:500}

        .cnc-steps{display:grid;grid-template-columns:1fr 1fr;gap:18px 16px;margin:20px 0 0}
        .cnc-step .n{font-size:12px;font-weight:900;color:var(--accent);letter-spacing:.08em;margin:0}
        .cnc-step h3{margin:4px 0 0;font-size:13.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em}
        .cnc-step p{margin:6px 0 0;font-size:13px;color:var(--ink-2);line-height:1.5}

        .cnc-cats{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:18px 0 0}
        .cnc-cats a{display:flex;align-items:center;justify-content:space-between;gap:8px;
          min-height:52px;padding:0 14px;border:1.5px solid var(--ink);background:var(--panel);
          text-decoration:none;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:.03em}
        .cnc-cats a:hover{background:var(--accent);border-color:var(--accent);color:#fff}
        .cnc-cats a span:last-child{color:var(--accent)}
        .cnc-cats a:hover span:last-child{color:#fff}

        .cnc-cred{margin:20px 0 0;background:var(--ink);color:var(--cream);border:2px solid var(--ink)}
        .cnc-cred img{width:100%;aspect-ratio:16/10;object-fit:cover}
        .cnc-cred .tx{padding:20px 22px 24px}
        .cnc-cred h2{margin:0;font-weight:900;font-size:clamp(22px,5.8vw,28px);line-height:1.06;letter-spacing:-.015em;text-transform:uppercase}
        .cnc-cred h2 em{font-style:normal;color:#e05a5f}
        .cnc-cred p{margin:10px 0 0;font-size:14.5px;color:#d9d4cb;line-height:1.6;max-width:52ch}

        .cnc-contact{margin:44px 0 0;border-top:3px solid var(--ink);padding-top:26px}
        .cnc-share{margin:40px 0 0;border-top:1.5px solid var(--edge);padding-top:22px}
        .cnc-share .row{display:flex;flex-wrap:wrap;gap:10px;margin:14px 0 0}
        .cnc-share .row .cnc-cta{flex:1 1 auto;min-height:46px;font-size:12px;padding:0 14px}
        .cnc-qrbox{display:none;margin:18px 0 0}
        .cnc-qrbox[data-open="true"]{display:block}
        .cnc-qrbox .qr{width:196px;padding:10px;background:#fff;border:1.5px solid var(--ink)}
        .cnc-qrbox img{width:100%;height:auto}
        .cnc-qrbox p{margin:8px 0 0;font-size:12px;color:var(--muted)}
        .cnc-qrbox .url{font-weight:700;color:var(--ink-2);letter-spacing:.02em}
        .cnc-status{min-height:1.2em;margin:8px 0 0;font-size:12px;font-weight:800;color:var(--accent)}
        .cnc-foot{margin:36px 0 0;border-top:1.5px solid var(--edge);padding-top:16px;
          font-size:11.5px;color:var(--muted);display:flex;flex-wrap:wrap;gap:6px 16px;justify-content:space-between}

        /* ---- cajón de cotización ---- */
        .cnc-overlay{position:fixed;inset:0;z-index:60;background:rgba(21,21,19,.55);
          display:flex;align-items:flex-end;justify-content:center}
        .cnc-drawer{width:100%;max-width:560px;max-height:92dvh;overflow-y:auto;
          background:var(--cream);color:var(--ink);border-top:4px solid var(--accent);padding:22px 22px 30px}
        .cnc-drawer h2{margin:0;font-weight:900;font-size:22px;text-transform:uppercase;letter-spacing:-.01em}
        .cnc-drawer .close{background:none;border:0;font:inherit;font-weight:700;font-size:13px;
          text-decoration:underline;cursor:pointer;color:var(--ink-2);padding:4px}
        .cnc-form{margin:14px 0 0;display:grid;gap:12px;grid-template-columns:1fr 1fr}
        .cnc-form .full{grid-column:1 / -1}
        .cnc-form label{display:block;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-2)}
        .cnc-form input,.cnc-form select,.cnc-form textarea{margin-top:5px;width:100%;min-height:46px;
          padding:9px 12px;border:1.5px solid var(--ink);background:var(--panel);color:var(--ink);
          font:inherit;font-size:15px;border-radius:0}
        .cnc-form textarea{min-height:84px;resize:vertical}
        .cnc-form input:focus-visible,.cnc-form select:focus-visible,.cnc-form textarea:focus-visible{outline:3px solid var(--accent);outline-offset:1px}
        .cnc-consent{display:flex;gap:10px;align-items:flex-start;font-size:13px;color:var(--ink-2)}
        .cnc-consent input{width:18px;height:18px;min-height:0;margin-top:2px;flex:none}
        .cnc-hint{font-size:12px;color:var(--muted);margin:2px 0 0}
        .hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}

        @media (min-width:900px){
          .cnc-shell{padding:0 48px 64px}
          .cnc-hero{display:grid;grid-template-columns:42fr 58fr;grid-template-areas:"avail img" "copy img";
            grid-template-rows:auto 1fr;column-gap:40px;align-items:center;padding:34px 0 0}
          .cnc-hero .avail{grid-area:avail;align-self:end}
          .cnc-heroimg{grid-area:img;display:grid;grid-template-columns:2fr 1fr;grid-template-rows:1fr 1fr;
            gap:10px;border:0;background:var(--cream)}
          .cnc-heroimg .main{grid-row:1 / 3;border:2px solid var(--ink)}
          .cnc-heroimg .main img{height:100%;aspect-ratio:auto}
          .cnc-crops{display:contents}
          .cnc-crops figure{margin:0;border:2px solid var(--ink)}
          .cnc-crops img{width:100%;height:100%;object-fit:cover}
          .cnc-hero .copy{grid-area:copy;align-self:start}
          .cnc-hero h1{font-size:clamp(42px,4.3vw,58px);margin-top:6px}
          .cnc-acts{flex-direction:row;flex-wrap:wrap}
          .cnc-acts .cnc-cta.primary{flex:1.4 1 240px}
          .cnc-acts .cnc-cta.mid{flex:1 1 190px}
          .cnc-duo{flex:1 1 260px}
          .cnc-sec{margin-top:64px}
          .cnc-workhead{display:grid;grid-template-columns:1fr 1fr;align-items:end;gap:30px}
          .cnc-workhead .cnc-subline{margin:0;justify-self:end}
          .cnc-work{grid-template-columns:repeat(4,1fr);gap:18px}
          .cnc-work figure:nth-child(2){transform:translateY(22px)}
          .cnc-work figure:nth-child(4){transform:translateY(22px)}
          .cnc-caps{display:grid;grid-template-columns:repeat(3,1fr);align-items:stretch}
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
          .cnc-overlay{align-items:center}
          .cnc-drawer{border:2px solid var(--ink);border-top:4px solid var(--accent)}
        }
        @media (prefers-reduced-motion:reduce){.cnc-work figure{transform:none!important}}
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

        <Show when={quoteState() === "sent"}>
          <p class="cnc-banner ok" role="status">{t().sent}</p>
        </Show>

        {/* HERO — móvil: identidad → producto → titular → acciones.
            Desktop: copy 42% izq · imagen dominante + 2 macros 58% der. */}
        <section class="cnc-hero">
          <p class="avail">{c().availability[lang()]}</p>
          <div class="cnc-heroimg">
            <figure class="main" style={{ margin: 0 }}>
              <img src={c().heroImg.src} alt={c().heroImg.alt[lang()]} width="1100" height="820"
                fetchpriority="high" decoding="async" />
            </figure>
            <div class="cnc-crops">
              <For each={c().heroCrops ?? []}>
                {(cr) => (
                  <figure>
                    <img src={cr.src} alt={cr.alt[lang()]} width="560" height="430" loading="lazy" decoding="async" />
                  </figure>
                )}
              </For>
            </div>
          </div>
          <div class="copy">
            <h1>{c().taglineA[lang()]}<br /><em>{c().taglineB[lang()]}</em></h1>
            <p class="sub">{c().sub[lang()]}</p>
            <div class="cnc-acts">
              <button type="button" class="cnc-cta primary" onClick={openQuote}
                data-track="quote_cta" data-card={p().id}>{t().quote}</button>
              <a class="cnc-cta mid" href={c().primaryHref} target="_blank" rel="noopener noreferrer"
                data-track="shop_click" data-card={p().id}>{c().primaryLabel[lang()]}</a>
              <div class="cnc-duo">
                <Show when={c().instagram}>
                  <a class="cnc-cta ghost" href={c().instagram!} target="_blank" rel="noopener noreferrer"
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

        {/* QUÉ PRODUCIMOS */}
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

        {/* DE LA IDEA AL PEDIDO */}
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

        {/* CATÁLOGO REAL */}
        <section class="cnc-sec" aria-labelledby="cat-h">
          <p class="cnc-eyebrow" id="cat-h">{t().catEyebrow}</p>
          <p class="cnc-subline">{lang() === "es"
            ? "Explore prendas y productos listos para personalizarse con su marca."
            : "Explore apparel and products ready to be customized around your brand."}</p>
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

        {/* PRODUCCIÓN */}
        <section class="cnc-sec" aria-labelledby="cred-h">
          <div class="cnc-cred">
            <Show when={c().credibility.src}>
              <img src={c().credibility.src} alt={c().credibility.alt?.[lang()] ?? ""} width="900" height="660" loading="lazy" decoding="async" />
            </Show>
            <div class="tx">
              <h2 id="cred-h">{lang() === "es" ? <>Hecho con cuidado.<br /><em>Terminado con precisión.</em></> : <>Built with care.<br /><em>Finished with precision.</em></>}</h2>
              <p>{c().credibility.body[lang()]}</p>
            </div>
          </div>
        </section>

        {/* CONTACTO */}
        <section class="cnc-contact" aria-labelledby="contact-h" id="quote">
          <div>
            <h2 id="contact-h" class="cnc-h2">{t().contactHeadA}<br />{t().contactHeadB}</h2>
            <p class="cnc-subline">{t().contactSub}</p>
          </div>
          <div class="cnc-acts">
            <button type="button" class="cnc-cta primary" onClick={openQuote}
              data-track="quote_cta" data-card={p().id}>{t().quote}</button>
            <a class="cnc-cta mid" href={c().primaryHref} target="_blank" rel="noopener noreferrer"
              data-track="shop_click" data-card={p().id}>{c().primaryLabel[lang()]}</a>
            <div class="cnc-duo">
              <Show when={c().instagram}>
                <a class="cnc-cta ghost" href={c().instagram!} target="_blank" rel="noopener noreferrer"
                  data-track="instagram_click" data-card={p().id}>{t().instagram}</a>
              </Show>
              <a class="cnc-cta ghost" href={`/card/${p().id}/vcard`} rel="external" download=""
                data-track="save_contact" data-card={p().id}>{t().save}</a>
            </div>
          </div>
        </section>

        {/* COMPARTIR — un solo QR, plegado, hacia la RUTA CANÓNICA de la tarjeta */}
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
            <p class="url">{c().shareUrl.replace(/^https:\/\//, "")}</p>
          </div>
        </section>

        <footer class="cnc-foot">
          <span>{p().company.name} · Custom Nation LLC</span>
          <span>{p().company.location[lang()]}</span>
        </footer>
      </div>

      {/* CAJÓN DE COTIZACIÓN — POST nativo al backend real de leads */}
      <Show when={quoteOpen()}>
        <div class="cnc-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeQuote(); }}>
          <div ref={drawerRef} class="cnc-drawer" role="dialog" aria-modal="true" aria-label={t().f.title}>
            <div style={{ display: "flex", "align-items": "baseline", "justify-content": "space-between", gap: "12px" }}>
              <h2>{t().f.title}</h2>
              <button type="button" class="close" onClick={closeQuote}>{t().f.close}</button>
            </div>
            <Show when={quoteState() === "error"}>
              <p class="cnc-banner bad" role="alert">{t().error}</p>
            </Show>
            <form class="cnc-form" method="post" action={`/card/${p().id}/quote`}
              onSubmit={() => setSending(true)}>
              {/* honeypot + antirreloj + atribución */}
              <input class="hp" type="text" name="website_url" tabIndex={-1} autocomplete="off" aria-hidden="true" />
              <input type="hidden" name="ts" value={ts()} />
              <input type="hidden" name="attribution" value={attribution()} />
              <input type="hidden" name="locale" value={lang()} />

              <div class="full">
                <label for="q-name">{t().f.name} *</label>
                <input id="q-name" name="name" required maxLength={120} autocomplete="name" />
              </div>
              <div class="full">
                <label for="q-org">{t().f.org}</label>
                <input id="q-org" name="org" maxLength={120} autocomplete="organization" />
              </div>
              <div>
                <label for="q-email">{t().f.email}</label>
                <input id="q-email" name="email" type="email" maxLength={160} autocomplete="email" />
              </div>
              <div>
                <label for="q-phone">{t().f.phone}</label>
                <input id="q-phone" name="phone" type="tel" maxLength={40} autocomplete="tel" />
              </div>
              <p class="cnc-hint full">{t().f.oneOf}</p>
              <div>
                <label for="q-product">{t().f.product} *</label>
                <select id="q-product" name="product" required>
                  <For each={t().f.products}>{([v, l]) => <option value={v}>{l}</option>}</For>
                </select>
              </div>
              <div>
                <label for="q-qty">{t().f.qty}</label>
                <input id="q-qty" name="qty" inputmode="numeric" maxLength={40} />
              </div>
              <div>
                <label for="q-method">{t().f.method}</label>
                <select id="q-method" name="method">
                  <For each={t().f.methods}>{([v, l]) => <option value={v}>{l}</option>}</For>
                </select>
              </div>
              <div>
                <label for="q-needby">{t().f.needBy}</label>
                <input id="q-needby" name="needBy" type="date" />
              </div>
              <div class="full">
                <label for="q-notes">{t().f.notes}</label>
                <textarea id="q-notes" name="notes" maxLength={1500} />
              </div>
              <div class="full">
                <label for="q-contact">{t().f.contact}</label>
                <select id="q-contact" name="contactMethod">
                  <For each={t().f.contacts}>{([v, l]) => <option value={v}>{l}</option>}</For>
                </select>
              </div>
              <label class="cnc-consent full">
                <input type="checkbox" name="consent" required />
                <span>{t().f.consent}</span>
              </label>
              <button type="submit" class="cnc-cta primary full" disabled={sending()}>
                {sending() ? t().f.sending : t().f.submit}
              </button>
            </form>
          </div>
        </div>
      </Show>
    </div>
  );
}
