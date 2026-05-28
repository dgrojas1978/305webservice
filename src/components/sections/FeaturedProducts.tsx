import { For } from "solid-js";
import { A } from "@solidjs/router";
import SectionWrapper from "~/components/ui/SectionWrapper";
import ProductCard from "./ProductCard";
import { getHighlightedProducts } from "~/data/products";

export default function FeaturedProducts() {
  const highlighted = getHighlightedProducts();

  return (
    <SectionWrapper id="productos" class="bg-dark-section">
      <div class="text-center mb-12">
        <p class="text-brand-accent text-sm font-semibold uppercase tracking-widest mb-3">
          Nuestros productos
        </p>
        <h2 class="text-3xl sm:text-4xl font-black text-white mb-4">
          Soluciones listas para tu negocio
        </h2>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">
          Software probado en negocios reales. Implementación rápida, soporte incluido y resultados desde el primer mes.
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-6 mb-10">
        <For each={highlighted}>
          {(product) => <ProductCard product={product} />}
        </For>
      </div>

      <div class="text-center">
        <A
          href="/productos"
          class="inline-flex items-center gap-2 text-brand-accent hover:text-blue-300 font-medium transition-colors"
        >
          Ver catálogo completo
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </A>
      </div>
    </SectionWrapper>
  );
}
