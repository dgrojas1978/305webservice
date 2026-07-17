import { For } from "solid-js";
import Seo from "~/components/Seo";
import Layout from "~/components/layout/Layout";
import Container from "~/components/ui/Container";
import { ButtonLink } from "~/components/ui/Button";
import { C } from "~/data/content";
import { PATHS, altPath, type Locale } from "~/lib/i18n";

export default function ProcessPage(props: { locale: Locale }) {
  const t = () => C[props.locale];

  return (
    <Layout locale={props.locale} page="process">
      <Seo
        title={t().meta.process.title}
        description={t().meta.process.description}
        path={PATHS.process[props.locale]}
        altPath={altPath("process", props.locale)}
        locale={props.locale}
      />

      <section data-surface="navy" class="bg-navy pb-0 pt-36 md:pt-48">
        <Container>
          <p class="micro-caps text-turquoise">{t().process.eyebrow}</p>
          <h1 class="mt-6 text-h1 uppercase text-paper">
            {t().process.title1}
            <br />
            {t().process.title2}
          </h1>
        </Container>

        {/* recorrido editorial con hairlines */}
        <Container class="mt-20 pb-section md:mt-28">
          <For each={t().process.steps}>
            {(step) => (
              <div class="reveal grid grid-cols-1 gap-6 border-t border-[rgba(247,249,252,0.14)] py-12 md:grid-cols-12 md:py-16">
                <span class="outline-num text-8xl md:col-span-3 md:text-9xl" aria-hidden="true">
                  {step.no}
                </span>
                <h2 class="text-h3 uppercase text-paper md:col-span-4">
                  <span class="sr-only">{step.no} — </span>
                  {step.name}
                </h2>
                <p class="max-w-prose text-body-lg text-on-navy md:col-span-5">{step.text}</p>
              </div>
            )}
          </For>
          <div class="hr-line-navy" />
        </Container>
      </section>

      <section class="bg-paper py-24 md:py-32">
        <Container>
          <h2 class="text-h2 uppercase text-navy">
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
