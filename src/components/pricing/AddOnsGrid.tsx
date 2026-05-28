import { For } from "solid-js";
import { addOns, type AddOn } from "~/data/plans";

const categories: AddOn["category"][] = ["Capacidad", "Módulos", "Soporte"];

const iconPaths: Record<string, string> = {
  UserPlus: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
  Monitor: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  Building2: "M4 21V11l8-8 8 8v10M9 21v-6h6v6",
  DollarSign: "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  Calculator: "M9 7H6a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-3M9 7V5a2 2 0 012-2h7a2 2 0 012 2v7a2 2 0 01-2 2h-2M9 7h7",
  Truck: "M9 17a2 2 0 11-4 0 2 2 0 014 0zM21 17a2 2 0 11-4 0 2 2 0 014 0zM1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6",
  Star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  MessageCircle: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  Headphones: "M3 18v-6a9 9 0 0118 0v6M3 18a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H4a2 2 0 00-2 2v3zM21 18a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h1a2 2 0 012 2v3z",
  Settings: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  GraduationCap: "M22 10v6M2 10l10-5 10 5-10 5z",
};

const categoryColors = {
  Capacidad: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400" },
  Módulos: { bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-400" },
  Soporte: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400" },
};

export default function AddOnsGrid() {
  return (
    <section class="py-16 bg-[#030B1A]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <p class="text-brand-accent text-sm font-semibold uppercase tracking-widest mb-3">Add-ons</p>
          <h2 class="text-3xl sm:text-4xl font-black text-white mb-4">
            Personaliza tu plan
          </h2>
          <p class="text-slate-400 text-lg max-w-xl mx-auto">
            Agrega solo lo que necesitas. Cada add-on se activa en minutos y puedes cancelarlo cuando quieras.
          </p>
        </div>

        <For each={categories}>
          {(cat) => {
            const items = addOns.filter((a) => a.category === cat);
            const colors = categoryColors[cat];
            return (
              <div class="mb-10">
                <div class="flex items-center gap-3 mb-4">
                  <span class={`px-3 py-1 rounded-full text-xs font-bold border ${colors.bg} ${colors.border} ${colors.text}`}>
                    {cat}
                  </span>
                  <div class="flex-1 h-px bg-white/5" />
                </div>
                <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <For each={items}>
                    {(addon) => {
                      const iconPath = iconPaths[addon.icon] ?? iconPaths.Settings;
                      return (
                        <div class="card-dark p-4 flex items-start gap-4">
                          <div class={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${colors.bg} ${colors.border}`}>
                            <svg class={`w-4 h-4 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={1.8}>
                              <path stroke-linecap="round" stroke-linejoin="round" d={iconPath} />
                            </svg>
                          </div>
                          <div class="flex-1 min-w-0">
                            <div class="flex items-center justify-between gap-2 mb-1">
                              <span class="text-white text-sm font-semibold">{addon.name}</span>
                              <span class="text-white font-black text-sm flex-shrink-0">
                                ${addon.price}
                                <span class="text-slate-500 font-normal text-xs">
                                  /{addon.period === "monthly" ? "mes" : "único"}
                                </span>
                              </span>
                            </div>
                            <p class="text-slate-500 text-xs leading-relaxed">{addon.description}</p>
                          </div>
                        </div>
                      );
                    }}
                  </For>
                </div>
              </div>
            );
          }}
        </For>

        <p class="text-center text-slate-500 text-sm mt-6">
          ¿Necesitas algo que no está en la lista?{" "}
          <a href="/contacto" class="text-brand-accent hover:underline">Cuéntanos tu caso</a>
        </p>
      </div>
    </section>
  );
}
