import { For } from "solid-js";
import Layout from "~/components/layout/Layout";
import Seo from "~/components/Seo";
import Container from "~/components/ui/Container";
import SectionHeading from "~/components/ui/SectionHeading";
import { ButtonLink } from "~/components/ui/Button";
import InfraDiagram from "~/components/sections/InfraDiagram";
import FinalCTA from "~/components/sections/FinalCTA";

const areas = [
  {
    title: "Business Networks",
    description:
      "Design, installation and maintenance of reliable business networks.",
    items: [
      "Business Wi-Fi",
      "Routers and switches",
      "Cabling",
      "Network segmentation",
      "Troubleshooting",
      "Secure remote access",
      "Monitoring",
    ],
    cta: { label: "Request a Quote", href: "/contact?service=networks" },
  },
  {
    title: "Servers & Infrastructure",
    description:
      "Configuration, protection, migration and maintenance of physical and cloud infrastructure.",
    items: [
      "Windows Server",
      "Linux",
      "Active Directory",
      "File servers",
      "Backups",
      "Cloud migrations",
      "Domains and email",
      "Security",
    ],
    cta: { label: "Request a Quote", href: "/contact?service=servers" },
  },
  {
    title: "IT Support & Consulting",
    description:
      "Remote and on-site support, technology assessments, maintenance, security and project planning.",
    items: [
      "Remote and on-site support",
      "Technology assessments",
      "Preventive maintenance",
      "Security reviews",
      "Project planning",
    ],
    cta: { label: "Request Support", href: "/contact?service=it-support" },
  },
];

export default function ITInfrastructurePage() {
  return (
    <Layout>
      <Seo
        title="Business Networks, Servers & IT Support in Miami | 305 Web Service"
        description="Business network installation, server management, cloud infrastructure, backups and IT support for businesses in Miami — on-site locally and remote across the US."
        path="/it-infrastructure"
      />

      <section class="bg-white py-16 sm:py-20">
        <Container>
          <div class="mx-auto max-w-2xl text-center">
            <p class="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-blue">
              IT Infrastructure
            </p>
            <h1 class="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              We Also Take Care of Your IT Infrastructure
            </h1>
            <p class="mt-5 text-lg leading-relaxed text-ink-muted">
              We install, configure and maintain the technology that keeps your
              business connected, productive and protected.
            </p>
            <div class="mt-7">
              <ButtonLink href="/contact?service=consulting" size="lg">
                Request a Technology Assessment
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <section class="border-t border-surface-line bg-surface-muted py-16 sm:py-20">
        <Container>
          <h2 class="sr-only">How your infrastructure connects</h2>
          <InfraDiagram />
        </Container>
      </section>

      <section class="bg-white py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="What We Cover"
            title="From the Cable in the Wall to the Cloud"
          />
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <For each={areas}>
              {(area) => (
                <article class="flex flex-col rounded-2xl border border-surface-line bg-white p-6 shadow-card sm:p-8">
                  <h3 class="text-lg font-bold text-ink">{area.title}</h3>
                  <p class="mt-2 text-sm leading-relaxed text-ink-muted">{area.description}</p>
                  <ul class="mt-4 space-y-1.5">
                    <For each={area.items}>
                      {(item) => (
                        <li class="flex items-start gap-2 text-sm text-ink-muted">
                          <svg
                            class="mt-1 h-3.5 w-3.5 flex-shrink-0 text-brand-blue"
                            viewBox="0 0 16 16"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                          {item}
                        </li>
                      )}
                    </For>
                  </ul>
                  <div class="mt-auto pt-6">
                    <ButtonLink href={area.cta.href} variant="secondary" class="w-full">
                      {area.cta.label}
                    </ButtonLink>
                  </div>
                </article>
              )}
            </For>
          </div>
        </Container>
      </section>

      <FinalCTA />
    </Layout>
  );
}
