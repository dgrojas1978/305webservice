import Layout from "~/components/layout/Layout";
import Seo from "~/components/Seo";
import Container from "~/components/ui/Container";
import { CONTACT_EMAIL } from "~/lib/site";

export default function PrivacyPage() {
  return (
    <Layout>
      <Seo
        title="Privacy Policy | 305 Web Service"
        description="How 305 Web Service collects, uses and protects the information you share through this website."
        path="/privacy"
      />

      <section class="bg-white py-16 sm:py-20">
        <Container>
          <div class="mx-auto max-w-2xl">
            <h1 class="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Privacy Policy
            </h1>
            <p class="mt-3 text-sm text-ink-faint">Last updated: July 15, 2026</p>

            <div class="mt-8 space-y-8 text-base leading-relaxed text-ink-muted">
              <section>
                <h2 class="mb-2 text-lg font-bold text-ink">Information we collect</h2>
                <p>
                  When you submit our quote request form, we collect the
                  information you provide: your name, company (optional), phone
                  number, email address, the service you're interested in, your
                  estimated budget, your project description and your preferred
                  contact method.
                </p>
              </section>

              <section>
                <h2 class="mb-2 text-lg font-bold text-ink">How we use it</h2>
                <p>
                  We use this information only to respond to your request,
                  prepare your quote and communicate with you about your
                  project. We do not sell your information or add you to
                  marketing lists.
                </p>
              </section>

              <section>
                <h2 class="mb-2 text-lg font-bold text-ink">How we store it</h2>
                <p>
                  Form submissions are stored securely in our database and are
                  accessible only to the 305 Web Service team.
                </p>
              </section>

              <section>
                <h2 class="mb-2 text-lg font-bold text-ink">Your choices</h2>
                <p>
                  You may contact us at any time to ask what information we
                  hold about you or to request that it be deleted. Write to{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} class="font-medium text-brand-blue hover:text-brand-blueDark">
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2 class="mb-2 text-lg font-bold text-ink">Third-party links</h2>
                <p>
                  This site includes links to WhatsApp for direct communication.
                  When you use WhatsApp, WhatsApp's own terms and privacy policy
                  apply.
                </p>
              </section>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
}
