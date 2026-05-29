import { Title, Meta } from "@solidjs/meta";
import { Show } from "solid-js";
import { A } from "@solidjs/router";
import Header from "~/components/layout/Header";
import Footer from "~/components/layout/Footer";
import { erpConfig, erpWhatsApp } from "~/config/erp.config";
import { erpEvents } from "~/lib/analytics";

interface DownloadItem {
  icon: string;
  label: string;
  description: string;
  filename: string;
  url: string;
  badge?: string;
  size?: string;
  note?: string;
}

const downloads: DownloadItem[] = [
  {
    icon: "💻",
    label: "Ventaro — Windows",
    description: "Instalador completo para Windows 10 y 11. Incluye POS, inventario, módulo de restaurantes y sincronización cloud.",
    filename: "Ventaro-Setup.exe",
    url: erpConfig.downloads.windows,
    badge: "Principal",
    size: "~95 MB",
    note: "Windows 10/11 · 64-bit · 4 GB RAM mínimo",
  },
  {
    icon: "📦",
    label: "Versión portátil (ZIP)",
    description: "Sin instalación. Copia en un USB y ejecuta desde cualquier PC. Ideal para técnicos e instalaciones rápidas.",
    filename: "Ventaro-Portable.zip",
    url: erpConfig.downloads.windows,
    size: "~88 MB",
    note: "No requiere instalación · Ejecuta desde USB",
  },
  {
    icon: "📱",
    label: "Ventaro — Android",
    description: "App para tablets y teléfonos Android. Úsala como terminal POS adicional o para gestión de mesas en restaurantes.",
    filename: "Ventaro.apk",
    url: erpConfig.downloads.android,
    badge: "Próximamente",
    size: "~45 MB",
    note: "Android 9.0+ · Tablet recomendada",
  },
  {
    icon: "🖥️",
    label: "Servidor LAN",
    description: "Componente servidor para instalaciones en red local. Instala en un PC o servidor Windows y conecta múltiples terminales.",
    filename: "Ventaro-Server.exe",
    url: erpConfig.downloads.server,
    size: "~110 MB",
    note: "Windows Server 2019+ o Windows 10/11 Pro",
  },
  {
    icon: "📄",
    label: "Manual de usuario (PDF)",
    description: "Guía completa paso a paso para operadores. Desde la primera venta hasta el cierre mensual.",
    filename: "Ventaro-Manual-v2.1.pdf",
    url: erpConfig.downloads.manual,
    note: "PDF · Actualizado a v2.1.0",
  },
  {
    icon: "📚",
    label: "Documentación técnica",
    description: "Documentación para administradores, integradores y desarrolladores. API, configuración avanzada y troubleshooting.",
    filename: "",
    url: erpConfig.downloads.docs,
    note: "Documentación web · Siempre actualizada",
  },
  {
    icon: "🎬",
    label: "Videos tutoriales",
    description: "Biblioteca completa de videos: instalación, configuración, POS, inventario, restaurantes y reportes.",
    filename: "",
    url: erpConfig.downloads.video,
    note: "YouTube · Subtítulos en español",
  },
];

