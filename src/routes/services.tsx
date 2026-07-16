import Layout from "~/components/layout/Layout";
import Seo from "~/components/Seo";
import Container from "~/components/ui/Container";
import ServicesGrid from "~/components/sections/ServicesGrid";
import ProcessSection from "~/components/sections/ProcessSection";
import FinalCTA from "~/components/sections/FinalCTA";

export default function ServicesPage() {
  return (
    <Layout>
      <Seo
        title="Technology Services for Businesses | 305 Web Service"
        description="Web design, custom software, business automation, networks, servers and IT support — complete technology services for small and medium-sized businesses in Miami and across the US."
        path="/services"
      />

      <section class="bg-white py-16 sm:py-20">
        <Container>
          <div class="mx-auto max-w-2xl text-center">
            <p class="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-blue">
              Services
            </p>
            <h1 class="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Everything Your Business Needs in Technology
            </h1>
            <p class="mt-5 text-lg leading-relaxed text-ink-muted">
              From a professional website to custom software and complete IT
              infrastructure, we bring your technology needs together under one
              experienced team.
            </p>
          </div>
        </Container>
      </section>

      <section class="bg-surface-muted py-16 sm:py-20">
        <Container>
          <ServicesGrid />
        </Container>
      </section>

      <ProcessSection />
      <FinalCTA />
    </Layout>
  );
}
