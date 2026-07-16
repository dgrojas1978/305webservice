import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import { Monitor, Code2, Workflow, Network, Server, Headset } from "lucide-solid";
import { SERVICES, type ServiceItem } from "~/data/content";

const icons: Record<string, typeof Monitor> = {
  "web-design": Monitor,
  "custom-software": Code2,
  automation: Workflow,
  networks: Network,
  servers: Server,
  support: Headset,
};

function ServiceCard(props: { service: ServiceItem }) {
  const Icon = icons[props.service.id];
  return (
    <article
      id={props.service.id}
      class="flex flex-col rounded-2xl border border-surface-line bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover sm:p-8"
    >
      <div class="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blueSoft text-brand-blue">
        <Icon size={22} stroke-width={2} aria-hidden="true" />
      </div>
      <h3 class="text-lg font-bold text-ink">{props.service.title}</h3>
      <Show when={props.service.price}>
        <p class="mt-1 text-sm font-semibold text-brand-blue">{props.service.price}</p>
      </Show>
      <p class="mt-2 text-sm leading-relaxed text-ink-muted">{props.service.description}</p>
      <ul class="mt-4 grid grid-cols-1 gap-x-4 gap-y-1.5">
        <For each={props.service.bullets}>
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
      <Show when={props.service.cta}>
        <div class="mt-auto pt-6">
          <A
            href={props.service.cta!.href}
            class="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blueDark"
          >
            {props.service.cta!.label}
            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 10h12m0 0-4.5-4.5M16 10l-4.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </A>
        </div>
      </Show>
    </article>
  );
}

export default function ServicesGrid() {
  return (
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <For each={SERVICES}>{(service) => <ServiceCard service={service} />}</For>
    </div>
  );
}
