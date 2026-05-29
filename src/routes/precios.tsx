import { Title, Meta } from "@solidjs/meta";
import { createSignal } from "solid-js";
import { A } from "@solidjs/router";
import Header from "~/components/layout/Header";
import Footer from "~/components/layout/Footer";
import LicensePlans from "~/components/erp/LicensePlans";
import FAQERP from "~/components/erp/FAQERP";
import StickyCTA from "~/components/erp/StickyCTA";
import { erpConfig, erpWhatsApp } from "~/config/erp.config";
import { erpEvents } from "~/lib/analytics";

export default function PreciosPage() {
  return (
    <>
      <Title>Precios Ventaro — Desde $19/mes · 305 Web Service</Title>
      <Meta name="description" content="Planes de Ventaro desde $19/mes. Starter, Profesional, Restaurante y Enterprise. 14 días gratis sin tarjeta. Funciona offline." />
      <Meta property="og:title" content="Precios Ventaro — Planes desde $19/mes · 305 Web Service" />
      <Meta property="og:description" content="ERP/POS para MIPYMES desde $19/mes. 14 días gratis, sin tarjeta, sin contrato." />

      <Header />
      <main>
        {/* Hero */}
        <section class="bg-[#020914] pt-28 pb-4 relative overflow-hidden">
          <div class="absolute inset-0 bg-grid opacity-40" />
          <div class="absolute inset-0" style="background: radial-gradient(ellipse at 50% -10%, rgba(55,48,163,0.25) 0%, transparent 60%)" />
          <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-5">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse-slow" />
              <span class="text-indigo-300 text-xs font-semibold">Ventaro — ERP/POS para Cuba y LATAM</span>
            </div>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
              Planes para cada{" "}
              <span style="background: linear-gradient(90deg,#818CF8,#38BDF8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;">
                etapa de tu negocio
              </span>
            </h1>
            <p class="text-slate-400 text-xl max-w-2xl mx-auto mb-6">
              Sin contratos de permanencia. Cancela cuando quieras.
              <strong class="text-white"> Funciona sin internet.</strong>
            </p>

            <div class="flex flex-wrap justify-center gap-3 mb-10">
              {["✓ 14 días gratis sin tarjeta", "✓ Modo offline incluido", "✓ Soporte en español", "✓ Pago flexible"].map((t) => (
                <span class="text-sm text-slate-400">{t}</span>
              ))}
            </div>
          </div>
        </section>

        <LicensePlans />

        {/* Offline highlight */}
        <section class="py-12 bg-white">
          <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 border border-indigo-200 mb-5">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span class="text-indigo-700 text-xs font-bold">Diseñado para Cuba y LATAM</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-black text-slate-900 mb-4">Funciona aunque no haya internet</h2>
            <p class="text-slate-500 text-lg max-w-2xl mx-auto mb-8">
              Todos los planes incluyen modo offline en red local (LAN). Tus ventas no se detienen aunque el internet falle.
            </p>
            <div class="grid sm:grid-cols-3 gap-4 text-left">
              {[
                { emoji: "🔌", title: "LAN sin internet", desc: "Funciona en tu red local. Tan rápido como siempre." },
                { emoji: "🔄", title: "Sync automático", desc: "Cuando vuelve internet, los datos suben solos." },
                { emoji: "📱", title: "Activación offline", desc: "¿Sin internet? Te enviamos el código por WhatsApp." },
              ].map((item) => (
                <div class="p-5 rounded-xl bg-slate-50 border border-slate-100">
                  <div class="text-2xl mb-3">{item.emoji}</div>
                  <h3 class="font-bold text-slate-900 mb-1 text-sm">{item.title}</h3>
                  <p class="text-slate-500 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Payment methods */}
        <section class="py-12 bg-slate-50">
          <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p class="text-indigo-600 text-sm font-semibold uppercase tracking-widest mb-3">Métodos de pago</p>
            <h2 class="text-2xl font-black text-slate-900 mb-3">Paga como puedas</h2>
            <p class="text-slate-500 mb-8">Aceptamos todos los métodos. Si tienes una situación especial, hablamos.</p>
            <div class="flex flex-wrap justify-center gap-3">
              {["Zelle", "Cash App", "PayPal", "Transferencia bancaria", "Tarjeta crédito/débito", "Efectivo (local)", "Crypto (consultar)"].map((m) => (
                <span class="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-medium shadow-sm">{m}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Compare CTA */}
        <section class="py-10 bg-white border-t border-slate-100">
          <div class="max-w-xl mx-auto px-4 text-center">
            <h2 class="text-2xl font-black text-slate-900 mb-3">¿Quieres comparar en detalle?</h2>
            <p class="text-slate-500 mb-6">Tabla completa con todas las funcionalidades por plan. Sin letra pequeña.</p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <A
                href="/comparar-planes"
                onClick={() => erpEvents.clickComparePlans()}
                class="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:-translate-y-0.5"
                style="background: linear-gradient(135deg,#3730A3,#0369A1)"
              >
                Ver tabla comparativa
              </A>
              <a
                href={erpWhatsApp("precios y planes")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => erpEvents.clickWhatsApp("precios")}
                class="px-6 py-3 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Preguntar por WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* License system */}
        <section class="py-14 bg-[#020914]">
          <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p class="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Licencias</p>
            <h2 class="text-3xl font-black text-white mb-4">Tu licencia, bajo tu control</h2>
            <p class="text-slate-400 text-lg mb-10">Activa, renueva y gestiona desde tu panel. Sin llamar a nadie.</p>
            <div class="grid sm:grid-cols-3 gap-5">
              {[
                { emoji: "🧾", title: "14 días gratis",       desc: "Sin tarjeta. Sin preguntas. Explora todo el sistema." },
                { emoji: "🔑", title: "Activación offline",   desc: "Sin internet para activar? Te enviamos el código por WhatsApp." },
                { emoji: "⏳", title: "7 días de gracia",     desc: "Si vence tu licencia, tienes 7 días extra para renovar sin perder datos." },
              ].map((item) => (
                <div class="p-5 rounded-xl bg-white/3 border border-white/8 text-left">
                  <div class="text-2xl mb-3">{item.emoji}</div>
                  <h3 class="font-bold text-white mb-2 text-sm">{item.title}</h3>
                  <p class="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FAQERP />

        {/* Final CTA */}
        <section class="py-16" style="background: linear-gradient(135deg,#3730A3,#0369A1)">
          <div class="max-w-2xl mx-auto px-4 text-center">
            <h2 class="text-3xl font-black text-white mb-3">Empieza gratis hoy. Sin tarjeta.</h2>
            <p class="text-indigo-200 mb-8">
              14 días para explorar todo el sistema sin límites. Si no te convence, no pagás nada.
            </p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <A
                href="/solicitar-demo"
                class="px-8 py-4 rounded-xl font-bold text-indigo-900 bg-white hover:bg-indigo-50 transition-colors"
              >
                Solicitar demo gratis
              </A>
              <a
                href={erpWhatsApp("comenzar prueba gratuita")}
                target="_blank"
                rel="noopener noreferrer"
                class="px-8 py-4 rounded-xl font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/20 transition-colors"
              >
                Hablar por WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyCTA />
    </>
  );
}
