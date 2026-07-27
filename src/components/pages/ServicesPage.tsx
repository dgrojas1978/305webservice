import Seo from "~/components/Seo";
import JsonLd from "~/components/JsonLd";
import Layout from "~/components/layout/Layout";
import PageHero from "~/components/pages/PageHero";
import PackageSelector from "~/components/sections/PackageSelector";
import { Industries, WhyCustom, ProcessSteps, Faq, FinalCta } from "~/components/sections/HomeSections";
import { C } from "~/data/content";
import { PATHS, altPath, type Locale } from "~/lib/i18n";
import { breadcrumbSchema, faqSchema } from "~/lib/schema";
import { SITE_NAME } from "~/lib/site";

export default function ServicesPage(props: { locale: Locale }) {
  const t = () => C[props.locale];
  const intro = () =>
    props.locale === "es"
      ? "Cada servicio empaquetado alrededor de un resultado de negocio real — con un cliente ideal, entregables claros y un solo próximo paso."
      : "Every service packaged around a real business outcome — with a clear ideal customer, defined deliverables and one simple next step.";
  return (
    <Layout locale={props.locale} page="services">
      <Seo title={t().meta.services.title} description={t().meta.services.description} path={PATHS.services[props.locale]} altPath={altPath("services", props.locale)} locale={props.locale} />
      <JsonLd data={breadcrumbSchema([{ name: SITE_NAME, path: PATHS.home[props.locale] }, { name: t().nav.services, path: PATHS.services[props.locale] }])} />
      <JsonLd data={faqSchema(t().faq.items)} />

      <PageHero eyebrow={t().selector.eyebrow} intro={intro()}>
        {props.locale === "es" ? "Elige el resultado que tu negocio necesita" : "Choose the outcome your business needs"}
      </PageHero>

      <PackageSelector locale={props.locale} heading={false} />
      <WhyCustom locale={props.locale} />
      <Industries locale={props.locale} />
      <ProcessSteps locale={props.locale} />
      <Faq locale={props.locale} />
      <FinalCta locale={props.locale} />
    </Layout>
  );
}
