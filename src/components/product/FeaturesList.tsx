import { For } from "solid-js";
import type { Product } from "~/types";
import SectionWrapper from "~/components/ui/SectionWrapper";
import { iconPaths } from "~/components/ui/iconPaths";

interface FeaturesListProps {
  product: Product;
}

export default function FeaturesList(props: FeaturesListProps) {
  const p = props.product;

  return (
    <SectionWrapper class="bg-slate-50">
      <div class="text-center mb-12">
        <p class="text-brand-blue text-sm font-semibold uppercase tracking-widest mb-3">
          Funcionalidades
        </p>
        <h2 class="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
          Todo lo que {p.name} incluye
        </h2>
        <p class="text-slate-500 text-lg max-w-2xl mx-auto">
          {p.solution}
        </p>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <For each={p.features}>
          {(feature) => {
            const iconPath = iconPaths[feature.icon] || iconPaths.Monitor;
            return (
              <div class="card-light p-6">
                <div
                  class="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={`background: linear-gradient(135deg, ${p.colorFrom}20, ${p.colorTo}20); border: 1px solid ${p.colorFrom}30;`}
                >
                  <svg
                    class="w-5 h-5"
                    style={`color: ${p.accentColor}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width={1.8}
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d={iconPath} />
                  </svg>
                </div>
                <h3 class="font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p class="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          }}
        </For>
      </div>
    </SectionWrapper>
  );
}
