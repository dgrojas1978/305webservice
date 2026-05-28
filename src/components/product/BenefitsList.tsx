import { For } from "solid-js";
import type { Product } from "~/types";
import SectionWrapper from "~/components/ui/SectionWrapper";

export default function BenefitsList(props: { product: Product }) {
  const p = props.product;

  return (
    <SectionWrapper class="bg-dark-section">
      <div class="text-center mb-12">
        <p class="text-brand-accent text-sm font-semibold uppercase tracking-widest mb-3">
          Resultados reales
        </p>
        <h2 class="text-3xl sm:text-4xl font-black text-white mb-4">
          ¿Qué gana tu negocio con {p.name}?
        </h2>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <For each={p.benefits}>
          {(benefit) => (
            <div class="card-dark p-6 text-center">
              <div class="text-3xl mb-3">
                {benefit.icon === "TrendingUp" ? "📈" :
                 benefit.icon === "Eye" ? "👁️" :
                 benefit.icon === "Shield" ? "🛡️" :
                 benefit.icon === "Clock" ? "⏰" :
                 benefit.icon === "TrendingDown" ? "📉" :
                 benefit.icon === "DollarSign" ? "💰" :
                 benefit.icon === "Star" ? "⭐" : "✨"}
              </div>
              {benefit.metric && (
                <div class="text-xl font-black mb-2" style={`color: ${p.accentColor}`}>
                  {benefit.metric}
                </div>
              )}
              <h3 class="text-white font-bold mb-2">{benefit.title}</h3>
              <p class="text-slate-400 text-sm leading-relaxed">{benefit.description}</p>
            </div>
          )}
        </For>
      </div>
    </SectionWrapper>
  );
}
