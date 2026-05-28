import { For } from "solid-js";
import SectionWrapper from "~/components/ui/SectionWrapper";
import { industries } from "~/data/services";

const industryIcons: Record<string, string> = {
  UtensilsCrossed: "M3 2h2l.4 2M5 6h14l-1.68 8.39A2 2 0 0115.36 16H8.64a2 2 0 01-1.96-1.61L5 6zM8 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z",
  ShoppingBag: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0",
  Heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  Briefcase: "M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2",
  GraduationCap: "M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5",
  Home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
};

const colorClasses = [
  { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400" },
  { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400" },
  { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400" },
  { bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-400" },
  { bg: "bg-cyan-500/10", border: "border-cyan-500/20", text: "text-cyan-400" },
  { bg: "bg-pink-500/10", border: "border-pink-500/20", text: "text-pink-400" },
];

export default function Industries() {
  return (
    <SectionWrapper class="bg-dark-section">
      <div class="text-center mb-12">
        <p class="text-brand-accent text-sm font-semibold uppercase tracking-widest mb-3">
          Industrias
        </p>
        <h2 class="text-3xl sm:text-4xl font-black text-white mb-4">
          Soluciones para tu industria
        </h2>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">
          Hemos trabajado con negocios de múltiples sectores. Entendemos los desafíos específicos de cada industria.
        </p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <For each={industries}>
          {(industry, i) => {
            const colors = colorClasses[i() % colorClasses.length];
            const iconPath = industryIcons[industry.icon] || industryIcons.Briefcase;

            return (
              <div class="card-dark p-5 text-center flex flex-col items-center gap-3">
                <div class={`w-12 h-12 rounded-xl border flex items-center justify-center ${colors.bg} ${colors.border}`}>
                  <svg class={`w-6 h-6 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={1.5}>
                    <path stroke-linecap="round" stroke-linejoin="round" d={iconPath} />
                  </svg>
                </div>
                <div>
                  <p class="text-white text-xs font-semibold leading-tight">{industry.name}</p>
                </div>
              </div>
            );
          }}
        </For>
      </div>
    </SectionWrapper>
  );
}
