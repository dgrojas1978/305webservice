import { A } from "@solidjs/router";
import { For } from "solid-js";
import { CONTACT_EMAIL, waLink, WA_DEFAULT_MESSAGE, NAV_LINKS } from "~/lib/site";
import { WhatsAppIcon } from "~/components/ui/Button";

const serviceLinks = [
  { href: "/web-design", label: "Web Design" },
  { href: "/custom-software", label: "Custom Software" },
  { href: "/services#automation", label: "Business Automation" },
  { href: "/it-infrastructure", label: "Networks & Servers" },
  { href: "/services#support", label: "IT Support & Consulting" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer class="bg-brand-navyDeep text-slate-300">
      <div class="mx-auto w-full max-w-content px-4 py-14 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <A href="/" class="inline-flex items-baseline gap-1.5 text-xl font-extrabold tracking-tight">
              <span class="text-blue-400">305</span>
              <span class="text-white">Web Service</span>
            </A>
            <p class="mt-4 text-sm leading-relaxed text-slate-400">
              Professional websites, custom software and IT solutions for small
              and medium-sized businesses — local in Miami, remote across the
              United States.
            </p>
            <p class="mt-3 text-sm text-slate-400">
              Bilingual service in English and Spanish.
            </p>
          </div>

          {/* Services */}
          <nav aria-label="Services">
            <h2 class="mb-4 text-sm font-semibold text-white">Services</h2>
            <ul class="space-y-2.5">
              <For each={serviceLinks}>
                {(link) => (
                  <li>
                    <A href={link.href} class="text-sm text-slate-400 transition-colors hover:text-white">
                      {link.label}
                    </A>
                  </li>
                )}
              </For>
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company">
            <h2 class="mb-4 text-sm font-semibold text-white">Company</h2>
            <ul class="space-y-2.5">
              <For each={NAV_LINKS.filter((l) => ["/about", "/services", "/contact"].includes(l.href))}>
                {(link) => (
                  <li>
                    <A href={link.href} class="text-sm text-slate-400 transition-colors hover:text-white">
                      {link.label}
                    </A>
                  </li>
                )}
              </For>
              <li>
                <A href="/privacy" class="text-sm text-slate-400 transition-colors hover:text-white">
                  Privacy Policy
                </A>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 class="mb-4 text-sm font-semibold text-white">Contact</h2>
            <ul class="space-y-3">
              <li>
                <a
                  href={waLink(WA_DEFAULT_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
                >
                  <WhatsAppIcon class="h-4 w-4" />
                  Chat on WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  class="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li class="pt-2">
                <A
                  href="/contact"
                  class="inline-block rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blueDark"
                >
                  Request a Quote
                </A>
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p class="text-xs text-slate-400">
            © {year} 305 Web Service. All rights reserved.
          </p>
          <p class="text-xs text-slate-400">Miami, Florida · Serving businesses across the United States</p>
        </div>
      </div>
    </footer>
  );
}
