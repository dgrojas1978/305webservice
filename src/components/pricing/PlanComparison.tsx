import { For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { comparisonData, plans } from "~/data/plans";

const planHeaders = [
  { label: "Básico", sub: "$19/mes", color: "#64748B" },
  { label: "Profesional", sub: "$39/mes", color: "#3B82F6", popular: true },
  { label: "Restaurante", sub: "$59/mes", color: "#F59E0B" },
  { label: "Enterprise", sub: "A consultar", color: "#8B5CF6" },
];

type CellValue = string | boolean;

function Cell(props: { value: CellValue; color?: string }) {
  if (typeof props.value === "boolean") {
    return props.value ? (
      <span class="text-emerald-400 font-bold text-base">✓</span>
    ) : (
      <span class="text-slate-700 text-base">—</span>
    );
  }
  return <span class="text-slate-300 text-sm font-medium">{props.value}</span>;
}

export default function PlanComparison() {
  return (
    <section class="py-16 bg-[#020914]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10">
          <p class="text-brand-accent text-sm font-semibold uppercase tracking-widest mb-3">Comparación completa</p>
          <h2 class="text-3xl sm:text-4xl font-black text-white mb-4">Compara todos los planes</h2>
          <p class="text-slate-400">Cada detalle, sin letra pequeña.</p>
        </div>

        {/* Scrollable table */}
        <div class="overflow-x-auto rounded-2xl border border-white/8 shadow-card-dark">
          <table class="w-full min-w-[640px]">
            {/* Header */}
            <thead>
              <tr class="border-b border-white/8">
                <th class="text-left px-5 py-4 text-slate-500 text-sm font-medium w-1/3 bg-[#0A1628]">
                  Funcionalidad
                </th>
                <For each={planHeaders}>
                  {(h) => (
                    <th class="px-4 py-4 text-center bg-[#0A1628]">
                      <div class="flex flex-col items-center gap-1">
                        <Show when={h.popular}>
                          <span class="text-[9px] font-bold text-blue-400 uppercase tracking-wide">Popular</span>
                        </Show>
                        <span class="text-white font-bold text-sm" style={`color: ${h.color}`}>{h.label}</span>
                        <span class="text-slate-500 text-xs">{h.sub}</span>
                      </div>
                    </th>
                  )}
                </For>
              </tr>
            </thead>
            <tbody>
              <For each={comparisonData}>
                {(group) => (
                  <>
                    {/* Category row */}
                    <tr class="bg-white/2">
                      <td colspan="5" class="px-5 py-2.5">
                        <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">
                          {group.category}
                        </span>
                      </td>
                    </tr>
                    {/* Feature rows */}
                    <For each={group.features}>
                      {(feature, i) => (
                        <tr class={`border-t border-white/4 hover:bg-white/2 transition-colors ${i() % 2 === 0 ? "" : "bg-white/1"}`}>
                          <td class="px-5 py-3.5 text-slate-300 text-sm">{feature.name}</td>
                          <td class="px-4 py-3.5 text-center"><Cell value={feature.basico} /></td>
                          <td class="px-4 py-3.5 text-center bg-blue-500/3"><Cell value={feature.profesional} /></td>
                          <td class="px-4 py-3.5 text-center"><Cell value={feature.restaurante} /></td>
                          <td class="px-4 py-3.5 text-center"><Cell value={feature.enterprise} /></td>
                        </tr>
                      )}
                    </For>
                  </>
                )}
              </For>
            </tbody>
            {/* Footer CTAs */}
            <tfoot>
              <tr class="border-t border-white/8 bg-[#0A1628]">
                <td class="px-5 py-4 text-slate-500 text-sm">Prueba gratis 14 días</td>
                <For each={plans}>
                  {(plan) => (
                    <td class="px-4 py-4 text-center">
                      <A
                        href={`/contacto?producto=axis-erp&plan=${plan.id}&motivo=demo`}
                        class="inline-block px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:-translate-y-0.5"
                        style={`background: linear-gradient(135deg, ${plan.colorFrom}, ${plan.colorTo})`}
                      >
                        {plan.isCustom ? "Contactar" : "Comenzar"}
                      </A>
                    </td>
                  )}
                </For>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  );
}
