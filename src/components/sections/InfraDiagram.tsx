import { For } from "solid-js";
import { Globe, Shield, Network, MonitorSmartphone, Server, DatabaseBackup } from "lucide-solid";

const nodes = [
  { label: "Internet", icon: Globe },
  { label: "Firewall / Router", icon: Shield },
  { label: "Business Network", icon: Network },
  { label: "Devices", icon: MonitorSmartphone },
  { label: "Server or Cloud", icon: Server },
  { label: "Backups", icon: DatabaseBackup },
];

/**
 * Accessible flow diagram: an ordered list styled as a horizontal chain on
 * desktop and a vertical chain on small screens. Screen readers hear a
 * plain ordered list.
 */
export default function InfraDiagram() {
  return (
    <ol
      class="flex flex-col items-stretch gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-0"
      aria-label="How your business infrastructure connects, from the internet to backups"
    >
      <For each={nodes}>
        {(node, i) => (
          <>
            <li class="flex items-center gap-3 rounded-xl border border-surface-line bg-white px-4 py-3 shadow-card lg:flex-col lg:gap-2 lg:px-5 lg:py-4 lg:text-center">
              <span class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-brand-blueSoft text-brand-blue">
                <node.icon size={18} aria-hidden="true" />
              </span>
              <span class="text-sm font-semibold text-ink">{node.label}</span>
            </li>
            {i() < nodes.length - 1 && (
              <li aria-hidden="true" class="flex justify-center px-1 text-slate-300 lg:flex-shrink-0">
                {/* down arrow on mobile, right arrow on desktop */}
                <svg class="h-5 w-5 lg:hidden" viewBox="0 0 20 20" fill="none">
                  <path d="M10 3v12m0 0-4-4m4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <svg class="hidden h-5 w-5 lg:block" viewBox="0 0 20 20" fill="none">
                  <path d="M3 10h12m0 0-4-4m4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </li>
            )}
          </>
        )}
      </For>
    </ol>
  );
}
