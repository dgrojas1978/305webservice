import { For } from "solid-js";
import Container from "~/components/ui/Container";
import SectionHeading from "~/components/ui/SectionHeading";
import type { Locale } from "~/lib/i18n";

/**
 * Selected Work — proyectos REALES aprobados para exhibición (owner-confirmed 2026-07-27):
 * Aguiar Flooring, Light Specter Film, Polkanea, Cosme Proenza. Capturas en /public/work.
 * Se muestra al inicio de /website-packages (destino del QR del flyer) para liderar con prueba.
 */
const WORK = [
  {
    key: "aguiar", domain: "aguiarflooring.com", url: "https://aguiarflooring.com", img: "/work/aguiar.jpg",
    industry: { en: "Flooring & remodeling", es: "Pisos y remodelación" },
    outcome: { en: "Built to turn visitors into quote requests", es: "Hecho para convertir visitas en cotizaciones" },
  },
  {
    key: "lsf", domain: "lightspecterfilm.com", url: "https://lightspecterfilm.com", img: "/work/lsf.jpg",
    industry: { en: "Film & production", es: "Cine y producción" },
    outcome: { en: "A cinematic, credible brand presence", es: "Una presencia de marca cinematográfica y creíble" },
  },
  {
    key: "polkanea", domain: "polkaneaproductions.com", url: "https://polkaneaproductions.com", img: "/work/polkanea.jpg",
    industry: { en: "Streaming platform", es: "Plataforma de streaming" },
    outcome: { en: "Built for subscriptions & content discovery", es: "Hecho para suscripciones y descubrimiento" },
  },
  {
    key: "cosme", domain: "cosmeproenza.com", url: "https://cosmeproenza.com", img: "/work/cosme.jpg",
    industry: { en: "Arts & culture", es: "Arte y cultura" },
    outcome: { en: "A refined gallery & archive experience", es: "Una experiencia de galería y archivo refinada" },
  },
] as const;

const COPY = {
  en: {
    eyebrow: "Our work",
    heading: "Real sites, live right now.",
    intro: "Every project below is a real client website — visit them.",
    visit: "Visit site",
    note: "Selected custom projects. Features and pricing vary by scope.",
  },
  es: {
    eyebrow: "Nuestro trabajo",
    heading: "Sitios reales, en línea ahora mismo.",
    intro: "Cada proyecto es un sitio real de un cliente — entra y compruébalo.",
    visit: "Ver sitio",
    note: "Proyectos personalizados seleccionados. Las funciones y el precio varían según el alcance.",
  },
} as const;

export default function SelectedWork(props: { locale: Locale }) {
  const t = () => COPY[props.locale];
  return (
    <section id="selected-work" class="bg-paper py-section">
      <Container>
        <SectionHeading eyebrow={t().eyebrow} title={t().heading} intro={t().intro} />
        <div class="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2">
          <For each={WORK}>
            {(w) => (
              <a
                href={w.url}
                target="_blank"
                rel="noopener noreferrer"
                class="group block"
                data-track="work_project_click"
                data-track-project={w.key}
              >
                <div class="overflow-hidden rounded-2xl border border-hairline bg-white shadow-sm transition-shadow duration-300 group-hover:shadow-xl">
                  <img
                    src={w.img}
                    alt={`${w.domain} — website built by 305 Web Service`}
                    width="1000"
                    height="625"
                    loading="lazy"
                    class="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div class="mt-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 class="text-lg font-extrabold tracking-tight text-navy">{w.domain}</h3>
                  <span class="micro-caps text-body">{w.industry[props.locale]}</span>
                </div>
                <p class="mt-1.5 leading-relaxed text-body">{w.outcome[props.locale]}</p>
                <span class="mt-3 inline-block text-sm font-bold text-blue-ink transition-transform duration-300 group-hover:translate-x-1">
                  {t().visit} &rarr;
                </span>
              </a>
            )}
          </For>
        </div>
        <p class="mt-10 max-w-3xl text-[0.85rem] italic leading-relaxed text-body">{t().note}</p>
      </Container>
    </section>
  );
}
