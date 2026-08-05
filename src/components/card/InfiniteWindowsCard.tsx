import { For, createSignal } from "solid-js";
import AnalyticsListener from "~/components/AnalyticsListener";
import MagicBox, { type MagicBoxItem } from "~/components/card/MagicBox";
import { trackEvent } from "~/lib/analytics";
import type { CardProfile } from "~/data/card";
import "./infinite-windows-card.css";

const A = "/card/infinite-windows";

const WORK: MagicBoxItem[] = [
  { id: "tarpon-front", src: `${A}/tarpon-front.webp`, width: 1800, height: 1005,
    alt: { en: "10 Tarpon Island residence in Palm Beach", es: "Residencia 10 Tarpon Island en Palm Beach" },
    title: { en: "10 Tarpon Island", es: "10 Tarpon Island" }, detail: { en: "Palm Beach · Residential", es: "Palm Beach · Residencial" } },
  { id: "tarpon-aerial", src: `${A}/tarpon-hero.webp`, width: 1800, height: 1005,
    alt: { en: "Aerial view of 10 Tarpon Island", es: "Vista aérea de 10 Tarpon Island" },
    title: { en: "10 Tarpon Island", es: "10 Tarpon Island" }, detail: { en: "Palm Beach · Residential", es: "Palm Beach · Residencial" } },
  { id: "tarpon-interior", src: `${A}/tarpon-interior.webp`, width: 1800, height: 1013,
    alt: { en: "Interior glazing at 10 Tarpon Island", es: "Cristalería interior en 10 Tarpon Island" },
    title: { en: "10 Tarpon Island", es: "10 Tarpon Island" }, detail: { en: "Palm Beach · Residential", es: "Palm Beach · Residencial" } },
  { id: "ocean-hero", src: `${A}/ocean-hero.webp`, width: 1800, height: 1013,
    alt: { en: "255 Ocean Boulevard residence", es: "Residencia 255 Ocean Boulevard" },
    title: { en: "255 Ocean Boulevard", es: "255 Ocean Boulevard" }, detail: { en: "Golden Beach · Residential · 2023", es: "Golden Beach · Residencial · 2023" } },
  ...["01", "02", "03", "04"].map((n): MagicBoxItem => ({
    id: `ocean-${n}`, src: `${A}/ocean-${n}.webp`, width: 1800, height: 1013,
    alt: { en: `255 Ocean Boulevard project detail ${n}`, es: `Detalle ${n} del proyecto 255 Ocean Boulevard` },
    title: { en: "255 Ocean Boulevard", es: "255 Ocean Boulevard" }, detail: { en: "Golden Beach · Residential · 2023", es: "Golden Beach · Residencial · 2023" },
  })),
];

