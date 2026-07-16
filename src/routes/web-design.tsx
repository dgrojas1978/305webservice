import { For } from "solid-js";
import Layout from "~/components/layout/Layout";
import Seo from "~/components/Seo";
import JsonLd from "~/components/JsonLd";
import Container from "~/components/ui/Container";
import SectionHeading from "~/components/ui/SectionHeading";
import { ButtonLink } from "~/components/ui/Button";
import PlansSection from "~/components/sections/PlansSection";
import FinalCTA from "~/components/sections/FinalCTA";
import { WEB_DESIGN_FAQ } from "~/data/content";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: WEB_DESIGN_FAQ.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const included = [
  {
    title: "Designed to convert",
    description:
      "Clear structure, strong calls to action and contact options on every page, so visitors become calls and messages.",
  },
  {
    title: "Fast and mobile-first",
    description:
      "Built for phones first, where most of your customers are, and optimized to load quickly.",
  },
  {
    title: "Secure from day one",
    description:
      "SSL certificate and domain configured correctly, so browsers mark your site as secure.",
  },
  {
    title: "Found on Google",
    description:
      "Clean structure, titles and descriptions set up with basic SEO so search engines can index your business.",
  },
];

export default function WebDesignPage() {
  return (
    <Layout>
      <Seo
        title="Web Design in Miami — Professional Websites from $499 | 305 Web Service"
        description="Professional website design for small businesses in Miami and across the US. Modern, fast, mobile-first websites starting at $499, with contact forms, WhatsApp integration, SSL and basic SEO."
        path="/web-design"
      />
      <JsonLd data={faqSchema} />

      <section class="bg-white py-16 sm:py-20">
        <Container>
          <div class="mx-auto max-w-2xl text-center">
            <p class="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-blue">
              Web Design
            </p>
            <h1 class="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              A Professional Website That Works as Hard as You Do
            </h1>
            <p class="mt-5 text-lg leading-relaxed text-ink-muted">
              Modern, fast, secure and responsive websites designed to turn
              visitors into customers — starting at $499.
            </p>
            <div class="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/contact?service=website" size="lg">
                Request a Quote
              </ButtonLink>
              <ButtonLink href="#plans" variant="secondary" size="lg">
                View Website Plans
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <section class="border-t border-surface-line bg-white pb-20 sm:pb-24">
        <Container>
          <div class="grid grid-cols-1 gap-8 pt-16 sm:grid-cols-2 lg:grid-cols-4">
            <For each={included}>
              {(item) => (
                <div>
                  <h2 class="text-base font-bold text-ink">{item.title}</h2>
                  <p class="mt-2 text-sm leading-relaxed text-ink-muted">{item.description}</p>
                </div>
              )}
            </For>
          </div>
        </Container>
      </section>

      <PlansSection />

      {/* FAQ */}
      <section class="bg-white py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="FAQ"
            title="Common Questions About Our Websites"
          />
          <div class="mx-auto max-w-3xl divide-y divide-surface-line rounded-2xl border border-surface-line bg-white shadow-card">
            <For each={WEB_DESIGN_FAQ}>
              {(item) => (
                <details class="group px-6 py-1">
                  <summary class="flex cursor-pointer items-center justify-between gap-4 py-4 text-left text-base font-semibold text-ink [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <svg
                      class="h-5 w-5 flex-shrink-0 text-ink-faint transition-transform group-open:rotate-180"
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path d="m5 8 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </summary>
                  <p class="pb-5 text-sm leading-relaxed text-ink-muted">{item.answer}</p>
                </details>
              )}
            </For>
          </div>
        </Container>
      </section>

      <FinalCTA />
    </Layout>
  );
}
