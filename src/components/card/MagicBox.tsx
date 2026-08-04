import { For, Show, createEffect, createMemo, onCleanup } from "solid-js";
import { isServer } from "solid-js/web";
import type { CardLocale } from "~/data/card";

/**
 * MagicBox — visor de galería reutilizable del sistema de tarjetas.
 *
 * Diálogo accesible de verdad: role=dialog + aria-modal, foco atrapado dentro,
 * Escape cierra, el foco vuelve EXACTO al elemento que lo abrió, el fondo queda
 * inerte y el scroll bloqueado (con restauración de posición al cerrar).
 *
 * La imagen se muestra `contain` (nunca recorta un bordado), limitada a
 * 88vw × 82vh en escritorio y a pantalla completa en móvil. Prev/next por
 * botón, teclado (←/→) y swipe. Miniaturas solo si hay más de tres.
 *
 * Rendimiento: solo se pinta la imagen activa y se PREcargan la anterior y la
 * siguiente; nada de cargar toda la galería a resolución completa de entrada.
 */

export interface MagicBoxItem {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: Record<CardLocale, string>;
  title: Record<CardLocale, string>;
  detail?: Record<CardLocale, string>;
  category?: string;
}

const UI = {
  en: { close: "Close", prev: "Previous image", next: "Next image", of: "of", counter: (a: number, n: number) => `Image ${a} of ${n}` },
  es: { close: "Cerrar", prev: "Imagen anterior", next: "Imagen siguiente", of: "de", counter: (a: number, n: number) => `Imagen ${a} de ${n}` },
};

