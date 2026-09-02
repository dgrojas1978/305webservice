import { A, action, redirect, useSearchParams, useSubmission } from "@solidjs/router";
import { For, Show, onMount } from "solid-js";
import Seo from "~/components/Seo";
import Layout from "~/components/layout/Layout";
import Container from "~/components/ui/Container";
import { ButtonLink, WhatsAppIcon } from "~/components/ui/Button";
import { C } from "~/data/content";
import { PATHS, altPath, type Locale } from "~/lib/i18n";
import { CONTACT_EMAIL, PHONE_DISPLAY, PHONE_TEL, waLink } from "~/lib/site";
import { captureAttribution, trackEvent } from "~/lib/analytics";

const submitQuote = action(async (formData: FormData) => {
  "use server";

  const locale: Locale = formData.get("locale") === "es" ? "es" : "en";
  const t = C[locale];
  const successUrl = `${PATHS.contact[locale]}?submitted=1`;

  // Honeypot: los usuarios reales nunca llenan este campo oculto.
  if ((formData.get("website_url") as string)?.trim()) throw redirect(successUrl);

  const get = (k: string) => ((formData.get(k) as string) ?? "").trim();
  let attribution: Record<string, string> = {};
  try {
    const raw = get("attribution");
    if (raw) attribution = JSON.parse(raw);
  } catch { /* atribución opcional */ }

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
    attribution: Object.keys(attribution).length ? attribution : undefined,
    createdAt: new Date(),
    source: "web-quote-form",
  };

  if (!lead.name || !lead.email || !lead.service || !lead.message) return { error: t.contact.errors.required };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return { error: t.contact.errors.email };
  if (!lead.consent) return { error: t.contact.errors.consent };

  // El lead se manda a celerati-cards y no a una base propia.
  //
  // Antes se guardaba en un MongoDB de este repositorio y NO SE AVISABA A
  // NADIE: el lead se quedaba ahí hasta que alguien se acordara de abrir la
  // colección. Y el filtro de publicidad vivía en las tarjetas y no aquí,
  // porque eran dos códigos distintos haciendo lo mismo peor.
  //
  // Va de servidor a servidor (esto es una server-action): no interviene CORS
  // y para el visitante no cambia nada, ni siquiera si lleva JavaScript
  // apagado.
  const destino = process.env.LEAD_API_URL || "https://card.celerati.com/api/lead";
  try {
    const r = await fetch(destino, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        // Nos identifica como servidor nuestro. Este POST sale de un servidor,
        // no de un navegador: no lleva User-Agent de Chrome, ni idioma, ni
        // cookie. Para el detector de bots del otro lado es indistinguible de
        // un programa —y lo es, solo que uno de casa—. Sin esta cabecera, el
        // dia que alla se exija el token, el formulario dejaria de guardar
        // nada y nadie se enteraria.
        ...(process.env.LEAD_API_TOKEN ? { "x-celerati-token": process.env.LEAD_API_TOKEN } : {}),
      },
      body: JSON.stringify({ ...lead, createdAt: undefined }),
      signal: AbortSignal.timeout(10_000),
    });
    const cuerpo = await r.json().catch(() => ({})) as { error?: string };
    // Nunca se finge que se guardó: si el destino falla, el formulario enseña
    // el error y sus alternativas (WhatsApp, correo). Un "gracias" falso es la
    // peor de las respuestas posibles: el lead se pierde y nadie se entera.
    if (!r.ok) return { error: cuerpo.error || t.contact.errors.server };
  } catch (err) {
    console.error("[305WS] Failed to save lead:", err);
    return { error: t.contact.errors.server };
  }

  throw redirect(successUrl);
}, "submitQuote");

