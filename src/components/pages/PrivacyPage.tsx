import { For } from "solid-js";
import Seo from "~/components/Seo";
import Layout from "~/components/layout/Layout";
import Container from "~/components/ui/Container";
import PageHero from "~/components/pages/PageHero";
import { C } from "~/data/content";
import { PATHS, altPath, type Locale } from "~/lib/i18n";
import { CONTACT_EMAIL } from "~/lib/site";

export default function PrivacyPage(props: { locale: Locale }) {
  const t = () => C[props.locale];
  const p = () => t().privacy;
  return (
    <Layout locale={props.locale} page="privacy">
      <Seo title={t().meta.privacy.title} description={t().meta.privacy.description} path={PATHS.privacy[props.locale]} altPath={altPath("privacy", props.locale)} locale={props.locale} />

      <PageHero eyebrow="305 Web Service">{p().title}</PageHero>

      <section class="bg-paper py-section">
        <Container>
          <p class="micro-caps text-body">{p().updated}</p>
          <div class="mt-12 max-w-2xl space-y-12">
            <For each={p().sections}>
              {(s) => (
                <div>
                  <h2 class="text-h3 font-extrabold tracking-tight text-navy">{s.h}</h2>
                  <div class="rule-t mt-4" />
                  <p class="mt-5 text-base leading-relaxed text-body">{s.p}</p>
                </div>
              )}
            </For>
            <p class="border-t border-hairline pt-8 text-sm text-body">
              305 Web Service · Miami, Florida ·{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} class="link-underline font-medium text-blue">{CONTACT_EMAIL}</a>
            </p>
          </div>
        </Container>
      </section>
    </Layout>
  );
}
