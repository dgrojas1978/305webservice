import { For, Show, createSignal, onCleanup, createEffect } from "solid-js";
import { isServer } from "solid-js/web";
import { trackEvent } from "~/lib/analytics";
import { CARD_COPY, type CardLocale, type CardProfile } from "~/data/card";
import {
  handleRenderable, paymentLink, zelleCopyValue, zelleDestination, zelleRenderable,
  zelleUrlSafe,
} from "~/lib/cardPayments";

/**
 * Hoja de cobro de la tarjeta.
 *
 * Existe por un motivo concreto: el cliente acaba escribiendo a mano un número
 * dictado en una acera, y un dígito mal manda el dinero a un desconocido sin
 * posibilidad de cancelarlo.
 *
 * El QR vive AQUÍ DENTRO, no en la página. `CARD-SYSTEM.md` congela «exactamente
 * un QR por página, al final, apuntando a la tarjeta»; sacarlo a la página
 * rompería esa invariante y obligaría a reabrir la especificación.
 *
 * Aquí no se cobra: solo se enseña a quién pagar y por dónde.
 */
export default function PaymentSheet(props: {
  profile: CardProfile;
  locale: CardLocale;
  open: boolean;
  onClose: () => void;
}) {
  const t = () => CARD_COPY[props.locale].payments;
  const pay = () => props.profile.payments;
  const [copied, setCopied] = createSignal<string | null>(null);
  const [qrOpen, setQrOpen] = createSignal(false);
  let panel: HTMLDivElement | undefined;
  let restoreTo: HTMLElement | null = null;

  const close = () => { setQrOpen(false); props.onClose(); };

  const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };

  // `isServer` en los dos sitios: en el render del servidor no hay `document`, y
  // la limpieza SÍ se ejecuta allí al desmontar el árbol. Sin esta guarda, la
  // tarjeta reventaba en el servidor en cuanto el negocio activaba los cobros.
  createEffect(() => {
    if (isServer) return;
    if (props.open) {
      restoreTo = document.activeElement as HTMLElement | null;
      document.addEventListener("keydown", onKey);
      // Bloqueo de scroll: sin esto el fondo se mueve bajo la hoja.
      document.body.style.overflow = "hidden";
      queueMicrotask(() => panel?.focus());
      trackEvent("payment_open", { card: props.profile.id });
    } else {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      restoreTo?.focus();
    }
  });

  onCleanup(() => {
    if (isServer) return;
    document.removeEventListener("keydown", onKey);
    document.body.style.overflow = "";
  });

  async function copy(value: string, what: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(what);
      setTimeout(() => setCopied(null), 2000);
      trackEvent("payment_copy", { card: props.profile.id, method: what });
    } catch {
      /* sin portapapeles el número sigue visible y se puede leer */
    }
  }

  const handles = () => ([
    { key: "venmo" as const, label: "Venmo", cfg: pay()?.venmo },
    { key: "cashapp" as const, label: "Cash App", cfg: pay()?.cashapp },
    { key: "paypal" as const, label: "PayPal", cfg: pay()?.paypal },
  ]).filter((h) => handleRenderable(h.cfg));

  return (
    <Show when={props.open}>
      <div class="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center"
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
        <div ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-label={t().sheetTitle}
          class="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-navy p-6 text-paper outline-none sm:rounded-3xl">

          <div class="flex items-start justify-between gap-4">
            <h2 class="text-h3 font-extrabold tracking-tight">{t().sheetTitle}</h2>
            <button type="button" onClick={close}
              class="shrink-0 text-sm text-on-navy underline">{t().close}</button>
          </div>

          {/* Zelle: sin enlace universal posible, asi que copiar / contacto / QR */}
          <Show when={zelleRenderable(pay()?.zelle)}>
            {(() => {
              const z = () => pay()!.zelle!;
              const dest = () => zelleDestination(z());
              return (
                <section class="mt-6 rounded-2xl border border-[rgba(247,249,252,0.16)] p-5">
                  <p class="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-turquoise">Zelle</p>

                  {/* El nombre es lo que evita que el dinero acabe en otra cuenta. */}
                  <p class="mt-3 text-sm text-on-navy">{t().verify}</p>
                  <p class="mt-1 text-xl font-extrabold">{z().recipientName}</p>

                  <p class="mt-4 text-[0.7rem] font-semibold uppercase tracking-wide text-on-navy-faint">
                    {t().recipient}
                  </p>
                  <p class="mt-1 select-all break-all text-lg font-bold tabular-nums">{dest()}</p>

                  {/* Botón primero: la tarjeta se ve en el teléfono del cliente,
                      así que escanear el QR ahí no sirve. El enlace es el MISMO
                      que el código lleva dentro. */}
                  <Show when={zelleUrlSafe(z().zelleUrl)}>
                    {(url) => (
                      <>
                        <a href={url()} target="_blank" rel="noopener noreferrer"
                          onClick={() => trackEvent("payment_open_app", { card: props.profile.id, method: "zelle" })}
                          class="btn btn-primary mt-4 flex w-full items-center justify-center !py-3 text-sm">
                          {t().payWithZelle}
                        </a>
                        <p class="mt-1.5 text-[0.7rem] text-on-navy-faint">{t().payWithZelleHelp}</p>
                      </>
                    )}
                  </Show>

                  <div class="mt-4 flex flex-wrap gap-2">
                    <button type="button" onClick={() => copy(zelleCopyValue(z()), "zelle")}
                      class="btn btn-outline !px-5 !py-2.5 text-sm">
                      {copied() === "zelle" ? t().copied : t().copy}
                    </button>
                    <a href={`/card/${props.profile.id}/vcard`} rel="external" download=""
                      onClick={() => trackEvent("payment_save_contact", { card: props.profile.id })}
                      class="btn btn-outline !px-5 !py-2.5 text-sm">
                      {t().saveContact}
                    </a>
                    <Show when={z().qrImage}>
                      <button type="button" onClick={() => { setQrOpen(!qrOpen()); trackEvent("payment_qr_view", { card: props.profile.id }); }}
                        class="btn btn-outline !px-5 !py-2.5 text-sm">
                        {qrOpen() ? t().hideQr : t().showQr}
                      </button>
                    </Show>
                  </div>

                  <Show when={qrOpen() && z().qrImage}>
                    <div class="mt-4 rounded-xl bg-paper p-4">
                      <img src={z().qrImage} alt="" width="220" height="220" class="mx-auto h-auto w-[220px]" />
                    </div>
                    <p class="mt-2 text-[0.7rem] text-on-navy-faint">{t().qrHelp}</p>
                    <p class="text-[0.7rem] text-on-navy-faint">{t().qrIssued}</p>
                  </Show>

                  <Show when={z().note || z().noteEs}>
                    <p class="mt-4 text-sm text-on-navy">
                      {props.locale === "es" ? (z().noteEs || z().note) : (z().note || z().noteEs)}
                    </p>
                  </Show>

                  <p class="mt-4 border-t border-[rgba(247,249,252,0.14)] pt-3 text-[0.7rem] leading-relaxed text-on-navy-faint">
                    {t().zelleHow} {t().irreversible}
                  </p>
                </section>
              );
            })()}
          </Show>

          {/* Venmo / Cash App / PayPal: aqui SI hay enlace universal de verdad. */}
          <Show when={handles().length}>
            <section class="mt-4 space-y-2">
              <For each={handles()}>
                {(h) => {
                  const href = paymentLink(h.key, h.cfg!.handle);
                  return (
                    <a href={href!} target="_blank" rel="noopener noreferrer"
                      onClick={() => trackEvent("payment_open_app", { card: props.profile.id, method: h.key })}
                      class="flex items-center justify-between gap-3 rounded-2xl border border-[rgba(247,249,252,0.16)] px-5 py-4">
                      <span>
                        <span class="block text-sm font-bold">{h.label}</span>
                        <Show when={h.cfg!.recipientName}>
                          <span class="block text-[0.7rem] text-on-navy-faint">{h.cfg!.recipientName}</span>
                        </Show>
                      </span>
                      <span class="shrink-0 text-sm text-turquoise">{t().openApp} →</span>
                    </a>
                  );
                }}
              </For>
            </section>
          </Show>
        </div>
      </div>
    </Show>
  );
}