export default function MagicBox(props: {
  items: MagicBoxItem[];
  activeIndex: number | null;
  lang: CardLocale;
  onClose: () => void;
  onChange: (index: number) => void;
  /** Elemento que abrió el visor: el foco vuelve aquí al cerrar. */
  returnFocus?: HTMLElement | null;
}) {
  const open = () => props.activeIndex !== null;
  const t = () => UI[props.lang];
  const active = createMemo(() => (props.activeIndex === null ? null : props.items[props.activeIndex] ?? null));
  const count = () => props.items.length;

  let dialogRef: HTMLDivElement | undefined;
  let closeRef: HTMLButtonElement | undefined;
  let scrollY = 0;
  let touchX: number | null = null;
  let touchY: number | null = null;

  const go = (delta: number) => {
    if (props.activeIndex === null) return;
    const n = count();
    const next = (props.activeIndex + delta + n) % n;
    props.onChange(next);
  };

  const onKey = (e: KeyboardEvent) => {
    if (!open()) return;
    if (e.key === "Escape") { e.preventDefault(); props.onClose(); return; }
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); return; }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); return; }
    if (e.key === "Tab") {
      // Trampa de foco: mantener el tabbing dentro del diálogo.
      const focusables = dialogRef?.querySelectorAll<HTMLElement>(
        'button, [href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || !focusables.length) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      const el = document.activeElement as HTMLElement;
      if (e.shiftKey && el === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && el === last) { e.preventDefault(); first.focus(); }
    }
  };

  // Bloqueo de scroll con restauración de posición + foco al abrir/cerrar.
  createEffect(() => {
    if (isServer) return;
    if (open()) {
      scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.addEventListener("keydown", onKey);
      queueMicrotask(() => closeRef?.focus());
    } else {
      document.removeEventListener("keydown", onKey);
      if (document.body.style.position === "fixed") {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        window.scrollTo(0, scrollY);
      }
      props.returnFocus?.focus();
    }
  });
  onCleanup(() => {
    if (isServer) return;
    document.removeEventListener("keydown", onKey);
    document.body.style.position = "";
    document.body.style.top = "";
  });

  const onTouchStart = (e: TouchEvent) => { touchX = e.touches[0].clientX; touchY = e.touches[0].clientY; };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX === null || touchY === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    const dy = e.changedTouches[0].clientY - touchY;
    // Solo cuenta como swipe horizontal si domina el eje X (no cerrar por error).
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
    touchX = touchY = null;
  };

  return (
    <Show when={open()}>
      <div class="mbx" role="dialog" aria-modal="true"
        aria-label={active() ? active()!.title[props.lang] : "Gallery"}
        ref={dialogRef}
        onClick={(e) => { if (e.target === e.currentTarget) props.onClose(); }}>
        <style>{`
          .mbx{position:fixed;inset:0;z-index:80;display:flex;flex-direction:column;
            background:rgba(10,10,9,.94);color:#F4F0E8;
            padding:max(14px,env(safe-area-inset-top)) max(14px,env(safe-area-inset-right)) max(14px,env(safe-area-inset-bottom)) max(14px,env(safe-area-inset-left))}
          .mbx-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex:none}
          .mbx-counter{font-size:13px;font-weight:700;letter-spacing:.06em;color:#cfc7ba;font-variant-numeric:tabular-nums}
          .mbx-close{width:44px;height:44px;display:grid;place-items:center;background:transparent;
            border:2px solid rgba(244,240,232,.4);color:#F4F0E8;cursor:pointer;border-radius:2px}
          .mbx-close:hover{border-color:#c12026}
          .mbx-stage{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;gap:12px;position:relative}
          .mbx .mbx-img{max-width:88vw;max-height:82vh;width:auto;height:auto;object-fit:contain;display:block}
          .mbx-nav{width:52px;height:52px;flex:none;display:grid;place-items:center;background:rgba(21,21,19,.6);
            border:2px solid rgba(244,240,232,.4);color:#F4F0E8;cursor:pointer;border-radius:50%;font-size:22px;line-height:1}
          .mbx-nav:hover{border-color:#c12026}
          .mbx-nav.edge{position:absolute;top:50%;transform:translateY(-50%)}
          .mbx-nav.prev{left:2px}.mbx-nav.next{right:2px}
          .mbx *:focus-visible{outline:3px solid #c12026;outline-offset:2px}
          .mbx-info{flex:none;text-align:center;padding:12px 8px 4px}
          .mbx-info .cat{font-size:10px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#c12026;margin:0}
          .mbx-info h3{margin:4px 0 0;font-size:17px;font-weight:800;letter-spacing:-.01em}
          .mbx-info p{margin:3px 0 0;font-size:13px;color:#cfc7ba}
          .mbx-thumbs{flex:none;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;padding:12px 0 2px}
          .mbx-thumb{width:56px;height:56px;padding:0;border:2px solid transparent;background:none;cursor:pointer;border-radius:2px;overflow:hidden}
          .mbx-thumb img{width:100%;height:100%;object-fit:cover;display:block}
          .mbx-thumb[aria-current="true"]{border-color:#c12026}
          @media (max-width:560px){
            .mbx .mbx-img{max-width:96vw;max-height:74vh}
            .mbx-nav.edge{display:none}
            .mbx-thumbs{display:none}
          }
          @media (min-width:561px){ .mbx-nav.inline{display:none} }
          @media (prefers-reduced-motion:reduce){ .mbx *{transition:none!important} }
        `}</style>

        <div class="mbx-bar">
          <span class="mbx-counter" aria-hidden="true">
            {props.activeIndex! + 1} / {count()}
          </span>
          <button ref={closeRef} type="button" class="mbx-close" aria-label={t().close} onClick={props.onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <div class="mbx-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <Show when={count() > 1}>
            <button type="button" class="mbx-nav edge prev" aria-label={t().prev} onClick={() => go(-1)}>‹</button>
          </Show>
          <Show when={active()}>
            {(it) => (
              <img class="mbx-img" src={it().src} alt={it().alt[props.lang]}
                width={it().width} height={it().height} decoding="async" />
            )}
          </Show>
          <Show when={count() > 1}>
            <button type="button" class="mbx-nav edge next" aria-label={t().next} onClick={() => go(1)}>›</button>
          </Show>
        </div>

        {/* Precarga silenciosa de la anterior y la siguiente (solo dos). */}
        <Show when={count() > 1}>
          <div aria-hidden="true" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", opacity: 0 }}>
            <img src={props.items[(props.activeIndex! + 1) % count()].src} alt="" width="1" height="1" />
            <img src={props.items[(props.activeIndex! - 1 + count()) % count()].src} alt="" width="1" height="1" />
          </div>
        </Show>

        <Show when={active()}>
          {(it) => (
            <div class="mbx-info">
              <Show when={it().category}><p class="cat">{it().category}</p></Show>
              <h3>{it().title[props.lang]}</h3>
              <Show when={it().detail}><p>{it().detail![props.lang]}</p></Show>
            </div>
          )}
        </Show>

        {/* Navegación móvil accesible bajo la info (sin depender de swipe). */}
        <Show when={count() > 1}>
          <div class="mbx-bar mbx-nav-inline" style={{ "justify-content": "center", gap: "18px", "margin-top": "4px" }}>
            <button type="button" class="mbx-nav inline" aria-label={t().prev} onClick={() => go(-1)}>‹</button>
            <button type="button" class="mbx-nav inline" aria-label={t().next} onClick={() => go(1)}>›</button>
          </div>
        </Show>

        {/* Miniaturas solo con más de tres imágenes. */}
        <Show when={count() > 3}>
          <div class="mbx-thumbs" role="tablist" aria-label="Thumbnails">
            <For each={props.items}>
              {(it, i) => (
                <button type="button" class="mbx-thumb" aria-current={i() === props.activeIndex}
                  aria-label={it.title[props.lang]} onClick={() => props.onChange(i())}>
                  <img src={it.src} alt="" width="56" height="56" loading="lazy" />
                </button>
              )}
            </For>
          </div>
        </Show>

        {/* Anuncio para lectores de pantalla del índice activo. */}
        <p style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}
          aria-live="polite">
          {t().counter(props.activeIndex! + 1, count())}
        </p>
      </div>
    </Show>
  );
}
