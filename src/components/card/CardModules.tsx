import { For, Show, createResource, createSignal, onCleanup, onMount } from "solid-js";
import { trackEvent } from "~/lib/analytics";
import { CARD_COPY, type CardLocale, type CardProfile } from "~/data/card";
import { locationRenderable, reviewsRenderable, type BusinessLocation } from "~/lib/cardModules";

/* ============================================================
   GOOGLE REVIEWS
   Muestra rating/reseñas REALES de Google vía Places API (server-side).
   Nunca publica reseñas ni simula el envío: "Leave a Google Review" abre la
   interfaz oficial de Google. Sin review gating: todos ven el mismo CTA.
   ============================================================ */

interface ReviewsPayload {
  status: "ok" | "no-reviews" | "not-configured" | "unavailable" | "quota";
  rating?: number | null;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviewsUri?: string;
  businessStatus?: string;
  reviews?: {
    id: string; rating: number; text: string; textLanguage: string;
    originalLanguage: string; relativeTime: string; authorName: string;
    authorUri: string; authorPhoto: string; googleMapsUri: string;
  }[];
}

function Stars(props: { rating: number; label: string }) {
  return (
    <span class="inline-flex items-center gap-0.5" role="img" aria-label={props.label}>
      <For each={[1, 2, 3, 4, 5]}>
        {(i) => (
          <svg viewBox="0 0 20 20" class={`h-3.5 w-3.5 ${i <= Math.round(props.rating) ? "text-[#fbbc04]" : "text-[rgba(247,249,252,0.22)]"}`}
            fill="currentColor" aria-hidden="true">
            <path d="M10 15.27 16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
          </svg>
        )}
      </For>
    </span>
  );
}

export function GoogleReviews(props: { profile: CardProfile; lang: CardLocale }) {
  const cfg = () => props.profile.reviews;
  const t = () => CARD_COPY[props.lang].reviews;
  let ref: HTMLElement | undefined;

  const [data] = createResource(
    () => (reviewsRenderable(cfg()) ? cfg()!.placeId! : null),
    async (placeId: string): Promise<ReviewsPayload> => {
      const res = await fetch(`/api/card-reviews/${encodeURIComponent(placeId)}`);
      return res.json();
    },
  );

  onMount(() => {
    if (!ref || !("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver((e) => {
      if (e.some((x) => x.isIntersecting)) { trackEvent("reviews_view", { card: props.profile.id }); obs.disconnect(); }
    }, { threshold: 0.4 });
    obs.observe(ref);
    onCleanup(() => obs.disconnect());
  });

  // Sin Place ID / URL oficial → el visitante no ve nada (nunca datos simulados).
  return (
    <Show when={reviewsRenderable(cfg())}>
      <section ref={ref} aria-labelledby="reviews-h" class="mt-10">
        <h2 id="reviews-h" class="font-editorial text-[1.4rem] font-semibold tracking-tight text-paper">
          {t().heading}
        </h2>

        <Show when={data.loading}>
          <div class="mt-4 animate-pulse rounded-2xl border border-[rgba(247,249,252,0.1)] p-5" aria-hidden="true">
            <div class="h-4 w-40 rounded bg-[rgba(247,249,252,0.12)]" />
            <div class="mt-3 h-3 w-56 rounded bg-[rgba(247,249,252,0.08)]" />
          </div>
        </Show>

        <Show when={!data.loading && data()}>
          {(d) => (
            <>
              {/* Resumen: rating real + conteo real + atribución a Google */}
              <Show when={d().status === "ok" && d().rating}>
                <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-[rgba(247,249,252,0.1)] px-5 py-4">
                  <span class="font-editorial text-2xl font-semibold text-paper">{d().rating!.toFixed(1)}</span>
                  <Stars rating={d().rating!} label={t().stars.replace("{rating}", String(d().rating))} />
                  <span class="text-[0.8rem] text-on-navy">
                    {t().basedOn.replace("{count}", String(d().userRatingCount ?? 0))}
                  </span>
                  <a href={d().reviewsUri || d().googleMapsUri} target="_blank" rel="noopener noreferrer"
                    data-track="review_source_open" data-card={props.profile.id}
                    class="link-underline ml-auto text-[0.78rem] font-bold text-turquoise">
                    {t().read} →
                  </a>
                </div>
              </Show>

              {/* Hasta 3 reseñas, con autor, enlace original y atribución */}
              <Show when={cfg()!.displayReviews && (d().reviews?.length ?? 0) > 0}>
                <ul class="scrollbar-none -mx-5 mt-3.5 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-5 pb-1 lg:mx-0 lg:px-0" role="list">
                  <For each={(d().reviews ?? []).slice(0, cfg()!.maxDisplayedReviews)}>
                    {(r) => (
                      <li class="w-[260px] flex-shrink-0 snap-start rounded-2xl border border-[rgba(247,249,252,0.1)] p-4">
                        <div class="flex items-center gap-2.5">
                          <Show when={r.authorPhoto}>
                            <img src={r.authorPhoto} alt="" width="32" height="32" loading="lazy"
                              class="h-8 w-8 rounded-full object-cover" referrerpolicy="no-referrer" />
                          </Show>
                          <div class="min-w-0">
                            <a href={r.authorUri} target="_blank" rel="noopener noreferrer"
                              class="block truncate text-[0.8rem] font-bold text-paper hover:underline">
                              {r.authorName}
                            </a>
                            <span class="text-[0.68rem] text-on-navy-faint">{r.relativeTime}</span>
                          </div>
                        </div>
                        <div class="mt-2.5"><Stars rating={r.rating} label={t().stars.replace("{rating}", String(r.rating))} /></div>
                        {/* Texto sin modificar; se declara si Google lo tradujo */}
                        <p class="mt-2 line-clamp-5 text-[0.8rem] leading-relaxed text-on-navy">{r.text}</p>
                        <Show when={r.originalLanguage && r.textLanguage && r.originalLanguage !== r.textLanguage}>
                          <p class="mt-1 text-[0.66rem] italic text-on-navy-faint">{t().translated}</p>
                        </Show>
                        <a href={r.googleMapsUri || d().googleMapsUri} target="_blank" rel="noopener noreferrer"
                          data-track="review_source_open" data-review="1"
                          class="mt-2.5 inline-block text-[0.7rem] font-bold text-turquoise hover:underline">
                          {t().viewOnGoogle} →
                        </a>
                      </li>
                    )}
                  </For>
                </ul>
                <p class="mt-2 text-[0.68rem] italic text-on-navy-faint">
                  {cfg()!.sortDisclosure === "Newest" ? t().sortNewest : t().sortRelevance}
                </p>
              </Show>

              {/* Atribución obligatoria a Google Maps */}
              <p class="mt-2 text-[0.68rem] font-semibold text-on-navy-faint">
                <a href={d().googleMapsUri || "https://maps.google.com"} target="_blank" rel="noopener noreferrer"
                  class="link-underline">{t().source}</a>
              </p>
            </>
          )}
        </Show>

        {/* CTA oficial: mismo para todos (sin gating) y siempre a Google */}
        <a href={cfg()!.requestReviewUrl} target="_blank" rel="noopener noreferrer"
          data-track="leave_google_review_click" data-card={props.profile.id}
          class="btn btn-outline mt-4 w-full !py-3 text-center">
          {t().leave}
        </a>
      </section>
    </Show>
  );
}

