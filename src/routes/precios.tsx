import { Title, Meta } from "@solidjs/meta";
import { createSignal, For } from "solid-js";
import { A } from "@solidjs/router";
import Header from "~/components/layout/Header";
import Footer from "~/components/layout/Footer";
import PricingCard from "~/components/pricing/PricingCard";
import BillingToggle from "~/components/pricing/BillingToggle";
import PlanComparison from "~/components/pricing/PlanComparison";
import AddOnsGrid from "~/components/pricing/AddOnsGrid";
import CTABanner from "~/components/sections/CTABanner";
import SectionWrapper from "~/components/ui/SectionWrapper";
import { plans, pricingFAQ } from "~/data/plans";
import { getWhatsAppUrl } from "~/data/products";

export default function PreciosPage() {
  const [annual, setAnnual] = createSignal(false);
  const [openFAQ, setOpenFAQ] = createSignal<number | null>(null);
  const whatsapp = getWhatsAppUrl("Venta POS");

  return (
    <>
      <Title>Precios Venta POS — 305 Web Service</Title>
      <Meta
        name="description"
        content="Planes desde $19/mes. Venta POS para tiendas, restaurantes, bares, ferreterías y más. Prueba gratis 14 días. Funciona sin internet."
      />
      <Meta property="og:title" content="Precios — Venta POS · 305 Web Service" />
      <Meta property="og:description" content="Planes desde $19/mes. Prueba gratis 14 días, sin tarjeta." />

      <Header />
      <main>
        {/* Hero */}
        <section class="bg-dark-section pt-28 pb-16 relative overflow-hidden">
          <div class="absolute inset-0 bg-grid" />
          <div class="absolute inset-0" style="background: radial-gradient(ellipse at 50% -10%, rgba(37,99,235,0.2) 0%, transparent 60%)" />
          <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/20 mb-5">
              <span class="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse-slow" />
              <span class="text-brand-accent text-xs font-semibold tracking-wide">Venta POS — Sistema ERP/POS</span>
            </div>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
              Planes para cada{" "}
              <span class="text-gradient">etapa de tu negocio</span>
            </h1>
            <p class="text-slate-400 text-xl max-w-2xl mx-auto mb-6">
              Sin contratos de permanencia. Cancela cuando quieras.
              <strong class="text-white"> Funciona sin internet.</strong>
            </p>

            {/* Trust pills */}
            <div class="flex flex-wrap justify-center gap-3 mb-10">
              {[
                "✓ 14 días gratis sin tarjeta",
                "✓ Modo offline incluido",
                "✓ Soporte en español",
                "✓ Pago flexible (Zelle, Cash App, transferencia)",
              ].map((t) => (
                <span class="text-sm text-slate-400 flex items-center gap-1">{t}</span>
              ))}
            </div>

            {/* Billing toggle */}
            <BillingToggle annual={annual()} onChange={setAnnual} />
          </div>
        </section>

        {/* Plans grid */}
        <section class="bg-dark-section py-12">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
              <For each={plans}>
                {(plan) => <PricingCard plan={plan} annual={annual()} />}
              </For>
            </div>

            <p class="text-center text-slate-500 text-sm mt-8">
              ¿No sabes cuál elegir?{" "}
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" class="text-brand-accent hover:underline">
                Escríbenos por WhatsApp
              </a>{" "}
              y te recomendamos el plan ideal para tu negocio.
            </p>
          </div>
        </section>

        {/* Offline highlight */}
        <SectionWrapper class="bg-white">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 mb-5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span class="text-emerald-700 text-xs font-bold">Diseñado para Cuba y LATAM</span>
              </div>
              <h2 class="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
                Funciona aunque no haya internet
              </h2>
              <p class="text-slate-500 text-lg leading-relaxed mb-6">
                El corte de internet no para tu negocio. Venta POS corre en tu red local (LAN) y cuando vuelve la conexión, sincroniza todo automáticamente — sin que tengas que hacer nada.
              </p>
              <div class="space-y-3">
                {[
                  { icon: "🔌", title: "Red local (LAN)", desc: "Funciona en tu red sin internet, tan rápido como siempre." },
                  { icon: "🔄", title: "Sincronización automática", desc: "Cuando vuelve internet, los datos se sincronizan solos." },
                  { icon: "💾", title: "Datos siempre seguros", desc: "Backups locales y en la nube. Nunca pierdes información." },
                  { icon: "📱", title: "Activación por código", desc: "Si no hay internet para activar, te enviamos un código por WhatsApp." },
                ].map((item) => (
                  <div class="flex items-start gap-3">
                    <span class="text-xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <span class="font-semibold text-slate-900 text-sm">{item.title}</span>
                      <span class="text-slate-500 text-sm"> — {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div class="bg-gradient-to-br from-[#030B1A] to-[#071426] rounded-2xl p-8 border border-white/8">
              <p class="text-white font-bold mb-4 text-sm">Lo que ve tu equipo cuando no hay internet:</p>
              <div class="bg-[#0A1628] rounded-xl p-4 border border-emerald-500/20 mb-4">
                <div class="flex items-center gap-2 mb-2">
                  <span class="w-2 h-2 rounded-full bg-amber-400" />
                  <span class="text-amber-400 text-xs font-semibold">Modo sin conexión activo</span>
                </div>
                <p class="text-slate-300 text-sm">
                  No hay internet, pero puedes seguir vendiendo. El sistema está funcionando en tu red local. Los datos se sincronizarán automáticamente cuando vuelva la conexión.
                </p>
              </div>
              <div class="bg-[#0A1628] rounded-xl p-4 border border-red-500/20">
                <div class="flex items-center gap-2 mb-2">
                  <span class="w-2 h-2 rounded-full bg-red-400" />
                  <span class="text-red-400 text-xs font-semibold">Lo que NUNCA verás</span>
                </div>
                <p class="text-slate-400 text-sm line-through opacity-60">
                  "License validation failed. Contact administrator."
                </p>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* Payment methods */}
        <section class="py-12 bg-slate-50">
          <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p class="text-brand-blue text-sm font-semibold uppercase tracking-widest mb-3">Métodos de pago</p>
            <h2 class="text-2xl font-black text-slate-900 mb-3">Paga como puedas</h2>
            <p class="text-slate-500 mb-8">
              Aceptamos todos los métodos. Si tienes una situación especial, hablamos.
            </p>
            <div class="flex flex-wrap justify-center gap-3">
              {["Zelle", "Cash App", "PayPal", "Transferencia bancaria", "Tarjeta crédito/débito", "Efectivo (local)", "Crypto (consultar)"].map((m) => (
                <span class="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-medium shadow-sm">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Full comparison table */}
        <PlanComparison />

        {/* Add-ons */}
        <AddOnsGrid />

        {/* License system info */}
        <SectionWrapper class="bg-white">
          <div class="max-w-3xl mx-auto text-center">
            <p class="text-brand-blue text-sm font-semibold uppercase tracking-widest mb-3">Licencias</p>
            <h2 class="text-3xl font-black text-slate-900 mb-4">Tu licencia, bajo tu control</h2>
            <p class="text-slate-500 text-lg leading-relaxed mb-10">
              Cada instalación tiene su propia licencia. Puedes ver el estado en tiempo real, renovar con un click y activar nuevos dispositivos sin llamar a nadie.
            </p>
            <div class="grid sm:grid-cols-3 gap-5">
              {[
                { icon: "🧾", title: "Prueba gratis 14 días", desc: "Sin tarjeta. Sin preguntas. Explora todo el sistema." },
                { icon: "🔑", title: "Activación por código", desc: "Sin internet para activar? Te enviamos el código por WhatsApp." },
                { icon: "⏳", title: "7 días de gracia", desc: "Si se vence tu licencia, tienes 7 días extra para renovar sin perder datos." },
              ].map((item) => (
                <div class="p-5 rounded-xl bg-slate-50 border border-slate-100 text-left">
                  <div class="text-2xl mb-3">{item.icon}</div>
                  <h3 class="font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p class="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionWrapper>

        {/* FAQ */}
        <section class="py-16 bg-slate-50">
          <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-10">
              <p class="text-brand-blue text-sm font-semibold uppercase tracking-widest mb-3">FAQ</p>
              <h2 class="text-3xl font-black text-slate-900">Preguntas frecuentes</h2>
            </div>
            <div class="space-y-3">
              <For each={pricingFAQ}>
                {(item, i) => (
                  <div class="card-light overflow-hidden">
                    <button
                      class="w-full flex items-center justify-between p-5 text-left"
                      onClick={() => setOpenFAQ(openFAQ() === i() ? null : i())}
                    >
                      <span class="font-semibold text-slate-900 pr-4 text-sm">{item.question}</span>
                      <span
                        class="text-slate-400 flex-shrink-0 w-5 h-5 transition-transform duration-200"
                        classList={{ "rotate-180": openFAQ() === i() }}
                      >
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                      </span>
                    </button>
                    <div
                      class="overflow-hidden transition-all duration-300"
                      style={openFAQ() === i() ? "max-height: 300px; opacity: 1" : "max-height: 0; opacity: 0"}
                    >
                      <div class="px-5 pb-5 text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-4">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>
            <p class="text-center text-slate-500 text-sm mt-8">
              ¿Otra pregunta?{" "}
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" class="text-brand-blue hover:underline">
                Escríbenos por WhatsApp
              </a>{" "}
              — respondemos en minutos.
            </p>
          </div>
        </section>

        <CTABanner
          title="Empieza gratis hoy. Sin tarjeta."
          subtitle="14 días para explorar todo el sistema sin límites. Si en ese tiempo no estás convencido, no pagás nada."
        />
      </main>
      <Footer />
    </>
  );
}
