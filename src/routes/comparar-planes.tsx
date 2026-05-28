import { Title, Meta } from "@solidjs/meta";
import { createSignal, For } from "solid-js";
import { A } from "@solidjs/router";
import Header from "~/components/layout/Header";
import Footer from "~/components/layout/Footer";
import PricingCard from "~/components/pricing/PricingCard";
import BillingToggle from "~/components/pricing/BillingToggle";
import PlanComparison from "~/components/pricing/PlanComparison";
import { plans } from "~/data/plans";
import { getWhatsAppUrl } from "~/data/products";

export default function CompararPlanesPage() {
  const [annual, setAnnual] = createSignal(false);
  const whatsapp = getWhatsAppUrl("Venta POS");

  return (
    <>
      <Title>Comparar planes — Venta POS · 305 Web Service</Title>
      <Meta name="description" content="Compara todos los planes de Venta POS. Básico, Profesional, Restaurante y Enterprise. Tabla detallada de funcionalidades." />

      <Header />
      <main>
        <section class="bg-dark-section pt-28 pb-12 relative overflow-hidden">
          <div class="absolute inset-0 bg-grid" />
          <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <A href="/precios" class="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm mb-6 transition-colors">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M15 19l-7-7 7-7" />
              </svg>
              Ver página de precios
            </A>
            <h1 class="text-4xl sm:text-5xl font-black text-white mb-4">
              Compara todos los planes
            </h1>
            <p class="text-slate-400 text-lg mb-8">
              Cada funcionalidad, cada límite. Todo claro, sin letra pequeña.
            </p>
            <BillingToggle annual={annual()} onChange={setAnnual} />
          </div>
        </section>

        {/* Quick cards */}
        <section class="bg-dark-section py-8 border-b border-white/5">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <For each={plans}>
                {(plan) => <PricingCard plan={plan} annual={annual()} />}
              </For>
            </div>
          </div>
        </section>

        {/* Full table */}
        <PlanComparison />

        {/* CTA */}
        <section class="py-14 bg-white text-center">
          <div class="max-w-xl mx-auto px-4">
            <h2 class="text-2xl font-black text-slate-900 mb-3">¿Aún tienes dudas?</h2>
            <p class="text-slate-500 mb-6">
              Cuéntanos sobre tu negocio y te decimos qué plan se ajusta mejor a lo que necesitas.
            </p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <A
                href="/contacto?motivo=demo&producto=venta-pos"
                class="px-6 py-3 bg-brand-blue hover:bg-blue-500 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5"
              >
                Solicitar demo gratis
              </A>
              <a
                href={whatsapp}
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
  );
}
