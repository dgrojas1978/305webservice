import Container from "~/components/ui/Container";
import { ButtonLink, WhatsAppIcon } from "~/components/ui/Button";
import { waLink, WA_DEFAULT_MESSAGE } from "~/lib/site";

export default function FinalCTA() {
  return (
    <section class="relative overflow-hidden bg-brand-navy py-20 sm:py-24">
      <div class="bg-dots-navy absolute inset-0" aria-hidden="true" />
      <Container class="relative">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Tell Us What Your Business Needs
          </h2>
          <p class="mt-4 text-lg leading-relaxed text-slate-300">
            Whether you need a new website, custom software or help with your
            network and servers, we can evaluate your project and recommend the
            right next step.
          </p>
          <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/contact" variant="onDark" size="lg" class="w-full sm:w-auto">
              Request a Quote
            </ButtonLink>
            <ButtonLink
              href={waLink(WA_DEFAULT_MESSAGE)}
              external
              variant="whatsapp"
              size="lg"
              class="w-full sm:w-auto"
            >
              <WhatsAppIcon class="h-5 w-5" />
              Chat on WhatsApp
            </ButtonLink>
          </div>
          <p class="mt-5 text-sm text-slate-400">No-obligation initial response.</p>
        </div>
      </Container>
    </section>
  );
}
