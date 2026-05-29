import { For } from "solid-js";
import { A } from "@solidjs/router";
import { erpBusinessTypes } from "~/data/axisErp";
import { erpConfig } from "~/config/erp.config";
import { erpEvents } from "~/lib/analytics";

export default function BusinessTypeCards() {
  return (
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <p class="text-indigo-600 text-sm font-semibold uppercase tracking-widest mb-3">Para tu tipo de negocio</p>
          <h2 class="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
            Diseñado para cada industria
          </h2>
          <p class="text-slate-500 text-lg max-w-2xl mx-auto">
            No es un sistema genérico. Ventaro ERP tiene módulos específicos para cada tipo de negocio — preconfigurados para que empieces el primer día.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <For each={erpBusinessTypes}>
            {(bt) => (
              <div class="group card-light p-6 hover:shadow-lg hover:shadow-indigo-100 hover:border-indigo-200 transition-all duration-200">
                {/* Icon */}
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style="background: linear-gradient(135deg,#3730A320,#0369A120); border: 1px solid #3730A330">
                    {bt.emoji}
                  </div>
                  <div>
                    <h3 class="font-black text-slate-900">{bt.name}</h3>
                    <p class="text-indigo-600 text-xs font-semibold">{bt.headline}</p>
                  </div>
                </div>

                <p class="text-slate-500 text-sm leading-relaxed mb-4">{bt.description}</p>

                {/* Feature list */}
                <ul class="space-y-1.5 mb-5">
                  <For each={bt.features}>
                    {(f) => (
                      <li class="flex items-start gap-2 text-xs text-slate-600">
                        <span class="text-indigo-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                        {f}
                      </li>
                    )}
                  </For>
                </ul>

                {/* CTA */}
                <a
                  href={`/demo?tipo=${bt.id}`}
                  onClick={() => erpEvents.clickDemo()}
                  class="block w-full text-center px-4 py-2.5 rounded-xl text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 hover:border-indigo-200 transition-colors"
                >
                  Ver Demo — {bt.name}
                </a>
              </div>
            )}
          </For>
        </div>

        {/* Bottom CTA */}
        <div class="text-center mt-10">
          <p class="text-slate-500 text-sm mb-4">¿No encuentras tu tipo de negocio?</p>
          <A
            href="/solicitar-demo"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:-translate-y-0.5"
            style="background: linear-gradient(135deg,#3730A3,#0369A1)"
          >
            Solicitar demo personalizada
          </A>
        </div>
      </div>
    </section>
  );
}
