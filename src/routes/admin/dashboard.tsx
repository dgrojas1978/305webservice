import { For, Show } from "solid-js";
import { clientOnly } from "@solidjs/start";
import { A, action, cache, createAsync, redirect, useSearchParams, useSubmission } from "@solidjs/router";
import { adminEnabled, clearCookie, isAuthed, issueCookie, passwordMatches } from "~/lib/adminAuth";
import {
  MIN_RATE_BASE, RANGES, loadDashboard, normalizeRange,
  type DashboardData, type Metric, type RangeKey,
} from "~/lib/dashboard";

/**
 * Panel de tarjetas NFC: qué pasa después del toque.
 *
 * Va detrás de la misma contraseña que el panel de enlaces y con `noindex`.
 *
 * Regla que manda sobre todo lo demás: este panel no adorna. Si no hay datos,
 * el bloque lo dice; si la muestra es pequeña, calla el porcentaje y enseña el
 * número. Un panel que inventa una tasa con tres eventos hace tomar decisiones
 * peores que no tener panel.
 */

/**
 * Leaflet solo en el navegador: toca `window` al arrancar y el render del
 * servidor reventaría. `clientOnly` además lo saca del paquete inicial, así que
 * el panel no paga el mapa hasta que hay algo que dibujar.
 */
const TapMap = clientOnly(() => import("~/components/admin/TapMap"));

function fail(reason: string): string {
  return `/admin/dashboard?e=${encodeURIComponent(reason)}`;
}

async function requireAuth() {
  "use server";
  const { getRequestEvent } = await import("solid-js/web");
  const ev = getRequestEvent();
  return isAuthed(ev?.request.headers.get("cookie") ?? null);
}

type State = { enabled: boolean; authed: boolean; data: DashboardData | null };

// `cache()`, no `query()`: el router es 0.14 y `query` llegó en 0.15.
const loadState = cache(async (range: RangeKey, business: string): Promise<State> => {
  "use server";
  if (!adminEnabled()) return { enabled: false, authed: false, data: null };
  if (!(await requireAuth())) return { enabled: true, authed: false, data: null };
  const { getRequestEvent } = await import("solid-js/web");
  const host = new URL(getRequestEvent()!.request.url).host;
  return { enabled: true, authed: true, data: await loadDashboard(range, business || null, host) };
}, "adminDashboardState");

const login = action(async (form: FormData) => {
  "use server";
  const password = String(form.get("password") ?? "");
  await new Promise((r) => setTimeout(r, 400));
  if (!passwordMatches(password)) throw redirect(fail("Contraseña incorrecta."));
  // La cookie viaja EN la redirección: redirect() construye una Response nueva.
  throw redirect("/admin/dashboard", { headers: { "Set-Cookie": issueCookie() } });
}, "adminDashLogin");

const logout = action(async () => {
  "use server";
  throw redirect("/admin/dashboard", { headers: { "Set-Cookie": clearCookie() } });
}, "adminDashLogout");

/* ---------- ayudas de presentación ---------- */

/** Porcentaje solo cuando la base lo aguanta. Si no, `null` y se enseña el crudo. */
function rate(part: number, base: number): string | null {
  if (base < MIN_RATE_BASE || base === 0) return null;
  return `${Math.round((part / base) * 1000) / 10}%`;
}

function width(n: number, max: number): string {
  return max > 0 ? `${Math.max(2, Math.round((n / max) * 100))}%` : "0%";
}

function fmtDate(iso: string | null): string {
  return iso ? new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }) : "—";
}

/** Fecha y hora en la hora de Miami. En UTC, un toque de la tarde sale de noche. */
function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString("es-ES", {
    timeZone: "America/New_York",
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: false,
  });
}

function Empty(props: { children: string }) {
  return <p class="text-sm text-on-navy-faint">{props.children}</p>;
}

function Panel(props: { title: string; note?: string; children: any }) {
  return (
    <section class="rounded-xl border border-[rgba(247,249,252,0.14)] p-5">
      <h2 class="text-sm font-bold uppercase tracking-wide">{props.title}</h2>
      <Show when={props.note}>
        <p class="mt-1 text-[0.7rem] text-on-navy-faint">{props.note}</p>
      </Show>
      <div class="mt-4">{props.children}</div>
    </section>
  );
}

