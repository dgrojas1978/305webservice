import { For, Show } from "solid-js";
import { ButtonLink } from "~/components/ui/Button";
import Container from "~/components/ui/Container";
import SectionHeading from "~/components/ui/SectionHeading";
import { PLANS, PRICING_NOTE } from "~/data/content";

export default function PlansSection() {
  return (
    <section id="plans" class="bg-surface-muted py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Website Plans"
          title="Your Business Deserves a Professional Website"
          intro="We create fast, modern websites built to generate calls, messages and new business opportunities."
        />

        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <For each={PLANS}>
            {(plan) => (
              <article
                class={`relative flex flex-col rounded-2xl bg-white p-6 sm:p-8 ${
                  plan.featured
                    ? "border-2 border-brand-blue shadow-card-hover"
                    : "border border-surface-line shadow-card"
                }`}
              >
                <Show when={plan.featured}>
                  <p class="absolute -top-3.5 left-6 rounded-full bg-brand-blue px-3 py-1 text-xs font-semibold text-white">
                    Most popular starting point
                  </p>
                </Show>
                <h3 class="text-sm font-semibold uppercase tracking-wider text-ink-faint">
                  {plan.name}
                </h3>
                <p class="mt-2 text-2xl font-bold text-ink">{plan.price}</p>
                <p class="mt-1 text-sm text-ink-muted">{plan.tagline}</p>
                <ul class="mt-6 space-y-2.5">
                  <For each={plan.features}>
                    {(feature) => (
                      <li class="flex items-start gap-2.5 text-sm text-ink-muted">
                        <svg
                          class="mt-0.5 h-4 w-4 flex-shrink-0 text-positive"
                          viewBox="0 0 16 16"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        {feature}
                      </li>
                    )}
                  </For>
                </ul>
                <div class="mt-auto pt-8">
                  <ButtonLink
                    href={plan.cta.href}
                    variant={plan.featured ? "primary" : "secondary"}
                    class="w-full"
                  >
                    {plan.cta.label}
                  </ButtonLink>
                </div>
              </article>
            )}
          </For>
        </div>

        <p class="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-ink-faint">
          {PRICING_NOTE}
        </p>
      </Container>
    </section>
  );
}
