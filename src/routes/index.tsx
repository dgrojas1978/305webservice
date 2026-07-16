import { For } from "solid-js";
import Layout from "~/components/layout/Layout";
import Seo from "~/components/Seo";
import JsonLd from "~/components/JsonLd";
import Container from "~/components/ui/Container";
import SectionHeading from "~/components/ui/SectionHeading";
import { ButtonLink } from "~/components/ui/Button";
import HeroVisual from "~/components/sections/HeroVisual";
import ServicesGrid from "~/components/sections/ServicesGrid";
import PlansSection from "~/components/sections/PlansSection";
import InfraDiagram from "~/components/sections/InfraDiagram";
import ProcessSection from "~/components/sections/ProcessSection";
import FinalCTA from "~/components/sections/FinalCTA";
import {
  TRUST_SIGNALS,
  CAPABILITIES,
  WHY_ITEMS,
  INFRA_ITEMS,
  SERVICES,
} from "~/data/content";
import { SITE_URL, CONTACT_EMAIL } from "~/lib/site";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#business`,
      name: "305 Web Service",
      url: `${SITE_URL}/`,
      email: CONTACT_EMAIL,
      description:
        "Professional websites starting at $499, custom software, automation, networking, servers and IT support for businesses in Miami and across the United States.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Miami",
        addressRegion: "FL",
        addressCountry: "US",
      },
      areaServed: [
        { "@type": "City", name: "Miami" },
        { "@type": "Country", name: "United States" },
      ],
      knowsLanguage: ["en", "es"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Technology services",
        itemListElement: SERVICES.map((s) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: s.title,
            description: s.description,
          },
          ...(s.id === "web-design"
            ? {
                priceSpecification: {
                  "@type": "PriceSpecification",
                  minPrice: 499,
                  priceCurrency: "USD",
                },
              }
            : {}),
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "305 Web Service",
      inLanguage: "en-US",
      publisher: { "@id": `${SITE_URL}/#business` },
    },
  ],
};

export default function HomePage() {
  return (
    <Layout>
      <Seo
        title="305 Web Service | Web Design, Custom Software & IT Solutions in Miami"
        description="Professional websites starting at $499, custom software, automation, networking, servers and IT support for businesses in Miami."
        path="/"
      />
      <JsonLd data={structuredData} />

      {/* ============ HERO ============ */}
      <section class="relative overflow-hidden bg-white">
        <div class="bg-dots absolute inset-0" aria-hidden="true" />
        <Container class="relative">
          <div class="grid grid-cols-1 items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:py-24">
            <div>
              <p class="text-sm font-semibold uppercase tracking-wider text-brand-blue">
                Web Design, Custom Software &amp; IT Solutions
              </p>
              <h1 class="mt-4 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
                Technology Built to Move Your Business Forward
              </h1>
              <p class="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
                We create professional websites, develop custom software and
                solve your company's technology needs—from automation and
                integrations to networks, servers and IT support.
              </p>
              <p class="mt-5 inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-brand-blueSoft px-4 py-2 text-sm font-semibold text-brand-blueDark">
                Professional Websites Starting at $499
              </p>
              <div class="mt-7 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/contact" size="lg" class="w-full sm:w-auto">
                  Request a Quote
                </ButtonLink>
                <ButtonLink href="/services" variant="secondary" size="lg" class="w-full sm:w-auto">
                  Explore Our Services
                </ButtonLink>
              </div>
              <ul class="mt-8 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                <For each={TRUST_SIGNALS}>
                  {(signal) => (
                    <li class="flex items-start gap-2 text-sm text-ink-muted">
                      <svg
                        class="mt-1 h-3.5 w-3.5 flex-shrink-0 text-positive"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      {signal}
                    </li>
                  )}
                </For>
              </ul>
            </div>
            <div class="hidden justify-center lg:flex">
              <HeroVisual />
            </div>
          </div>
        </Container>
      </section>

      {/* ============ SERVICES ============ */}
      <section id="services" class="border-t border-surface-line bg-white py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Services"
            title="Everything Your Business Needs in Technology"
            intro="From a professional website to custom software and complete IT infrastructure, we bring your technology needs together under one experienced team."
          />
          <ServicesGrid />
        </Container>
      </section>

      {/* ============ WEBSITE PLANS ============ */}
      <PlansSection />

      {/* ============ CUSTOM SOLUTIONS ============ */}
      <section class="bg-white py-20 sm:py-24">
        <Container>
          <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Custom Solutions"
                title="Solutions Built Around Your Business"
                align="left"
                intro="You don't need to adapt your company to a predefined product. We first study your business, then build the right solution around your workflows, goals and budget."
              />
              <ButtonLink href="/contact?service=custom-software">
                Discuss Your Project
              </ButtonLink>
            </div>
            <div>
              <ul class="flex flex-wrap gap-2.5" aria-label="Examples of what we can build">
                <For each={CAPABILITIES}>
                  {(capability) => (
                    <li class="rounded-full border border-surface-line bg-surface-muted px-4 py-2 text-sm font-medium text-ink-soft">
                      {capability}
                    </li>
                  )}
                </For>
              </ul>
              <p class="mt-5 text-sm text-ink-faint">
                These are examples of what we can build — every project starts
                from your specific needs.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ============ IT INFRASTRUCTURE ============ */}
      <section class="bg-surface-muted py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="IT Infrastructure"
            title="We Also Take Care of Your IT Infrastructure"
            intro="We install, configure and maintain the technology that keeps your business connected, productive and protected."
          />
          <InfraDiagram />
          <ul class="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2" aria-label="Infrastructure services">
            <For each={INFRA_ITEMS}>
              {(item) => (
                <li class="rounded-full border border-surface-line bg-white px-3.5 py-1.5 text-sm text-ink-soft">
                  {item}
                </li>
              )}
            </For>
          </ul>
          <div class="mt-10 text-center">
            <ButtonLink href="/contact?service=consulting" size="lg">
              Request a Technology Assessment
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* ============ PROCESS ============ */}
      <ProcessSection />

      {/* ============ WHY 305 WEB SERVICE ============ */}
      <section class="bg-surface-muted py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Why 305 Web Service"
            title="One Team for All Your Technology"
          />
          <ul class="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            <For each={WHY_ITEMS}>
              {(item) => (
                <li>
                  <h3 class="flex items-start gap-2.5 text-base font-bold text-ink">
                    <svg
                      class="mt-1 h-4 w-4 flex-shrink-0 text-brand-blue"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    {item.title}
                  </h3>
                  <p class="mt-1.5 pl-[26px] text-sm leading-relaxed text-ink-muted">
                    {item.description}
                  </p>
                </li>
              )}
            </For>
          </ul>
        </Container>
      </section>

      {/* ============ ABOUT ============ */}
      <section class="bg-white py-20 sm:py-24">
        <Container>
          <div class="mx-auto max-w-2xl text-center">
            <p class="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-blue">
              About
            </p>
            <h2 class="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Technology with a Human Approach
            </h2>
            <p class="mt-5 text-lg leading-relaxed text-ink-muted">
              305 Web Service helps small and medium-sized businesses modernize
              their operations through professional websites, custom software,
              automation and technology infrastructure. We first understand the
              problem, then recommend a practical and secure solution that fits
              the company's needs and budget.
            </p>
            <div class="mt-7">
              <ButtonLink href="/about" variant="secondary">
                Learn more about how we work
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* ============ FINAL CTA ============ */}
      <FinalCTA />
    </Layout>
  );
}
