import { For } from "solid-js";
import Seo from "~/components/Seo";
import Layout from "~/components/layout/Layout";
import Container from "~/components/ui/Container";
import PageHero from "~/components/pages/PageHero";
import { ButtonLink } from "~/components/ui/Button";
import { C } from "~/data/content";
import { PATHS, altPath, type Locale } from "~/lib/i18n";

export default function ServicesPage(props: { locale: Locale }) {
  const t = () => C[props.locale];

  return (
    <Layout locale={props.locale} page="services">
      <Seo
        title={t().meta.services.title}
        description={t().meta.services.description}
        path={PATHS.services[props.locale]}
        altPath={altPath("services", props.locale)}
        locale={props.locale}
      />

      <PageHero eyebrow={t().services.eyebrow} intro={t().services.pageIntro}>
        {t().services.title1}
        <br />
        {t().services.title2}
      </PageHero>

      <section class="bg-paper">
        <Container>
          <For each={t().services.items}>
            {(svc) => (
              <article
                id={svc.id}
                class="grid scroll-mt-28 grid-cols-1 gap-10 border-b border-hairline py-16 md:grid-cols-12 md:py-24"
              >
                {/* número + nombre */}
                <div class="md:col-span-5">
                  <span class="monument monument-ghost block text-8xl md:text-9xl" aria-hidden="true">
                    {svc.no}
                  </span>
                  <h2 class="mt-8 max-w-[14ch] text-h3 uppercase text-navy">
                    <span class="sr-only">{svc.no} — </span>
                    {svc.name}
                  </h2>
                  <div class="rule-t mt-6" />
                  <p class="mt-6 max-w-prose text-body-lg text-body">{svc.short}</p>
                </div>

                {/* detalle */}
                <div class="space-y-10 md:col-span-6 md:col-start-7">
                  <div class="reveal">
                    <h3 class="micro-caps text-blue">{t().services.labels.problem}</h3>
                    <p class="mt-3 max-w-prose text-base leading-relaxed text-body">
                      {svc.problem}
                    </p>
                  </div>

                  <div class="reveal">
                    <h3 class="micro-caps text-blue">{t().services.labels.includes}</h3>
                    <ul class="mt-3">
                      <For each={svc.includes}>
                        {(item) => (
                          <li class="border-b border-hairline py-2.5 text-base font-medium text-navy">
                            {item}
                          </li>
                        )}
                      </For>
                    </ul>
                  </div>

                  <div class="reveal">
                    <h3 class="micro-caps text-blue">{t().services.labels.forWho}</h3>
                    <p class="mt-3 max-w-prose text-base leading-relaxed text-body">
                      {svc.forWho}
                    </p>
                  </div>

                  <div class="reveal">
                    <h3 class="micro-caps text-blue">{t().services.labels.integrations}</h3>
                    <p class="mt-3 max-w-prose text-base leading-relaxed text-body">
                      {svc.integrations}
                    </p>
                  </div>

                  <ButtonLink
                    href={`${PATHS.contact[props.locale]}?service=${svc.id}`}
                    variant="outline"
                  >
                    {t().services.labels.cta}
                  </ButtonLink>
                </div>
              </article>
            )}
          </For>
        </Container>
      </section>

      {/* CTA final compacto */}
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
