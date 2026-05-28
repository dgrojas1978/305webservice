import { For, Show } from "solid-js";
import type { Product } from "~/types";
import SectionWrapper from "~/components/ui/SectionWrapper";
import { getWhatsAppUrl } from "~/data/products";

export default function PricingSection(props: { product: Product }) {
  const p = props.product;
  const pricing = p.pricing;

  if (pricing.type === "contact" || !pricing.plans) {
    return (
      <SectionWrapper class="bg-white">
        <div class="max-w-xl mx-auto text-center">
          <h2 class="text-3xl font-black text-slate-900 mb-4">Precio a medida</h2>
          <p class="text-slate-500 mb-6">{pricing.contactText || "El precio depende de tus necesidades específicas. Contáctanos para una cotización personalizada."}</p>
          <a href={getWhatsAppUrl(p.name)} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue hover:bg-blue-500 text-white font-semibold rounded-xl transition-all">
            Solicitar cotización
          </a>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper class="bg-white">
      <div class="text-center mb-12">
        <p class="text-brand-blue text-sm font-semibold uppercase tracking-widest mb-3">Precios</p>
        <h2 class="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Planes para cada etapa</h2>
        {pricing.note && <p class="text-slate-500 text-sm">{pricing.note}</p>}
      </div>

      <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <For each={pricing.plans}>
          {(plan) => (
            <div
              class={`rounded-2xl p-6 flex flex-col border-2 transition-all duration-200 ${
                plan.isPopular
                  ? "border-brand-blue bg-gradient-to-br from-blue-50 to-white shadow-xl shadow-blue-100 scale-105"
                  : "border-slate-100 bg-white shadow-sm hover:border-slate-200 hover:shadow-md"
              }`}
            >
              {plan.isPopular && (
                <div class="text-center mb-4">
                  <span class="px-3 py-1 bg-brand-blue text-white text-xs font-bold rounded-full">
                    MÁS POPULAR
                  </span>
                </div>
              )}

              <h3 class="text-slate-900 font-black text-xl mb-1">{plan.name}</h3>
              <p class="text-slate-500 text-sm mb-5">{plan.description}</p>

              <div class="mb-6">
                <Show
                  when={plan.price !== null}
                  fallback={
                    <div class="text-3xl font-black text-slate-900">A consultar</div>
                  }
                >
                  <div class="flex items-end gap-1">
                    <span class="text-slate-500 text-lg">$</span>
                    <span class="text-4xl font-black text-slate-900">{plan.price}</span>
                    <span class="text-slate-500 text-sm mb-1">
                      /{plan.period === "monthly" ? "mes" : plan.period === "yearly" ? "año" : "único"}
                    </span>
                  </div>
                </Show>
              </div>

              <ul class="space-y-2.5 mb-8 flex-1">
                <For each={plan.features}>
                  {(feature) => (
                    <li class="flex items-start gap-2 text-sm text-slate-600">
                      <span class="text-brand-emerald font-bold mt-0.5 flex-shrink-0">✓</span>
                      {feature}
                    </li>
                  )}
                </For>
              </ul>

              <Show
                when={plan.price !== null}
                fallback={
                  <a
                    href={getWhatsAppUrl(p.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="block w-full text-center px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-colors"
                  >
                    {plan.cta}
                  </a>
                }
              >
                <a
                  href={`/contacto?producto=${p.slug}&plan=${plan.name.toLowerCase()}`}
                  class={`block w-full text-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
                    plan.isPopular
                      ? "bg-brand-blue hover:bg-blue-500 text-white shadow-md hover:shadow-blue-200"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                  }`}
                >
                  {plan.cta}
                </a>
              </Show>
            </div>
          )}
        </For>
      </div>
    </SectionWrapper>
  );
}
