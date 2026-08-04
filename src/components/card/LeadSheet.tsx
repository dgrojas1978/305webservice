import { A, action, redirect, useAction, useSubmission } from "@solidjs/router";
import { For, Show, createEffect, createSignal, onCleanup } from "solid-js";
import { saveLead } from "~/lib/db";
import { captureAttribution, trackEvent } from "~/lib/analytics";
import { waLink } from "~/lib/site";
import { CARD_COPY, cardHref, type CardLocale, type CardProfile } from "~/data/card";

/**
 * Bottom sheet / modal accesible de 2 pasos (orden §5–6).
 * Modo "project" (Start a Project) y modo "exchange" (Share Your Contact) —
 * mismo formulario, misma privacidad. El paso 1 pide lo mínimo (nombre,
 * método preferido, necesidad); el paso 2 completa contacto + consentimiento.
 * Focus trap, Escape, aria-modal, scroll lock, restaura el foco al cerrar.
 */

export type SheetMode = "project" | "exchange" | null;

/** Exportada para que la tarjeta pueda restaurar el sheet tras un POST nativo
    (sin interceptación JS el envío recarga la página y el error se perdería). */
export const submitCardLead = action(async (formData: FormData) => {
  "use server";
  const locale: CardLocale = formData.get("locale") === "es" ? "es" : "en";
  const t = CARD_COPY[locale].sheet;
  const slug = ((formData.get("card") as string) || "305").slice(0, 40);
  const successUrl = `/card/${slug}?submitted=1`;

  // Honeypot: usuarios reales nunca llenan este campo oculto.
  if ((formData.get("website_url") as string)?.trim()) throw redirect(successUrl);

  const get = (k: string) => ((formData.get(k) as string) ?? "").trim();
  let attribution: Record<string, string> = {};
  try {
    const raw = get("attribution");
    if (raw) attribution = JSON.parse(raw);
  } catch { /* atribución opcional */ }

  const method = get("method");
  const lead = {
    name: get("name").slice(0, 120),
    company: get("company").slice(0, 120) || undefined,
    email: get("email").slice(0, 160) || undefined,
    phone: get("phone").slice(0, 40) || undefined,
    contactMethod: method,
    service: get("service").slice(0, 60),
    message: get("message").slice(0, 2000) || "(digital card lead)",
    consent: formData.get("consent") === "on",
    locale,
    attribution: Object.keys(attribution).length ? attribution : undefined,
    createdAt: new Date(),
    source: `digital-card-${slug}`,
  };

  if (!lead.name || !method || !lead.service) return { error: t.errors.required };
  if (method === "email") {
    if (!lead.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return { error: t.errors.email };
  } else if (!lead.phone) {
    return { error: t.errors.phone };
  } else if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    return { error: t.errors.email };
  }
  if (!lead.consent) return { error: t.errors.consent };

  try {
    await saveLead(lead);
  } catch (err) {
    console.error("[305WS] Failed to save card lead:", err);
    return { error: t.errors.server };
  }
  throw redirect(successUrl);
}, "submitCardLead");

interface Props {
  profile: CardProfile;
  lang: CardLocale;
  mode: SheetMode;
  /** Necesidad preseleccionada (formService) al abrir desde el concierge. */
  preselect?: string;
  /** true → el sheet abre mostrando el estado de éxito (?submitted=1). */
  success?: boolean;
  onClose: () => void;
}

