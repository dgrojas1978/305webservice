import { HttpStatusCode } from "@solidjs/start";
import Layout from "~/components/layout/Layout";
import Seo from "~/components/Seo";
import Container from "~/components/ui/Container";
import { ButtonLink } from "~/components/ui/Button";

export default function NotFoundPage() {
  return (
    <Layout>
      <HttpStatusCode code={404} />
      <Seo
        title="Page Not Found | 305 Web Service"
        description="The page you're looking for doesn't exist."
        path="/404"
      />
      <section class="bg-white py-24 sm:py-32">
        <Container>
          <div class="mx-auto max-w-xl text-center">
            <p class="text-sm font-semibold uppercase tracking-wider text-brand-blue">404</p>
            <h1 class="mt-3 text-4xl font-extrabold tracking-tight text-ink">
              Page not found
            </h1>
            <p class="mt-4 text-lg text-ink-muted">
              The page you're looking for doesn't exist or has moved.
            </p>
            <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/">Go to the homepage</ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                Request a Quote
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
}
