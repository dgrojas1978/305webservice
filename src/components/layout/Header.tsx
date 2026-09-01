import { A } from "@solidjs/router";
import { createSignal, onCleanup, onMount, Show, For } from "solid-js";
import { C } from "~/data/content";
import { PATHS, altPath, otherLocale, type Locale, type PageKey } from "~/lib/i18n";
import { WhatsAppIcon } from "~/components/ui/Button";
import { waQuote } from "~/lib/links";

interface Props {
  locale: Locale;
  page: PageKey;
}

/**
 * Header comercial: transparente sobre el hero → barra navy compacta al scroll.
 * Servicios en dropdown accesible (desktop) y menú full-screen numerado (móvil).
 */
export default function Header(props: Props) {
  const t = () => C[props.locale];
  const [scrolled, setScrolled] = createSignal(false);
  const [open, setOpen] = createSignal(false);
  const [svcOpen, setSvcOpen] = createSignal(false);

  let toggleRef: HTMLButtonElement | undefined;
  let overlayRef: HTMLDivElement | undefined;
  let svcTimer: number | undefined;

  onMount(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    onCleanup(() => window.removeEventListener("scroll", onScroll));
  });

  function openMenu() {
    setOpen(true);
    document.documentElement.style.overflow = "hidden";
    queueMicrotask(() => overlayRef?.querySelector<HTMLElement>("a, button")?.focus());
  }
  function closeMenu(returnFocus = true) {
    setOpen(false);
    document.documentElement.style.overflow = "";
    if (returnFocus) toggleRef?.focus();
  }
  function onOverlayKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") { e.preventDefault(); closeMenu(); return; }
    if (e.key === "Tab" && overlayRef) {
      const f = overlayRef.querySelectorAll<HTMLElement>("a, button");
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
  onCleanup(() => { if (typeof document !== "undefined") document.documentElement.style.overflow = ""; });

  const servicesMenu = (): { key: PageKey; label: string }[] => [
    { key: "websitePackages", label: t().nav.websitePackages },
    { key: "customSoftware", label: t().nav.customSoftware },
    { key: "automation", label: props.locale === "es" ? "Marketing y Automatización" : "Marketing & Automation" },
    { key: "itInfrastructure", label: props.locale === "es" ? "Infraestructura IT" : "IT Infrastructure" },
    { key: "nfc", label: t().nav.nfc },
  ];
  const rightNav = (): { key: PageKey; label: string }[] => [
    { key: "industries", label: t().nav.industries },
    { key: "process", label: t().nav.process },
    { key: "about", label: t().nav.about },
    { key: "contact", label: t().nav.contact },
  ];
  const mobileItems = (): { key: PageKey; label: string }[] => [
    { key: "services", label: t().nav.services },
    { key: "websitePackages", label: t().nav.websitePackages },
    { key: "customSoftware", label: t().nav.customSoftware },
    { key: "nfc", label: t().nav.nfc },
    { key: "industries", label: t().nav.industries },
    { key: "process", label: t().nav.process },
    { key: "about", label: t().nav.about },
    { key: "contact", label: t().nav.contact },
  ];

  return (
    <header
      data-surface="navy"
      class={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow] duration-300 ease-editorial ${
        scrolled() ? "bg-navy shadow-[0_1px_0_rgba(247,249,252,0.12)]" : "bg-navy/85 backdrop-blur-sm"
      }`}
    >
      <div class="container-site">
        <div class={`flex items-center justify-between transition-[height] duration-300 ease-editorial ${scrolled() ? "h-16" : "h-18 md:h-20"}`}>
          <A href={PATHS.home[props.locale]} class="text-[0.95rem] font-black uppercase tracking-tight text-paper" aria-label="305 Web Service">
            <span class="text-blue-navy">305</span> Web Service
          </A>

          <nav class="hidden items-center gap-7 lg:flex" aria-label="Main">
            {/* Services dropdown */}
            <div
              class="relative"
              onMouseEnter={() => { clearTimeout(svcTimer); setSvcOpen(true); }}
              onMouseLeave={() => { svcTimer = window.setTimeout(() => setSvcOpen(false), 120); }}
            >
              <A
                href={PATHS.services[props.locale]}
                class="link-underline micro-caps text-on-navy hover:text-paper"
                aria-haspopup="true"
                aria-expanded={svcOpen()}
                onFocus={() => setSvcOpen(true)}
              >
                {t().nav.services} ▾
              </A>
              <Show when={svcOpen()}>
                <div class="absolute left-0 top-full w-64 pt-3">
                  <div class="overflow-hidden rounded-xl border border-hairline bg-white py-2 shadow-[0_18px_44px_rgba(7,20,38,0.16)]">
                    <For each={servicesMenu()}>
                      {(s) => (
                        <A href={PATHS[s.key][props.locale]} class="block px-5 py-2.5 text-sm font-semibold text-navy hover:bg-paper hover:text-blue" onClick={() => setSvcOpen(false)}>
                          {s.label}
                        </A>
                      )}
                    </For>
                  </div>
                </div>
              </Show>
            </div>

            <For each={rightNav()}>
              {(item) => (
                <A href={PATHS[item.key][props.locale]} class="link-underline micro-caps text-on-navy hover:text-paper">{item.label}</A>
              )}
            </For>

            <a href={altPath(props.page, props.locale)} class="link-underline micro-caps text-on-navy-faint hover:text-paper" aria-label={t().langSwitch.toOther}>
              {otherLocale(props.locale).toUpperCase()}
            </a>
            <a href={waQuote(props.locale)} target="_blank" rel="noopener noreferrer" class="flex h-9 w-9 items-center justify-center rounded-full text-turquoise hover:bg-[rgba(32,215,197,0.12)]" aria-label={t().nav.whatsapp}>
              <WhatsAppIcon class="h-5 w-5" />
            </a>
            <A href={PATHS.contact[props.locale]} class="btn btn-primary !min-h-[40px] !px-5 !py-2" data-track="header_cta_click">{t().nav.cta}</A>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            class="micro-caps flex min-h-[44px] min-w-[44px] items-center justify-center text-paper lg:hidden"
            aria-expanded={open()}
            aria-controls="mobile-menu"
            onClick={() => (open() ? closeMenu() : openMenu())}
          >
            {open() ? t().nav.menuClose : "Menu"}
          </button>
        </div>
      </div>

      <Show when={open()}>
        <div id="mobile-menu" ref={overlayRef} role="dialog" aria-modal="true" aria-label={t().nav.menuOpen} class="fixed inset-0 z-50 overflow-y-auto bg-navy lg:hidden" onKeyDown={onOverlayKeydown}>
          <div class="container-site flex min-h-full flex-col">
            <div class="flex h-16 items-center justify-between">
              <span class="text-[0.95rem] font-black uppercase tracking-tight text-paper"><span class="text-blue-navy">305</span> Web Service</span>
              <button type="button" class="micro-caps flex min-h-[44px] min-w-[44px] items-center justify-center text-paper" onClick={() => closeMenu()}>{t().nav.menuClose}</button>
            </div>
            <nav class="mt-6 flex-1" aria-label="Mobile">
              <ul>
                <For each={mobileItems()}>
                  {(item, i) => (
                    <li class="menu-item-in border-b border-[rgba(247,249,252,0.12)]" style={{ "animation-delay": `${i() * 50}ms` }}>
                      <A href={PATHS[item.key][props.locale]} class="group flex items-center gap-5 py-4 text-paper" onClick={() => closeMenu(false)}>
                        <span class="h-[3px] w-5 shrink-0 bg-turquoise transition-all duration-200 ease-editorial group-hover:w-8" aria-hidden="true" />
                        <span class="text-2xl font-black uppercase tracking-tight">{item.label}</span>
                      </A>
                    </li>
                  )}
                </For>
              </ul>
            </nav>
            <div class="flex flex-col gap-4 py-8">
              <A href={PATHS.contact[props.locale]} class="btn btn-primary w-full" onClick={() => closeMenu(false)}>{t().nav.cta}</A>
              <div class="flex items-center justify-between">
                <a href={altPath(props.page, props.locale)} class="link-underline micro-caps text-on-navy">{t().langSwitch.toOther}</a>
                <span class="micro-caps text-on-navy-faint">Miami · FL</span>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </header>
  );
}
