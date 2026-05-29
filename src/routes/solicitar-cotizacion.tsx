import { Title, Meta } from "@solidjs/meta";
import { createSignal, Show } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { action, useAction } from "@solidjs/router";
import Header from "~/components/layout/Header";
import Footer from "~/components/layout/Footer";
import { erpWhatsApp } from "~/config/erp.config";
import { erpEvents } from "~/lib/analytics";

const submitQuoteRequest = action(async (formData: FormData) => {
  "use server";
  const { saveLead } = await import("~/lib/db");
  await saveLead({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    company: String(formData.get("company") ?? ""),
    product: "Ventaro",
    reason: `Cotización — ${formData.get("businessType")} — ${formData.get("locations")} sucursales — ${formData.get("users")} usuarios`,
    message: String(formData.get("message") ?? ""),
    createdAt: new Date(),
    source: "solicitar-cotizacion",
  });
  const { redirect } = await import("@solidjs/router");
  throw redirect("/solicitar-cotizacion?exito=1");
}, "submitQuoteRequest");

const businessTypes = ["Tienda / Retail", "Restaurante", "Bar / Cantina", "Cafetería", "Ferretería", "Farmacia", "MIPYME General", "Cadena / Franquicia", "Otro"];
const locationOptions = ["1 sucursal", "2–3 sucursales", "4–10 sucursales", "Más de 10"];
const userOptions = ["1–2 usuarios", "3–5 usuarios", "6–15 usuarios", "Más de 15"];

export default function SolicitarCotizacionPage() {
  const [params] = useSearchParams();
  const submit = useAction(submitQuoteRequest);
  const [loading, setLoading] = createSignal(false);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    erpEvents.submitQuote();
    await submit(new FormData(e.target as HTMLFormElement));
    setLoading(false);
  };

  return (
    <>
      <Title>Solicitar Cotización Ventaro · 305 Web Service</Title>
      <Meta name="description" content="Cotización personalizada para Ventaro. Respuesta en menos de 2 horas. Planes desde $19/mes." />

      <Header />
      <main class="min-h-screen bg-[#020914]">
        <section class="pt-28 pb-20">
          <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Success */}
            <Show when={params.exito === "1"}>
              <div class="text-center py-20">
                <div class="text-5xl mb-4">✅</div>
                <h1 class="text-3xl font-black text-white mb-3">¡Cotización enviada!</h1>
                <p class="text-slate-400 text-lg mb-8">
                  Preparamos tu cotización personalizada y te la enviamos en menos de 2 horas.
                </p>
                <a
                  href={erpWhatsApp("mi cotización de Ventaro")}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-[#25D366]/15 border border-[#25D366]/25 hover:bg-[#25D366]/25 transition-colors"
                >
                  Seguimiento por WhatsApp
                </a>
              </div>
            </Show>

            <Show when={params.exito !== "1"}>
              <div class="text-center mb-10">
                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-5">
                  <span class="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span class="text-indigo-300 text-xs font-semibold">Respuesta en menos de 2 horas</span>
                </div>
                <h1 class="text-4xl font-black text-white mb-4">Cotización personalizada</h1>
                <p class="text-slate-400">
                  Cuéntanos sobre tu negocio y te enviamos un presupuesto exacto con el plan ideal.
                </p>
              </div>

              <form onSubmit={handleSubmit} class="space-y-4">
                <div class="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-slate-300 text-sm font-semibold mb-1.5">Nombre *</label>
                    <input name="name" type="text" required placeholder="Tu nombre"
                      class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm" />
                  </div>
                  <div>
                    <label class="block text-slate-300 text-sm font-semibold mb-1.5">Email *</label>
                    <input name="email" type="email" required placeholder="tu@empresa.com"
                      class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm" />
                  </div>
                </div>

                <div class="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-slate-300 text-sm font-semibold mb-1.5">WhatsApp *</label>
                    <input name="phone" type="tel" required placeholder="+1 305 000 0000"
                      class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm" />
                  </div>
                  <div>
                    <label class="block text-slate-300 text-sm font-semibold mb-1.5">Empresa</label>
                    <input name="company" type="text" placeholder="Nombre del negocio"
                      class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm" />
                  </div>
                </div>

                <div>
                  <label class="block text-slate-300 text-sm font-semibold mb-1.5">Tipo de negocio *</label>
                  <select name="businessType" required
                    class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500/50 transition-colors text-sm">
                    <option value="" class="bg-[#0A1628]">Seleccionar...</option>
                    {businessTypes.map((bt) => <option value={bt} class="bg-[#0A1628]">{bt}</option>)}
                  </select>
                </div>

                <div class="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-slate-300 text-sm font-semibold mb-1.5">Sucursales</label>
                    <select name="locations"
                      class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500/50 transition-colors text-sm">
                      {locationOptions.map((l) => <option value={l} class="bg-[#0A1628]">{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label class="block text-slate-300 text-sm font-semibold mb-1.5">Usuarios / empleados</label>
                    <select name="users"
                      class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500/50 transition-colors text-sm">
                      {userOptions.map((u) => <option value={u} class="bg-[#0A1628]">{u}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-slate-300 text-sm font-semibold mb-1.5">¿Qué necesitas? (opcional)</label>
                  <textarea name="message" rows={3}
                    placeholder="Cuéntanos qué módulos necesitas, si ya tienes un sistema actual, cuándo quieres implementar..."
                    class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm resize-none" />
                </div>

                <button type="submit" disabled={loading()}
                  class="w-full py-4 rounded-xl font-bold text-white text-lg transition-all hover:-translate-y-0.5 disabled:opacity-60"
                  style="background: linear-gradient(135deg,#3730A3,#0369A1)">
                  {loading() ? "Enviando..." : "Solicitar Cotización →"}
                </button>

                <p class="text-center text-slate-600 text-xs">
                  Respuesta garantizada en menos de 2 horas · Lunes a sábado 9am–8pm
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
