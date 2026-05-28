import { For } from "solid-js";
import type { Product } from "~/types";
import SectionWrapper from "~/components/ui/SectionWrapper";

const featureIconPaths: Record<string, string> = {
  Monitor: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  Package: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10",
  BarChart3: "M3 3v18h18M9 17V9m4 8V5m4 12v-5",
  Users: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  Building2: "M4 21V11l8-8 8 8v10M9 21v-6h6v6",
  CreditCard: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  Globe: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9",
  BellRing: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  CalendarDays: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  Layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  BarChart2: "M18 20V10M12 20V4M6 20v-6",
  DollarSign: "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
};

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
            const iconPath = featureIconPaths[feature.icon] || featureIconPaths.Monitor;
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