export default function InfiniteWindowsCard(props: { profile: CardProfile }) {
  const [active, setActive] = createSignal<number | null>(null);
  const [returnFocus, setReturnFocus] = createSignal<HTMLElement | null>(null);
  const [copied, setCopied] = createSignal(false);
  const shareUrl = "https://www.305webservice.com/card/infinite-windows";

  const openWork = (index: number, event: MouseEvent) => {
    setReturnFocus(event.currentTarget as HTMLElement);
    setActive(index);
    trackEvent("card_work_open", { card: props.profile.id, index });
  };
  const share = async () => {
    trackEvent("card_native_share", { card: props.profile.id });
    try {
      if (navigator.share) return await navigator.share({ title: "Infinite Windows", url: shareUrl });
      await navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 1800);
    } catch { /* user cancelled or clipboard unavailable */ }
  };

  return (
    <div class="iwc">
      <AnalyticsListener />
      <main class="iwc-shell">
        <section class="iwc-hero" aria-labelledby="iwc-title">
          <img class="iwc-hero-img" src={`${A}/tarpon-front.webp`} alt="10 Tarpon Island residence in Palm Beach" width="1800" height="1005" />
          <div class="iwc-hero-shade" />
          <header><img src={`${A}/logo-white.png`} alt="Infinite Windows" width="872" height="258" /></header>
          <div class="iwc-hero-copy">
            <p>10 Tarpon Island · Palm Beach</p>
            <h1 id="iwc-title">The windows of the houses you remember.</h1>
            <span>Impact glazing · Architectural fabrication · Florida · Since 2005</span>
          </div>
        </section>

        <section class="iwc-actions" aria-label="Primary actions">
          <a class="primary" href="https://infinitewindows.com/contact" target="_blank" rel="noopener noreferrer" data-track="request_consultation">Request a consultation <b>→</b></a>
          <a href="https://infinitewindows.com/?atlas=open" target="_blank" rel="noopener noreferrer" data-track="ask_atlas">Ask Atlas — our studio assistant <b>↗</b></a>
          <nav aria-label="Contact actions">
            <a href={`/card/${props.profile.id}/vcard`} download="" data-track="save_contact">Save contact</a>
            <a href="tel:+17865183725" data-track="call">Call</a>
            <a href="https://maps.google.com/?q=1612+NW+84th+Ave+Doral+FL+33126" target="_blank" rel="noopener noreferrer" data-track="directions">Directions</a>
            <button type="button" onClick={share}>Share</button>
          </nav>
          <p class="iwc-status" role="status" aria-live="polite">{copied() ? "Link copied" : ""}</p>
        </section>

        <section class="iwc-section iwc-practices" aria-labelledby="iwc-practices">
          <p class="iwc-kicker">01 — Two practices, one studio</p>
          <h2 id="iwc-practices">Two fronts of the same work —<br />the house on the water, and the tower on the skyline.</h2>
          <div class="iwc-practice-grid">
            <a href="https://infinitewindows.com/residential" target="_blank" rel="noopener noreferrer">
              <small>For homeowners · architects · designers</small><h3>Residential</h3>
              <p>Waterfront estates, historic renovations, custom single-family.</p><b>Explore residential →</b>
            </a>
            <a href="https://infinitewindows.com/commercial" target="_blank" rel="noopener noreferrer">
              <small>For developers · general contractors</small><h3>Commercial</h3>
              <p>High-rise residential, hospitality, mixed-use, institutional.</p><b>Explore commercial →</b>
            </a>
          </div>
        </section>

        <section class="iwc-section" aria-labelledby="iwc-work">
          <p class="iwc-kicker">Recent work</p>
          <h2 id="iwc-work">A few of the houses, and towers, you might remember.</h2>
          <div class="iwc-work-grid">
            <For each={WORK}>{(item, index) => (
              <button type="button" onClick={(e) => openWork(index(), e)} aria-label={`Open ${item.title.en}`}>
                <img src={item.src} alt={item.alt.en} width={item.width} height={item.height} loading={index() > 1 ? "lazy" : "eager"} />
                <span><small>{item.detail?.en}</small><strong>{item.title.en}</strong></span>
              </button>
            )}</For>
          </div>
          <a class="iwc-wide-link" href="https://infinitewindows.com/projects" target="_blank" rel="noopener noreferrer">Full portfolio <b>→</b></a>
        </section>

        <section class="iwc-platform" aria-labelledby="iwc-platform">
          <p>The Infinite difference</p>
          <h2 id="iwc-platform">Twenty-one years of craft.<br />The operating system to match.</h2>
          <p>After two decades of building homes and towers, we built the software that runs them behind the scenes.</p>
          <div>
            <a href="https://infinitewindows.ai/" target="_blank" rel="noopener noreferrer">Client portal →</a>
            <a href="https://infinitewindows.com/platform" target="_blank" rel="noopener noreferrer">Explore the platform →</a>
            <a href="https://infinitewindows.com/maintenance" target="_blank" rel="noopener noreferrer">Maintenance →</a>
            <a href="https://infinitewindows.com/iwin" target="_blank" rel="noopener noreferrer">iWin · IW1000–IW4000 →</a>
          </div>
        </section>

        <section class="iwc-section iwc-contact" aria-labelledby="iwc-contact">
          <p class="iwc-kicker">Let's begin</p><h2 id="iwc-contact">Tell us about your project.<br />We'll take it from there.</h2>
          <a class="iwc-wide-link gold" href="https://infinitewindows.com/contact" target="_blank" rel="noopener noreferrer">Request a consultation <b>→</b></a>
          <dl>
            <div><dt>Visit</dt><dd>1612 NW 84th Ave<br />Doral, FL 33126</dd></div>
            <div><dt>Call</dt><dd><a href="tel:+17865183725">786 · 518 · 3725</a></dd></div>
            <div><dt>Write</dt><dd><a href="mailto:laura@infinitewindows.email">laura@infinitewindows.email</a></dd></div>
          </dl>
          <a class="iwc-linkedin" href="https://www.linkedin.com/company/infinite-windows-llc" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
        </section>

        <section class="iwc-share" aria-labelledby="iwc-share">
          <div><p>Share this card</p><h2 id="iwc-share">Infinite Windows</h2><span>Scan to open this digital card.</span></div>
          <img src="/card/qr-infinite-windows.svg" alt="QR code opening the Infinite Windows digital card" width="184" height="184" />
        </section>

        <footer class="iwc-footer">
          <img src={`${A}/logo-white.png`} alt="Infinite Windows" width="872" height="258" />
          <p>Hurricane-impact windows, doors, and architectural fabrication for South Florida's most significant residential and commercial projects. Since 2005.</p>
          <small>Digital card by <a href="https://www.305webservice.com/">305 Web Service</a></small>
        </footer>
      </main>
      <MagicBox items={WORK} activeIndex={active()} lang="en" accent="#c7a25d" returnFocus={returnFocus()}
        onChange={setActive} onClose={() => setActive(null)} />
    </div>
  );
}
