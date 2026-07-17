import { For } from "solid-js";
import Seo from "~/components/Seo";
import Layout from "~/components/layout/Layout";
import Container from "~/components/ui/Container";
import { ButtonLink } from "~/components/ui/Button";
import { C } from "~/data/content";
import { PATHS, altPath, type Locale } from "~/lib/i18n";

/**
 * Proyectos — sin proyectos verificables todavía: estructura editorial
 * con estados abstractos tipográficos etiquetados «PRÓXIMAMENTE».
 * Sin clientes inventados, sin capturas falsas, sin testimonios.
 */
export default function ProjectsPage(props: { locale: Locale }) {
  const t = () => C[props.locale];

  return (
    <Layout locale={props.locale} page="projects">
      <Seo
        title={t().meta.projects.title}
        description={t().meta.projects.description}
        path={PATHS.projects[props.locale]}
        altPath={altPath("projects", props.locale)}
        locale={props.locale}
      />

      <section data-surface="navy" class="bg-navy pb-24 pt-36 md:pb-32 md:pt-48">
        <Container>
          <p class="micro-caps text-turquoise">{t().projects.eyebrow}</p>
          <h1 class="mt-6 text-h1 uppercase text-paper">
            {t().projects.titleLines[0]}
            <br />
            {t().projects.titleLines[1]}
            <br />
            {t().projects.titleLines[2]}
          </h1>
          <p class="mt-8 max-w-xl text-body-lg text-on-navy">{t().projects.text}</p>
        </Container>
      </section>

      <section class="bg-paper py-section">
        <Container>
          <div class="space-y-px bg-hairline">
            <For each={t().projects.slots}>
              {(slot, i) => (
                <div
                  class={`reveal relative overflow-hidden bg-paper py-20 md:py-28 ${
                    i() % 2 === 1 ? "md:text-right" : ""
                  }`}
                >
                  <span
                    class={`monument monument-ghost pointer-events-none absolute top-1/2 -translate-y-1/2 text-[clamp(10rem,26vw,22rem)] ${
                      i() % 2 === 1 ? "-left-[0.08em]" : "-right-[0.08em]"
                    }`}
                    aria-hidden="true"
                  >
                    {`0${i() + 1}`}
                  </span>
                  <div class="relative z-10">
                    <p class="micro-caps text-body">{slot.tag}</p>
                    <h2 class="mt-4 text-h2 uppercase text-navy">{slot.name}</h2>
                    <p class="micro-caps mt-8 inline-block border border-hairline px-4 py-2 text-blue">
                      {t().projects.comingSoon}
                    </p>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Container>
      </section>

      <section data-surface="navy" class="bg-navy py-24 md:py-32">
        <Container>
          <h2 class="text-h2 uppercase text-paper">
            {t().finalCta.title1} {t().finalCta.title2}
          </h2>
          <div class="mt-10">
            <ButtonLink href={PATHS.contact[props.locale]}>{t().finalCta.button}</ButtonLink>
          </div>
        </Container>
      </section>
    </Layout>
  );
}
