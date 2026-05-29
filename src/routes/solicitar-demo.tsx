import { Title, Meta } from "@solidjs/meta";
import { createSignal, Show } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { action, useAction } from "@solidjs/router";
import Header from "~/components/layout/Header";
import Footer from "~/components/layout/Footer";
import { erpWhatsApp } from "~/config/erp.config";
import { erpEvents } from "~/lib/analytics";

const submitDemoRequest = action(async (formData: FormData) => {
  "use server";
  const { saveLead } = await import("~/lib/db");
  await saveLead({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    company: String(formData.get("company") ?? ""),
    product: "Ventaro ERP",
    reason: `Demo — ${formData.get("businessType")} — ${formData.get("preferredTime")}`,
    message: String(formData.get("message") ?? ""),
    createdAt: new Date(),
    source: "solicitar-demo",
  });
  const { redirect } = await import("@solidjs/router");
  throw redirect("/solicitar-demo?exito=1");
}, "submitDemoRequest");

const businessTypes = ["Tienda / Retail", "Restaurante", "Bar / Cantina", "Cafetería", "Ferretería", "Farmacia", "Otro"];
const times = ["Mañana (9am–12pm)", "Mediodía (12pm–2pm)", "Tarde (2pm–6pm)", "Flexible / Cualquier hora"];

export default function SolicitarDemoPage() {
  const [params] = useSearchParams();
  const submit = useAction(submitDemoRequest);
  const [loading, setLoading] = createSignal(false);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    erpEvents.submitDemo();
    await submit(new FormData(e.target as HTMLFormElement));
    setLoading(false);
  };

  return (
    <>
      <Title>Solicitar Demo de Ventaro ERP · 305 Web Service</Title>
      <Meta name="description" content="Agenda una demostración personalizada de Ventaro ERP. 30 minutos con tu inventario y datos reales. Sin costo." />

      <Header />
      <main class="min-h-screen bg-[#020914]">
        <section class="pt-28 pb-20">
          <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Success state */}
            <Show when={params.exito === "1"}>
              <div class="text-center py-20">
                <div class="text-5xl mb-4">🎉</div>
                <h1 class="text-3xl font-black text-white mb-3">¡Solicitud recibida!</h1>
                <p class="text-slate-400 text-lg mb-8">
                  Te contactaremos en menos de 2 horas para confirmar el horario de la demo.
                </p>
                <a
                  href={erpWhatsApp("confirmar mi demo")}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-[#25D366]/15 border border-[#25D366]/25 hover:bg-[#25D366]/25 transition-colors"
                >
                  Confirmar por WhatsApp
                </a>
              </div>
            </Show>

            <Show when={params.exito !== "1"}>
              {/* Header */}
              <div class="text-center mb-10">
                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-5">
                  <span class="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span class="text-indigo-300 text-xs font-semibold">Demo personalizada · 30 minutos · Sin costo</span>
                </div>
                <h1 class="text-4xl font-black text-white mb-4">Solicita tu demo gratis</h1>
                <p class="text-slate-400">
                  Un especialista te muestra el sistema con datos reales de tu tipo de negocio. Sin ventas agresivas.
                </p>
              </div>

              {/* What to expect */}
              <div class="grid grid-cols-3 gap-3 mb-8">
                {[
                  { emoji: "⏱️", title: "30 minutos", desc: "Demo enfocada en tu negocio" },
                  { emoji: "🎯", title: "Personalizada", desc: "Con tus datos reales" },
                  { emoji: "🚫", title: "Sin presión", desc: "No es una llamada de ventas" },
                ].map((item) => (
                  <div class="text-center p-4 rounded-xl border border-white/8 bg-white/2">
                    <div class="text-2xl mb-2">{item.emoji}</div>
                    <div class="text-white font-bold text-sm mb-1">{item.title}</div>
                    <div class="text-slate-500 text-xs">{item.desc}</div>
                  </div>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} class="space-y-4">
                <div class="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-slate-300 text-sm font-semibold mb-1.5">Nombre *</label>
                    <input
                      name="name"
                      type="text"
                      required
                      placeholder="Tu nombre completo"
                      class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-slate-300 text-sm font-semibold mb-1.5">Email *</label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="tu@empresa.com"
                      class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
                    />
                  </div>
                </div>

                <div class="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-slate-300 text-sm font-semibold mb-1.5">Teléfono / WhatsApp *</label>
                    <input
                      name="phone"
                      type="tel"
                      required
                      placeholder="+1 305 000 0000"
                      class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-slate-300 text-sm font-semibold mb-1.5">Nombre del negocio</label>
                    <input
                      name="company"
                      type="text"
                      placeholder="Tu negocio"
                      class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
                    />
                  </div>
                </div>

                <div class="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-slate-300 text-sm font-semibold mb-1.5">Tipo de negocio *</label>
                    <select
                      name="businessType"
                      required
                      class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
                    >
                      <option value="" class="bg-[#0A1628]">Seleccionar...</option>
                      {businessTypes.map((bt) => (
                        <option value={bt} class="bg-[#0A1628]">{bt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label class="block text-slate-300 text-sm font-semibold mb-1.5">Horario preferido</label>
                    <select
                      name="preferredTime"
                      class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
                    >
                      {times.map((t) => (
                        <option value={t} class="bg-[#0A1628]">{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-slate-300 text-sm font-semibold mb-1.5">¿Qué necesitas resolver?</label>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Cuéntanos brevemente sobre tu negocio y lo que buscas en el sistema..."
                    class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading()}
                  class="w-full py-4 rounded-xl font-bold text-white text-lg transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                  style="background: linear-gradient(135deg,#3730A3,#0369A1)"
                >
                  {loading() ? "Enviando..." : "Solicitar Demo Gratis →"}
                </button>

                <p class="text-center text-slate-600 text-xs">
                  ¿Prefieres WhatsApp?{" "}
                  <a href={erpWhatsApp("solicitar una demo")} target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:underline">
                    Escríbenos directamente
                  </a>
                </p>
              </form>
            </Show>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
