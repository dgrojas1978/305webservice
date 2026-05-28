import { For, Show, createSignal } from "solid-js";
import { A } from "@solidjs/router";
import { erpPlans } from "~/data/axisErp";
import { erpWhatsApp } from "~/config/erp.config";
import { erpEvents } from "~/lib/analytics";

export default function LicensePlans() {
  const [annual, setAnnual] = createSignal(false);

  return (
    <section class="py-16 bg-[#020914]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10">
          <p class="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Planes y precios</p>
          <h2 class="text-3xl sm:text-4xl font-black text-white mb-4">Sin contratos. Cancela cuando quieras.</h2>
          <p class="text-slate-400 mb-8">14 días gratis en todos los planes. Sin tarjeta de crédito.</p>

          {/* Billing toggle */}
          <div class="inline-flex items-center gap-3 bg-white/5 border border-white/8 rounded-xl px-4 py-2">
            <button
              class={`text-sm font-semibold transition-colors ${!annual() ? "text-white" : "text-slate-500"}`}
              onClick={() => setAnnual(false)}
            >
              Mensual
            </button>
            <button
              class={`relative w-12 h-6 rounded-full transition-colors ${annual() ? "bg-indigo-500" : "bg-white/10"}`}
              onClick={() => setAnnual(!annual())}
              aria-label="Toggle annual billing"
            >
              <span
                class={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${annual() ? "translate-x-6" : ""}`}
              />
            </button>
            <button
              class={`text-sm font-semibold transition-colors ${annual() ? "text-white" : "text-slate-500"}`}
              onClick={() => setAnnual(true)}
            >
              Anual
              <span class="ml-1.5 text-xs font-bold text-emerald-400">−17%</span>
            </button>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          <For each={erpPlans}>
            {(plan) => (
              <div
                class={`relative rounded-2xl p-6 flex flex-col border transition-all duration-200 ${
                  plan.isPopular
                    ? "border-indigo-500/50 bg-indigo-500/5 shadow-xl shadow-indigo-500/10 scale-[1.02]"
                    : "border-white/8 bg-white/2 hover:border-white/15"
                }`}
              >
                {plan.isPopular && (
                  <div class="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span class="px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-wide" style="background: linear-gradient(135deg,#3730A3,#0369A1)">
                      Más Popular
                    </span>
                  </div>
                )}

                {/* Plan header */}
                <div class="mb-5">
                  <div class="w-8 h-1 rounded-full mb-4" style={`background: linear-gradient(90deg, ${plan.colorFrom}, ${plan.colorTo})`} />
                  <h3 class="text-white font-black text-lg mb-1">{plan.name}</h3>
                  <p class="text-slate-500 text-xs">{plan.description}</p>
                </div>

                {/* Price */}
                <div class="mb-5">
                  <Show
                    when={!plan.isCustom}
                    fallback={<div class="text-3xl font-black text-white">A consultar</div>}
                  >
                    <div class="flex items-end gap-1">
                      <span class="text-slate-400 text-lg">$</span>
                      <span class="text-4xl font-black text-white">
                        {annual() ? plan.annualPrice : plan.monthlyPrice}
                      </span>
                      <span class="text-slate-500 text-sm mb-1">/{annual() ? "año" : "mes"}</span>
                    </div>
                    <Show when={annual()}>
                      <p class="text-emerald-400 text-xs mt-1 font-semibold">
                        Ahorras ${(plan.monthlyPrice! * 12) - plan.annualPrice!}/año
                      </p>
                    </Show>
                  </Show>
                </div>

                {/* Limits chips */}
                <div class="flex flex-wrap gap-1.5 mb-5">
                  {[plan.limits.pos, plan.limits.branches, plan.limits.users].map((l) => (
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold border border-white/10 text-slate-400 bg-white/3">
                      {l}
                    </span>
                  ))}
                </div>

                {/* Features */}
                <ul class="space-y-2 mb-6 flex-1">
                  <For each={plan.features}>
                    {(f) => (
                      <li class="flex items-start gap-2 text-xs text-slate-400">
                        <span class="font-bold mt-0.5 flex-shrink-0" style={`color: ${plan.colorFrom}`}>✓</span>
                        {f}
                      </li>
                    )}
                  </For>
                </ul>

                {/* Ideal for */}
                <p class="text-slate-600 text-[10px] mb-4">Ideal: {plan.idealFor}</p>

                {/* CTA */}
                <Show
                  when={plan.isCustom}
                  fallback={
                    <A
                      href={`/solicitar-demo?plan=${plan.id}`}
                      onClick={() => erpEvents.viewPricing(plan.id)}
                      class="block w-full text-center px-4 py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                      style={`background: linear-gradient(135deg, ${plan.colorFrom}, ${plan.colorTo})`}
                    >
                      {plan.cta}
                    </A>
                  }
                >
                  <a
                    href={erpWhatsApp("plan Enterprise")}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => erpEvents.clickWhatsApp("pricing-enterprise")}
                    class="block w-full text-center px-4 py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                    style={`background: linear-gradient(135deg, ${plan.colorFrom}, ${plan.colorTo})`}
                  >
                    {plan.cta}
                  </a>
                </Show>
              </div>
            )}
          </For>
        </div>

        <p class="text-center text-slate-600 text-sm mt-8">
          ¿Necesitas comparar en detalle?{" "}
          <A href="/comparar-planes" class="text-indigo-400 hover:text-indigo-300 hover:underline" onClick={() => erpEvents.clickComparePlans()}>
            Ver tabla completa de funcionalidades →
          </A>
        </p>
      </div>
    </section>
  );
}
