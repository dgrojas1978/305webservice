import { HttpStatusCode } from "@solidjs/start";
import Seo from "~/components/Seo";
import Layout from "~/components/layout/Layout";
import Container from "~/components/ui/Container";
import { ButtonLink } from "~/components/ui/Button";
import { C } from "~/data/content";
import { PATHS, type Locale } from "~/lib/i18n";

export default function NotFoundPage(props: { locale: Locale }) {
  const t = () => C[props.locale];

  return (
    <Layout locale={props.locale} page="home">
      <HttpStatusCode code={404} />
      <Seo
        title={t().meta.notFound.title}
        description={t().meta.notFound.description}
        path={PATHS.home[props.locale]}
        locale={props.locale}
      />

      <section
        data-surface="navy"
        class="relative flex min-h-[100svh] items-center overflow-hidden bg-navy"
      >
        <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <span class="monument absolute -bottom-[0.14em] -right-[0.14em] text-[clamp(15rem,45vw,48rem)]">
            305
          </span>
        </div>
        <Container class="relative z-10 py-36">
          <p class="monument text-[clamp(6rem,14vw,12rem)]" aria-hidden="true">404</p>
          <h1 class="mt-8 text-h1 uppercase text-paper">
            <span class="sr-only">404 — </span>
            {t().notFound.line1}
            <br />
            {t().notFound.line2}
          </h1>
          <div class="mt-12">
            <ButtonLink href={PATHS.home[props.locale]}>{t().notFound.button}</ButtonLink>
          </div>
        </Container>
      </section>
    </Layout>
  );
}
