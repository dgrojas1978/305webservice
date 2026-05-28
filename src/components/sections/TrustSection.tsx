import SectionWrapper from "~/components/ui/SectionWrapper";

const trustItems = [
  {
    icon: "🔒",
    title: "Seguridad empresarial",
    description: "HTTPS en todo, autenticación con 2FA opcional, backups diarios automáticos y logs de auditoría para todos tus datos.",
  },
  {
    icon: "💬",
    title: "Soporte directo",
    description: "Acceso directo al equipo de desarrollo por WhatsApp. Sin intermediarios ni tickets que tarden días en responderse.",
  },
  {
    icon: "🏆",
    title: "+5 años de experiencia",
    description: "Hemos construido sistemas para docenas de negocios en múltiples industrias. Sabemos qué funciona y qué no.",
  },
  {
    icon: "🎯",
    title: "Software a tu medida",
    description: "Cada negocio es diferente. Configuramos y personalizamos para que el sistema funcione exactamente como tu operación lo requiere.",
  },
];

export default function TrustSection() {
  return (
    <SectionWrapper class="bg-white">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: content */}
        <div>
          <p class="text-brand-blue text-sm font-semibold uppercase tracking-widest mb-3">
            Por qué confiar en nosotros
          </p>
          <h2 class="text-3xl sm:text-4xl font-black text-slate-900 mb-6">
            Tu negocio merece un socio tecnológico serio
          </h2>
          <p class="text-slate-500 text-lg leading-relaxed mb-8">
            No somos una agencia que desaparece después de entregar el proyecto. Somos tu equipo tecnológico a largo plazo, comprometido con el crecimiento de tu negocio.
          </p>
          <div class="space-y-5">
            {trustItems.map((item) => (
              <div class="flex gap-4">
                <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-xl">
                  {item.icon}
                </div>
                <div>
                  <h3 class="font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p class="text-slate-500 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: stats + visual */}
        <div class="relative">
          <div class="bg-gradient-to-br from-[#030B1A] to-[#071426] rounded-3xl p-8 border border-white/5">
            {/* Big number */}
            <div class="text-center mb-8">
              <div class="text-6xl font-black text-white mb-2">98%</div>
              <div class="text-slate-400">de satisfacción de clientes</div>
            </div>

            {/* Stats grid */}
            <div class="grid grid-cols-2 gap-4 mb-8">
              {[
                { value: "50+", label: "Negocios atendidos" },
                { value: "24h", label: "Tiempo de implementación" },
                { value: "5+", label: "Años de experiencia" },
                { value: "99.9%", label: "Uptime garantizado" },
              ].map((stat) => (
                <div class="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                  <div class="text-2xl font-black text-white mb-1">{stat.value}</div>
                  <div class="text-slate-500 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Guarantee badge */}
            <div class="bg-brand-emerald/10 border border-brand-emerald/20 rounded-xl p-4 flex items-center gap-3">
              <div class="text-2xl">🛡️</div>
              <div>
                <p class="text-brand-emeraldLight font-semibold text-sm">Garantía de satisfacción</p>
                <p class="text-slate-400 text-xs">Si en 14 días no estás satisfecho, te devolvemos tu inversión.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
