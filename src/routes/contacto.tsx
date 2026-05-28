import { Title, Meta } from "@solidjs/meta";
import { useSearchParams } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { action, redirect } from "@solidjs/router";
import Header from "~/components/layout/Header";
import Footer from "~/components/layout/Footer";
import { products } from "~/data/products";
import { saveLead } from "~/lib/db";

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || "13051234567";
const EMAIL = import.meta.env.VITE_CONTACT_EMAIL || "info@305webservice.com";

const submitContact = action(async (formData: FormData) => {
  "use server";

  const data = {
    name: (formData.get("name") as string)?.trim(),
    email: (formData.get("email") as string)?.trim(),
    phone: (formData.get("phone") as string)?.trim() || undefined,
    company: (formData.get("company") as string)?.trim() || undefined,
    product: (formData.get("product") as string) || undefined,
    reason: (formData.get("reason") as string) || "general",
    message: (formData.get("message") as string)?.trim(),
    createdAt: new Date(),
    source: "web-contacto",
  };

  if (!data.name || !data.email || !data.message) {
    return { error: "Por favor completa los campos requeridos." };
  }

  await saveLead(data);

  throw redirect("/contacto?exito=1");
}, "submitContact");

const reasons = [
  { value: "demo", label: "Solicitar demo de un producto" },
  { value: "cotizacion", label: "Solicitar cotización" },
  { value: "soporte", label: "Soporte técnico" },
  { value: "proyecto", label: "Proyecto de desarrollo" },
  { value: "general", label: "Consulta general" },
];

