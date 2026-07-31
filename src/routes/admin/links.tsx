import { For, Show, createSignal } from "solid-js";
import { action, cache, createAsync, revalidate, useSearchParams, useSubmission, redirect } from "@solidjs/router";
import { adminEnabled, clearCookie, isAuthed, issueCookie, passwordMatches } from "~/lib/adminAuth";
import {
  createLink, listLinks, normalizeSlug, setActive, updateLink, validateTarget,
  type ShortLink,
} from "~/lib/shortlinks";

/**
 * Panel de enlaces virtuales NFC.
 *
 * Crea redirecciones bajo nuestro propio dominio, asi que va detras de
 * contraseña: un formulario abierto permitiria publicar phishing con la marca
 * de 305 y arriesgar que Google marque el dominio entero.
 *
 * `noindex` ademas para que el panel no aparezca en buscadores.
 */

/** Vuelve al panel con el mensaje en la URL, legible sin JavaScript. */
function fail(reason: string): string {
  return `/admin/links?e=${encodeURIComponent(reason)}`;
}

function done(message: string): string {
  return `/admin/links?ok=${encodeURIComponent(message)}`;
}

async function requireAuth() {
  "use server";
  const { getRequestEvent } = await import("solid-js/web");
  const ev = getRequestEvent();
  return isAuthed(ev?.request.headers.get("cookie") ?? null);
}

const loadState = cache(async () => {
  "use server";
  if (!adminEnabled()) return { enabled: false, authed: false, links: [] as ShortLink[] };
  if (!(await requireAuth())) return { enabled: true, authed: false, links: [] as ShortLink[] };
  return { enabled: true, authed: true, links: await listLinks() };
}, "adminLinksState");

const login = action(async (form: FormData) => {
  "use server";
  const password = String(form.get("password") ?? "");
  // Retraso fijo: encarece el probar contraseñas por fuerza bruta.
  await new Promise((r) => setTimeout(r, 400));
  if (!passwordMatches(password)) throw redirect(fail("Contraseña incorrecta."));
  // La cookie viaja EN la redirección: si se añadiera a event.response se
  // perderia, porque redirect() construye una Response nueva.
  throw redirect("/admin/links", { headers: { "Set-Cookie": issueCookie() } });
}, "adminLogin");

const logout = action(async () => {
  "use server";
  throw redirect("/admin/links", { headers: { "Set-Cookie": clearCookie() } });
}, "adminLogout");

const saveLink = action(async (form: FormData) => {
  "use server";
  if (!(await requireAuth())) throw redirect(fail("Sesión expirada."));
  const { getRequestEvent } = await import("solid-js/web");
  const host = new URL(getRequestEvent()!.request.url).host;

  const check = validateTarget(String(form.get("target") ?? ""), host);
  if (!check.ok) throw redirect(fail(check.reason));

  const res = await createLink({
    slug: String(form.get("slug") ?? ""),
    target: check.url,
    label: String(form.get("label") ?? ""),
    business: String(form.get("business") ?? ""),
    owner: String(form.get("owner") ?? ""),
    cardId: String(form.get("cardId") ?? ""),
    context: String(form.get("context") ?? ""),
  });
  if (!res.ok) throw redirect(fail(res.reason));
  revalidate(loadState.key);
  throw redirect(done(`Enlace /c/${normalizeSlug(String(form.get("slug") ?? ""))} creado.`));
}, "adminSaveLink");

/**
 * Guarda TODO lo editable de un enlace: destino y atribución, de una vez.
 *
 * El mensaje dice exactamente qué se guardó y qué no. Un «actualizado» genérico
 * cuando no cambió nada es lo que hizo creer que la atribución estaba guardada
 * cuando lo único que se habia tocado era el destino.
 */
const saveChanges = action(async (form: FormData) => {
  "use server";
  if (!(await requireAuth())) throw redirect(fail("Sesión expirada. Vuelve a entrar y repite el guardado."));
  const { getRequestEvent } = await import("solid-js/web");
  const host = new URL(getRequestEvent()!.request.url).host;
  const slug = normalizeSlug(String(form.get("slug") ?? ""));

  const check = validateTarget(String(form.get("target") ?? ""), host);
  if (!check.ok) throw redirect(fail(`/c/${slug}: ${check.reason}`));

  const res = await updateLink(slug, {
    target: check.url,
    business: String(form.get("business") ?? ""),
    owner: String(form.get("owner") ?? ""),
    cardId: String(form.get("cardId") ?? ""),
    context: String(form.get("context") ?? ""),
  });
  if (!res.ok) throw redirect(fail(`/c/${slug}: ${res.reason}`));

  revalidate(loadState.key);

  if (!res.target && !res.attribution.length) {
    throw redirect(done(`/c/${slug}: no había nada que cambiar, todo estaba ya guardado así.`));
  }
  const parts: string[] = [];
  if (res.target) parts.push("destino");
  if (res.attribution.length) parts.push(res.attribution.join(", "));
  throw redirect(done(
    `/c/${slug}: guardado ${parts.join(" y ")}.` +
    (res.attribution.length ? " La atribución cuenta desde el próximo toque." : ""),
  ));
}, "adminSaveChanges");