/* ============================================================
   WHERE WE WORK — física / zona de servicio / híbrida / multi-sucursal
   Nunca muestra un pin falso ni una dirección no publicada.
   ============================================================ */

function LocationBlock(props: { loc: BusinessLocation; lang: CardLocale; showAddress: boolean; cardId: string }) {
  const t = () => CARD_COPY[props.lang].location;
  const l = () => props.loc;
  return (
    <div class="rounded-2xl border border-[rgba(247,249,252,0.1)] p-5">
      <p class="text-[0.85rem] font-bold text-paper">{l().publicName || l().label}</p>
      <Show when={props.showAddress && l().address}>
        <p class="mt-1.5 text-[0.8rem] leading-relaxed text-on-navy">{l().address}</p>
      </Show>
      <Show when={l().appointmentRequired}>
        <p class="mt-2 inline-block rounded-full border border-[rgba(32,215,197,0.3)] px-2.5 py-0.5 text-[0.66rem] font-bold uppercase tracking-wide text-turquoise">
          {t().appointment}
        </p>
      </Show>
      <Show when={l().hours?.lines?.length}>
        <div class="mt-3">
          <p class="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-on-navy-faint">{t().hours}</p>
          <ul class="mt-1.5 space-y-0.5">
            <For each={l().hours!.lines}>{(h) => <li class="text-[0.76rem] text-on-navy">{h}</li>}</For>
          </ul>
        </div>
      </Show>
      <div class="mt-4 flex flex-wrap gap-2">
        <Show when={l().googleMapsUrl}>
          <a href={l().googleMapsUrl} target="_blank" rel="noopener noreferrer"
            data-track="directions_click" data-location={l().id}
            class="btn btn-outline !px-4 !py-2 text-sm">{t().directions}</a>
        </Show>
        <Show when={l().phone}>
          <a href={`tel:${l().phone}`} data-track="call_click" data-location={l().id}
            class="btn btn-outline !px-4 !py-2 text-sm">{t().call}</a>
        </Show>
      </div>
    </div>
  );
}