function BarList(props: { rows: Metric[]; empty: string }) {
  const max = () => Math.max(1, ...props.rows.map((r) => r.n));
  return (
    <Show when={props.rows.length} fallback={<Empty>{props.empty}</Empty>}>
      <ul class="space-y-2">
        <For each={props.rows}>
          {(r) => (
            <li>
              <div class="flex items-baseline justify-between gap-3 text-sm">
                <span class="truncate">{r.label || "—"}</span>
                <span class="shrink-0 tabular-nums text-on-navy">{r.n}</span>
              </div>
              <div class="mt-1 h-1.5 rounded-full bg-[rgba(247,249,252,0.1)]">
                <div class="h-full rounded-full bg-turquoise" style={{ width: width(r.n, max()) }} />
              </div>
            </li>
          )}
        </For>
      </ul>
    </Show>
  );
}

function Kpi(props: { label: string; value: number | string; note?: string }) {
  return (
    <div class="rounded-xl border border-[rgba(247,249,252,0.14)] p-4">
      <p class="text-[0.7rem] font-semibold uppercase tracking-wide text-on-navy-faint">{props.label}</p>
      <p class="mt-1.5 text-3xl font-extrabold tabular-nums">{props.value}</p>
      <Show when={props.note}>
        <p class="mt-1 text-[0.7rem] text-on-navy-faint">{props.note}</p>
      </Show>
    </div>
  );
}

const WEEKDAYS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

/* ---------- página ---------- */

