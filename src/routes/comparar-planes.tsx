import { Title, Meta } from "@solidjs/meta";
import { For, Show } from "solid-js";
import { A } from "@solidjs/router";
import Header from "~/components/layout/Header";
import Footer from "~/components/layout/Footer";
import { erpPlans, erpComparisonData } from "~/data/axisErp";
import { erpWhatsApp } from "~/config/erp.config";
import { erpEvents } from "~/lib/analytics";

const planColors = ["#64748B", "#3730A3", "#B45309", "#6D28D9"];

type CellVal = string | boolean;

function Cell(props: { value: CellVal; color: string }) {
  if (typeof props.value === "boolean") {
    return props.value
      ? <span class="text-emerald-400 font-bold text-base">✓</span>
      : <span class="text-slate-700 text-base">—</span>;
  }
  return <span class="text-slate-300 text-sm font-medium">{props.value}</span>;
}

export default function CompararPlanesPage() {
  return (
    <>
      <Title>Comparar planes Ventaro ERP — Tabla completa · 305 Web Service</Title>
      <Meta name="description" content="Compara todos los planes de Ventaro ERP: Starter, Profesional, Restaurante & Bar y Enterprise. Tabla completa de funcionalidades." />

      <Header />
      <main class="min-h-screen bg-[#020914]">
        {/* Hero */}
        <section class="pt-28 pb-12 relative overflow-hidden">
          <div class="absolute inset-0 bg-grid opacity-40" />
          <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <A href="/precios" class="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm mb-6 transition-colors">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M15 19l-7-7 7-7" />
              </svg>
              Ver precios
            </A>
            <h1 class="text-4xl sm:text-5xl font-black text-white mb-4">Compara todos los planes</h1>
            <p class="text-slate-400 text-lg">Cada funcionalidad, cada límite. Todo claro, sin letra pequeña.</p>
          </div>
        </section>

        {/* Quick plan cards */}
        <section class="pb-8">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <For each={erpPlans}>
                {(plan) => (
                  <div class={`p-5 rounded-2xl border transition-all ${plan.isPopular ? "border-indigo-500/40 bg-indigo-500/5" : "border-white/8 bg-white/2"}`}>
                    <div class="w-6 h-1 rounded-full mb-3" style={`background: linear-gradient(90deg, ${plan.colorFrom}, ${plan.colorTo})`} />
                    <Show when={plan.isPopular}>
                      <span class="text-[10px] font-bold text-indigo-400 uppercase tracking-wide">Más Popular</span>
                    </Show>
                    <h3 class="text-white font-black text-lg mt-1 mb-1">{plan.name}</h3>
                    <Show
                      when={!plan.isCustom}
                      fallback={<p class="text-2xl font-black text-white mb-3">A consultar</p>}
                    >
                      <p class="text-2xl font-black text-white mb-3">
                        ${plan.monthlyPrice}<span class="text-slate-500 text-sm font-normal">/mes</span>
                      </p>
                    </Show>
                    <Show
                      when={plan.isCustom}
                      fallback={
                        <A
                          href={`/solicitar-demo?plan=${plan.id}`}
                          class="block w-full text-center px-3 py-2 rounded-lg text-xs font-bold text-white transition-all"
                          style={`background: linear-gradient(135deg, ${plan.colorFrom}, ${plan.colorTo})`}
                        >
                          Comenzar
                        </A>
                      }
                    >
                      <a
                        href={erpWhatsApp("plan Enterprise")}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="block w-full text-center px-3 py-2 rounded-lg text-xs font-bold text-white transition-all"
                        style={`background: linear-gradient(135deg, ${plan.colorFrom}, ${plan.colorTo})`}
                      >
                        Contactar
                      </a>
                    </Show>
                  </div>
                )}
              </For>
            </div>
          </div>
        </section>

        {/* Full table */}
        <section class="pb-16">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="overflow-x-auto rounded-2xl border border-white/8 shadow-card-dark">
              <table class="w-full min-w-[640px]">
                <thead>
                  <tr class="border-b border-white/8">
                    <th class="text-left px-5 py-4 text-slate-500 text-sm font-medium w-1/3 bg-[#0A1628]">
                      Funcionalidad
                    </th>
                    <For each={erpPlans}>
                      {(plan, i) => (
                        <th class="px-4 py-4 text-center bg-[#0A1628]">
                          <div class="flex flex-col items-center gap-1">
                            <Show when={plan.isPopular}>
                              <span class="text-[9px] font-bold text-indigo-400 uppercase tracking-wide">Popular</span>
                            </Show>
                            <span class="font-bold text-sm" style={`color: ${planColors[i()]}`}>{plan.name}</span>
                            <span class="text-slate-500 text-xs">
                              {plan.isCustom ? "A consultar" : `$${plan.monthlyPrice}/mes`}
                            </span>
                          </div>
                        </th>
                      )}
                    </For>
                  </tr>
                </thead>
                <tbody>
                  <For each={erpComparisonData}>
                    {(group) => (
                      <>
                        <tr class="bg-white/2">
                          <td colspan="5" class="px-5 py-2.5">
                            <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">
                              {group.category}
                            </span>
                          </td>
                        </tr>
                        <For each={group.features}>
                          {(feature, i) => (
                            <tr class={`border-t border-white/4 hover:bg-white/2 transition-colors ${i() % 2 === 0 ? "" : "bg-white/1"}`}>
                              <td class="px-5 py-3.5 text-slate-300 text-sm">{feature.name}</td>
                              <td class="px-4 py-3.5 text-center"><Cell value={feature.starter}      color={planColors[0]} /></td>
                              <td class="px-4 py-3.5 text-center bg-indigo-500/3"><Cell value={feature.professional} color={planColors[1]} /></td>
                              <td class="px-4 py-3.5 text-center"><Cell value={feature.restaurant}   color={planColors[2]} /></td>
                              <td class="px-4 py-3.5 text-center"><Cell value={feature.enterprise}   color={planColors[3]} /></td>
                            </tr>
                          )}
                        </For>
                      </>
                    )}
                  </For>
                </tbody>
                <tfoot>
                  <tr class="border-t border-white/8 bg-[#0A1628]">
                    <td class="px-5 py-4 text-slate-500 text-sm">Prueba gratis 14 días</td>
                    <For each={erpPlans}>
                      {(plan) => (
                        <td class="px-4 py-4 text-center">
                          <Show
                            when={plan.isCustom}
                            fallback={
                              <A
                                href={`/solicitar-demo?plan=${plan.id}`}
                                class="inline-block px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:-translate-y-0.5"
                                style={`background: linear-gradient(135deg, ${plan.colorFrom}, ${plan.colorTo})`}
                              >
                                Comenzar
                              </A>
                            }
                          >
                            <a
                              href={erpWhatsApp("Enterprise")}
                              target="_blank"
                              rel="noopener noreferrer"
                              class="inline-block px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all"
                              style={`background: linear-gradient(135deg, ${plan.colorFrom}, ${plan.colorTo})`}
                            >
                              Contactar
                            </a>
                          </Show>
                        </td>
                      )}
                    </For>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section class="py-12 border-t border-white/5 bg-[#030B1A]">
          <div class="max-w-xl mx-auto px-4 text-center">
            <h2 class="text-2xl font-black text-white mb-3">¿Aún tienes dudas?</h2>
            <p class="text-slate-500 mb-6">Cuéntanos sobre tu negocio y te decimos qué plan necesitas.</p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <A
                href="/solicitar-demo"
                onClick={() => erpEvents.clickDemo()}
                class="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:-translate-y-0.5"
                style="background: linear-gradient(135deg,#3730A3,#0369A1)"
              >
                Solicitar demo gratis
              </A>
              <a
                href={erpWhatsApp("qué plan necesito")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => erpEvents.clickWhatsApp("comparar-planes")}
                class="px-6 py-3 rounded-xl font-semibold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/8 transition-colors"
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
