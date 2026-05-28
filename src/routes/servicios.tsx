import { Title, Meta } from "@solidjs/meta";
import { For } from "solid-js";
import Header from "~/components/layout/Header";
import Footer from "~/components/layout/Footer";
import CTABanner from "~/components/sections/CTABanner";
import SectionWrapper from "~/components/ui/SectionWrapper";
import { services } from "~/data/services";
import { getWhatsAppUrl } from "~/data/products";

const serviceIconPaths: Record<string, string> = {
  Code2: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
  Globe: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9",
  Settings2: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  Zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  Plug: "M7 16.5V7m0 9.5H4.5m0 0v-6h15v6M16.5 16.5V7m0 9.5H19m-12-6v-4h10v4",
  Lightbulb: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  Headphones: "M3 18v-6a9 9 0 0118 0v6M3 18a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H4a2 2 0 00-2 2v3zM21 18a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h1a2 2 0 012 2v3z",
  Network: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18",
};

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Desarrollo: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  Web: { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
  Sistemas: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  Automatización: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  Integraciones: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  Consultoría: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  Soporte: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  Infraestructura: { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200" },
};

export default function ServiciosPage() {
  const whatsapp = getWhatsAppUrl();

  return (
    <>
      <Title>Servicios — 305 Web Service</Title>
      <Meta
        name="description"
        content="Desarrollo de software a medida, páginas web, sistemas internos, automatizaciones, integraciones, consultoría y soporte técnico para empresas."
      />

      <Header />
      <main>
        {/* Page hero */}
        <section class="bg-dark-section pt-28 pb-16 relative overflow-hidden">
          <div class="absolute inset-0 bg-grid" />
          <div class="absolute inset-0" style="background: radial-gradient(ellipse at 70% 50%, rgba(37,99,235,0.12) 0%, transparent 60%)" />
          <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="max-w-3xl">
              <p class="text-brand-accent text-sm font-semibold uppercase tracking-widest mb-3">
                Servicios profesionales
              </p>
              <h1 class="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
                Tecnología a medida para tu negocio
              </h1>
              <p class="text-slate-400 text-xl leading-relaxed mb-8">
                Cuando el software del mercado no es suficiente, nosotros construimos exactamente lo que necesitas. Con código limpio, soporte real y entrega en tiempo.
              </p>
              <div class="flex flex-col sm:flex-row gap-3">
                <a
                  href="/contacto"
                  class="inline-flex items-center justify-center px-6 py-3.5 bg-brand-blue hover:bg-blue-500 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-500/20"
                >
                  Solicitar cotización gratuita
                </a>
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all"
                >
                  Escribir por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Services grid */}
        <SectionWrapper class="bg-white">
          <div class="text-center mb-12">
            <p class="text-brand-blue text-sm font-semibold uppercase tracking-widest mb-3">Qué hacemos</p>
            <h2 class="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
              Nuestros servicios
            </h2>
            <p class="text-slate-500 text-lg max-w-2xl mx-auto">
              De la idea al sistema terminado. Cubrimos todo el ciclo de vida de un proyecto tecnológico.
            </p>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <For each={services}>
              {(service) => {
                const colors = categoryColors[service.category] ?? categoryColors.Desarrollo;
                const iconPath = serviceIconPaths[service.icon] ?? serviceIconPaths.Code2;

                return (
                  <div class="card-light p-6">
                    <div class="flex items-start gap-4 mb-4">
                      <div class={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${colors.bg} ${colors.border}`}>
                        <svg class={`w-6 h-6 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={1.8}>
                          <path stroke-linecap="round" stroke-linejoin="round" d={iconPath} />
                        </svg>
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                          <h3 class="font-bold text-slate-900">{service.name}</h3>
                          <span class={`px-2 py-0.5 text-xs font-medium rounded-full border ${colors.bg} ${colors.border} ${colors.text}`}>
                            {service.category}
                          </span>
                        </div>
                        <p class="text-slate-500 text-sm">{service.shortDescription}</p>
                      </div>
                    </div>

                    <p class="text-slate-600 text-sm leading-relaxed mb-4">{service.description}</p>

                    <ul class="space-y-1.5">
                      <For each={service.features}>
                        {(feature) => (
                          <li class="flex items-center gap-2 text-slate-500 text-sm">
                            <span class="text-brand-emerald text-xs font-bold">✓</span>
                            {feature}
                          </li>
                        )}
                      </For>
                    </ul>
                  </div>
                );
              }}
            </For>
          </div>
        </SectionWrapper>

        {/* Process */}
        <SectionWrapper class="bg-slate-50">
          <div class="text-center mb-12">
            <p class="text-brand-blue text-sm font-semibold uppercase tracking-widest mb-3">Proceso</p>
            <h2 class="text-3xl font-black text-slate-900 mb-4">Cómo trabajamos</h2>
            <p class="text-slate-500 max-w-xl mx-auto">Un proceso claro, transparente y diseñado para entregar resultados reales en el menor tiempo posible.</p>
          </div>

          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Análisis", desc: "Entendemos tu negocio, tus procesos y el problema que necesita solución. Sin jerga técnica." },
              { step: "02", title: "Propuesta", desc: "Te presentamos la solución propuesta, el costo y el tiempo estimado de entrega." },
              { step: "03", title: "Desarrollo", desc: "Construimos en iteraciones cortas. Ves el progreso cada semana, sin sorpresas al final." },
              { step: "04", title: "Entrega", desc: "Deploy, capacitación del equipo y soporte post-entrega incluido durante 30 días." },
            ].map((s) => (
              <div class="text-center">
                <div class="w-12 h-12 rounded-xl bg-brand-blue text-white font-black text-lg flex items-center justify-center mx-auto mb-4">
                  {s.step}
                </div>
                <h3 class="font-bold text-slate-900 mb-2">{s.title}</h3>
                <p class="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </SectionWrapper>

        <CTABanner
          title="¿Tienes un proyecto en mente?"
          subtitle="Cuéntanos qué necesitas. Te respondemos en menos de 2 horas con una propuesta inicial sin costo."
        />
      </main>
      <Footer />
    </>
  );
}
