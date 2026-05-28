import { A } from "@solidjs/router";
import { For } from "solid-js";
import type { Product } from "~/types";
import Badge from "~/components/ui/Badge";
import { getWhatsAppUrl } from "~/data/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard(props: ProductCardProps) {
  const p = props.product;
  const whatsappUrl = getWhatsAppUrl(p.name);

  return (
    <div class="card-dark p-6 flex flex-col h-full group">
      {/* Header */}
      <div class="flex items-start justify-between mb-4">
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
          style={`background: linear-gradient(135deg, ${p.colorFrom}, ${p.colorTo});`}
        >
          <ProductIcon name={p.icon} />
        </div>
        {p.isHighlighted && (
          <Badge variant="emerald">Destacado</Badge>
        )}
        {p.status === "coming-soon" && (
          <Badge variant="gray">Próximamente</Badge>
        )}
      </div>

      {/* Category */}
      <div class="mb-2">
        <Badge variant="blue">{p.category}</Badge>
      </div>

      {/* Name + tagline */}
      <h3 class="text-xl font-bold text-white mb-2 group-hover:text-brand-glow transition-colors">
        {p.name}
      </h3>
      <p class="text-slate-400 text-sm leading-relaxed mb-4 flex-1">
        {p.shortDescription}
      </p>

      {/* Tags */}
      <div class="flex flex-wrap gap-1.5 mb-5">
        <For each={p.tags.slice(0, 4)}>
          {(tag) => (
            <span class="px-2 py-0.5 text-xs rounded-md bg-white/5 text-slate-400 border border-white/5">
              {tag}
            </span>
          )}
        </For>
      </div>

      {/* Key benefits */}
      <div class="space-y-1.5 mb-6">
        <For each={p.benefits.slice(0, 3)}>
          {(benefit) => (
            <div class="flex items-center gap-2 text-sm text-slate-400">
              <span class="text-brand-emeraldLight text-xs">✓</span>
              {benefit.title}
            </div>
          )}
        </For>
      </div>

      {/* CTAs */}
      <div class="flex gap-2 mt-auto">
        <A
          href={`/productos/${p.slug}`}
          class="flex-1 text-center px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white text-sm font-medium transition-all duration-200"
        >
          Ver detalles
        </A>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="flex-1 text-center px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
          style={`background: linear-gradient(135deg, ${p.colorFrom}, ${p.colorTo});`}
        >
          Solicitar demo
        </a>
      </div>
    </div>
  );
}

function ProductIcon(props: { name: string }) {
  const icons: Record<string, string> = {
    ShoppingCart: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
    Calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  };

  const path = icons[props.name] || icons.ShoppingCart;

  return (
    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={1.8}>
      <path stroke-linecap="round" stroke-linejoin="round" d={path} />
    </svg>
  );
}