export default function ContactPage() {
  const [params] = useSearchParams();

  return (
    <>
      <Title>Contacto — 305 Web Service</Title>
      <Meta name="description" content="Contacta al equipo de 305 Web Service. Solicita una demo, cotización o cuéntanos sobre tu proyecto." />

      <Header />
      <main>
        {/* Hero */}
        <section class="bg-dark-section pt-28 pb-16 relative overflow-hidden">
          <div class="absolute inset-0 bg-grid" />
          <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p class="text-brand-accent text-sm font-semibold uppercase tracking-widest mb-3">Hablemos</p>
            <h1 class="text-4xl sm:text-5xl font-black text-white mb-4">
              ¿Listo para dar el siguiente paso?
            </h1>
            <p class="text-slate-400 text-lg max-w-xl mx-auto">
              Completa el formulario y te contactamos en menos de 2 horas. Sin presión, sin compromisos.
            </p>
          </div>
        </section>

        {/* Main content */}
        <section class="py-16 bg-white">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid lg:grid-cols-3 gap-12">
              {/* Contact info */}
              <div class="lg:col-span-1 space-y-6">
                <div>
                  <h2 class="text-xl font-bold text-slate-900 mb-4">Canales de contacto</h2>
                  <div class="space-y-4">
                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/${WHATSAPP}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex items-center gap-4 p-4 rounded-xl bg-green-50 border border-green-100 hover:border-green-200 transition-colors group"
                    >
                      <div class="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.852L.057 23.743a.5.5 0 00.612.612l5.9-1.476A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                        </svg>
                      </div>
                      <div>
                        <p class="font-semibold text-slate-900 text-sm">WhatsApp</p>
                        <p class="text-green-600 text-xs">Respuesta rápida · Disponible ahora</p>
                      </div>
                    </a>

                    {/* Email */}
                    <a
                      href={`mailto:${EMAIL}`}
                      class="flex items-center gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100 hover:border-blue-200 transition-colors"
                    >
                      <div class="w-10 h-10 rounded-lg bg-brand-blue flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p class="font-semibold text-slate-900 text-sm">Email</p>
                        <p class="text-slate-500 text-xs">{EMAIL}</p>
                      </div>
                    </a>
                  </div>
                </div>

                {/* What to expect */}
                <div class="p-5 rounded-xl bg-slate-50 border border-slate-100">
                  <h3 class="font-bold text-slate-900 mb-3">¿Qué esperar?</h3>
                  <ul class="space-y-2.5 text-sm text-slate-500">
                    {[
                      "Respuesta en menos de 2 horas",
                      "Demo personalizada sin costo",
                      "Sin presiones de venta",
                      "Propuesta clara con precios reales",
                      "Soporte en español siempre",
                    ].map((item) => (
                      <li class="flex items-center gap-2">
                        <span class="text-brand-emerald font-bold">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Form */}
              <div class="lg:col-span-2">
                <Show
                  when={!params.exito}
                  fallback={
                    <div class="text-center py-16">
                      <div class="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h2 class="text-2xl font-black text-slate-900 mb-2">¡Mensaje recibido!</h2>
                      <p class="text-slate-500 mb-6">
                        Gracias por contactarnos. Te respondemos en menos de 2 horas en días hábiles.
                      </p>
                      <a href="/" class="px-6 py-3 bg-brand-blue text-white font-semibold rounded-xl hover:bg-blue-500 transition-colors">
                        Volver al inicio
                      </a>
                    </div>
                  }
                >
                  <div>
                    <h2 class="text-2xl font-black text-slate-900 mb-6">Envíanos un mensaje</h2>
                    <form action={submitContact} method="post" class="space-y-4">
                      {/* Name + Email */}
                      <div class="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label for="name" class="block text-sm font-medium text-slate-700 mb-1.5">
                            Nombre completo <span class="text-red-500">*</span>
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            placeholder="Juan García"
                            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-slate-900 placeholder-slate-400 text-sm bg-white"
                          />
                        </div>
                        <div>
                          <label for="email" class="block text-sm font-medium text-slate-700 mb-1.5">
                            Email <span class="text-red-500">*</span>
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="juan@empresa.com"
                            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-slate-900 placeholder-slate-400 text-sm bg-white"
                          />
                        </div>
                      </div>

                      {/* Phone + Company */}
                      <div class="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label for="phone" class="block text-sm font-medium text-slate-700 mb-1.5">
                            Teléfono / WhatsApp
                          </label>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+1 (305) 000-0000"
                            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-slate-900 placeholder-slate-400 text-sm bg-white"
                          />
                        </div>
                        <div>
                          <label for="company" class="block text-sm font-medium text-slate-700 mb-1.5">
                            Empresa / Negocio
                          </label>
                          <input
                            id="company"
                            name="company"
                            type="text"
                            placeholder="Mi Empresa S.A."
                            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-slate-900 placeholder-slate-400 text-sm bg-white"
                          />
                        </div>
                      </div>

                      {/* Reason */}
                      <div>
                        <label for="reason" class="block text-sm font-medium text-slate-700 mb-1.5">
                          Motivo de consulta
                        </label>
                        <select
                          id="reason"
                          name="reason"
                          class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-slate-900 text-sm bg-white appearance-none"
                        >
                          {reasons.map((r) => (
                            <option value={r.value} selected={params.motivo === r.value}>
                              {r.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Product of interest */}
                      <div>
                        <label for="product" class="block text-sm font-medium text-slate-700 mb-1.5">
                          Producto de interés
                        </label>
                        <select
                          id="product"
                          name="product"
                          class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-slate-900 text-sm bg-white appearance-none"
                        >
                          <option value="">No aplica / Servicio a medida</option>
                          {products.map((p) => (
                            <option value={p.slug} selected={params.producto === p.slug}>
                              {p.name} — {p.tagline}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Message */}
                      <div>
                        <label for="message" class="block text-sm font-medium text-slate-700 mb-1.5">
                          Cuéntanos sobre tu necesidad <span class="text-red-500">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={4}
                          placeholder="Describe brevemente tu negocio y qué problema necesitas resolver..."
                          class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-slate-900 placeholder-slate-400 text-sm bg-white resize-none"
                        />
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        class="w-full px-6 py-3.5 bg-brand-blue hover:bg-blue-500 text-white font-bold rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25 text-base"
                      >
                        Enviar mensaje
                      </button>

                      <p class="text-center text-xs text-slate-400">
                        Al enviar, aceptas que te contactemos para responder tu consulta. Sin spam, sin listas de correo.
                      </p>
                    </form>
                  </div>
                </Show>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