export default function LeadSheet(props: Props) {
  const t = () => CARD_COPY[props.lang].sheet;
  const submission = useSubmission(submitCardLead);
  const runSubmit = useAction(submitCardLead);
  const [step, setStep] = createSignal<1 | 2>(1);
  const [method, setMethod] = createSignal("whatsapp");
  const [stepError, setStepError] = createSignal(false);

  let panel: HTMLDivElement | undefined;
  let attrRef: HTMLInputElement | undefined;
  let opener: Element | null = null;
  let form: HTMLFormElement | undefined;

  const open = () => props.mode !== null;

  createEffect(() => {
    if (!open()) return;
    opener = document.activeElement;
    document.body.style.overflow = "hidden"; // scroll lock
    setStep(1);
    setStepError(false);
    if (attrRef) attrRef.value = JSON.stringify(captureAttribution());
    if (props.mode === "project") trackEvent("lead_form_start", { card: props.profile.id });
    queueMicrotask(() => {
      const first = panel?.querySelector<HTMLElement>("input, select, button");
      first?.focus();
    });
    onCleanup(() => {
      document.body.style.overflow = "";
      (opener as HTMLElement | null)?.focus?.();
    });
  });

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") { e.preventDefault(); props.onClose(); return; }
    if (e.key !== "Tab" || !panel) return;
    // focus trap
    const focusables = [...panel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
    )].filter((el) => el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  const tryContinue = () => {
    const name = (form?.elements.namedItem("name") as HTMLInputElement)?.value.trim();
    const service = (form?.elements.namedItem("service") as HTMLSelectElement)?.value;
    if (!name || !service) { setStepError(true); return; }
    setStepError(false);
    setStep(2);
    queueMicrotask(() => panel?.querySelector<HTMLElement>('[data-step="2"] input')?.focus());
  };

  const field = "field-input";
  const lbl = "mb-1 block text-[0.8rem] font-semibold text-navy";

  return (
    <Show when={open()}>
      <div class="fixed inset-0 z-50" role="presentation" onKeyDown={onKeyDown}>
        {/* backdrop */}
        <button
          type="button"
          aria-label={t().close}
          class="absolute inset-0 h-full w-full cursor-default bg-[rgba(2,8,18,0.66)]"
          onClick={() => props.onClose()}
          tabIndex={-1}
        />
        {/* sheet: bottom en móvil, centrado en escritorio */}
        <div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-labelledby="sheet-title"
          class="absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto rounded-t-2xl bg-paper text-navy shadow-2xl sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:max-h-[86vh] sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl"
        >
          <div class="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-hairline bg-paper px-5 py-3.5">
            <h2 id="sheet-title" class="text-base font-extrabold tracking-tight">
              {props.success ? t().success.title : props.mode === "exchange" ? t().titleExchange : t().titleProject}
            </h2>
            <button type="button" onClick={() => props.onClose()} aria-label={t().close}
              class="flex h-9 w-9 items-center justify-center rounded-full text-body hover:bg-[rgba(7,20,38,0.06)]">
              <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
          </div>

          <div class="p-5 safe-bottom">
            <Show
              when={!props.success}
              fallback={
                <div role="status">
                  <p class="text-[0.92rem] leading-relaxed text-body">{t().success.text}</p>
                  <div class="mt-4 flex flex-col gap-2.5">
                    <a href={waLink()} target="_blank" rel="noopener noreferrer" class="btn btn-primary w-full text-center">
                      {t().success.whatsapp}
                    </a>
                    <button type="button" onClick={() => props.onClose()} class="btn btn-outline w-full text-center">
                      {t().success.back}
                    </button>
                  </div>
                </div>
              }
            >
              <form ref={form} action={submitCardLead} method="post"
                aria-describedby={submission.result?.error ? "sheet-error" : undefined}
                onSubmit={(e) => {
                  // Envío programático (RPC): error inline sin recargar; sin JS
                  // el action serializado degrada a POST nativo con redirect.
                  e.preventDefault();
                  trackEvent("lead_form_submit", { card: props.profile.id, mode: props.mode ?? "" });
                  void runSubmit(new FormData(e.currentTarget));
                }}>
                <input type="hidden" name="locale" value={props.lang} />
                <input type="hidden" name="card" value={props.profile.id} />
                <input type="hidden" name="mode" value={props.mode ?? "project"} />
                <input ref={attrRef} type="hidden" name="attribution" value="" />
                <div class="hidden" aria-hidden="true">
                  <label for="ls-hp">Leave empty</label>
                  <input id="ls-hp" name="website_url" type="text" tabIndex={-1} autocomplete="off" />
                </div>

                <Show when={submission.result?.error}>
                  <div id="sheet-error" role="alert" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-800">
                    {submission.result!.error}
                  </div>
                </Show>

                {/* paso 1 */}
                <div data-step="1" style={{ display: step() === 1 ? "block" : "none" }}>
                  <p class="micro-caps text-blue-ink">{t().step1}</p>
                  <div class="mt-3 grid gap-3.5">
                    <div>
                      <label for="ls-name" class={lbl}>{t().name} <span class="text-blue" aria-hidden="true">*</span></label>
                      <input id="ls-name" name="name" type="text" required autocomplete="name" class={field} />
                    </div>
                    <fieldset>
                      <legend class={lbl}>{t().method} <span class="text-blue" aria-hidden="true">*</span></legend>
                      <div class="grid grid-cols-3 gap-2" role="radiogroup">
                        <For each={["whatsapp", "call", "email"] as const}>
                          {(m) => (
                            <label class={`t-card flex cursor-pointer items-center justify-center rounded-lg border px-2 py-2.5 text-[0.8rem] font-bold ${method() === m ? "border-blue bg-[rgba(20,108,255,0.08)] text-blue-ink" : "border-hairline text-body"}`}>
                              <input type="radio" name="method" value={m} checked={method() === m}
                                onChange={() => setMethod(m)} class="sr-only" />
                              {t().methods[m]}
                            </label>
                          )}
                        </For>
                      </div>
                    </fieldset>
                    <div>
                      <label for="ls-service" class={lbl}>{t().need} <span class="text-blue" aria-hidden="true">*</span></label>
                      <select id="ls-service" name="service" required class={field}>
                        <option value="">{t().selectNeed}</option>
                        <For each={props.profile.conversion?.services ?? []}>
                          {(s) => (
                            <option value={s.formService} selected={props.preselect === s.formService}>
                              {s.label[props.lang]}
                            </option>
                          )}
                        </For>
                      </select>
                    </div>
                    <Show when={stepError()}>
                      <p role="alert" class="text-sm font-medium text-red-700">{t().errors.required}</p>
                    </Show>
                    <button type="button" onClick={tryContinue} class="btn btn-primary w-full">{t().continue}</button>
                  </div>
                </div>

                {/* paso 2 */}
                <div data-step="2" style={{ display: step() === 2 ? "block" : "none" }}>
                  <p class="micro-caps text-blue-ink">{t().step2}</p>
                  <div class="mt-3 grid gap-3.5">
                    <Show
                      when={method() === "email"}
                      fallback={
                        <div>
                          <label for="ls-phone" class={lbl}>{t().phone} <span class="text-blue" aria-hidden="true">*</span></label>
                          <input id="ls-phone" name="phone" type="tel" autocomplete="tel" class={field} />
                        </div>
                      }
                    >
                      <div>
                        <label for="ls-email" class={lbl}>{t().email} <span class="text-blue" aria-hidden="true">*</span></label>
                        <input id="ls-email" name="email" type="email" autocomplete="email" class={field} />
                      </div>
                    </Show>
                    <div>
                      <label for="ls-company" class={lbl}>{t().company} <span class="font-normal text-body/70">({t().optional})</span></label>
                      <input id="ls-company" name="company" type="text" autocomplete="organization" class={field} />
                    </div>
                    <div>
                      <label for="ls-message" class={lbl}>{t().message} <span class="font-normal text-body/70">({t().optional})</span></label>
                      <textarea id="ls-message" name="message" rows={3} class={`${field} resize-y`} />
                    </div>
                    <label class="flex items-start gap-2.5 text-[0.8rem] text-body">
                      <input type="checkbox" name="consent" required class="mt-0.5 h-4 w-4 rounded border-hairline text-blue focus:ring-blue" />
                      <span>
                        {t().consent}{" "}
                        <A href={cardHref("/privacy", props.lang)} class="link-underline font-medium text-blue-ink">{t().privacy}</A>. <span class="text-blue" aria-hidden="true">*</span>
                      </span>
                    </label>
                    <div class="flex gap-2.5">
                      <button type="button" onClick={() => setStep(1)} class="btn btn-outline flex-1">{t().back}</button>
                      <button type="submit" disabled={submission.pending} class="btn btn-primary flex-[2] disabled:cursor-not-allowed disabled:opacity-60">
                        {submission.pending ? t().sending : t().submit}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </Show>
          </div>
        </div>
      </div>
    </Show>
  );
}
