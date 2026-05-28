import { A } from "@solidjs/router";
import { getWhatsAppUrl } from "~/data/products";

export default function Hero() {
  const whatsappUrl = getWhatsAppUrl();

  return (
    <section class="relative min-h-screen flex items-center bg-dark-section overflow-hidden">
      {/* Background effects */}
      <div class="absolute inset-0 bg-grid" />
      <div class="absolute inset-0 bg-hero-glow" />

      {/* Animated blobs */}
      <div
        class="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-10 animate-blob"
        style="background: radial-gradient(circle, #2563EB 0%, #1D4ED8 40%, transparent 70%);"
      />
      <div
        class="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-8 animate-blob"
        style="background: radial-gradient(circle, #06B6D4 0%, #0891B2 40%, transparent 70%); animation-delay: 3s;"
      />

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div>
            {/* Badge */}
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/20 mb-6 animate-fade-in">
              <span class="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse-slow" />
              <span class="text-brand-accent text-xs font-semibold tracking-wide uppercase">
                Software para negocios reales
              </span>
            </div>

            {/* Headline */}
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight mb-6 animate-fade-up delay-100">
              El software que tu negocio{" "}
              <span class="text-gradient">necesita para crecer</span>
            </h1>

            {/* Subheadline */}
            <p class="text-lg text-slate-400 leading-relaxed mb-8 max-w-xl animate-fade-up delay-200">
              Soluciones digitales diseñadas para pequeñas y medianas empresas. Sistemas reales que resuelven problemas reales, sin complicaciones técnicas.
            </p>

            {/* CTAs */}
            <div class="flex flex-col sm:flex-row gap-3 animate-fade-up delay-300">
              <A
                href="/productos"
                class="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-blue hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5"
              >
                Ver soluciones
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </A>
              <A
                href="/contacto?motivo=demo"
                class="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 hover:-translate-y-0.5"
              >
                Solicitar demo gratis
              </A>
            </div>

            {/* Trust signals */}
            <div class="flex flex-wrap items-center gap-4 mt-8 animate-fade-up delay-400">
              {[
                { icon: "✓", text: "Sin contratos de permanencia" },
                { icon: "✓", text: "Soporte en español" },
                { icon: "✓", text: "Setup incluido" },
              ].map((item) => (
                <div class="flex items-center gap-1.5 text-sm text-slate-400">
                  <span class="text-brand-emeraldLight font-bold">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual */}
          <div class="relative animate-fade-up delay-300">
            {/* Main card: Dashboard mockup */}
            <div class="gradient-border rounded-2xl p-[1px] animate-float">
              <div class="bg-[#071426] rounded-2xl overflow-hidden shadow-card-dark">
                {/* Browser chrome */}
                <div class="bg-[#0A1628] px-4 py-3 border-b border-white/5 flex items-center gap-2">
                  <div class="flex gap-1.5">
                    <div class="w-3 h-3 rounded-full bg-red-500/70" />
                    <div class="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div class="w-3 h-3 rounded-full bg-green-500/70" />
                  </div>
                  <div class="flex-1 ml-2 bg-white/5 rounded-md px-3 py-1 text-xs text-slate-500">
                    app.305webservice.com
                  </div>
                </div>
                {/* Dashboard content */}
                <div class="p-6">
                  <div class="flex items-center justify-between mb-4">
                    <div>
                      <p class="text-xs text-slate-500 mb-0.5">Ventas hoy</p>
                      <p class="text-2xl font-bold text-white">$12,480</p>
                    </div>
                    <div class="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <span class="text-emerald-400 text-xs font-semibold">+18.2%</span>
                    </div>
                  </div>
                  {/* Mini chart */}
                  <div class="flex items-end gap-1 h-16 mb-4">
                    {[40, 65, 45, 80, 60, 90, 75, 95, 70, 88, 72, 100].map((h) => (
                      <div
                        class="flex-1 rounded-sm bg-gradient-to-t from-brand-blue to-brand-accent opacity-70"
                        style={`height: ${h}%`}
                      />
                    ))}
                  </div>
                  {/* Stats row */}
                  <div class="grid grid-cols-3 gap-3">
                    {[
                      { label: "Productos", value: "284" },
                      { label: "Clientes", value: "1,240" },
                      { label: "Órdenes", value: "48" },
                    ].map((stat) => (
                      <div class="bg-white/5 rounded-xl p-3 text-center">
                        <p class="text-white font-bold text-sm">{stat.value}</p>
                        <p class="text-slate-500 text-xs">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div class="absolute -top-4 -left-4 glass rounded-xl px-3 py-2 shadow-card-dark" style="animation: float 4s ease-in-out 1s infinite;">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <span class="text-emerald-400 text-sm">✓</span>
                </div>
                <div>
                  <p class="text-white text-xs font-semibold">Venta registrada</p>
                  <p class="text-slate-400 text-[10px]">$185.00 · Efectivo</p>
                </div>
              </div>
            </div>

            <div class="absolute -bottom-4 -right-4 glass rounded-xl px-3 py-2 shadow-card-dark" style="animation: float 5s ease-in-out 2s infinite;">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <span class="text-blue-400 text-sm">📅</span>
                </div>
                <div>
                  <p class="text-white text-xs font-semibold">Cita confirmada</p>
                  <p class="text-slate-400 text-[10px]">María G. · 3:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div class="mt-16 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-up delay-500">
          {[
            { value: "50+", label: "Negocios activos" },
            { value: "5+", label: "Años de experiencia" },
            { value: "98%", label: "Satisfacción de clientes" },
            { value: "24h", label: "Tiempo de implementación" },
          ].map((stat) => (
            <div class="text-center">
              <p class="text-2xl sm:text-3xl font-black text-white mb-1">{stat.value}</p>
              <p class="text-slate-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