export function WhereWeWork(props: {
  profile: CardProfile;
  lang: CardLocale;
  /** Abre el bottom sheet para consultar cobertura (no inventamos un checker). */
  onCheckArea: () => void;
}) {
  const cfg = () => props.profile.location;
  const t = () => CARD_COPY[props.lang].location;
  const areas = () => cfg()?.serviceAreas ?? [];
  const locs = () => cfg()?.locations ?? [];
  const [selected, setSelected] = createSignal(0);
  const areaLabel = (a: { label: string; labelEs?: string }) =>
    props.lang === "es" ? (a.labelEs ?? a.label) : a.label;

  const askNearest = () => {
    // La geolocalización SOLO se pide tras un gesto explícito del usuario.
    trackEvent("nearest_location_request", { card: props.profile.id });
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        let best = 0, bestD = Infinity;
        locs().forEach((l, i) => {
          if (l.latitude == null || l.longitude == null) return;
          const d = (l.latitude - pos.coords.latitude) ** 2 + (l.longitude - pos.coords.longitude) ** 2;
          if (d < bestD) { bestD = d; best = i; }
        });
        setSelected(best);
      },
      () => { /* permiso denegado: no pasa nada */ },
      { timeout: 8000 },
    );
  };

  return (
    <Show when={locationRenderable(cfg())}>
      <section aria-labelledby="where-h" class="mt-10">
        <h2 id="where-h" class="font-editorial text-[1.4rem] font-semibold tracking-tight text-paper">
          {t().heading}
        </h2>

        {/* A · física  |  C · híbrida (bloque "Visit us") */}
        <Show when={cfg()!.mode === "physical" || cfg()!.mode === "hybrid"}>
          <p class="mt-4 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-turquoise">{t().visit}</p>
          <div class="mt-2.5">
            <LocationBlock loc={locs()[0]} lang={props.lang} showAddress={!!cfg()!.showExactAddress} cardId={props.profile.id} />
          </div>
        </Show>

        {/* B · zona de servicio  |  C · híbrida (bloque "We also serve") */}
        <Show when={cfg()!.mode === "service-area" || cfg()!.mode === "hybrid"}>
          <p class="mt-5 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-turquoise">
            {cfg()!.mode === "hybrid" ? t().alsoServe : t().serviceArea}
          </p>
          {/* "Based in X" solo si X no está ya listado como zona (sin repetir) */}
          <Show when={cfg()!.mode === "service-area" && cfg()!.headquartersLabel
            && !areas().some((a) => areaLabel(a) === cfg()!.headquartersLabel)}>
            <p class="mt-2 text-[0.8rem] text-on-navy">{t().basedIn} {cfg()!.headquartersLabel}</p>
          </Show>
          <ul class="mt-3 flex flex-wrap gap-2" role="list">
            <For each={areas()}>
              {(a) => (
                <li class="rounded-full border border-[rgba(247,249,252,0.16)] px-3.5 py-1.5 text-[0.78rem] font-medium text-on-navy">
                  {areaLabel(a)}
                </li>
              )}
            </For>
          </ul>
          <button type="button"
            onClick={() => { trackEvent("service_area_check", { card: props.profile.id }); props.onCheckArea(); }}
            class="btn btn-outline mt-4 w-full !py-3 text-center">
            {t().checkArea}
          </button>
        </Show>

        {/* D · varias sucursales: selector; reviews/dirección/horarios cambian juntos */}
        <Show when={cfg()!.mode === "multiple-locations"}>
          <div class="mt-4 flex flex-wrap gap-2" role="tablist" aria-label={t().selectLocation}>
            <For each={locs()}>
              {(l, i) => (
                <button type="button" role="tab" aria-selected={selected() === i()}
                  onClick={() => { setSelected(i()); trackEvent("location_select", { location: l.id }); }}
                  class={`t-card min-h-[44px] rounded-full border px-3.5 py-2 text-[0.78rem] font-bold ${
                    selected() === i()
                      ? "border-blue bg-[rgba(20,108,255,0.16)] text-paper"
                      : "border-[rgba(247,249,252,0.16)] text-on-navy hover:text-paper"
                  }`}>
                  {l.label}
                </button>
              )}
            </For>
          </div>
          <button type="button" onClick={askNearest}
            class="link-underline mt-3 text-[0.76rem] font-semibold text-turquoise">
            {t().nearest}
          </button>
          <div class="mt-3.5">
            <LocationBlock loc={locs()[selected()]} lang={props.lang} showAddress={!!cfg()!.showExactAddress} cardId={props.profile.id} />
          </div>
        </Show>
      </section>
    </Show>
  );
}
