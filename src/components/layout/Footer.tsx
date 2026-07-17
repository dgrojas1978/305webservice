import { A } from "@solidjs/router";
import { For } from "solid-js";
import { C } from "~/data/content";
import { PATHS, type Locale } from "~/lib/i18n";
import { CONTACT_EMAIL, PHONE_DISPLAY, PHONE_TEL, WEB_DISPLAY, waLink } from "~/lib/site";

interface Props {
  locale: Locale;
}

export default function Footer(props: Props) {
  const t = () => C[props.locale];
  const year = new Date().getFullYear();

  const navLinks = () => [
    { href: PATHS.services[props.locale], label: t().nav.services },
    { href: PATHS.process[props.locale], label: t().nav.process },
    { href: PATHS.about[props.locale], label: t().nav.about },
    { href: PATHS.contact[props.locale], label: t().nav.contact },
  ];

  return (
    <footer data-surface="navy" class="bg-navy text-on-navy">
      <div class="container-site">
        <div class="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 md:py-20 lg:grid-cols-4">
          {/* marca */}
          <div>
            <p class="micro-caps text-paper">305 Web Service</p>
            <div class="rule-t mt-5" />
            <p class="micro-caps mt-5 leading-loose text-on-navy-faint">
              {t().footer.tagline}
            </p>
            <p class="micro-caps mt-8 text-on-navy-faint">Miami · Florida</p>
          </div>

          {/* navegación */}
          <nav aria-label={t().footer.navTitle}>
            <h2 class="micro-caps text-on-navy-faint">{t().footer.navTitle}</h2>
            <ul class="mt-6 space-y-3">
              <For each={navLinks()}>
                {(link) => (
                  <li>
                    <A href={link.href} class="link-underline text-sm font-medium text-paper">
                      {link.label}
                    </A>
                  </li>
                )}
              </For>
            </ul>
          </nav>

          {/* servicios */}
          <nav aria-label={t().footer.servicesTitle}>
            <h2 class="micro-caps text-on-navy-faint">{t().footer.servicesTitle}</h2>
            <ul class="mt-6 space-y-3">
              <For each={t().services.items.slice(0, 5)}>
                {(svc) => (
                  <li>
                    <A
                      href={`${PATHS.services[props.locale]}#${svc.id}`}
                      class="link-underline text-sm font-medium text-paper"
                    >
                      {svc.name}
                    </A>
                  </li>
                )}
              </For>
            </ul>
          </nav>

          {/* contacto */}
          <div>
            <h2 class="micro-caps text-on-navy-faint">{t().footer.contactTitle}</h2>
            <ul class="mt-6 space-y-3 text-sm font-medium">
              <li>
                <a href={`tel:${PHONE_TEL}`} class="link-underline font-bold text-paper">
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} class="link-underline text-paper">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="link-underline text-paper"
                >
                  WhatsApp
                </a>
              </li>
              <li class="pt-2">
                <span class="micro-caps text-turquoise">{WEB_DISPLAY}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="hr-line-navy" />

        <div class="flex flex-col items-start justify-between gap-4 py-8 sm:flex-row sm:items-center">
          <p class="text-xs text-on-navy-faint">
            © {year} 305 Web Service. {t().footer.rights}
          </p>
          <div class="flex items-center gap-8">
            <A
              href={PATHS.privacy[props.locale]}
              class="link-underline text-xs text-on-navy-faint hover:text-paper"
            >
              {t().footer.privacy}
            </A>
            <a href="#top" class="link-underline micro-caps text-on-navy-faint hover:text-paper">
              {t().footer.backToTop} ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
