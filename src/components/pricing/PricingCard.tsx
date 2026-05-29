import { Show } from "solid-js";
import { A } from "@solidjs/router";
import type { Plan } from "~/data/plans";
import { getWhatsAppUrl } from "~/data/products";

interface PricingCardProps {
  plan: Plan;
  annual: boolean;
}

const ctaClasses = {
  primary: "bg-brand-blue hover:bg-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/25",
  dark: "bg-slate-800 hover:bg-slate-700 text-white",
  amber: "bg-amber-500 hover:bg-amber-400 text-white hover:shadow-lg hover:shadow-amber-500/25",
  purple: "bg-violet-600 hover:bg-violet-500 text-white hover:shadow-lg hover:shadow-violet-500/25",
};

export default function PricingCard(props: PricingCardProps) {
  const p = props.plan;
  const price = () => (props.annual ? p.annualPrice : p.monthlyPrice);
  const savings = () => p.annualSavings;
  const whatsapp = getWhatsAppUrl("Axis ERP");

  return (
    <div
      class={`relative flex flex-col rounded-2xl border transition-all duration-300 ${
        p.isPopular
          ? "border-brand-blue shadow-2xl shadow-blue-500/10 scale-[1.02]"
          : "border-white/10 hover:border-white/20"
      } bg-[#0A1628]`}
    >
      {/* Popular badge */}
      <Show when={p.isPopular}>
        <div class="absolute -top-4 left-1/2 -translate-x-1/2">
          <span class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-brand-blue to-cyan-500 shadow-lg shadow-blue-500/30">
            ⭐ Más recomendado
          </span>
        </div>
      </Show>

      <div class="p-6 flex flex-col flex-1">
        {/* Header */}
        <div class="mb-6">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold mb-3"
            style={`background: ${p.colorFrom}20; color: ${p.accentColor};`}
          >
            <span class="w-1.5 h-1.5 rounded-full" style={`background: ${p.accentColor}`} />
            {p.name}
          </div>
          <p class="text-slate-400 text-sm leading-relaxed">{p.tagline}</p>
        </div>

        {/* Price */}
        <div class="mb-6">
          <Show
            when={!p.isCustom}
            fallback={
              <div>
                <div class="text-3xl font-black text-white mb-1">A consultar</div>
                <p class="text-slate-500 text-xs">Precio según alcance</p>
              </div>
            }
          >
            <div class="flex items-end gap-1 mb-1">
              <span class="text-slate-400 text-xl mb-1">$</span>
              <span class="text-5xl font-black text-white leading-none">{price()}</span>
              <span class="text-slate-400 text-sm mb-1.5">
                /{props.annual ? "año" : "mes"}
              </span>
            </div>
            <Show when={props.annual && savings()}>
              <div class="flex items-center gap-2">
                <span class="text-slate-500 text-xs line-through">${(p.monthlyPrice! * 12)}/año</span>
                <span
                  class="px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={`background: ${p.colorFrom}25; color: ${p.accentColor}`}
                >
                  Ahorra ${savings()}
                </span>
              </div>
            </Show>
            <Show when={!props.annual}>
              <p class="text-slate-500 text-xs mt-1">
                o ${p.annualPrice}/año · ahorra ${p.annualSavings}
              </p>
            </Show>
          </Show>
        </div>

        {/* Limits chips */}
        <div class="flex flex-wrap gap-1.5 mb-5">
          {[
            `${p.limits.users} usuario${typeof p.limits.users === "number" && p.limits.users === 1 ? "" : "s"}`,
            `${p.limits.pos} caja${typeof p.limits.pos === "number" && p.limits.pos === 1 ? "" : "s"}`,
            `${p.limits.locations} sucursal${typeof p.limits.locations === "number" && p.limits.locations === 1 ? "" : "es"}`,
            `Offline ${p.limits.offlineDays}d`,
          ].map((chip) => (
            <span class="px-2 py-0.5 rounded-md text-xs bg-white/5 border border-white/8 text-slate-400">
              {chip}
            </span>
          ))}
        </div>

        {/* Features */}
        <ul class="space-y-2 mb-6 flex-1">
          {p.features.map((f) => (
            <li class="flex items-start gap-2 text-sm text-slate-300">
              <span class="text-emerald-400 mt-0.5 flex-shrink-0 text-xs font-bold">✓</span>
              {f}
            </li>
          ))}
        </ul>

        {/* Ideal for */}
        <div class="mb-5">
          <p class="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2">Ideal para</p>
          <div class="flex flex-wrap gap-1">
            {p.ideal.map((item) => (
              <span
                class="px-2 py-0.5 rounded-md text-xs border"
                style={`background: ${p.colorFrom}15; border-color: ${p.colorFrom}30; color: ${p.textColor};`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Show
          when={!p.isCustom}
          fallback={
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              class={`w-full text-center px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 ${ctaClasses[p.ctaStyle]}`}
            >
              {p.cta}
            </a>
          }
        >
          <A
            href={`/contacto?producto=venta-pos&plan=${p.id}&motivo=demo`}
            class={`w-full text-center px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 ${ctaClasses[p.ctaStyle]}`}
          >
            {p.cta}
          </A>
        </Show>
      </div>
    </div>
  );
}
