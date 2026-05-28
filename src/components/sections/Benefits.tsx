import SectionWrapper from "~/components/ui/SectionWrapper";

const benefits = [
  {
    icon: "🚀",
    title: "Implementación en 24-72 horas",
    description: "Sin procesos largos ni esperas. Tu sistema funciona en días, no en meses. Te acompañamos en cada paso.",
  },
  {
    icon: "🤝",
    title: "Soporte humano, no tickets",
    description: "Hablas directamente con el equipo técnico por WhatsApp. Sin chatbots, sin esperas interminables.",
  },
  {
    icon: "🔒",
    title: "Seguridad incluida",
    description: "HTTPS, autenticación segura, backups automáticos y cumplimiento de mejores prácticas de seguridad.",
  },
  {
    icon: "📱",
    title: "Funciona en cualquier dispositivo",
    description: "PC, tablet o celular. Tus sistemas están disponibles donde estés, sin instalar nada extra.",
  },
  {
    icon: "⚙️",
    title: "Se adapta a tu negocio",
    description: "No eres tú quien se adapta al software. Configuramos y personalizamos para que funcione a tu manera.",
  },
  {
    icon: "📈",
    title: "Preparado para crecer",
    description: "Empieza con lo que necesitas hoy y agrega módulos conforme tu negocio crece. Sin límites artificiales.",
  },
];

export default function Benefits() {
  return (
    <SectionWrapper class="bg-slate-50">
      <div class="text-center mb-12">
        <p class="text-brand-blue text-sm font-semibold uppercase tracking-widest mb-3">
          Por qué elegirnos
        </p>
        <h2 class="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
          Tecnología con respaldo humano
        </h2>
        <p class="text-slate-500 text-lg max-w-2xl mx-auto">
          No solo vendemos software. Somos tu socio tecnológico. Nos comprometemos con el éxito de tu negocio.
        </p>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit) => (
          <div class="card-light p-6">
            <div class="text-3xl mb-4">{benefit.icon}</div>
            <h3 class="text-slate-900 font-bold mb-2">{benefit.title}</h3>
            <p class="text-slate-500 text-sm leading-relaxed">{benefit.description}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
