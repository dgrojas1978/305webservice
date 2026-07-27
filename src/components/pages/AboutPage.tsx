import { For } from "solid-js";
import Seo from "~/components/Seo";
import JsonLd from "~/components/JsonLd";
import Layout from "~/components/layout/Layout";
import Container from "~/components/ui/Container";
import PageHero from "~/components/pages/PageHero";
import { ProofExpect, FinalCta } from "~/components/sections/HomeSections";
import { C } from "~/data/content";
import { PATHS, altPath, type Locale } from "~/lib/i18n";
import { breadcrumbSchema } from "~/lib/schema";
import { SITE_NAME } from "~/lib/site";

export default function AboutPage(props: { locale: Locale }) {
  const t = () => C[props.locale];
  const a = () => t().about;
  return (
    <Layout locale={props.locale} page="about">
      <Seo title={t().meta.about.title} description={t().meta.about.description} path={PATHS.about[props.locale]} altPath={altPath("about", props.locale)} locale={props.locale} />
      <JsonLd data={breadcrumbSchema([{ name: SITE_NAME, path: PATHS.home[props.locale] }, { name: t().nav.about, path: PATHS.about[props.locale] }])} />

      <PageHero eyebrow={a().eyebrow} intro={a().body[0]}>{a().heading}</PageHero>

      <section class="bg-paper py-section">
        <Container>
          <div class="grid grid-cols-1 gap-12 md:grid-cols-12">
            <div class="md:col-span-7">
              <For each={a().body.slice(1)}>
                {(p) => <p class="mb-6 max-w-prose text-body-lg leading-relaxed text-body">{p}</p>}
              </For>
            </div>
            <div class="md:col-span-4 md:col-start-9">
              <div class="rule-t" />
              <h2 class="mt-6 text-h3 font-extrabold tracking-tight text-navy">{a().positioningHeading}</h2>
              <p class="mt-5 text-[0.95rem] leading-relaxed text-body">{a().positioning}</p>
            </div>
          </div>
        </Container>
      </section>

      <ProofExpect locale={props.locale} />
      <FinalCta locale={props.locale} />
    </Layout>
  );
}
