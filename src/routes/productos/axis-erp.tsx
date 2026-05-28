import { Title, Meta } from "@solidjs/meta";
import Header from "~/components/layout/Header";
import Footer from "~/components/layout/Footer";
import HeroERP from "~/components/erp/HeroERP";
import BenefitsGrid from "~/components/erp/BenefitsGrid";
import BusinessTypeCards from "~/components/erp/BusinessTypeCards";
import LicensePlans from "~/components/erp/LicensePlans";
import FAQERP from "~/components/erp/FAQERP";
import StickyCTA from "~/components/erp/StickyCTA";
import { iconPaths } from "~/components/ui/iconPaths";
import { axisErpProduct } from "~/data/axisErp";
import { erpConfig, erpWhatsApp } from "~/config/erp.config";
import { erpEvents } from "~/lib/analytics";
import { A } from "@solidjs/router";

const schemaOrg = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Axis ERP",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Windows, Android, Web",
  "description": axisErpProduct.shortDescription,
  "offers": {
    "@type": "Offer",
    "price": "19.00",
    "priceCurrency": "USD",
    "priceValidUntil": "2026-12-31",
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "120",
  },
});

export default function AxisErpPage() {
  return (
    <>
      <Title>Axis ERP — ERP y POS para MIPYMES de Cuba y LATAM · 305 Web Service</Title>
      <Meta name="description" content="Sistema ERP/POS completo para tiendas, restaurantes, bares, ferreterías y farmacias. Funciona offline, multi-sucursal, desde $19/mes. Prueba gratis 14 días." />
      <Meta name="keywords" content="ERP Cuba, POS Cuba, software facturación LATAM, sistema POS restaurante, ERP inventario, software MIPYMES" />
      <Meta property="og:title" content="Axis ERP — ERP y POS para MIPYMES · 305 Web Service" />
      <Meta property="og:description" content="ERP/POS para tiendas, restaurantes y bares en Cuba y LATAM. Offline, multi-sucursal, desde $19/mes." />
      <Meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json" innerHTML={schemaOrg} />

      <Header />
      <main>
        <HeroERP />
        <BenefitsGrid />
        <BusinessTypeCards />

        {/* Features section reusing existing component */}
        <section class="py-16 bg-slate-50">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
              <p class="text-indigo-600 text-sm font-semibold uppercase tracking-widest mb-3">Funcionalidades</p>
              <h2 class="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Una plataforma. Todo incluido.</h2>
              <p class="text-slate-500 text-lg max-w-2xl mx-auto">{axisErpProduct.solution}</p>
            </div>
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {axisErpProduct.features.map((feature) => {
                const iconPath = iconPaths[feature.icon] || iconPaths.Monitor;
                return (
                  <div class="card-light p-6">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style="background: #3730A315; border: 1px solid #3730A330">
                      <svg class="w-5 h-5" style="color: #818CF8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={1.8}>
                        <path stroke-linecap="round" stroke-linejoin="round" d={iconPath} />
                      </svg>
                    </div>
                    <h3 class="font-bold text-slate-900 mb-2">{feature.title}</h3>
                    <p class="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Offline highlight */}
        <section class="py-14 bg-[#020914]">
          <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-5">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span class="text-amber-300 text-xs font-bold">Diseñado para Cuba y LATAM</span>
                </div>
                <h2 class="text-3xl sm:text-4xl font-black text-white mb-4">
                  Funciona aunque no haya internet
                </h2>
                <p class="text-slate-400 text-lg leading-relaxed mb-6">
                  El corte de internet no para tu negocio. Axis ERP corre en tu red local y cuando vuelve la conexión, sincroniza todo automáticamente.
                </p>
                <div class="space-y-3">
                  {[
                    { emoji: "🔌", title: "Red local (LAN)", desc: "Tan rápido como siempre, sin depender del proveedor de internet." },
                    { emoji: "🔄", title: "Sincronización automática", desc: "Los datos suben solos a la nube cuando vuelve la conexión." },
                    { emoji: "💾", title: "Backups locales y cloud", desc: "Nunca pierdes información. Backup diario automático." },
                    { emoji: "📱", title: "Activación offline", desc: "¿Sin internet para activar? Te enviamos el código por WhatsApp." },
                  ].map((item) => (
                    <div class="flex items-start gap-3">
                      <span class="text-xl flex-shrink-0">{item.emoji}</span>
                      <div>
                        <span class="font-semibold text-white text-sm">{item.title}</span>
                        <span class="text-slate-500 text-sm"> — {item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div class="bg-[#0A1628] rounded-2xl p-6 border border-white/8">
                <p class="text-white font-bold text-sm mb-4">Lo que ve tu equipo sin internet:</p>
                <div class="bg-[#030B1A] rounded-xl p-4 border border-amber-500/20 mb-4">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="w-2 h-2 rounded-full bg-amber-400" />
                    <span class="text-amber-400 text-xs font-semibold">Modo sin conexión activo</span>
                  </div>
                  <p class="text-slate-300 text-sm">No hay internet, pero puedes seguir vendiendo. Los datos se sincronizarán cuando vuelva la conexión.</p>
                </div>
                <div class="bg-[#030B1A] rounded-xl p-4 border border-red-500/20">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="w-2 h-2 rounded-full bg-red-400" />
                    <span class="text-red-400 text-xs font-semibold">Lo que NUNCA verás</span>
                  </div>
                  <p class="text-slate-500 text-sm line-through opacity-60">"License validation failed. Contact your administrator."</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <LicensePlans />

        {/* Demo CTA */}
        <section class="py-14 bg-white">
          <div class="max-w-3xl mx-auto px-4 text-center">
            <h2 class="text-3xl font-black text-slate-900 mb-4">Prueba Axis ERP ahora mismo</h2>
            <p class="text-slate-500 text-lg mb-8">
              Demo en vivo con datos reales. Selecciona tu tipo de negocio y explora el sistema completo.
            </p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={erpConfig.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => erpEvents.clickDemo()}
                class="px-8 py-4 rounded-xl font-bold text-white text-lg transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30"
                style="background: linear-gradient(135deg,#3730A3,#0369A1)"
              >
                Entrar al Demo →
              </a>
              <A href="/descargas" class="px-8 py-4 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 text-lg transition-colors">
                Descargar versión oficial
              </A>
            </div>
            <p class="text-slate-400 text-sm mt-6">
              ¿Prefieres una demo personalizada?{" "}
              <A href="/solicitar-demo" class="text-indigo-600 hover:underline">Agendamos una llamada →</A>
            </p>
          </div>
        </section>

        <FAQERP />

        {/* Final CTA */}
        <section class="py-16" style="background: linear-gradient(135deg,#3730A3,#0369A1)">
          <div class="max-w-3xl mx-auto px-4 text-center">
            <h2 class="text-3xl sm:text-4xl font-black text-white mb-4">Empieza gratis. Sin tarjeta.</h2>
            <p class="text-indigo-200 text-lg mb-8">
              14 días para explorar todo el sistema. Si no te convence, no pagás nada.
            </p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <A href="/solicitar-demo" class="px-8 py-4 rounded-xl font-bold text-indigo-900 bg-white hover:bg-indigo-50 transition-colors text-lg">
                Solicitar demo gratis
              </A>
              <a
                href={erpWhatsApp("comenzar prueba gratuita")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => erpEvents.clickWhatsApp("bottom-cta")}
                class="px-8 py-4 rounded-xl font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/20 transition-colors text-lg"
              >
                Hablar por WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyCTA />
    </>
  );
}