const toggle = action(async (form: FormData) => {
  "use server";
  if (!(await requireAuth())) throw redirect(fail("Sesión expirada."));
  const slug = normalizeSlug(String(form.get("slug") ?? ""));
  const active = form.get("active") === "1";
  await setActive(slug, active);
  revalidate(loadState.key);
  throw redirect(done(`/c/${slug} ${active ? "activado" : "desactivado"}.`));
}, "adminToggle");

export default function AdminLinks() {
  const state = createAsync(() => loadState());
  const loginSub = useSubmission(login);
  const saveSub = useSubmission(saveLink);
  const [params] = useSearchParams();
  const [slug, setSlug] = createSignal("");

  return (
    <main class="min-h-screen bg-navy px-5 py-14 text-paper">
      <title>Enlaces NFC — 305 Web Service</title>
      <meta name="robots" content="noindex, nofollow" />

      <div class="mx-auto max-w-4xl">
        <div class="flex flex-wrap items-baseline justify-between gap-3">
          <h1 class="text-2xl font-extrabold tracking-tight">Enlaces virtuales NFC</h1>
          <a href="/admin/dashboard" class="text-xs text-on-navy underline">Panel de tarjetas →</a>
        </div>

        <Show when={params.ok}>
          <p role="status" class="mt-5 rounded-lg border border-[rgba(63,216,198,0.45)] bg-[rgba(63,216,198,0.08)] px-4 py-3 text-sm text-turquoise">
            {String(params.ok)}
          </p>
        </Show>

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
            <button type="submit" disabled={loginSub.pending}
              class="btn btn-primary mt-4 w-full !py-3">
              {loginSub.pending ? "Comprobando…" : "Entrar"}
            </button>
          </form>
        </Show>

        <Show when={state()?.authed}>
          <form action={logout} method="post" class="mt-2">
            <button type="submit" class="text-xs text-on-navy underline">Cerrar sesión</button>
          </form>

          {/* Crear */}
          <form action={saveLink} method="post"
            class="mt-8 grid gap-3 rounded-xl border border-[rgba(247,249,252,0.14)] p-5 sm:grid-cols-[1fr_2fr_auto]">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wide" for="slug">
                Nombre corto
              </label>
              <input id="slug" name="slug" required value={slug()}
                onInput={(e) => setSlug(e.currentTarget.value)}
                class="mt-1.5 w-full rounded-lg border border-[rgba(247,249,252,0.2)] bg-transparent px-3 py-2" />
              <p class="mt-1 text-[0.7rem] text-on-navy-faint">
                /c/{normalizeSlug(slug()) || "…"}
              </p>
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wide" for="target">
                Destino (https)
              </label>
              <input id="target" name="target" type="url" required placeholder="https://…"
                class="mt-1.5 w-full rounded-lg border border-[rgba(247,249,252,0.2)] bg-transparent px-3 py-2" />
              <input name="label" placeholder="Etiqueta interna (opcional)"
                class="mt-2 w-full rounded-lg border border-[rgba(247,249,252,0.2)] bg-transparent px-3 py-2 text-sm" />
              {/* Atribucion OBLIGATORIA. Se congela en cada tap: un enlace sin
                  negocio ni dueño genera toques que no se pueden asignar a nadie
                  nunca, y eso no se arregla despues. */}
              <div class="mt-2 grid grid-cols-2 gap-2">
                <input name="business" required placeholder="Negocio *"
                  class="rounded-lg border border-[rgba(247,249,252,0.2)] bg-transparent px-3 py-2 text-sm" />
                <input name="owner" required placeholder="Dueño de la tarjeta *"
                  class="rounded-lg border border-[rgba(247,249,252,0.2)] bg-transparent px-3 py-2 text-sm" />
                <input name="cardId" placeholder="ID de tarjeta"
                  class="rounded-lg border border-[rgba(247,249,252,0.2)] bg-transparent px-3 py-2 text-sm" />
                <input name="context" placeholder="Contexto (feria, camioneta…)"
                  class="rounded-lg border border-[rgba(247,249,252,0.2)] bg-transparent px-3 py-2 text-sm" />
              </div>
              <p class="mt-1.5 text-[0.7rem] text-on-navy-faint">
                * Obligatorios. Cada toque guarda su copia, así que un enlace sin
                negocio ni dueño genera toques que no se pueden asignar a nadie
                nunca — no hay forma de arreglarlo más tarde.
              </p>
            </div>
            <button type="submit" disabled={saveSub.pending} class="btn btn-primary self-start sm:mt-6">
              {saveSub.pending ? "Guardando…" : "Crear"}
            </button>
          </form>

          {/* Listado */}
          <ul class="mt-8 space-y-3">
            <For each={state()?.links} fallback={
              <li class="text-sm text-on-navy">Todavía no hay enlaces.</li>
            }>
              {(l) => (
                <li class="rounded-xl border border-[rgba(247,249,252,0.14)] p-4">
                  <div class="flex flex-wrap items-baseline justify-between gap-2">
                    <code class="font-bold">/c/{l.slug}</code>
                    <span class="text-xs text-on-navy-faint">
                      {l.taps} toques · {l.active ? "activo" : "desactivado"}
                    </span>
                  </div>
                  <Show when={l.label}>
                    <p class="mt-1 text-sm text-on-navy">{l.label}</p>
                  </Show>
                  <Show when={l.business || l.owner || l.cardId || l.context}>
                    <p class="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-[0.7rem] text-on-navy-faint">
                      <Show when={l.business}><span>{l.business}</span></Show>
                      <Show when={l.owner}><span>· {l.owner}</span></Show>
                      <Show when={l.cardId}><span>· <code>{l.cardId}</code></span></Show>
                      <Show when={l.context}><span>· {l.context}</span></Show>
                    </p>
                  </Show>

                  {/* UN solo formulario y UN solo boton: destino y atribucion
                      se guardan juntos. Dos botones parecidos hacian pulsar el
                      que no era y creer que se habia guardado la atribucion. */}
                  <form action={saveChanges} method="post" class="mt-3">
                    <input type="hidden" name="slug" value={l.slug} />

                    <Show when={!(l.business && l.owner)}>
                      <p role="alert" class="mb-3 rounded-lg border border-[rgba(255,193,7,0.45)] bg-[rgba(255,193,7,0.08)] px-3 py-2 text-[0.7rem] text-[#ffd98a]">
                        Sin negocio ni dueño. Cada toque que entre así queda sin
                        asignar <strong>para siempre</strong>. Rellénalo ya.
                      </p>
                    </Show>

                    <label class="block text-[0.7rem] font-semibold uppercase tracking-wide text-on-navy-faint"
                      for={`t-${l.slug}`}>Destino</label>
                    <input id={`t-${l.slug}`} name="target" type="url" required value={l.target}
                      class="mt-1.5 w-full rounded-lg border border-[rgba(247,249,252,0.2)] bg-transparent px-3 py-2 text-sm" />

                    <label class="mt-3 block text-[0.7rem] font-semibold uppercase tracking-wide text-on-navy-faint">
                      Atribución
                    </label>
                    <div class="mt-1.5 grid grid-cols-2 gap-2">
                      <input name="business" required value={l.business ?? ""} placeholder="Negocio *"
                        class="rounded-lg border border-[rgba(247,249,252,0.2)] bg-transparent px-3 py-2 text-sm" />
                      <input name="owner" required value={l.owner ?? ""} placeholder="Dueño *"
                        class="rounded-lg border border-[rgba(247,249,252,0.2)] bg-transparent px-3 py-2 text-sm" />
                      <input name="cardId" value={l.cardId ?? ""} placeholder="ID de tarjeta"
                        class="rounded-lg border border-[rgba(247,249,252,0.2)] bg-transparent px-3 py-2 text-sm" />
                      <input name="context" value={l.context ?? ""} placeholder="Contexto"
                        class="rounded-lg border border-[rgba(247,249,252,0.2)] bg-transparent px-3 py-2 text-sm" />
                    </div>

                    <button type="submit" class="btn btn-primary mt-3 !px-5 !py-2 text-sm">
                      Guardar cambios
                    </button>
                    <p class="mt-1.5 text-[0.7rem] text-on-navy-faint">
                      Guarda destino y atribución a la vez. La atribución cuenta desde el
                      próximo toque: los ya registrados guardaron su copia y no se reescriben.
                    </p>
                  </form>
                  <form action={toggle} method="post" class="mt-2">
                    <input type="hidden" name="slug" value={l.slug} />
                    <input type="hidden" name="active" value={l.active ? "0" : "1"} />
                    <button type="submit" class="text-xs text-on-navy underline">
                      {l.active ? "Desactivar" : "Activar"}
                    </button>
                  </form>
                </li>
              )}
            </For>
          </ul>
        </Show>
      </div>
    </main>
  );
}
