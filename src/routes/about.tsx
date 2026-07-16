import { For } from "solid-js";
import Layout from "~/components/layout/Layout";
import Seo from "~/components/Seo";
import Container from "~/components/ui/Container";
import SectionHeading from "~/components/ui/SectionHeading";
import FinalCTA from "~/components/sections/FinalCTA";
import ProcessSection from "~/components/sections/ProcessSection";
import { WHY_ITEMS } from "~/data/content";

export default function AboutPage() {
  return (
    <Layout>
      <Seo
        title="About 305 Web Service | Technology with a Human Approach"
        description="305 Web Service helps small and medium-sized businesses modernize through professional websites, custom software, automation and IT infrastructure — bilingual service in Miami and across the US."
        path="/about"
      />

      <section class="bg-white py-16 sm:py-20">
        <Container>
          <div class="mx-auto max-w-2xl text-center">
            <p class="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-blue">
              About
            </p>
            <h1 class="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Technology with a Human Approach
            </h1>
            <p class="mt-5 text-lg leading-relaxed text-ink-muted">
              305 Web Service helps small and medium-sized businesses modernize
              their operations through professional websites, custom software,
              automation and technology infrastructure. We first understand the
              problem, then recommend a practical and secure solution that fits
              the company's needs and budget.
            </p>
          </div>
        </Container>
      </section>

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

      <ProcessSection />
      <FinalCTA />
    </Layout>
  );
}
