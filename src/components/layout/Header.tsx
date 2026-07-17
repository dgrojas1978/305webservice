import { A } from "@solidjs/router";
import { createSignal, onCleanup, onMount, Show, For } from "solid-js";
import { C } from "~/data/content";
import { PATHS, altPath, otherLocale, type Locale, type PageKey } from "~/lib/i18n";

interface Props {
  locale: Locale;
  page: PageKey;
}

/**
 * Header «Monumento 305»:
 * - transparente sobre el hero; al hacer scroll, barra navy compacta con hairline.
 * - móvil: menú full-screen navy con enlaces grandes, stagger breve,
 *   Escape para cerrar, scroll bloqueado y foco gestionado.
 */
export default function Header(props: Props) {
  const t = () => C[props.locale];
  const [scrolled, setScrolled] = createSignal(false);
  const [open, setOpen] = createSignal(false);

  let toggleRef: HTMLButtonElement | undefined;
  let overlayRef: HTMLDivElement | undefined;

  onMount(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    onCleanup(() => window.removeEventListener("scroll", onScroll));
  });

  function openMenu() {
    setOpen(true);
    document.documentElement.style.overflow = "hidden";
    queueMicrotask(() => {
      overlayRef?.querySelector<HTMLElement>("a, button")?.focus();
    });
  }

  function closeMenu(returnFocus = true) {
    setOpen(false);
    document.documentElement.style.overflow = "";
    if (returnFocus) toggleRef?.focus();
  }

  function onOverlayKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeMenu();
      return;
    }
    if (e.key === "Tab" && overlayRef) {
      // trap de foco simple dentro del menú
      const focusables = overlayRef.querySelectorAll<HTMLElement>("a, button");
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  onCleanup(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.overflow = "";
    }
  });

  const navItems = () => [
    { href: PATHS.services[props.locale], label: t().nav.services },
    { href: PATHS.process[props.locale], label: t().nav.process },
    { href: PATHS.about[props.locale], label: t().nav.about },
  ];

  const mobileItems = () => [
    ...navItems(),
    { href: PATHS.contact[props.locale], label: t().nav.contact },
  ];

  const switchHref = () => altPath(props.page, props.locale);
  const switchLabel = () => otherLocale(props.locale).toUpperCase();

  return (
    <header
      data-surface="navy"
      class={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow] duration-300 ease-editorial ${
        scrolled() ? "bg-navy shadow-[0_1px_0_rgba(247,249,252,0.12)]" : "bg-transparent"
      }`}
    >
      <div class="container-site">
        <div
          class={`flex items-center justify-between transition-[height] duration-300 ease-editorial ${
            scrolled() ? "h-16" : "h-20 md:h-24"
          }`}
        >
          {/* wordmark */}
          <A
            href={PATHS.home[props.locale]}
            class="micro-caps text-paper"
            aria-label="305 Web Service"
          >
            305 Web Service
          </A>

          {/* nav desktop */}
          <nav class="hidden items-center gap-8 md:flex" aria-label="Main">
            <For each={navItems()}>
              {(item) => (
                <A href={item.href} class="link-underline micro-caps text-on-navy hover:text-paper">
                  {item.label}
                </A>
              )}
            </For>
            <a
              href={switchHref()}
              class="link-underline micro-caps text-on-navy-faint hover:text-paper"
              aria-label={t().langSwitch.toOther}
            >
              {switchLabel()}
            </a>
            <A href={PATHS.contact[props.locale]} class="btn btn-primary !min-h-[40px] !px-5 !py-2">
              {t().nav.cta}
            </A>
          </nav>

          {/* botón menú móvil */}
          <button
            ref={toggleRef}
            type="button"
            class="micro-caps flex min-h-[44px] min-w-[44px] items-center justify-center text-paper md:hidden"
            aria-expanded={open()}
            aria-controls="mobile-menu"
            onClick={() => (open() ? closeMenu() : openMenu())}
          >
            {open() ? t().nav.menuClose : "Menu"}
          </button>
        </div>
      </div>

      {/* menú móvil full-screen */}
      <Show when={open()}>
        <div
          id="mobile-menu"
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label={t().nav.menuOpen}
          class="fixed inset-0 z-50 bg-navy md:hidden"
          onKeyDown={onOverlayKeydown}
        >
          <div class="container-site flex h-full flex-col">
            <div class="flex h-20 items-center justify-between">
              <span class="micro-caps text-paper">305 Web Service</span>
              <button
                type="button"
                class="micro-caps flex min-h-[44px] min-w-[44px] items-center justify-center text-paper"
                onClick={() => closeMenu()}
              >
                {t().nav.menuClose}
              </button>
            </div>

            <nav class="mt-10 flex-1" aria-label="Mobile">
              <ul>
                <For each={mobileItems()}>
                  {(item, i) => (
                    <li
                      class="menu-item-in border-b border-[rgba(247,249,252,0.12)]"
                      style={{ "animation-delay": `${i() * 60}ms` }}
                    >
                      <A
                        href={item.href}
                        class="group flex items-center gap-5 py-5 text-paper"
                        onClick={() => closeMenu(false)}
                      >
                        <span class="h-[3px] w-5 shrink-0 bg-turquoise transition-all duration-200 ease-editorial group-hover:w-8" aria-hidden="true" />
                        <span class="text-3xl font-black uppercase tracking-tight">
                          {item.label}
                        </span>
                      </A>
                    </li>
                  )}
                </For>
              </ul>
            </nav>

            <div class="flex items-center justify-between pb-10">
              <a
                href={switchHref()}
                class="link-underline micro-caps text-on-navy"
                aria-label={t().langSwitch.toOther}
              >
                {t().langSwitch.toOther}
              </a>
              <span class="micro-caps text-on-navy-faint">Miami · FL</span>
            </div>
          </div>
        </div>
      </Show>
    </header>
  );
}
