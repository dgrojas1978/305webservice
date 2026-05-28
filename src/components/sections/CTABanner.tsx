import { A } from "@solidjs/router";
import { getWhatsAppUrl } from "~/data/products";

interface CTABannerProps {
  title?: string;
  subtitle?: string;
}

export default function CTABanner(props: CTABannerProps) {
  const whatsapp = getWhatsAppUrl();

  return (
    <section class="relative overflow-hidden bg-gradient-to-br from-brand-blue via-blue-600 to-brand-cyan py-16 lg:py-20">
      {/* Background pattern */}
      <div
        class="absolute inset-0 opacity-10"
        style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size: 32px 32px;"
      />
      <div class="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-brand-blue/50 to-transparent" />

      <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
          {props.title ?? "¿Listo para modernizar tu negocio?"}
        </h2>
        <p class="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
          {props.subtitle ?? "Habla con nuestro equipo hoy mismo. Te mostramos cómo nuestras soluciones pueden transformar tu operación en menos de una semana."}
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <A
            href="/contacto?motivo=demo"
            class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-blue font-bold rounded-xl hover:bg-blue-50 transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-black/20 text-base"
          >
            Solicitar demo gratis
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </A>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 hover:border-white/40 transition-all duration-200 hover:-translate-y-0.5 text-base"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.852L.057 23.743a.5.5 0 00.612.612l5.9-1.476A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
            </svg>
            Escribir por WhatsApp
          </a>
        </div>

        <p class="mt-6 text-blue-200 text-sm">
          Sin compromiso · Respuesta en menos de 2 horas · Atención en español
        </p>
      </div>
    </section>
  );
}
