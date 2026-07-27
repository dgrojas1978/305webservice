import Seo from "~/components/Seo";
import JsonLd from "~/components/JsonLd";
import Layout from "~/components/layout/Layout";
import PageHero from "~/components/pages/PageHero";
import { Industries, FinalCta } from "~/components/sections/HomeSections";
import PackageSelector from "~/components/sections/PackageSelector";
import { C } from "~/data/content";
import { PATHS, altPath, type Locale } from "~/lib/i18n";
import { breadcrumbSchema } from "~/lib/schema";
import { SITE_NAME } from "~/lib/site";

export default function IndustriesPage(props: { locale: Locale }) {
  const t = () => C[props.locale];
  return (
    <Layout locale={props.locale} page="industries">
      <Seo title={t().meta.industries.title} description={t().meta.industries.description} path={PATHS.industries[props.locale]} altPath={altPath("industries", props.locale)} locale={props.locale} />
      <JsonLd data={breadcrumbSchema([{ name: SITE_NAME, path: PATHS.home[props.locale] }, { name: t().nav.industries, path: PATHS.industries[props.locale] }])} />

      <PageHero eyebrow={t().industries.eyebrow} intro={t().industries.note}>{t().industries.heading}</PageHero>

      <Industries locale={props.locale} heading={false} />
      <PackageSelector locale={props.locale} />
      <FinalCta locale={props.locale} />
    </Layout>
  );
}
