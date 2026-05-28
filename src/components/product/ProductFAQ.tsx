import { createSignal, For } from "solid-js";
import type { Product } from "~/types";
import SectionWrapper from "~/components/ui/SectionWrapper";

export default function ProductFAQ(props: { product: Product }) {
  const p = props.product;
  const [openIndex, setOpenIndex] = createSignal<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex() === i ? null : i);
  };

  return (
    <SectionWrapper class="bg-slate-50">
      <div class="max-w-3xl mx-auto">
        <div class="text-center mb-10">
          <p class="text-brand-blue text-sm font-semibold uppercase tracking-widest mb-3">FAQ</p>
          <h2 class="text-3xl font-black text-slate-900 mb-3">
            Preguntas frecuentes sobre {p.name}
          </h2>
          <p class="text-slate-500">¿Tienes otra pregunta? <a href="/contacto" class="text-brand-blue hover:underline">Escríbenos</a></p>
        </div>

        <div class="space-y-3">
          <For each={p.faq}>
            {(item, i) => (
              <div class="card-light overflow-hidden">
                <button
                  class="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => toggle(i())}
                >
                  <span class="font-semibold text-slate-900 pr-4">{item.question}</span>
                  <span
                    class="text-slate-400 flex-shrink-0 w-5 h-5 transition-transform duration-200"
                    classList={{ "rotate-180": openIndex() === i() }}
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </button>
                <div
                  class="overflow-hidden transition-all duration-300"
                  style={openIndex() === i() ? "max-height: 300px; opacity: 1;" : "max-height: 0; opacity: 0;"}
                >
                  <div class="px-5 pb-5 text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-4">
                    {item.answer}
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </SectionWrapper>
  );
}
