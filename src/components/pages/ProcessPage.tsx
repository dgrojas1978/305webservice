import Seo from "~/components/Seo";
import JsonLd from "~/components/JsonLd";
import Layout from "~/components/layout/Layout";
import PageHero from "~/components/pages/PageHero";
import { ProcessSteps, Faq, FinalCta } from "~/components/sections/HomeSections";
import { C } from "~/data/content";
import { PATHS, altPath, type Locale } from "~/lib/i18n";
import { breadcrumbSchema } from "~/lib/schema";
import { SITE_NAME } from "~/lib/site";

export default function ProcessPage(props: { locale: Locale }) {
  const t = () => C[props.locale];
  const intro = () =>
    props.locale === "es"
      ? "Un proceso claro, con alcance por escrito y puntos de revisión — sin agregados sorpresa."
      : "A clear process, with scope in writing and review points along the way — no surprise additions.";
  return (
    <Layout locale={props.locale} page="process">
      <Seo title={t().meta.process.title} description={t().meta.process.description} path={PATHS.process[props.locale]} altPath={altPath("process", props.locale)} locale={props.locale} />
      <JsonLd data={breadcrumbSchema([{ name: SITE_NAME, path: PATHS.home[props.locale] }, { name: t().nav.process, path: PATHS.process[props.locale] }])} />

      <PageHero eyebrow={t().process.eyebrow} intro={intro()}>{t().process.heading}</PageHero>

      <ProcessSteps locale={props.locale} />
      <Faq locale={props.locale} />
      <FinalCta locale={props.locale} />
    </Layout>
  );
}
