import { For } from "solid-js";
import Container from "~/components/ui/Container";
import type { Locale } from "~/lib/i18n";

/**
 * Reseñas REALES de Google (perfil: 305 Web Service LLC, 2026-09).
 * Citas textuales, verificables con un clic en el enlace al perfil.
 * Actualizar a mano cuando entren reseñas nuevas que valgan la pena mostrar.
 */
const REVIEWS_URL = "https://g.page/r/CdycYMzuNye2EBM";

const REVIEWS = [
  {
    quote: "Profesional, calidad, seguridad y amabilidad. Recomendado 100%.",
    name: "Paloseco Design & Prints",
    detail: { en: "Design studio · Miami", es: "Estudio de diseño · Miami" },
  },
  {
    quote: "No he conocido alguien más profesional, dedicado y con un desempeño tan bueno.",
    name: "Lázaro Mireles Galbán",
    detail: { en: "Google Local Guide", es: "Local Guide de Google" },
  },
] as const;

const COPY = {
  en: {
    eyebrow: "Google reviews",
    heading: "Clients say it best.",
    ratingLabel: "on Google",
    verify: "Read our reviews on Google",
  },
  es: {
    eyebrow: "Reseñas de Google",
    heading: "Nuestros clientes lo dicen mejor.",
    ratingLabel: "en Google",
    verify: "Lee nuestras reseñas en Google",
  },
} as const;

function Stars() {
  return (
    <div class="flex gap-1" aria-hidden="true">
      <For each={[0, 1, 2, 3, 4]}>
        {() => (
          <svg class="h-5 w-5 text-[#FBBF24]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.9 6.2 6.8.8-5 4.6 1.3 6.7-6-3.3-6 3.3 1.3-6.7-5-4.6 6.8-.8z" />
          </svg>
        )}
      </For>
    </div>
  );
}

export default function GoogleReviews(props: { locale: Locale }) {
  const t = () => COPY[props.locale];
  return (
    <section id="reviews" class="bg-navy py-section" data-surface="navy">
      <Container>
        <div class="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          {/* Resumen: 5.0 en Google, verificable */}
          <div class="lg:col-span-4">
            <p class="micro-caps text-turquoise">{t().eyebrow}</p>
            <h2 class="mt-5 text-[clamp(1.8rem,3.4vw,2.8rem)] font-extrabold leading-tight tracking-tight text-paper">
              {t().heading}
            </h2>
            <div class="mt-7 flex items-center gap-4">
              <span class="text-5xl font-extrabold text-paper">5.0</span>
              <div>
                <Stars />
                <p class="mt-1 text-sm text-on-navy">{t().ratingLabel}</p>
              </div>
            </div>
            <a
              href={REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              class="mt-6 inline-block text-sm font-bold text-turquoise link-underline"
              data-track="reviews_google_link"
            >
              {t().verify} →
            </a>
          </div>

          {/* Citas textuales */}
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-8">
            <For each={REVIEWS}>
              {(r) => (
                <figure class="flex flex-col rounded-2xl border border-[rgba(247,249,252,0.14)] p-7">
                  <Stars />
                  <blockquote class="mt-5 flex-1 text-lg font-medium leading-relaxed text-paper">
                    “{r.quote}”
                  </blockquote>
                  <figcaption class="mt-6 border-t border-[rgba(247,249,252,0.14)] pt-4">
                    <span class="block font-bold text-paper">{r.name}</span>
                    <span class="text-sm text-on-navy-faint">{r.detail[props.locale]}</span>
                  </figcaption>
                </figure>
              )}
            </For>
          </div>
        </div>
      </Container>
    </section>
  );
}
