import { Title, Meta } from "@solidjs/meta";
import { createSignal, For, Show } from "solid-js";
import { useSearchParams, A } from "@solidjs/router";
import Header from "~/components/layout/Header";
import Footer from "~/components/layout/Footer";
import { erpBusinessTypes } from "~/data/axisErp";
import { erpConfig, erpWhatsApp } from "~/config/erp.config";
import { erpEvents } from "~/lib/analytics";

export default function DemoPage() {
  const [params] = useSearchParams();
  const [selected, setSelected] = createSignal<string>(params.tipo || "tienda");

  const current = () => erpBusinessTypes.find((b) => b.id === selected()) ?? erpBusinessTypes[0];

  return (
    <>
      <Title>Demo Axis ERP — Prueba el sistema en vivo · 305 Web Service</Title>
      <Meta name="description" content="Prueba Axis ERP en vivo. Selecciona tu tipo de negocio y accede al demo completo con datos reales. Sin registro, sin tarjeta." />

      <Header />
      <main class="min-h-screen bg-[#020914]">
        {/* Hero */}
        <section class="pt-28 pb-12 relative overflow-hidden">
          <div class="absolute inset-0 bg-grid opacity-40" />
          <div class="absolute inset-0" style="background: radial-gradient(ellipse at 50% 0%, rgba(55,48,163,0.3) 0%, transparent 60%)" />
          <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-5">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse-slow" />
              <span class="text-indigo-300 text-xs font-semibold">Demo en vivo · Sin registro · Sin tarjeta</span>
            </div>
            <h1 class="text-4xl sm:text-5xl font-black text-white mb-4">
              Prueba Axis ERP ahora mismo
            </h1>
            <p class="text-slate-400 text-xl mb-8">
              Selecciona tu tipo de negocio y accede al demo completo con datos reales.
            </p>
          </div>
        </section>

        {/* Business type selector */}
        <section class="pb-4">
          <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-wrap justify-center gap-2">
              <For each={erpBusinessTypes}>
                {(bt) => (
                  <button
                    class={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      selected() === bt.id
                        ? "text-white shadow-lg shadow-indigo-500/20"
                        : "text-slate-400 bg-white/3 border border-white/8 hover:border-white/15 hover:text-white"
                    }`}
                    style={selected() === bt.id ? "background: linear-gradient(135deg,#3730A3,#0369A1)" : ""}
                    onClick={() => setSelected(bt.id)}
                  >
                    {bt.emoji} {bt.name}
                  </button>
                )}
              </For>
            </div>
          </div>
        </section>

        {/* Demo card */}
        <section class="py-10">
          <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Show when={current()}>
              {(bt) => (
                <div class="grid lg:grid-cols-2 gap-8 items-start">
                  {/* Info */}
                  <div>
                    <div class="text-5xl mb-4">{bt().emoji}</div>
                    <h2 class="text-3xl font-black text-white mb-3">{bt().name}</h2>
                    <p class="text-indigo-400 font-semibold mb-3">{bt().headline}</p>
                    <p class="text-slate-400 leading-relaxed mb-6">{bt().description}</p>

                    <div class="space-y-2 mb-8">
                      <For each={bt().features}>
                        {(f) => (
                          <div class="flex items-center gap-2 text-sm text-slate-300">
                            <span class="text-indigo-400 font-bold">✓</span>
                            {f}
                          </div>
                        )}
                      </For>
                    </div>

                    {/* Demo credentials */}
                    <div class="bg-white/3 border border-white/8 rounded-xl p-4 mb-6">
                      <p class="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-3">Credenciales de acceso al demo</p>
                      <div class="space-y-2">
                        <div class="flex items-center justify-between">
                          <span class="text-slate-500 text-sm">URL</span>
                          <code class="text-indigo-300 text-sm font-mono">{erpConfig.demoUrl}</code>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-slate-500 text-sm">Usuario</span>
                          <code class="text-indigo-300 text-sm font-mono">{erpConfig.demoUser}</code>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-slate-500 text-sm">Contraseña</span>
                          <code class="text-indigo-300 text-sm font-mono">{erpConfig.demoPass}</code>
                        </div>
                      </div>
                    </div>

                    <div class="flex gap-3">
                      <a
                        href={erpConfig.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => erpEvents.clickDemo()}
                        class="flex-1 text-center px-6 py-3.5 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5"
                        style="background: linear-gradient(135deg,#3730A3,#0369A1)"
                      >
                        Entrar al Demo →
                      </a>
                      <a
                        href={erpWhatsApp(`demo de ${bt().name}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => erpEvents.clickWhatsApp("demo-page")}
                        class="px-4 py-3.5 rounded-xl font-semibold text-white bg-[#25D366]/15 border border-[#25D366]/25 hover:bg-[#25D366]/25 transition-colors"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>

                  {/* Screenshot placeholder */}
                  <div class="rounded-2xl overflow-hidden border border-white/8 bg-[#0A1628]">
                    <div class="bg-[#020914] px-4 py-3 border-b border-white/5 flex items-center gap-2">
                      <div class="flex gap-1.5">
                        <div class="w-3 h-3 rounded-full bg-red-500/50" />
                        <div class="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div class="w-3 h-3 rounded-full bg-green-500/50" />
                      </div>
                      <div class="text-slate-500 text-xs ml-2">Axis ERP — {bt().name}</div>
                    </div>
                    <div class="p-8 min-h-[280px] flex flex-col items-center justify-center text-center">
                      <div class="text-6xl mb-4 opacity-60">{bt().emoji}</div>
                      <p class="text-slate-500 text-sm mb-2">Vista previa del módulo</p>
                      <p class="text-slate-600 text-xs">Entra al demo para ver el sistema completo</p>
                      <div class="flex flex-wrap gap-2 justify-center mt-6">
                        <For each={bt().features.slice(0, 3)}>
                          {(f) => (
                            <span class="px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/8 text-slate-400">{f}</span>
                          )}
                        </For>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Show>
          </div>
        </section>

        {/* Bottom CTA */}
        <section class="py-12 border-t border-white/5">
          <div class="max-w-xl mx-auto px-4 text-center">
            <h3 class="text-xl font-black text-white mb-3">¿Quieres un demo personalizado?</h3>
            <p class="text-slate-500 text-sm mb-6">
              Agendamos una sesión de 30 minutos con tu inventario real y datos de tu negocio.
            </p>
            <A
              href="/solicitar-demo"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:-translate-y-0.5"
              style="background: linear-gradient(135deg,#3730A3,#0369A1)"
            >
              Solicitar demo personalizada
            </A>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
