import { For } from "solid-js";
import { erpBenefits } from "~/data/axisErp";

export default function BenefitsGrid() {
  return (
    <section class="py-16 bg-[#020914]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <p class="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Por qué Ventaro ERP</p>
          <h2 class="text-3xl sm:text-4xl font-black text-white mb-4">Todo lo que tu negocio necesita</h2>
          <p class="text-slate-400 text-lg max-w-2xl mx-auto">
            Una plataforma completa. Sin módulos de pago extra. Sin sorpresas.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <For each={erpBenefits}>
            {(b) => (
              <div class="group p-5 rounded-2xl border border-white/6 bg-white/2 hover:bg-indigo-500/5 hover:border-indigo-500/20 transition-all duration-200 text-center">
                <div class="text-3xl mb-3">{b.emoji}</div>
                <h3 class="text-white font-bold text-sm mb-2">{b.title}</h3>
                <p class="text-slate-500 text-xs leading-relaxed">{b.description}</p>
              </div>
            )}
          </For>
        </div>
      </div>
    </section>
  );
}
