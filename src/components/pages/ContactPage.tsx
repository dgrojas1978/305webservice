import { A, action, redirect, useSearchParams, useSubmission } from "@solidjs/router";
import { For, Show } from "solid-js";
import Seo from "~/components/Seo";
import Layout from "~/components/layout/Layout";
import Container from "~/components/ui/Container";
import { ButtonLink, WhatsAppIcon } from "~/components/ui/Button";
import { saveLead } from "~/lib/db";
import { C } from "~/data/content";
import { PATHS, altPath, type Locale } from "~/lib/i18n";
import { CONTACT_EMAIL, PHONE_DISPLAY, PHONE_TEL, waLink } from "~/lib/site";

const submitProject = action(async (formData: FormData) => {
  "use server";

  const locale: Locale = formData.get("locale") === "es" ? "es" : "en";
  const t = C[locale];
  const successUrl = `${PATHS.contact[locale]}?submitted=1`;

  // Honeypot: los usuarios reales nunca llenan este campo oculto.
  if ((formData.get("website_url") as string)?.trim()) {
    throw redirect(successUrl);
  }

  const get = (key: string) => ((formData.get(key) as string) ?? "").trim();

  const lead = {
    name: get("name"),
    company: get("company") || undefined,
    email: get("email"),
    phone: get("phone") || undefined,
    service: get("service"),
    budget: get("budget") || undefined,
    message: get("message"),
    consent: formData.get("consent") === "on",
    locale,
    createdAt: new Date(),
    source: "web-contact-form",
  };

  if (!lead.name || !lead.email || !lead.service || !lead.message) {
    return { error: t.contact.errors.required };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    return { error: t.contact.errors.email };
  }
  if (!lead.consent) {
    return { error: t.contact.errors.consent };
  }

  try {
    await saveLead(lead);
  } catch (err) {
    console.error("[305WS] Failed to save lead:", err);
    // No simulamos éxito: el usuario conserva lo escrito y ve el error real.
    return { error: t.contact.errors.server };
  }

  throw redirect(successUrl);
}, "submitProject");

