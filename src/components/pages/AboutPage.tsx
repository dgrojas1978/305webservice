import { For } from "solid-js";
import Seo from "~/components/Seo";
import Layout from "~/components/layout/Layout";
import Container from "~/components/ui/Container";
import PageHero from "~/components/pages/PageHero";
import { ButtonLink } from "~/components/ui/Button";
import { C } from "~/data/content";
import { PATHS, altPath, type Locale } from "~/lib/i18n";

export default function AboutPage(props: { locale: Locale }) {
  const t = () => C[props.locale];

  return (
    <Layout locale={props.locale} page="about">
      <Seo
        title={t().meta.about.title}
        description={t().meta.about.description}
        path={PATHS.about[props.locale]}
        altPath={altPath("about", props.locale)}
        locale={props.locale}
      />

      <PageHero eyebrow={t().about.eyebrow} intro={t().about.text}>
        {t().about.title}
      </PageHero>

      {/* posicionamiento */}
      <section class="bg-paper py-section">
        <Container>
          <div class="grid grid-cols-1 gap-10 md:grid-cols-12">
            <div class="md:col-span-8">
              <p class="reveal micro-caps text-blue">{t().positioning.eyebrow}</p>
              <div class="rule-t reveal-rule mt-6" />
              <h2 class="reveal mt-8 max-w-[18ch] text-h2 uppercase text-navy" data-delay="1">
                {t().positioning.title}
              </h2>
            </div>
            <div class="flex md:col-span-4 md:items-end">
              <p class="reveal max-w-prose text-body-lg text-body" data-delay="2">
                {t().positioning.text}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* principios */}
      <section class="bg-paper pb-section">
        <Container>
          <h2 class="reveal-line text-h2 uppercase text-navy">
            <span class="ln"><span class="li">{t().principles.title1}</span></span>
            <span class="ln"><span class="li">{t().principles.title2}</span></span>
            <span class="ln"><span class="li text-blue">{t().principles.title3}</span></span>
          </h2>
          <div class="mt-16 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
            <For each={t().principles.items}>
              {(item, i) => (
                <div class="reveal flex items-baseline gap-6 border-t border-hairline pt-6" data-delay={String(i() % 2)}>
                  <span class="text-sm font-bold text-blue">{item.no}</span>
                  <p class="text-lg font-extrabold uppercase tracking-tight text-navy md:text-xl">
                    {item.name}
                  </p>
                </div>
              )}
            </For>
          </div>
        </Container>
      </section>

      {/* miami */}
      <section class="bg-blue py-section">
        <Container>
          <h2 class="reveal-line text-display uppercase leading-[0.95] text-navy">
            <span class="ln"><span class="li">{t().miami.line1}</span></span>
            <span class="ln"><span class="li">{t().miami.line2}</span></span>
          </h2>
          <div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-12">
            <p class="reveal max-w-prose text-body-lg font-medium text-navy md:col-span-6" data-delay="1">
              {t().miami.text}
            </p>
            <div class="flex md:col-span-6 md:items-end md:justify-end">
              <p class="reveal micro-caps text-navy" data-delay="2">{t().miami.micro}</p>
            </div>
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
