import { A } from "@solidjs/router";
import { For } from "solid-js";
import { C } from "~/data/content";
import { PATHS, type Locale, type PageKey } from "~/lib/i18n";
import { CONTACT_EMAIL, PHONE_DISPLAY, PHONE_TEL, WEB_DISPLAY } from "~/lib/site";
import { waQuote } from "~/lib/links";
import { WhatsAppIcon } from "~/components/ui/Button";

export default function Footer(props: { locale: Locale }) {
  const t = () => C[props.locale];
  const year = new Date().getFullYear();

  const services = (): { key: PageKey; label: string }[] => [
    { key: "websitePackages", label: t().nav.websitePackages },
    { key: "customSoftware", label: t().nav.customSoftware },
    { key: "automation", label: props.locale === "es" ? "Automatización" : "Automation" },
    { key: "itInfrastructure", label: props.locale === "es" ? "Infraestructura IT" : "IT Infrastructure" },
    { key: "nfc", label: t().nav.nfc },
  ];
  const company = (): { key: PageKey; label: string }[] => [
    { key: "services", label: t().nav.services },
    { key: "industries", label: t().nav.industries },
    { key: "process", label: t().nav.process },
    { key: "about", label: t().nav.about },
    { key: "contact", label: t().nav.contact },
  ];

  return (
    <footer data-surface="navy" class="bg-navy text-on-navy">
      <div class="container-site">
        <div class="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 md:py-20 lg:grid-cols-4">
          <div>
            <p class="text-[0.95rem] font-black uppercase tracking-tight text-paper"><span class="text-blue-navy">305</span> Web Service</p>
            <div class="rule-t mt-5" />
            <p class="mt-5 max-w-xs text-sm leading-relaxed text-on-navy-faint">{t().footer.tagline}</p>
            <p class="micro-caps mt-8 text-on-navy-faint">Miami · Florida</p>
          </div>

          <nav aria-label={t().footer.servicesTitle}>
            <h2 class="micro-caps text-on-navy-faint">{t().footer.servicesTitle}</h2>
            <ul class="mt-6 space-y-3">
              <For each={services()}>
                {(l) => <li><A href={PATHS[l.key][props.locale]} class="link-underline text-sm font-medium text-paper">{l.label}</A></li>}
              </For>
            </ul>
          </nav>

          <nav aria-label={t().footer.companyTitle}>
            <h2 class="micro-caps text-on-navy-faint">{t().footer.companyTitle}</h2>
            <ul class="mt-6 space-y-3">
              <For each={company()}>
                {(l) => <li><A href={PATHS[l.key][props.locale]} class="link-underline text-sm font-medium text-paper">{l.label}</A></li>}
              </For>
            </ul>
          </nav>

          <div>
            <h2 class="micro-caps text-on-navy-faint">{t().footer.contactTitle}</h2>
            <ul class="mt-6 space-y-3 text-sm font-medium">
              <li><a href={`tel:${PHONE_TEL}`} class="link-underline font-bold text-paper">{PHONE_DISPLAY}</a></li>
              <li><a href={`mailto:${CONTACT_EMAIL}`} class="link-underline text-paper">{CONTACT_EMAIL}</a></li>
              <li>
                <a href={waQuote(props.locale)} target="_blank" rel="noopener noreferrer" class="link-underline inline-flex items-center gap-2 text-paper">
                  <WhatsAppIcon class="h-4 w-4" /> WhatsApp
                </a>
              </li>
              <li class="pt-2"><span class="micro-caps text-turquoise">{WEB_DISPLAY}</span></li>
            </ul>
          </div>
        </div>

        <div class="hr-line-navy" />
        <div class="flex flex-col items-start justify-between gap-4 py-8 sm:flex-row sm:items-center">
          <p class="text-xs text-on-navy-faint">© {year} 305 Web Service. {t().footer.rights}</p>
          <div class="flex items-center gap-8">
            <A href={PATHS.privacy[props.locale]} class="link-underline text-xs text-on-navy-faint hover:text-paper">{t().footer.privacy}</A>
            <a href="#top" class="link-underline micro-caps text-on-navy-faint hover:text-paper">{t().footer.backToTop} ↑</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