export default function DescargasPage() {
  return (
    <>
      <Title>Descargas Ventaro — Versión oficial v{erpConfig.version} · 305 Web Service</Title>
      <Meta name="description" content={`Descarga Ventaro v${erpConfig.version}. Windows, Android, servidor LAN, manual PDF y documentación técnica. Versión oficial.`} />

      <Header />
      <main class="min-h-screen bg-[#020914]">
        {/* Hero */}
        <section class="pt-28 pb-12 relative overflow-hidden">
          <div class="absolute inset-0 bg-grid opacity-40" />
          <div class="absolute inset-0" style="background: radial-gradient(ellipse at 50% 0%, rgba(55,48,163,0.25) 0%, transparent 60%)" />
          <div class="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-4xl sm:text-5xl font-black text-white mb-4">Descarga Ventaro</h1>
            <div class="flex items-center justify-center gap-3 mb-4">
              <span class="px-3 py-1 rounded-full text-sm font-bold border border-indigo-500/30 text-indigo-300 bg-indigo-500/10">
                v{erpConfig.version}
              </span>
              <span class="text-slate-500 text-sm">{erpConfig.releaseDate}</span>
              <a href={erpConfig.downloads.changelog} class="text-slate-500 text-sm hover:text-slate-300 transition-colors">
                Ver changelog →
              </a>
            </div>
            <p class="text-slate-400 text-lg">
              Versión oficial estable. Incluye todos los módulos, actualizaciones automáticas y soporte.
            </p>
          </div>
        </section>

        {/* Download grid */}
        <section class="py-10 pb-16">
          <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-2 gap-4">
              {downloads.map((dl) => (
                <div class="group p-5 rounded-2xl border border-white/8 bg-white/2 hover:bg-white/4 hover:border-white/15 transition-all duration-200">
                  <div class="flex items-start gap-4">
                    {/* Icon */}
                    <div class="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-indigo-500/10 border border-indigo-500/20">
                      {dl.icon}
                    </div>

                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <h3 class="text-white font-bold text-sm">{dl.label}</h3>
                        <Show when={dl.badge}>
                          <span class={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            dl.badge === "Principal"
                              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                              : "bg-slate-500/20 text-slate-400 border border-slate-500/30"
                          }`}>
                            {dl.badge}
                          </span>
                        </Show>
                      </div>
                      <p class="text-slate-500 text-xs leading-relaxed mb-3">{dl.description}</p>
                      <Show when={dl.note}>
                        <p class="text-slate-600 text-xs mb-3">{dl.note}</p>
                      </Show>

                      <Show
                        when={dl.url && dl.url !== "#"}
                        fallback={
                          <span class="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-semibold text-slate-500 bg-white/3 border border-white/8 cursor-not-allowed">
                            Próximamente
                          </span>
                        }
                      >
                        <a
                          href={dl.url}
                          download={dl.filename || undefined}
                          target={dl.filename ? undefined : "_blank"}
                          rel="noopener noreferrer"
                          onClick={() => erpEvents.clickDownload(dl.label)}
                          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white transition-all hover:-translate-y-0.5"
                          style="background: linear-gradient(135deg,#3730A3,#0369A1)"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          {dl.filename ? "Descargar" : "Abrir"}
                          <Show when={dl.size}>
                            <span class="opacity-60">{dl.size}</span>
                          </Show>
                        </a>
                      </Show>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* System requirements */}
        <section class="py-12 border-t border-white/5">
          <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-xl font-black text-white mb-6 text-center">Requisitos del sistema</h2>
            <div class="grid sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Mínimos (1 terminal)",
                  items: ["Windows 10 64-bit", "Intel Core i3 / AMD Ryzen 3", "4 GB RAM", "50 GB disco libre", "Red local (LAN) — sin internet"],
                },
                {
                  title: "Recomendados (multi-terminal)",
                  items: ["Windows 10/11 64-bit", "Intel Core i5 / AMD Ryzen 5", "8 GB RAM", "100 GB SSD", "Red LAN 100 Mbps + internet opcional"],
                },
              ].map((req) => (
                <div class="p-5 rounded-xl border border-white/8 bg-white/2">
                  <h3 class="text-white font-bold text-sm mb-3">{req.title}</h3>
                  <ul class="space-y-1.5">
                    {req.items.map((item) => (
                      <li class="text-slate-400 text-xs flex items-center gap-2">
                        <span class="text-indigo-400 font-bold">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Help CTA */}
        <section class="py-12 border-t border-white/5">
          <div class="max-w-xl mx-auto px-4 text-center">
            <h3 class="text-xl font-black text-white mb-3">¿Necesitas ayuda con la instalación?</h3>
            <p class="text-slate-500 text-sm mb-6">
              Ofrecemos instalación remota incluida en los planes Profesional y superiores. También puedes escribirnos por WhatsApp.
            </p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <A
                href="/solicitar-demo"
                class="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:-translate-y-0.5"
                style="background: linear-gradient(135deg,#3730A3,#0369A1)"
              >
                Solicitar instalación asistida
              </A>
              <a
                href={erpWhatsApp("instalación de Ventaro")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => erpEvents.clickWhatsApp("descargas")}
                class="px-6 py-3 rounded-xl font-semibold text-white bg-[#25D366]/15 border border-[#25D366]/25 hover:bg-[#25D366]/25 transition-colors"
              >
                Ayuda por WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
