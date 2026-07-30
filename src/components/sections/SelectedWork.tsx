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
    eyebrow: "Selected work",
    heading: "Selected digital work.",
    intro: "Websites and platforms designed around distinct business goals.",
    visit: "Visit site",
    note: "Selected custom projects. Features and pricing vary by scope.",
  },
  es: {
    eyebrow: "Trabajo seleccionado",
    heading: "Trabajo digital seleccionado.",
    intro: "Sitios y plataformas diseñados alrededor de objetivos de negocio distintos.",
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
        <div class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <For each={WORK}>
            {(w) => (
              <a
                href={w.url}
                target="_blank"
                rel="noopener noreferrer"
                class="card group flex flex-col overflow-hidden !p-0 transition-shadow hover:shadow-lg"
                data-track="work_project_click"
                data-track-project={w.key}
              >
                <div class="flex items-center gap-1.5 border-b border-hairline bg-[#e9edf3] px-3 py-2">
                  <span class="h-2 w-2 rounded-full bg-[#c3ccd8]" aria-hidden="true" />
                  <span class="h-2 w-2 rounded-full bg-[#c3ccd8]" aria-hidden="true" />
                  <span class="h-2 w-2 rounded-full bg-[#c3ccd8]" aria-hidden="true" />
                  <span class="ml-2 truncate text-[0.7rem] font-semibold tracking-wide text-[#8a97a6]">{w.domain}</span>
                </div>
                <img
                  src={w.img}
                  alt={`${w.domain} — website built by 305 Web Service`}
                  width="1000"
                  height="625"
                  loading="lazy"
                  class="aspect-[16/10] w-full object-cover object-top"
                />
                <div class="flex flex-1 flex-col p-5">
                  <h3 class="text-sm font-extrabold uppercase tracking-tight text-navy">{w.industry[props.locale]}</h3>
                  <p class="mt-2 text-[0.85rem] leading-relaxed text-body">{w.outcome[props.locale]}</p>
                  <span class="mt-auto pt-4 text-[0.8rem] font-bold text-blue-ink group-hover:underline">{t().visit} &rarr;</span>
                </div>
              </a>
            )}
          </For>
        </div>
        <p class="mt-8 max-w-3xl text-[0.85rem] italic leading-relaxed text-body">{t().note}</p>
      </Container>
    </section>
  );
}
