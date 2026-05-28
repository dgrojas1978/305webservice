import { A, useLocation } from "@solidjs/router";
import { createSignal, onMount, onCleanup, Show } from "solid-js";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/precios", label: "Precios" },
  { href: "/demo", label: "Demo" },
  { href: "/servicios", label: "Servicios" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  const location = useLocation();
  const [scrolled, setScrolled] = createSignal(false);
  const [menuOpen, setMenuOpen] = createSignal(false);

  onMount(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onCleanup(() => window.removeEventListener("scroll", onScroll));
  });

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  return (
    <header
      class={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled()
          ? "bg-[#030B1A]/95 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <A href="/" class="flex items-center gap-2 group">
            <div class="flex items-center">
              <span class="text-2xl font-black text-white tracking-tight">
                <span class="text-brand-accent">305</span>
                <span class="text-white/90"> Web</span>
              </span>
              <span class="ml-1 text-xs font-semibold text-brand-emeraldLight bg-brand-emeraldLight/10 border border-brand-emeraldLight/20 px-2 py-0.5 rounded-full">
                Service
              </span>
            </div>
          </A>

          {/* Desktop nav */}
          <nav class="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <A
                href={link.href}
                class={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive(link.href)
                    ? "text-white bg-white/10"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </A>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div class="hidden md:flex items-center gap-3">
            <A
              href="/contacto"
              class="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Solicitar cotización
            </A>
            <A
              href="/contacto?motivo=demo"
              class="px-4 py-2 rounded-xl bg-brand-blue hover:bg-blue-500 text-white text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
            >
              Solicitar Demo
            </A>
          </div>

          {/* Mobile menu button */}
          <button
            class="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen())}
            aria-label="Menu"
          >
            <Show when={!menuOpen()} fallback={
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            }>
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Show>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <Show when={menuOpen()}>
        <div class="md:hidden bg-[#030B1A]/98 backdrop-blur-xl border-t border-white/5">
          <div class="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <A
                href={link.href}
                onClick={() => setMenuOpen(false)}
                class={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-white bg-white/10"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </A>
            ))}
            <div class="pt-3 border-t border-white/5 mt-3">
              <A
                href="/contacto?motivo=demo"
                onClick={() => setMenuOpen(false)}
                class="block w-full text-center px-4 py-3 rounded-xl bg-brand-blue hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
              >
                Solicitar Demo Gratis
              </A>
            </div>
          </div>
        </div>
      </Show>
    </header>
  );
}
