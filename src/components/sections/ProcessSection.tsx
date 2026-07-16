import { For } from "solid-js";
import Container from "~/components/ui/Container";
import SectionHeading from "~/components/ui/SectionHeading";
import { PROCESS } from "~/data/content";

export default function ProcessSection() {
  return (
    <section id="process" class="bg-white py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="How We Work"
          title="From an Idea to a Working Solution"
          intro="A clear process with defined scope, pricing and schedule — agreed on before work begins."
        />
        <ol class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <For each={PROCESS}>
            {(step, i) => (
              <li class="relative rounded-2xl border border-surface-line bg-white p-6 shadow-card">
                <p class="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-white">
                  {i() + 1}
                </p>
                <h3 class="text-base font-bold text-ink">{step.title}</h3>
                <p class="mt-2 text-sm leading-relaxed text-ink-muted">{step.description}</p>
              </li>
            )}
          </For>
        </ol>
      </Container>
    </section>
  );
}