export default function AdminDashboard() {
  const [params] = useSearchParams();
  const range = () => normalizeRange(params.d);
  const business = () => String(params.b ?? "");
  const state = createAsync(() => loadState(range(), business()));
  const loginSub = useSubmission(login);
  const d = () => state()?.data;

  /** Enlace que conserva el resto de filtros. */
  const href = (next: { d?: string; b?: string }) => {
    const q = new URLSearchParams();
    q.set("d", next.d ?? range());
    const b = next.b ?? business();
    if (b) q.set("b", b);
    return `/admin/dashboard?${q.toString()}`;
  };

  return (
    <main class="min-h-screen bg-navy px-5 py-14 text-paper">
      <title>Panel de tarjetas — 305 Web Service</title>
      <meta name="robots" content="noindex, nofollow" />

      <div class="mx-auto max-w-5xl">
        <div class="flex flex-wrap items-baseline justify-between gap-3">
          <h1 class="text-2xl font-extrabold tracking-tight">Tarjetas NFC</h1>
          <A href="/admin/links" class="text-xs text-on-navy underline">Enlaces →</A>
        </div>

        <Show when={params.e}>
          <p role="alert" class="mt-5 rounded-lg border border-[rgba(255,107,107,0.45)] bg-[rgba(255,107,107,0.08)] px-4 py-3 text-sm text-[#ffb3b3]">
            {String(params.e)}
          </p>
        </Show>

        <Show when={state()?.enabled === false}>
          <p class="mt-6 rounded-lg border border-[rgba(255,107,107,0.4)] p-4 text-sm text-on-navy">
            El panel está deshabilitado. Define <code>ADMIN_PASSWORD</code> (mínimo 12
            caracteres) en el entorno del despliegue para activarlo.
          </p>
        </Show>

        <Show when={state()?.enabled && !state()?.authed}>
          <form action={login} method="post" class="mt-8 max-w-sm">
            <label class="block text-sm font-semibold" for="pw">Contraseña</label>
            <input id="pw" name="password" type="password" required autocomplete="current-password"
              class="mt-2 w-full rounded-lg border border-[rgba(247,249,252,0.2)] bg-transparent px-3 py-2.5" />
            <button type="submit" disabled={loginSub.pending} class="btn btn-primary mt-4 w-full !py-3">
              {loginSub.pending ? "Comprobando…" : "Entrar"}
            </button>
          </form>
        </Show>

        <Show when={state()?.authed && d()}>
          {(() => {
            const data = () => d()!;
            const small = () => data().totals.taps < MIN_RATE_BASE;

            /** Une el detalle del rango con el contador histórico de cada enlace. */
            const slugRows = () => {
              const hist = new Map(data().linkCounters.map((l) => [l.slug, l.taps]));
              const rows = data().bySlug.map((s) => ({
                slug: s.label, detail: s.n, hist: hist.get(s.label) ?? null,
              }));
              const seen = new Set(rows.map((r) => r.slug));
              // Enlaces que el contador conoce y el detalle no: son justo los que
              // provocan la pregunta «¿por qué aquí dice 3 y allí 7?».
              for (const l of data().linkCounters) {
                if (!seen.has(l.slug) && l.taps > 0) rows.push({ slug: l.slug, detail: 0, hist: l.taps });
              }
              return rows.sort((a, b) => (b.hist ?? b.detail) - (a.hist ?? a.detail));
            };

            return (
              <>
                <form action={logout} method="post" class="mt-2">
                  <button type="submit" class="text-xs text-on-navy underline">Cerrar sesión</button>
                </form>

                {/* Filtros — enlaces normales: funcionan sin JavaScript */}
                <div class="mt-6 flex flex-wrap items-center gap-2">
                  <For each={RANGES}>
                    {(r) => (
                      <A href={href({ d: r.key })}
                        class={`rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
                          range() === r.key
                            ? "border-turquoise bg-[rgba(32,215,197,0.12)] text-turquoise"
                            : "border-[rgba(247,249,252,0.2)] text-on-navy"
                        }`}>
                        {r.label}
                      </A>
                    )}
                  </For>
                  <Show when={data().businesses.length > 1}>
                    <span class="ml-2 text-xs text-on-navy-faint">Negocio:</span>
                    <A href={href({ b: "" })}
                      class={`rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
                        !business() ? "border-turquoise text-turquoise" : "border-[rgba(247,249,252,0.2)] text-on-navy"
                      }`}>
                      Todos
                    </A>
                    <For each={data().businesses}>
                      {(b) => (
                        <A href={href({ b })}
                          class={`rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
                            business() === b ? "border-turquoise text-turquoise" : "border-[rgba(247,249,252,0.2)] text-on-navy"
                          }`}>
                          {b}
                        </A>
                      )}
                    </For>
                  </Show>
                </div>

                <p class="mt-3 text-[0.7rem] text-on-navy-faint">
                  {data().from
                    ? `Desde el ${fmtDate(data().from)}.`
                    : "Todo el histórico."}{" "}
                  Registro detallado desde el {fmtDate(data().loggingSince)}.
                </p>

                {/* Aviso de muestra pequeña. Va arriba del todo, no al pie. */}
                <Show when={small()}>
                  <p role="status" class="mt-5 rounded-lg border border-[rgba(255,193,7,0.45)] bg-[rgba(255,193,7,0.08)] px-4 py-3 text-sm text-[#ffd98a]">
                    <strong>Muestra insuficiente.</strong> Hay {data().totals.taps}{" "}
                    {data().totals.taps === 1 ? "toque" : "toques"} en este rango. Por debajo de{" "}
                    {MIN_RATE_BASE} no se publica ningún porcentaje: con tan pocos datos, una tasa
                    cambia de golpe con un solo toque más. Los números absolutos sí son reales.
                  </p>
                </Show>

                <Show when={data().truncated}>
                  <p role="status" class="mt-3 rounded-lg border border-[rgba(255,193,7,0.45)] px-4 py-3 text-xs text-[#ffd98a]">
                    El embudo se calculó sobre una muestra de visitantes, no sobre todos: el
                    volumen supera el límite que se cruza en memoria.
                  </p>
                </Show>

                {/* 1 · Cuatro números */}
                <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Kpi label="Toques" value={data().totals.taps} note="NFC y QR registrados" />
                  <Kpi label="Visitantes únicos" value={data().totals.visitors} note="navegadores distintos" />
                  <Kpi label="Acciones de contacto" value={data().totals.contacts} note="llamar, WhatsApp, email" />
                  <Kpi
                    label="Toque → contacto"
                    value={rate(data().funnel.contact, data().funnel.visitors) ?? "—"}
                    note={rate(data().funnel.contact, data().funnel.visitors)
                      ? "sobre visitantes que tocaron"
                      : `sin base suficiente (${data().funnel.visitors} visitantes)`}
                  />
                </div>

                {/* Reconciliación de los dos contadores. Se enseña SIEMPRE que no
                    cuadren: esconderla en la vista de todo el histórico dejaba el
                    panel pareciendo roto al lado del de enlaces. */}
                <Show when={data().linkCountersTotal !== data().totals.taps}>
                  <p class="mt-4 rounded-lg border border-[rgba(247,249,252,0.14)] px-4 py-3 text-xs leading-relaxed text-on-navy">
                    El panel de enlaces suma <strong>{data().linkCountersTotal}</strong> toques y aquí
                    aparecen <strong>{data().totals.taps}</strong>. Aquel es un contador{" "}
                    <strong>de siempre</strong>, que solo sabe sumar uno; este es el registro{" "}
                    <strong>detallado</strong>{data().from ? " y del rango elegido" : ""}, que
                    arrancó el {fmtDate(data().loggingSince)}. Pero parte de la diferencia SÍ fue un
                    fallo: hasta el 31 de julio el toque se guardaba sin esperar a que la escritura
                    terminara, y en Vercel la función se apaga al devolver la redirección, así que
                    muchos toques nunca llegaron a escribirse. Ya se espera. Los toques perdidos
                    antes de ese arreglo no se pueden recuperar. La tabla «Toques por enlace» enseña
                    las dos cifras enlace a enlace.
                  </p>
                </Show>

                <div class="mt-6 grid gap-4 lg:grid-cols-2">
                  {/* 2 · Embudo */}
                  <Panel title="Embudo"
                    note="Se cruza por identificador anónimo de navegador: une el toque con lo que esa persona hizo después.">
                    <Show when={data().funnel.taps} fallback={<Empty>Sin toques en este rango.</Empty>}>
                      <ul class="space-y-3">
                        <For each={[
                          { k: "Toques", v: data().funnel.taps },
                          { k: "Visitantes", v: data().funnel.visitors },
                          { k: "Vieron la tarjeta", v: data().funnel.cardView },
                          { k: "Abrieron un proyecto", v: data().funnel.projectVisit },
                          { k: "Contactaron", v: data().funnel.contact },
                        ]}>
                          {(row) => (
                            <li class="flex items-baseline justify-between gap-3 text-sm">
                              <span>{row.k}</span>
                              <span class="tabular-nums">
                                {row.v}
                                <Show when={rate(row.v, data().funnel.visitors)}>
                                  <span class="ml-2 text-on-navy-faint">
                                    {rate(row.v, data().funnel.visitors)}
                                  </span>
                                </Show>
                              </span>
                            </li>
                          )}
                        </For>
                      </ul>
                      <Show when={data().funnel.measurable < data().funnel.taps}>
                        <p class="mt-4 border-t border-[rgba(247,249,252,0.14)] pt-3 text-[0.7rem] text-on-navy-faint">
                          Solo {data().funnel.measurable} de {data().funnel.taps} toques llevan a una
                          tarjeta alojada aquí. El resto redirige a un sitio de cliente, donde no
                          medimos nada: para esos toques el embudo se corta en el primer paso, y eso
                          es un límite real, no un cero.
                        </p>
                      </Show>
                    </Show>
                  </Panel>

                  {/* 4 · Atribución */}
                  <Panel title="Por tarjeta, vendedor y contexto"
                    note="Congelado en el momento del toque: cambiar hoy el dueño de un enlace no reescribe lo que ya pasó.">
                    <Show
                      when={data().attribution.some((a) => a.business || a.owner || a.cardId || a.context)}
                      fallback={
                        <Empty>
                          Ningún toque trae atribución. Los enlaces existentes se crearon sin negocio,
                          dueño ni contexto — rellena esos campos en el panel de enlaces y los toques
                          nuevos empezarán a repartirse aquí.
                        </Empty>
                      }>
                      <div class="overflow-x-auto">
                        <table class="w-full min-w-[28rem] text-sm">
                          <thead class="text-[0.7rem] uppercase tracking-wide text-on-navy-faint">
                            <tr>
                              <th class="py-1 text-left">Negocio / dueño</th>
                              <th class="py-1 text-right">Toques</th>
                              <th class="py-1 text-right">Visitantes</th>
                              <th class="py-1 text-right">Contactos</th>
                            </tr>
                          </thead>
                          <tbody>
                            <For each={data().attribution}>
                              {(a) => (
                                <tr class="border-t border-[rgba(247,249,252,0.1)]">
                                  <td class="py-2">
                                    <span>{a.business || "sin negocio"}</span>
                                    <Show when={a.owner}>
                                      <span class="text-on-navy"> · {a.owner}</span>
                                    </Show>
                                    <Show when={a.cardId || a.context}>
                                      <span class="block text-[0.7rem] text-on-navy-faint">
                                        {[a.cardId, a.context].filter(Boolean).join(" · ")}
                                      </span>
                                    </Show>
                                  </td>
                                  <td class="py-2 text-right tabular-nums">{a.taps}</td>
                                  <td class="py-2 text-right tabular-nums">{a.visitors}</td>
                                  <td class="py-2 text-right tabular-nums">{a.contacts}</td>
                                </tr>
                              )}
                            </For>
                          </tbody>
                        </table>
                      </div>
                    </Show>
                  </Panel>

                  {/* 5 · Cuándo */}
                  <Panel title="Cuándo se toca" note="Hora local de Miami. Sirve para decidir cuándo repartir.">
                    <Show when={data().totals.taps} fallback={<Empty>Sin toques en este rango.</Empty>}>
                      <p class="text-[0.7rem] uppercase tracking-wide text-on-navy-faint">Hora del día</p>
                      <div class="mt-2 flex h-20 items-end gap-[2px]">
                        <For each={data().hours}>
                          {(n) => (
                            <div class="flex-1 rounded-t bg-turquoise"
                              style={{ height: width(n, Math.max(1, ...data().hours)) }}
                              title={`${n} toques`} />
                          )}
                        </For>
                      </div>
                      <div class="mt-1 flex justify-between text-[0.65rem] text-on-navy-faint">
                        <span>0h</span><span>12h</span><span>23h</span>
                      </div>
                      <p class="mt-4 text-[0.7rem] uppercase tracking-wide text-on-navy-faint">Día de la semana</p>
                      <div class="mt-2">
                        <BarList
                          rows={data().weekdays.map((n, i) => ({ label: WEEKDAYS[i], n }))}
                          empty="Sin datos." />
                      </div>
                    </Show>
                  </Panel>

                  {/* 3 · Ubicación */}
                  <Panel title="Ubicación aproximada"
                    note="Derivada de la IP por el borde de red. Es aproximada por definición y NO ubica a una persona.">
                    <BarList
                      rows={data().places.map((p) => ({
                        label: [p.city, p.region, p.country].filter(Boolean).join(", "),
                        n: p.n,
                      }))}
                      empty="Sin ubicaciones registradas." />
                  </Panel>

                  {/* 6 · Nuevos vs recurrentes */}
                  <Panel title="Nuevos y recurrentes" note="Primera vez que ese navegador toca cualquier tarjeta nuestra.">
                    <BarList
                      rows={[
                        { label: "Primera vez", n: data().visitors.fresh },
                        { label: "Ya habían tocado", n: data().visitors.returning },
                      ]}
                      empty="Sin toques en este rango." />
                  </Panel>

                  {/* 7 · Dispositivo */}
                  <Panel title="Dispositivo">
                    <BarList rows={data().devices} empty="Sin toques en este rango." />
                  </Panel>

                  {/* 8 · Origen */}
                  <Panel title="Origen del toque"
                    note="utm_source distingue NFC de QR y de enlace compartido.">
                    <BarList
                      rows={data().sources.map((s) => ({
                        label: s.label || "sin atribución (toque directo)",
                        n: s.n,
                      }))}
                      empty="Sin toques en este rango." />
                  </Panel>

                  <Panel title="Toques por enlace"
                    note="Dos cifras distintas a propósito: el detalle solo existe desde que se registra, el contador viene de antes.">
                    <Show when={slugRows().length} fallback={<Empty>Todavía no hay enlaces con toques.</Empty>}>
                      <div class="overflow-x-auto">
                        <table class="w-full min-w-[22rem] text-sm">
                          <thead class="text-[0.7rem] uppercase tracking-wide text-on-navy-faint">
                            <tr>
                              <th class="py-1 text-left">Enlace</th>
                              <th class="py-1 text-right">
                                {data().from ? "En este rango" : "Con detalle"}
                              </th>
                              <th class="py-1 text-right">Contador de siempre</th>
                            </tr>
                          </thead>
                          <tbody>
                            <For each={slugRows()}>
                              {(r) => (
                                <tr class="border-t border-[rgba(247,249,252,0.1)]">
                                  <td class="py-2"><code>/c/{r.slug}</code></td>
                                  <td class="py-2 text-right tabular-nums">{r.detail}</td>
                                  <td class="py-2 text-right tabular-nums text-on-navy-faint">
                                    {r.hist === null ? "—" : r.hist}
                                  </td>
                                </tr>
                              )}
                            </For>
                          </tbody>
                        </table>
                      </div>
                      <p class="mt-3 text-[0.7rem] text-on-navy-faint">
                        «—» es un perfil fijo en código, que no pasa por el contador de enlaces.
                      </p>
                    </Show>
                  </Panel>

                  <Panel title="Eventos en la tarjeta" note={`${data().totals.events} eventos en el rango.`}>
                    <BarList rows={data().events} empty="Sin eventos en este rango." />
                  </Panel>
                </div>

                {/* Mapa. Un círculo es una CIUDAD, nunca una persona. */}
                <div class="mt-4">
                  <Panel title="Dónde se tocan las tarjetas"
                    note="Cada círculo es una ciudad y su tamaño dice cuántos toques. La posición viene de la IP: NO señala dónde estaba una persona.">
                    <Show
                      when={data().points.length}
                      fallback={
                        <Empty>
                          {data().totals.taps
                            ? "Ningún toque de este rango trae coordenadas. Se empezaron a guardar hoy, y los toques anteriores no se pueden rellenar hacia atrás: el mapa se irá llenando con los toques nuevos."
                            : "Sin toques en este rango."}
                        </Empty>
                      }>
                      <TapMap points={data().points} />
                      <p class="mt-2 text-[0.7rem] text-on-navy-faint">
                        El mapa dibuja {data().geoCoverage} de {data().totals.taps} toques del rango
                        — solo los que traen coordenadas. Los mosaicos los sirve OpenStreetMap, así
                        que este panel (y solo este) pide imágenes a un servidor externo.
                      </p>
                    </Show>
                  </Panel>
                </div>

                {/* Toque a toque: fecha, hora y de dónde. */}
                <div class="mt-4">
                  <Panel title="Últimos toques"
                    note="Hora de Miami. Los 40 más recientes del rango. La ubicación es aproximada y la IP no se muestra.">
                    <Show when={data().recent.length} fallback={<Empty>Sin toques en este rango.</Empty>}>
                      <div class="overflow-x-auto">
                        <table class="w-full min-w-[40rem] text-sm">
                          <thead class="text-[0.7rem] uppercase tracking-wide text-on-navy-faint">
                            <tr>
                              <th class="py-1 text-left">Fecha y hora</th>
                              <th class="py-1 text-left">Enlace</th>
                              <th class="py-1 text-left">Dónde (aprox.)</th>
                              <th class="py-1 text-left">Dispositivo</th>
                              <th class="py-1 text-left">Origen</th>
                            </tr>
                          </thead>
                          <tbody>
                            <For each={data().recent}>
                              {(t) => (
                                <tr class="border-t border-[rgba(247,249,252,0.1)]">
                                  <td class="py-2 tabular-nums">{fmtDateTime(t.at)}</td>
                                  <td class="py-2">
                                    <code>/c/{t.slug}</code>
                                    <Show when={t.business || t.owner}>
                                      <span class="block text-[0.7rem] text-on-navy-faint">
                                        {[t.business, t.owner].filter(Boolean).join(" · ")}
                                      </span>
                                    </Show>
                                  </td>
                                  <td class="py-2 text-on-navy">
                                    {[t.city, t.region, t.country].filter(Boolean).join(", ") || "sin ubicación"}
                                  </td>
                                  <td class="py-2 text-on-navy">{t.device}</td>
                                  <td class="py-2 text-on-navy">
                                    {t.source || (t.kind === "profile" ? "nfc" : "directo")}
                                    <Show when={t.firstVisit}>
                                      <span class="ml-1.5 text-[0.7rem] text-turquoise">nuevo</span>
                                    </Show>
                                  </td>
                                </tr>
                              )}
                            </For>
                          </tbody>
                        </table>
                      </div>
                    </Show>
                  </Panel>
                </div>

                <p class="mt-8 text-[0.7rem] leading-relaxed text-on-navy-faint">
                  Este panel solo muestra lo que se ha registrado. No hay proyecciones, ni
                  estimaciones de ingresos, ni datos de ejemplo. La dirección IP se guarda pero no
                  se muestra aquí: verla no ayuda a decidir nada y sí expone un dato personal.
                </p>
              </>
            );
          })()}
        </Show>
      </div>
    </main>
  );
}
