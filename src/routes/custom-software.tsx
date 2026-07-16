import { For } from "solid-js";
import Layout from "~/components/layout/Layout";
import Seo from "~/components/Seo";
import Container from "~/components/ui/Container";
import SectionHeading from "~/components/ui/SectionHeading";
import { ButtonLink } from "~/components/ui/Button";
import ProcessSection from "~/components/sections/ProcessSection";
import FinalCTA from "~/components/sections/FinalCTA";
import { CAPABILITIES } from "~/data/content";

const examples = [
  {
    title: "Administrative systems",
    description: "Replace spreadsheets and manual processes with one system your team shares.",
  },
  {
    title: "Customer portals",
    description: "Give your customers a secure place to view orders, documents or account status.",
  },
  {
    title: "Web and mobile applications",
    description: "Applications your customers and employees can use from any device.",
  },
  {
    title: "Reservation systems",
    description: "Let customers book appointments or services online, on their own time.",
  },
  {
    title: "Membership platforms",
    description: "Manage members, subscriptions and access to content or services.",
  },
  {
    title: "Inventory systems",
    description: "Track stock, movements and purchases with information you can trust.",
  },
  {
    title: "Internal tools",
    description: "Small, focused tools that remove the busywork specific to your operation.",
  },
  {
    title: "Management dashboards",
    description: "See how the business is doing in one place, with data pulled automatically.",
  },
];

export default function CustomSoftwarePage() {
  return (
    <Layout>
      <Seo
        title="Custom Software Development in Miami | 305 Web Service"
        description="Custom software built around your business — administrative systems, customer portals, web and mobile applications, reservations, inventory and dashboards. Serving Miami and the US."
        path="/custom-software"
      />

      <section class="bg-white py-16 sm:py-20">
        <Container>
          <div class="mx-auto max-w-2xl text-center">
            <p class="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-blue">
              Custom Software
            </p>
            <h1 class="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Software That Fits the Way Your Business Already Works
            </h1>
            <p class="mt-5 text-lg leading-relaxed text-ink-muted">
              You don't need to adapt your company to a predefined product. We
              first study your business, then design and build the right system
              around your workflows, goals and budget.
            </p>
            <div class="mt-7">
              <ButtonLink href="/contact?service=custom-software" size="lg">
                Discuss Your Project
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <section class="bg-surface-muted py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="What We Build"
            title="Solutions Built Around Your Business"
            intro="These are examples of what custom software can do for a business like yours — every project starts from your specific needs."
          />
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <For each={examples}>
              {(example) => (
                <div class="rounded-2xl border border-surface-line bg-white p-6 shadow-card">
                  <h3 class="text-base font-bold text-ink">{example.title}</h3>
                  <p class="mt-2 text-sm leading-relaxed text-ink-muted">{example.description}</p>
                </div>
              )}
            </For>
          </div>
          <ul class="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2" aria-label="More capabilities">
            <For each={CAPABILITIES}>
              {(capability) => (
                <li class="rounded-full border border-surface-line bg-white px-3.5 py-1.5 text-sm text-ink-soft">
                  {capability}
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
