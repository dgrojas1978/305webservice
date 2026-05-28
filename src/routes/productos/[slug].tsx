import { Title, Meta } from "@solidjs/meta";
import { useParams } from "@solidjs/router";
import { Show } from "solid-js";
import Header from "~/components/layout/Header";
import Footer from "~/components/layout/Footer";
import ProductHero from "~/components/product/ProductHero";
import FeaturesList from "~/components/product/FeaturesList";
import ModulesList from "~/components/product/ModulesList";
import BenefitsList from "~/components/product/BenefitsList";
import ProductFAQ from "~/components/product/ProductFAQ";
import PricingSection from "~/components/product/PricingSection";
import CTABanner from "~/components/sections/CTABanner";
import DownloadsSection from "~/components/product/DownloadsSection";
import { getProductBySlug, getWhatsAppUrl } from "~/data/products";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const product = () => getProductBySlug(params.slug);

  return (
    <Show
      when={product()}
      fallback={
        <>
          <Header />
          <main class="min-h-screen bg-dark-section flex items-center justify-center">
            <div class="text-center">
              <h1 class="text-4xl font-black text-white mb-4">Producto no encontrado</h1>
              <p class="text-slate-400 mb-6">El producto que buscas no existe.</p>
              <a href="/productos" class="px-6 py-3 bg-brand-blue text-white rounded-xl font-semibold">
                Ver todos los productos
              </a>
            </div>
          </main>
          <Footer />
        </>
      }
    >
      {(p) => (
        <>
          <Title>{p().name} — 305 Web Service</Title>
          <Meta name="description" content={p().shortDescription} />
          <Meta property="og:title" content={`${p().name} — ${p().tagline}`} />
          <Meta property="og:description" content={p().shortDescription} />

          <Header />
          <main>
            <ProductHero product={p()} />
            <DownloadsSection product={p()} />

            {/* Use cases */}
            <section class="py-12 bg-white">
              <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-8">
                  <p class="text-brand-blue text-sm font-semibold uppercase tracking-widest mb-2">Casos de uso</p>
                  <h2 class="text-3xl font-black text-slate-900">¿Para quién es {p().name}?</h2>
                </div>
                <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {p().useCases.map((uc) => (
                    <div class="p-5 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-100 hover:bg-blue-50/20 transition-colors">
                      <span class="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full mb-3">
                        {uc.industry}
                      </span>
                      <h3 class="font-bold text-slate-900 mb-2">{uc.title}</h3>
                      <p class="text-slate-500 text-sm leading-relaxed">{uc.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <FeaturesList product={p()} />
            <ModulesList product={p()} />
            <BenefitsList product={p()} />
            <PricingSection product={p()} />
            <ProductFAQ product={p()} />

            {/* Final CTA */}
            <section class="py-12 bg-white">
              <div class="max-w-2xl mx-auto px-4 text-center">
                <h2 class="text-2xl font-black text-slate-900 mb-4">
                  ¿Listo para probar {p().name}?
                </h2>
                <p class="text-slate-500 mb-6">
                  Solicita una demo gratuita de 30 minutos. Te mostramos el sistema en vivo con datos reales de tu industria.
                </p>
                <div class="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={`/contacto?producto=${p().slug}&motivo=demo`}
                    class="px-6 py-3 bg-brand-blue hover:bg-blue-500 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5"
                  >
                    Solicitar demo gratis
                  </a>
                  <a
                    href={getWhatsAppUrl(p().name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-xl transition-colors"
                  >
                    Preguntar por WhatsApp
                  </a>
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </>
      )}
    </Show>
  );
}
