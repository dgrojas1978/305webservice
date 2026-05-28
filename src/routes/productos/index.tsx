import { Title, Meta } from "@solidjs/meta";
import { For, createSignal } from "solid-js";
import Header from "~/components/layout/Header";
import Footer from "~/components/layout/Footer";
import ProductCard from "~/components/sections/ProductCard";
import CTABanner from "~/components/sections/CTABanner";
import { products } from "~/data/products";

const categories = ["Todos", ...new Set(products.map((p) => p.category))];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = createSignal("Todos");

  const filtered = () =>
    activeCategory() === "Todos"
      ? products
      : products.filter((p) => p.category === activeCategory());

  return (
    <>
      <Title>Productos — 305 Web Service</Title>
      <Meta
        name="description"
        content="Catálogo de productos de 305 Web Service: Venta POS, Calentico y más. Software listo para implementar en tu negocio."
      />

      <Header />
      <main>
        {/* Page header */}
        <section class="bg-dark-section pt-28 pb-16 relative overflow-hidden">
          <div class="absolute inset-0 bg-grid" />
          <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p class="text-brand-accent text-sm font-semibold uppercase tracking-widest mb-3">
              Catálogo de productos
            </p>
            <h1 class="text-4xl sm:text-5xl font-black text-white mb-4">
              Software listo para tu negocio
            </h1>
            <p class="text-slate-400 text-lg max-w-2xl mx-auto">
              Soluciones probadas en negocios reales. Elige el producto que resuelve tu problema o combínalos para una solución completa.
            </p>
          </div>
        </section>

        {/* Filter + Grid */}
        <section class="bg-dark-section py-12">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category filter */}
            <div class="flex flex-wrap gap-2 mb-8">
              <For each={categories}>
                {(cat) => (
                  <button
                    class={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeCategory() === cat
                        ? "bg-brand-blue text-white"
                        : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10"
                    }`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                )}
              </For>
            </div>

            {/* Products grid */}
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <For each={filtered()}>
                {(product) => <ProductCard product={product} />}
              </For>
            </div>

            {/* Empty state */}
            {filtered().length === 0 && (
              <div class="text-center py-20">
                <p class="text-slate-400">No hay productos en esta categoría aún.</p>
              </div>
            )}
          </div>
        </section>

        {/* Services callout */}
        <section class="py-12 bg-white border-b border-slate-100">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="bg-slate-50 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6 justify-between border border-slate-100">
              <div>
                <h3 class="text-xl font-bold text-slate-900 mb-2">
                  ¿No encuentras lo que buscas?
                </h3>
                <p class="text-slate-500">
                  También desarrollamos software a medida. Cuéntanos tu problema y lo resolvemos.
                </p>
              </div>
              <a
                href="/servicios"
                class="flex-shrink-0 px-6 py-3 rounded-xl bg-brand-blue hover:bg-blue-500 text-white font-semibold transition-all hover:-translate-y-0.5"
              >
                Ver servicios a medida
              </a>
            </div>
          </div>
        </section>

        <CTABanner
          title="¿Tienes dudas sobre cuál producto necesitas?"
          subtitle="Agenda una llamada de 20 minutos sin costo. Te ayudamos a elegir la solución correcta para tu negocio."
        />
      </main>
      <Footer />
    </>
  );
}
