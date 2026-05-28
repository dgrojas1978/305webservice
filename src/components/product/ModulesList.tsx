import { For } from "solid-js";
import type { Product } from "~/types";
import SectionWrapper from "~/components/ui/SectionWrapper";

export default function ModulesList(props: { product: Product }) {
  const p = props.product;

  return (
    <SectionWrapper class="bg-white">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p class="text-brand-blue text-sm font-semibold uppercase tracking-widest mb-3">
            Módulos incluidos
          </p>
          <h2 class="text-3xl sm:text-4xl font-black text-slate-900 mb-6">
            Una plataforma completa, sin extras ocultos
          </h2>
          <p class="text-slate-500 text-lg leading-relaxed mb-8">
            Todo lo que necesitas viene incluido desde el primer día. Sin módulos de pago por separado ni sorpresas en la factura.
          </p>
          <div class="flex flex-wrap gap-2">
            <For each={p.tags}>
              {(tag) => (
                <span class="px-3 py-1.5 text-sm rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                  {tag}
                </span>
              )}
            </For>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <For each={p.modules}>
            {(module) => (
              <div class="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
                <div class="flex items-center gap-2 mb-1.5">
                  <span class="text-brand-emerald text-sm">✓</span>
                  <span class="font-semibold text-slate-900 text-sm">{module.name}</span>
                </div>
                <p class="text-slate-500 text-xs leading-relaxed pl-5">{module.description}</p>
              </div>
            )}
          </For>
        </div>
      </div>
    </SectionWrapper>
  );
}
