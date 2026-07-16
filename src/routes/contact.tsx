import { A, action, redirect, useSearchParams, useSubmission } from "@solidjs/router";
import { For, Show } from "solid-js";
import Layout from "~/components/layout/Layout";
import Seo from "~/components/Seo";
import Container from "~/components/ui/Container";
import { ButtonLink, WhatsAppIcon } from "~/components/ui/Button";
import { saveLead } from "~/lib/db";
import { CONTACT_EMAIL, waLink, WA_DEFAULT_MESSAGE } from "~/lib/site";
import { FORM_SERVICES, FORM_BUDGETS, FORM_CONTACT_METHODS } from "~/data/content";

const submitQuote = action(async (formData: FormData) => {
  "use server";

  // Honeypot: real users never fill this hidden field.
  if ((formData.get("website_url") as string)?.trim()) {
    throw redirect("/contact?submitted=1");
  }

  const get = (key: string) => ((formData.get(key) as string) ?? "").trim();

  const lead = {
    name: get("name"),
    company: get("company") || undefined,
    phone: get("phone"),
    email: get("email"),
    service: get("service"),
    budget: get("budget") || undefined,
    message: get("message"),
    preferredContact: get("preferredContact"),
    consent: formData.get("consent") === "on",
    createdAt: new Date(),
    source: "web-quote-form",
  };

  if (!lead.name || !lead.phone || !lead.email || !lead.service || !lead.message) {
    return { error: "Please complete all required fields." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    return { error: "Please enter a valid email address." };
  }
  if (!lead.consent) {
    return { error: "Please confirm that we may contact you about your request." };
  }

  try {
    await saveLead(lead);
  } catch (err) {
    console.error("[305WS] Failed to save lead:", err);
    return {
      error:
        "Something went wrong sending your request. Please try again, or reach us by WhatsApp or email.",
    };
  }

  throw redirect("/contact?submitted=1");
}, "submitQuote");

const inputClass =
  "w-full rounded-xl border border-surface-line bg-white px-4 py-2.5 text-sm text-ink placeholder-slate-400 transition-colors focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none";

function SuccessMessage() {
  return (
    <div class="rounded-2xl border border-surface-line bg-white p-10 text-center shadow-card" role="status">
      <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-positive-soft">
        <svg class="h-7 w-7 text-positive" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-ink">Request received</h2>
      <p class="mx-auto mt-3 max-w-md text-ink-muted">
        Thank you for reaching out. We'll review your project and get back to
        you using your preferred contact method. No-obligation initial
        response.
      </p>
      <div class="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <ButtonLink href="/">Back to the homepage</ButtonLink>
        <ButtonLink href={waLink(WA_DEFAULT_MESSAGE)} external variant="whatsapp">
          <WhatsAppIcon class="h-4 w-4" />
          Chat on WhatsApp
        </ButtonLink>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const [params] = useSearchParams();
  const submission = useSubmission(submitQuote);

  const preselectedService = () => {
    const s = params.service;
    return FORM_SERVICES.some((o) => o.value === s) ? s : "";
  };

  return (
    <Layout>
      <Seo
        title="Request a Quote | 305 Web Service"
        description="Tell us what your business needs — a website, custom software, automation or IT infrastructure — and we'll evaluate your project and recommend the right next step."
        path="/contact"
      />

      <section class="bg-white py-14 sm:py-16">
        <Container>
          <div class="mx-auto max-w-2xl text-center">
            <p class="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-blue">
              Contact
            </p>
            <h1 class="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Tell Us What Your Business Needs
            </h1>
            <p class="mt-5 text-lg leading-relaxed text-ink-muted">
              Whether you need a new website, custom software or help with your
              network and servers, we can evaluate your project and recommend
              the right next step.
            </p>
          </div>
        </Container>
      </section>

      <section class="bg-surface-muted py-14 sm:py-16">
        <Container>
          <div class="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Side column */}
            <div class="space-y-5 lg:col-span-1">
              <a
                href={waLink(WA_DEFAULT_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-4 rounded-2xl border border-surface-line bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <span class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-positive text-white">
                  <WhatsAppIcon class="h-5 w-5" />
                </span>
                <span>
                  <span class="block text-sm font-bold text-ink">Chat on WhatsApp</span>
                  <span class="block text-sm text-ink-faint">Fastest way to reach us</span>
                </span>
              </a>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                class="flex items-center gap-4 rounded-2xl border border-surface-line bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <span class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-brand-blue text-white">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <span>
                  <span class="block text-sm font-bold text-ink">Email</span>
                  <span class="block text-sm text-ink-faint">{CONTACT_EMAIL}</span>
                </span>
              </a>

              <div class="rounded-2xl border border-surface-line bg-white p-5 shadow-card">
                <h2 class="text-sm font-bold text-ink">What to expect</h2>
                <ul class="mt-3 space-y-2 text-sm text-ink-muted">
                  {[
                    "No-obligation initial response",
                    "A clear quote with scope and price",
                    "Service in English or Spanish",
                    "Direct contact with the technical team",
                  ].map((item) => (
                    <li class="flex items-start gap-2">
                      <svg class="mt-1 h-3.5 w-3.5 flex-shrink-0 text-positive" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Form */}
            <div class="lg:col-span-2">
              <Show when={!params.submitted} fallback={<SuccessMessage />}>
                <form
                  action={submitQuote}
                  method="post"
                  class="rounded-2xl border border-surface-line bg-white p-6 shadow-card sm:p-8"
                  aria-describedby={submission.result?.error ? "form-error" : undefined}
                >
                  <h2 class="text-xl font-bold text-ink">Request a Quote</h2>
                  <p class="mt-1 text-sm text-ink-faint">
                    Fields marked with <span aria-hidden="true">*</span>
                    <span class="sr-only">an asterisk</span> are required.
                  </p>

                  <Show when={submission.result?.error}>
                    <div
                      id="form-error"
                      role="alert"
                      class="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
                    >
                      {submission.result!.error}
                    </div>
                  </Show>

                  {/* Honeypot — hidden from real users */}
                  <div class="hidden" aria-hidden="true">
                    <label for="website_url">Leave this field empty</label>
                    <input id="website_url" name="website_url" type="text" tabIndex={-1} autocomplete="off" />
                  </div>

                  <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label for="name" class="mb-1.5 block text-sm font-medium text-ink-soft">
                        Full name <span class="text-red-600" aria-hidden="true">*</span>
                      </label>
                      <input id="name" name="name" type="text" required autocomplete="name" class={inputClass} />
                    </div>
                    <div>
                      <label for="company" class="mb-1.5 block text-sm font-medium text-ink-soft">
                        Company <span class="text-ink-faint">(optional)</span>
                      </label>
                      <input id="company" name="company" type="text" autocomplete="organization" class={inputClass} />
                    </div>
                    <div>
                      <label for="phone" class="mb-1.5 block text-sm font-medium text-ink-soft">
                        Phone <span class="text-red-600" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        autocomplete="tel"
                        placeholder="(305) 555-0100"
                        class={inputClass}
                      />
                    </div>
                    <div>
                      <label for="email" class="mb-1.5 block text-sm font-medium text-ink-soft">
                        Email <span class="text-red-600" aria-hidden="true">*</span>
                      </label>
                      <input id="email" name="email" type="email" required autocomplete="email" class={inputClass} />
                    </div>
                    <div>
                      <label for="service" class="mb-1.5 block text-sm font-medium text-ink-soft">
                        Service needed <span class="text-red-600" aria-hidden="true">*</span>
                      </label>
                      <select id="service" name="service" required class={inputClass}>
                        <option value="">Select a service…</option>
                        <For each={FORM_SERVICES}>
                          {(option) => (
                            <option value={option.value} selected={preselectedService() === option.value}>
                              {option.label}
                            </option>
                          )}
                        </For>
                      </select>
                    </div>
                    <div>
                      <label for="budget" class="mb-1.5 block text-sm font-medium text-ink-soft">
                        Estimated budget
                      </label>
                      <select id="budget" name="budget" class={inputClass}>
                        <option value="">Select a range…</option>
                        <For each={FORM_BUDGETS}>
                          {(option) => <option value={option.value}>{option.label}</option>}
                        </For>
                      </select>
                    </div>
                  </div>

                  <div class="mt-5">
                    <label for="message" class="mb-1.5 block text-sm font-medium text-ink-soft">
                      Tell us about your project <span class="text-red-600" aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Briefly describe your business and what you need help with…"
                      class={`${inputClass} resize-y`}
                    />
                  </div>

                  <fieldset class="mt-5">
                    <legend class="mb-2 text-sm font-medium text-ink-soft">
                      Preferred contact method
                    </legend>
                    <div class="flex flex-wrap gap-x-6 gap-y-2">
                      <For each={FORM_CONTACT_METHODS}>
                        {(method, i) => (
                          <label class="flex items-center gap-2 text-sm text-ink-muted">
                            <input
                              type="radio"
                              name="preferredContact"
                              value={method.value}
                              checked={i() === 0}
                              class="h-4 w-4 border-surface-line text-brand-blue focus:ring-brand-blue"
                            />
                            {method.label}
                          </label>
                        )}
                      </For>
                    </div>
                  </fieldset>

                  <div class="mt-6">
                    <label class="flex items-start gap-3 text-sm text-ink-muted">
                      <input
                        type="checkbox"
                        name="consent"
                        required
                        class="mt-0.5 h-4 w-4 rounded border-surface-line text-brand-blue focus:ring-brand-blue"
                      />
                      <span>
                        I agree to be contacted by 305 Web Service about this
                        request. See our{" "}
                        <A href="/privacy" class="font-medium text-brand-blue underline hover:text-brand-blueDark">
                          Privacy Policy
                        </A>
                        . <span class="text-red-600" aria-hidden="true">*</span>
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={submission.pending}
                    class="mt-7 w-full rounded-xl bg-brand-blue px-6 py-3.5 text-base font-semibold text-white shadow-cta transition-colors hover:bg-brand-blueDark disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Show when={submission.pending} fallback={"Request a Quote"}>
                      <span class="inline-flex items-center gap-2">
                        <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25" />
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
                        </svg>
                        Sending your request…
                      </span>
                    </Show>
                  </button>
                  <p class="mt-3 text-center text-xs text-ink-faint" aria-live="polite">
                    {submission.pending ? "Sending — please don't close this page." : "No-obligation initial response."}
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
