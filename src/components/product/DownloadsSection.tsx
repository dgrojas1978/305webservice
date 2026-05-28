import { For, Show } from "solid-js";
import type { Product } from "~/types";

export default function DownloadsSection(props: { product: Product }) {
  const p = props.product;

  return (
    <Show when={p.downloads && p.downloads.length > 0}>
      <section
        class="py-14"
        style={`background: linear-gradient(135deg, ${p.colorFrom}18, #020914 60%)`}
      >
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div class="text-center mb-10">
            <p
              class="text-sm font-semibold uppercase tracking-widest mb-3"
              style={`color: ${p.accentColor}`}
            >
              Cliente de escritorio
            </p>
            <h2 class="text-3xl sm:text-4xl font-black text-white mb-3">
              Descarga {p.name}
            </h2>
            <div class="flex items-center justify-center gap-2">
              <span class="px-2.5 py-1 rounded-full text-xs font-bold border" style={`color: ${p.accentColor}; border-color: ${p.accentColor}40; background: ${p.accentColor}10`}>
                v{p.downloadVersion}
              </span>
              <span class="text-slate-500 text-sm">· Última versión estable</span>
            </div>
          </div>

          {/* Download cards */}
          <div class="grid sm:grid-cols-2 gap-4 mb-8">
            <For each={p.downloads}>
              {(dl) => (
                <a
                  href={dl.url}
                  download={dl.filename}
                  class="group flex items-center gap-4 p-5 rounded-2xl border border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/15 transition-all duration-200"
                  classList={{ "pointer-events-none opacity-50": dl.url === "#" }}
                >
                  {/* File type icon */}
                  <div
                    class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-lg font-black"
                    style={`background: ${p.accentColor}15; border: 1px solid ${p.accentColor}30; color: ${p.accentColor}`}
                  >
                    {dl.type === "exe" ? ".EXE" : ".ZIP"}
                  </div>

                  <div class="flex-1 min-w-0">
                    <p class="text-white font-semibold text-sm mb-0.5">{dl.label}</p>
                    <p class="text-slate-500 text-xs truncate font-mono">{dl.filename}</p>
                    <div class="flex items-center gap-3 mt-1.5">
                      <span class="text-slate-500 text-xs">{dl.platform}</span>
                      <Show when={dl.size}>
                        <span class="text-slate-600 text-xs">·</span>
                        <span class="text-slate-500 text-xs">{dl.size}</span>
                      </Show>
                    </div>
                  </div>

                  {/* Arrow */}
                  <svg
                    class="w-5 h-5 text-slate-600 group-hover:text-white group-hover:translate-y-0.5 transition-all flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width={2}
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              )}
            </For>
          </div>

          {/* Requirements note */}
          <p class="text-center text-slate-600 text-xs">
            Requiere Windows 10 o superior · 64-bit · 4 GB RAM mínimo
            <span class="mx-2">·</span>
            También disponible como{" "}
            <span class="text-slate-400 font-medium">PWA</span>{" "}
            en cualquier navegador moderno
          </p>
        </div>
      </section>
    </Show>
  );
}
