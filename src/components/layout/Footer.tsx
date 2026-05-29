import { A } from "@solidjs/router";

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || "13051234567";
const EMAIL = import.meta.env.VITE_CONTACT_EMAIL || "info@305webservice.com";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer class="bg-[#020914] border-t border-white/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div class="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div class="lg:col-span-1">
            <A href="/" class="inline-flex items-center gap-1 mb-4">
              <span class="text-xl font-black text-white">
                <span class="text-brand-accent">305</span> Web
              </span>
              <span class="text-xs font-semibold text-brand-emeraldLight bg-brand-emeraldLight/10 border border-brand-emeraldLight/20 px-2 py-0.5 rounded-full">
                Service
              </span>
            </A>
            <p class="text-slate-400 text-sm leading-relaxed mb-4">
              Software moderno para empresas que quieren crecer. Soluciones reales para problemas reales.
            </p>
            <div class="flex gap-3">
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                class="w-9 h-9 rounded-lg bg-white/5 hover:bg-green-500/20 border border-white/10 hover:border-green-500/30 flex items-center justify-center transition-colors text-slate-400 hover:text-green-400"
                aria-label="WhatsApp"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.852L.057 23.743a.5.5 0 00.612.612l5.9-1.476A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.66-.523-5.17-1.427l-.37-.22-3.828.957.975-3.763-.241-.387A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
              </a>
              <a
                href={`mailto:${EMAIL}`}
                class="w-9 h-9 rounded-lg bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/30 flex items-center justify-center transition-colors text-slate-400 hover:text-blue-400"
                aria-label="Email"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 class="text-white font-semibold text-sm mb-4">Productos</h3>
            <ul class="space-y-2">
              {[
                { href: "/productos/ventaro",          label: "Ventaro"            },
                { href: "/productos/fortaleza-zona-0", label: "FORTALEZA / ZONA-0" },
                { href: "/productos",                  label: "Ver todos"          },
              ].map((link) => (
                <li>
                  <A href={link.href} class="text-slate-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </A>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 class="text-white font-semibold text-sm mb-4">Servicios</h3>
            <ul class="space-y-2">
              {[
                "Desarrollo a medida",
                "Páginas web",
                "Sistemas internos",
                "Automatizaciones",
                "Integraciones",
                "Consultoría",
                "Soporte",
              ].map((s) => (
                <li>
                  <A href="/servicios" class="text-slate-400 hover:text-white text-sm transition-colors">
                    {s}
                  </A>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 class="text-white font-semibold text-sm mb-4">Contacto</h3>
            <ul class="space-y-3">
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-slate-400 hover:text-green-400 text-sm transition-colors flex items-center gap-2"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
                  WhatsApp disponible
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} class="text-slate-400 hover:text-blue-400 text-sm transition-colors">
                  {EMAIL}
                </a>
              </li>
              <li class="pt-2">
                <A
                  href="/contacto?motivo=demo"
                  class="inline-block px-4 py-2 bg-brand-blue hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Solicitar demo gratis
                </A>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div class="py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-slate-500 text-xs">
            © {year} 305 Web Service. Todos los derechos reservados.
          </p>
          <div class="flex gap-4">
            <A href="/privacidad" class="text-slate-500 hover:text-slate-400 text-xs transition-colors">
              Privacidad
            </A>
            <A href="/terminos" class="text-slate-500 hover:text-slate-400 text-xs transition-colors">
              Términos
            </A>
          </div>
        </div>
      </div>
    </footer>
  );
}
