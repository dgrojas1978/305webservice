import { A } from "@solidjs/router";
import { Show } from "solid-js";
import type { Product } from "~/types";
import Badge from "~/components/ui/Badge";
import { getWhatsAppUrl } from "~/data/products";
import { iconPaths } from "~/components/ui/iconPaths";

interface ProductHeroProps {
  product: Product;
}

export default function ProductHero(props: ProductHeroProps) {
  const p = props.product;
  const whatsapp = getWhatsAppUrl(p.name);

  return (
    <section class="relative bg-dark-section overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-20">
      <div class="absolute inset-0 bg-grid" />
      <div
        class="absolute inset-0"
        style={`background: radial-gradient(ellipse at 30% 50%, ${p.colorFrom}20 0%, transparent 60%)`}
      />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <div class="flex items-center gap-2 mb-4">
              <Badge variant="blue">{p.category}</Badge>
              {p.isHighlighted && <Badge variant="emerald">Destacado</Badge>}
            </div>

            <div
              class="inline-flex items-center gap-3 mb-6"
            >
              <div
                class="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
                style={`background: linear-gradient(135deg, ${p.colorFrom}, ${p.colorTo})`}
              >
                <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={1.8}>
                  <path stroke-linecap="round" stroke-linejoin="round" d={iconPaths[p.icon] || iconPaths.ShoppingCart} />
                </svg>
              </div>
              <h1 class="text-4xl sm:text-5xl font-black text-white">{p.name}</h1>
            </div>

            <p class="text-xl text-brand-glow font-semibold mb-4">{p.tagline}</p>
            <p class="text-slate-400 text-lg leading-relaxed mb-8">{p.shortDescription}</p>

            {/* Problem callout */}
            <div class="bg-white/3 border border-white/8 rounded-xl p-4 mb-8">
              <p class="text-xs text-brand-accent font-semibold uppercase tracking-wide mb-2">El problema que resuelve</p>
              <p class="text-slate-300 text-sm leading-relaxed">{p.problem}</p>
            </div>

            <div class="flex flex-col sm:flex-row gap-3">
              <Show
                when={p.demoUrl}
                fallback={
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 font-bold text-white rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                    style={`background: linear-gradient(135deg, ${p.colorFrom}, ${p.colorTo})`}
                  >
                    Solicitar demo gratis
                  </a>
                }
              >
                <a
                  href={p.demoUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 font-bold text-white rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                  style={`background: linear-gradient(135deg, ${p.colorFrom}, ${p.colorTo})`}
                >
                  {p.ctaLabel ?? "Ver en vivo →"}
                </a>
              </Show>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold rounded-xl transition-all duration-200"
              >
                Solicitar info
              </a>
            </div>
          </div>

          {/* Right: screenshot placeholder */}
          <div class="relative">
            <div
              class="rounded-2xl overflow-hidden border border-white/10 shadow-card-dark"
              style={`background: linear-gradient(135deg, ${p.colorFrom}15, ${p.colorTo}10, #071426)`}
            >
              <div class="bg-[#0A1628] px-4 py-3 border-b border-white/5 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <div class="w-3 h-3 rounded-full bg-red-500/50" />
                  <div class="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div class="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div class="flex-1 ml-2 bg-white/5 rounded-md px-3 py-1 text-xs text-slate-500">
                  {p.demoUrl ? p.demoUrl.replace(/^https?:\/\//, "") : `${p.slug}.305webservice.com`}
                </div>
              </div>
              <Show
                when={p.screenshots && p.screenshots.length > 0 && !p.screenshots[0].url.startsWith("/screenshots/placeholder")}
                fallback={
                  <div class="p-8 min-h-[280px] flex flex-col items-center justify-center">
                    <div class="text-center mb-6 opacity-50">
                      <div
                        class="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                        style={`background: linear-gradient(135deg, ${p.colorFrom}40, ${p.colorTo}40)`}
                      >
                        <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={1.5}>
                          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3.75 3h16.5M4.5 3v18M19.5 3v18" />
                        </svg>
                      </div>
                      <p class="text-slate-500 text-sm">Screenshot del producto</p>
                      <p class="text-slate-600 text-xs mt-1">Reemplaza con imágenes reales</p>
                    </div>
                    <div class="flex flex-wrap gap-2 justify-center">
                      {p.features.slice(0, 4).map((f) => (
                        <span class="px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-slate-400">
                          {f.title}
                        </span>
                      ))}
                    </div>
                  </div>
                }
              >
                <img
                  src={p.screenshots![0].url}
                  alt={p.screenshots![0].alt}
                  class="w-full h-auto object-cover"
                  loading="lazy"
                />
              </Show>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
