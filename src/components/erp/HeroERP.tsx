import { A } from "@solidjs/router";
import { erpConfig, erpWhatsApp } from "~/config/erp.config";
import { erpEvents } from "~/lib/analytics";

export default function HeroERP() {
  return (
    <section class="relative bg-[#020914] overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24">
      {/* Grid overlay */}
      <div class="absolute inset-0 bg-grid opacity-40" />
      {/* Indigo glow */}
      <div class="absolute inset-0" style="background: radial-gradient(ellipse at 30% 40%, rgba(55,48,163,0.35) 0%, transparent 60%)" />
      <div class="absolute inset-0" style="background: radial-gradient(ellipse at 80% 80%, rgba(3,105,161,0.2) 0%, transparent 50%)" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-14 items-center">

          {/* ── Left ── */}
          <div>
            {/* Badge */}
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse-slow" />
              <span class="text-indigo-300 text-xs font-semibold tracking-wide">ERP/POS para Cuba y Latinoamérica · v{erpConfig.version}</span>
            </div>

            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] mb-6">
              Control total de tu negocio,{" "}
              <span style="background: linear-gradient(90deg,#818CF8,#38BDF8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;">
                con o sin internet
              </span>
            </h1>

            <p class="text-slate-400 text-xl leading-relaxed mb-8 max-w-lg">
              Ventas, inventario, restaurantes, bares, múltiples sucursales,{" "}
              <strong class="text-white">modo offline</strong> y sincronización cloud en una sola plataforma.
            </p>

            {/* Trust pills */}
            <div class="flex flex-wrap gap-x-5 gap-y-2 mb-10 text-sm text-slate-400">
              {["✓ Funciona sin internet", "✓ Desde $19/mes", "✓ 14 días gratis", "✓ Soporte en español"].map((t) => (
                <span>{t}</span>
              ))}
            </div>

            {/* CTAs */}
            <div class="flex flex-wrap gap-3">
              <a
                href={erpConfig.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => erpEvents.clickDemo()}
                class="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30"
                style="background: linear-gradient(135deg,#3730A3,#0369A1)"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Probar Demo
              </a>

              <A
                href="/descargas"
                onClick={() => erpEvents.clickDownload("hero")}
                class="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-white/8 border border-white/10 hover:bg-white/12 hover:border-white/20 transition-all duration-200"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Descargar
              </A>

              <A
                href="/precios"
                class="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-300 hover:text-white bg-white/4 hover:bg-white/8 border border-white/8 transition-all duration-200"
              >
                Ver Precios
              </A>

              <a
                href={erpWhatsApp("demo y precios")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => erpEvents.clickWhatsApp("hero")}
                class="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-[#25D366]/15 border border-[#25D366]/25 hover:bg-[#25D366]/25 transition-all duration-200"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>

          {/* ── Right: Dashboard mockup ── */}
          <div class="relative hidden lg:block">
            {/* Glow behind */}
            <div class="absolute inset-0 rounded-3xl blur-3xl opacity-20" style="background: linear-gradient(135deg,#3730A3,#0369A1)" />

            <div class="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0A1628] shadow-2xl shadow-indigo-900/30">
              {/* Chrome bar */}
              <div class="flex items-center gap-2 px-4 py-3 bg-[#020914] border-b border-white/5">
                <div class="flex gap-1.5">
                  <div class="w-3 h-3 rounded-full bg-red-500/50" />
                  <div class="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div class="w-3 h-3 rounded-full bg-emerald-500/50" />
                </div>
                <div class="flex-1 ml-3 bg-white/5 rounded px-3 py-1 text-xs text-slate-500">
                  Axis ERP — Panel de Control
                </div>
              </div>

              {/* App layout */}
              <div class="flex h-[340px]">
                {/* Sidebar */}
                <div class="w-12 bg-[#030B1A] border-r border-white/5 flex flex-col items-center py-3 gap-3">
                  {["#818CF8","#38BDF8","#64748B","#64748B","#64748B"].map((c, i) => (
                    <div class="w-7 h-7 rounded-lg flex items-center justify-center" style={`background: ${i === 0 ? c+"20" : "transparent"}`}>
                      <div class="w-3 h-3 rounded-sm" style={`background: ${c}`} />
                    </div>
                  ))}
                </div>

                {/* Main content */}
                <div class="flex-1 p-4 overflow-hidden">
                  {/* Stat cards */}
                  <div class="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { label: "Ventas hoy", value: "$1,847", delta: "+12%", color: "#818CF8" },
                      { label: "Órdenes",    value: "47",     delta: "+5",   color: "#38BDF8" },
                      { label: "Stock bajo", value: "3",      delta: "!",    color: "#F59E0B" },
                    ].map((s) => (
                      <div class="bg-white/3 rounded-xl p-3 border border-white/5">
                        <div class="text-slate-500 text-[10px] mb-1">{s.label}</div>
                        <div class="text-white font-bold text-sm">{s.value}</div>
                        <div class="text-[10px] font-semibold mt-0.5" style={`color: ${s.color}`}>{s.delta}</div>
                      </div>
                    ))}
                  </div>

                  {/* Sales chart (CSS bars) */}
                  <div class="bg-white/3 rounded-xl p-3 border border-white/5 mb-3">
                    <div class="text-slate-500 text-[10px] mb-2">Ventas últimos 7 días</div>
                    <div class="flex items-end gap-1.5 h-12">
                      {[40, 65, 45, 80, 55, 90, 70].map((h) => (
                        <div class="flex-1 rounded-t-sm" style={`height: ${h}%; background: linear-gradient(to top, #3730A3, #818CF8)`} />
                      ))}
                    </div>
                  </div>

                  {/* Recent sales */}
                  <div class="bg-white/3 rounded-xl p-3 border border-white/5">
                    <div class="text-slate-500 text-[10px] mb-2">Ventas recientes</div>
                    <div class="space-y-1.5">
                      {[
                        { name: "Producto #1432", amount: "$45.00", time: "2m" },
                        { name: "Producto #0892", amount: "$128.50", time: "8m" },
                        { name: "Servicio catering", amount: "$340.00", time: "15m" },
                      ].map((tx) => (
                        <div class="flex items-center justify-between">
                          <span class="text-slate-400 text-[10px] truncate">{tx.name}</span>
                          <div class="flex items-center gap-2 flex-shrink-0 ml-2">
                            <span class="text-[9px] text-slate-600">{tx.time}</span>
                            <span class="text-[10px] font-semibold text-indigo-300">{tx.amount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating: sale confirmed */}
            <div class="absolute -top-3 -right-3 bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg shadow-emerald-500/30 animate-pulse-slow">
              ✓ Venta $45.00 registrada
            </div>

            {/* Floating: offline badge */}
            <div class="absolute -bottom-3 -left-3 flex items-center gap-2 bg-[#0A1628] border border-white/10 rounded-xl px-3 py-2 shadow-lg">
              <span class="w-2 h-2 rounded-full bg-amber-400" />
              <span class="text-amber-300 text-xs font-semibold">Modo offline activo</span>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div class="mt-16 pt-8 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { value: "500+", label: "Negocios activos" },
            { value: "6",    label: "Tipos de negocio" },
            { value: "99.9%",label: "Uptime garantizado" },
            { value: "24/7", label: "Soporte en español" },
          ].map((s) => (
            <div class="text-center">
              <div class="text-3xl font-black text-white mb-1">{s.value}</div>
              <div class="text-slate-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