export default function ContactPage(props: { locale: Locale }) {
  const t = () => C[props.locale];
  const [params] = useSearchParams();
  const submission = useSubmission(submitProject);

  const preselectedService = () => {
    const s = params.service;
    return t().formServices.some((o) => o.value === s) ? s : "";
  };

  return (
    <Layout locale={props.locale} page="contact">
      <Seo
        title={t().meta.contact.title}
        description={t().meta.contact.description}
        path={PATHS.contact[props.locale]}
        altPath={altPath("contact", props.locale)}
        locale={props.locale}
      />

      <section data-surface="navy" class="bg-navy pb-24 pt-36 md:pb-32 md:pt-48">
        <Container>
          <div class="grid grid-cols-1 gap-16 lg:grid-cols-12">
            {/* izquierda */}
            <div class="lg:col-span-5">
              <h1 class="text-h1 uppercase text-paper">
                {t().contact.title1}
                <br />
                {t().contact.title2}
              </h1>
              <div class="rule-t mt-8" />
              <p class="mt-8 max-w-md text-body-lg text-on-navy">{t().contact.intro}</p>

              <ul class="mt-12 space-y-4 text-base font-medium">
                <li>
                  <a href={`tel:${PHONE_TEL}`} class="link-underline font-bold text-paper">
                    {PHONE_DISPLAY}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${CONTACT_EMAIL}`} class="link-underline text-on-navy">
                    {CONTACT_EMAIL}
                  </a>
                </li>
                <li>
                  <a
                    href={waLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="link-underline inline-flex items-center gap-2 text-on-navy"
                  >
                    <WhatsAppIcon class="h-4 w-4" />
                    WhatsApp
                  </a>
                </li>
              </ul>
              <p class="micro-caps mt-12 text-on-navy-faint">Miami · Florida</p>
            </div>

            {/* derecha: formulario */}
            <div class="lg:col-span-6 lg:col-start-7">
              <Show
                when={!params.submitted}
                fallback={
                  <div role="status">
                    <h2 class="text-h2 uppercase text-paper">{t().contact.success.title}</h2>
                    <p class="mt-6 max-w-md text-body-lg text-on-navy">
                      {t().contact.success.text}
                    </p>
                    <div class="mt-10">
                      <ButtonLink href={PATHS.home[props.locale]} variant="outline">
                        {t().contact.success.back}
                      </ButtonLink>
                    </div>
                  </div>
                }
              >
                <form
                  action={submitProject}
                  method="post"
                  aria-describedby={submission.result?.error ? "form-error" : undefined}
                >
                  <input type="hidden" name="locale" value={props.locale} />
                  <p class="micro-caps text-on-navy-faint">
                    {t().contact.labels.required} <span aria-hidden="true">*</span>
                  </p>

                  <Show when={submission.result?.error}>
                    <div
                      id="form-error"
                      role="alert"
                      class="mt-6 border-l-2 border-turquoise py-2 pl-4 text-sm font-medium text-paper"
                    >
                      {submission.result!.error}
                    </div>
                  </Show>

                  {/* honeypot — oculto para usuarios reales */}
                  <div class="hidden" aria-hidden="true">
                    <label for="website_url">Leave this field empty</label>
                    <input id="website_url" name="website_url" type="text" tabIndex={-1} autocomplete="off" />
                  </div>

                  <div class="mt-8 grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
                    <div>
                      <label for="name" class="micro-caps block text-on-navy">
                        {t().contact.labels.name} <span class="text-turquoise" aria-hidden="true">*</span>
                      </label>
                      <input id="name" name="name" type="text" required autocomplete="name"
                        class="field-input mt-2 !text-paper" style={{ "border-bottom-color": "rgba(247,249,252,0.3)" }} />
                    </div>
                    <div>
                      <label for="company" class="micro-caps block text-on-navy">
                        {t().contact.labels.company} <span class="normal-case text-on-navy-faint">({t().contact.labels.companyOpt})</span>
                      </label>
                      <input id="company" name="company" type="text" autocomplete="organization"
                        class="field-input mt-2 !text-paper" style={{ "border-bottom-color": "rgba(247,249,252,0.3)" }} />
                    </div>
                    <div>
                      <label for="email" class="micro-caps block text-on-navy">
                        {t().contact.labels.email} <span class="text-turquoise" aria-hidden="true">*</span>
                      </label>
                      <input id="email" name="email" type="email" required autocomplete="email"
                        class="field-input mt-2 !text-paper" style={{ "border-bottom-color": "rgba(247,249,252,0.3)" }} />
                    </div>
                    <div>
                      <label for="phone" class="micro-caps block text-on-navy">
                        {t().contact.labels.phone} <span class="normal-case text-on-navy-faint">({t().contact.labels.phoneOpt})</span>
                      </label>
                      <input id="phone" name="phone" type="tel" autocomplete="tel"
                        class="field-input mt-2 !text-paper" style={{ "border-bottom-color": "rgba(247,249,252,0.3)" }} />
                    </div>
                    <div>
                      <label for="service" class="micro-caps block text-on-navy">
                        {t().contact.labels.service} <span class="text-turquoise" aria-hidden="true">*</span>
                      </label>
                      <select id="service" name="service" required
                        class="field-input mt-2 !text-paper [&>option]:text-navy" style={{ "border-bottom-color": "rgba(247,249,252,0.3)" }}>
                        <option value="">{t().contact.labels.selectService}</option>
                        <For each={t().formServices}>
                          {(o) => (
                            <option value={o.value} selected={preselectedService() === o.value}>
                              {o.label}
                            </option>
                          )}
                        </For>
                      </select>
                    </div>
                    <div>
                      <label for="budget" class="micro-caps block text-on-navy">
                        {t().contact.labels.budget} <span class="normal-case text-on-navy-faint">({t().contact.labels.budgetOpt})</span>
                      </label>
                      <select id="budget" name="budget"
                        class="field-input mt-2 !text-paper [&>option]:text-navy" style={{ "border-bottom-color": "rgba(247,249,252,0.3)" }}>
                        <option value="">{t().contact.labels.selectBudget}</option>
                        <For each={t().formBudgets}>
                          {(o) => <option value={o.value}>{o.label}</option>}
                        </For>
                      </select>
                    </div>
                  </div>

                  <div class="mt-7">
                    <label for="message" class="micro-caps block text-on-navy">
                      {t().contact.labels.message} <span class="text-turquoise" aria-hidden="true">*</span>
                    </label>
                    <textarea id="message" name="message" required rows={4}
                      class="field-input mt-2 resize-y !text-paper" style={{ "border-bottom-color": "rgba(247,249,252,0.3)" }} />
                  </div>

                  <div class="mt-8">
                    <label class="flex items-start gap-3 text-sm text-on-navy">
                      <input type="checkbox" name="consent" required
                        class="mt-0.5 h-4 w-4 rounded-none border-hairline bg-transparent text-blue focus:ring-turquoise" />
                      <span>
                        {t().contact.labels.consent}{" "}
                        <A href={PATHS.privacy[props.locale]} class="link-underline font-medium text-paper">
                          {t().contact.labels.privacyLink}
                        </A>
                        . <span class="text-turquoise" aria-hidden="true">*</span>
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={submission.pending}
                    class="btn btn-primary mt-10 w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {submission.pending ? t().contact.labels.sending : t().contact.labels.submit}
                  </button>
                  <p class="mt-4 text-xs text-on-navy-faint" aria-live="polite">
                    {submission.pending ? t().contact.labels.sending : t().contact.note}
                  </p>
                </form>
              </Show>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
}
