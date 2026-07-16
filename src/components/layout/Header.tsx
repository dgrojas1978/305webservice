import { A, useLocation } from "@solidjs/router";
import { createSignal, createEffect, onMount, onCleanup, Show, For } from "solid-js";
import { NAV_LINKS, waLink, WA_DEFAULT_MESSAGE } from "~/lib/site";
import { WhatsAppIcon } from "~/components/ui/Button";

export function Logo() {
  return (
    <span class="inline-flex items-baseline gap-1.5 text-xl font-extrabold tracking-tight">
      <span class="text-brand-blue">305</span>
      <span class="text-ink">Web Service</span>
    </span>
  );
}

export default function Header() {
  const location = useLocation();
  const [scrolled, setScrolled] = createSignal(false);
  const [menuOpen, setMenuOpen] = createSignal(false);

  onMount(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    onCleanup(() => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    });
  });

  // Close the mobile menu on navigation
  createEffect(() => {
    location.pathname;
    setMenuOpen(false);
  });

  const isActive = (href: string) => location.pathname === href;

  return (
    <header
      class={`sticky top-0 z-50 bg-white/95 backdrop-blur transition-shadow ${
        scrolled() || menuOpen() ? "border-b border-surface-line shadow-sm" : ""
      }`}
    >
      <div class="mx-auto flex h-16 w-full max-w-content items-center justify-between px-4 sm:px-6 lg:h-[4.5rem] lg:px-8">
        {/* Logo */}
        <A href="/" class="rounded-md">
          <Logo />
        </A>

        {/* Desktop nav */}
        <nav class="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          <For each={NAV_LINKS}>
            {(link) => (
              <A
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                class={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-brand-blue"
                    : "text-ink-soft hover:bg-surface-muted hover:text-ink"
                }`}
              >
                {link.label}
              </A>
            )}
          </For>
        </nav>

        {/* Desktop CTA */}
        <div class="hidden items-center gap-3 lg:flex">
          <a
            href={waLink(WA_DEFAULT_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-positive hover:bg-positive-soft transition-colors"
          >
            <WhatsAppIcon class="h-4 w-4" />
            WhatsApp
          </a>
          <A
            href="/contact"
            class="rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blueDark"
          >
            Request a Quote
          </A>
        </div>

        {/* Mobile: WhatsApp + menu button */}
        <div class="flex items-center gap-1 lg:hidden">
          <a
            href={waLink(WA_DEFAULT_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            class="flex h-11 w-11 items-center justify-center rounded-lg text-positive hover:bg-positive-soft transition-colors"
          >
            <WhatsAppIcon class="h-5 w-5" />
          </a>
          <button
            type="button"
            class="flex h-11 w-11 items-center justify-center rounded-lg text-ink-soft hover:bg-surface-muted transition-colors"
            aria-expanded={menuOpen()}
            aria-controls="mobile-menu"
            aria-label={menuOpen() ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen(!menuOpen())}
          >
            <Show
              when={!menuOpen()}
              fallback={
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </Show>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <Show when={menuOpen()}>
        <nav
          id="mobile-menu"
          aria-label="Main navigation"
          class="border-t border-surface-line bg-white lg:hidden"
        >
          <div class="space-y-1 px-4 py-4">
            <For each={NAV_LINKS}>
              {(link) => (
                <A
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  class={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-brand-blueSoft text-brand-blue"
                      : "text-ink-soft hover:bg-surface-muted"
                  }`}
                >
                  {link.label}
                </A>
              )}
            </For>
            <div class="pt-3">
              <A
                href="/contact"
                class="block w-full rounded-xl bg-brand-blue px-4 py-3.5 text-center text-base font-semibold text-white transition-colors hover:bg-brand-blueDark"
              >
                Request a Quote
              </A>
            </div>
          </div>
        </nav>
      </Show>
    </header>
  );
}
