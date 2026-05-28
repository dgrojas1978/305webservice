import { For } from "solid-js";
import SectionWrapper from "~/components/ui/SectionWrapper";
import { testimonials } from "~/data/services";

export default function Testimonials() {
  return (
    <SectionWrapper class="bg-slate-50">
      <div class="text-center mb-12">
        <p class="text-brand-blue text-sm font-semibold uppercase tracking-widest mb-3">
          Testimonios
        </p>
        <h2 class="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
          Lo que dicen nuestros clientes
        </h2>
        <p class="text-slate-500 text-lg max-w-2xl mx-auto">
          No te lo decimos nosotros. Te lo dicen quienes usan nuestras soluciones todos los días.
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        <For each={testimonials}>
          {(t) => (
            <div class="card-light p-6 flex flex-col">
              {/* Stars */}
              <div class="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map(() => (
                  <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote class="text-slate-700 text-sm leading-relaxed mb-5 flex-1">
                "{t.content}"
              </blockquote>

              {/* Author */}
              <div class="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div class="w-9 h-9 rounded-full bg-gradient-to-br from-brand-blue to-brand-cyan flex items-center justify-center text-white text-sm font-bold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p class="font-semibold text-slate-900 text-sm">{t.name}</p>
                  <p class="text-slate-500 text-xs">{t.role} · {t.company}</p>
                </div>
                {t.product && (
                  <span class="ml-auto px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-medium rounded-full border border-blue-100">
                    {t.product}
                  </span>
                )}
              </div>
            </div>
          )}
        </For>
      </div>
    </SectionWrapper>
  );
}