export default function ContactPage(props: { locale: Locale }) {
  const t = () => C[props.locale];
  const [params] = useSearchParams();
  const submission = useSubmission(submitQuote);

  const preselected = () => {
    const s = params.service;
    return t().formServices.some((o) => o.value === s) ? (s as string) : "";
  };

  let attrRef: HTMLInputElement | undefined;
  onMount(() => {
    if (attrRef) attrRef.value = JSON.stringify(captureAttribution());
    if (params.submitted) trackEvent("form_submit_success");
    else trackEvent("form_start");
  });

  return (
    <Layout locale={props.locale} page="contact">
      <Seo title={t().meta.contact.title} description={t().meta.contact.description} path={PATHS.contact[props.locale]} altPath={altPath("contact", props.locale)} locale={props.locale} />

      <section data-surface="navy" class="bg-navy pb-20 pt-32 md:pb-28 md:pt-40">
        <Container>
          <div class="grid grid-cols-1 gap-16 lg:grid-cols-12">
            {/* izquierda */}
            <div class="lg:col-span-5">
              <p class="micro-caps text-turquoise">{t().contact.eyebrow}</p>
              <h1 class="mt-6 text-[clamp(2rem,4.4vw,3.6rem)] font-black leading-[1.05] tracking-tight text-paper">{t().contact.title}</h1>
              <div class="rule-t mt-7" />
              <p class="mt-7 max-w-md text-body-lg leading-relaxed text-on-navy">{t().contact.intro}</p>

              <div class="mt-12">
                <h2 class="micro-caps text-on-navy-faint">{t().contact.channelsTitle}</h2>
                <ul class="mt-5 space-y-4 text-base font-medium">
                  <li>
                    <a href={waLink()} target="_blank" rel="noopener noreferrer" class="link-underline inline-flex items-center gap-2 font-bold text-paper">
                      <WhatsAppIcon class="h-5 w-5 text-turquoise" /> {t().contact.whatsappLabel}
                    </a>
                    <span class="mt-1 block text-sm text-on-navy-faint">{t().contact.whatsappSub}</span>
                  </li>
                  <li><a href={`tel:${PHONE_TEL}`} class="link-underline font-bold text-paper">{PHONE_DISPLAY}</a></li>
                  <li><a href={`mailto:${CONTACT_EMAIL}`} class="link-underline text-on-navy">{CONTACT_EMAIL}</a></li>
                </ul>
              </div>
              <p class="micro-caps mt-12 text-on-navy-faint">Miami · Florida</p>
            </div>

            {/* derecha: formulario */}
            <div class="lg:col-span-6 lg:col-start-7">
              <Show
                when={!params.submitted}
                fallback={
                  <div role="status" class="card p-8 md:p-10">
                    <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(20,108,255,0.1)]">
                      <svg class="h-7 w-7 text-blue" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                    </div>
                    <h2 class="mt-6 text-center text-2xl font-extrabold tracking-tight text-navy">{t().contact.success.title}</h2>
                    <p class="mx-auto mt-3 max-w-md text-center text-body">{t().contact.success.text}</p>
                    <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                      <ButtonLink href={PATHS.home[props.locale]} variant="outline">{t().contact.success.back}</ButtonLink>
                      <ButtonLink href={waLink()} external><WhatsAppIcon class="h-4 w-4" />{t().contact.success.whatsapp}</ButtonLink>
                    </div>
                  </div>
                }
              >
                <form action={submitQuote} method="post" class="card p-6 md:p-8" aria-describedby={submission.result?.error ? "form-error" : undefined}>
                  <input type="hidden" name="locale" value={props.locale} />
                  <input ref={attrRef} type="hidden" name="attribution" value="" />

                  <p class="text-sm text-body">
                    {t().contact.labels.required} <span class="text-blue" aria-hidden="true">*</span>
                  </p>

                  <Show when={submission.result?.error}>
                    <div id="form-error" role="alert" class="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                      {submission.result!.error}
                    </div>
                  </Show>

                  <div class="hidden" aria-hidden="true">
                    <label for="website_url">Leave empty</label>
                    <input id="website_url" name="website_url" type="text" tabIndex={-1} autocomplete="off" />
                  </div>

                  <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                    <div>
                      <label for="name" class="mb-1.5 block text-sm font-medium text-navy">{t().contact.labels.name} <span class="text-blue" aria-hidden="true">*</span></label>
                      <input id="name" name="name" type="text" required autocomplete="name" class="field-input" />
                    </div>
                    <div>
                      <label for="company" class="mb-1.5 block text-sm font-medium text-navy">{t().contact.labels.company} <span class="text-body/70">({t().contact.labels.companyOpt})</span></label>
                      <input id="company" name="company" type="text" autocomplete="organization" class="field-input" />
                    </div>
                    <div>
                      <label for="email" class="mb-1.5 block text-sm font-medium text-navy">{t().contact.labels.email} <span class="text-blue" aria-hidden="true">*</span></label>
                      <input id="email" name="email" type="email" required autocomplete="email" class="field-input" />
                    </div>
                    <div>
                      <label for="phone" class="mb-1.5 block text-sm font-medium text-navy">{t().contact.labels.phone} <span class="text-body/70">({t().contact.labels.phoneOpt})</span></label>
                      <input id="phone" name="phone" type="tel" autocomplete="tel" class="field-input" />
                    </div>
                    <div>
                      <label for="service" class="mb-1.5 block text-sm font-medium text-navy">{t().contact.labels.service} <span class="text-blue" aria-hidden="true">*</span></label>
                      <select id="service" name="service" required class="field-input">
                        <option value="">{t().contact.labels.selectService}</option>
                        <For each={t().formServices}>
                          {(o) => <option value={o.value} selected={preselected() === o.value}>{o.label}</option>}
                        </For>
                      </select>
                    </div>
                    <div>
                      <label for="budget" class="mb-1.5 block text-sm font-medium text-navy">{t().contact.labels.budget} <span class="text-body/70">({t().contact.labels.budgetOpt})</span></label>
                      <select id="budget" name="budget" class="field-input">
                        <option value="">{t().contact.labels.selectBudget}</option>
                        <For each={t().formBudgets}>{(o) => <option value={o.value}>{o.label}</option>}</For>
                      </select>
                    </div>
                  </div>

                  <div class="mt-5">
                    <label for="message" class="mb-1.5 block text-sm font-medium text-navy">{t().contact.labels.message} <span class="text-blue" aria-hidden="true">*</span></label>
                    <textarea id="message" name="message" required rows={4} class="field-input resize-y" />
                  </div>

                  <div class="mt-6">
                    <label class="flex items-start gap-3 text-sm text-body">
                      <input type="checkbox" name="consent" required class="mt-0.5 h-4 w-4 rounded border-hairline text-blue focus:ring-blue" />
                      <span>
                        {t().contact.labels.consent}{" "}
                        <A href={PATHS.privacy[props.locale]} class="link-underline font-medium text-blue">{t().contact.labels.privacyLink}</A>. <span class="text-blue" aria-hidden="true">*</span>
                      </span>
                    </label>
                  </div>

                  <button type="submit" disabled={submission.pending} class="btn btn-primary mt-8 w-full disabled:cursor-not-allowed disabled:opacity-60">
                    {submission.pending ? t().contact.labels.sending : t().contact.labels.submit}
                  </button>
                  <p class="mt-3 text-center text-xs text-body/70" aria-live="polite">
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
