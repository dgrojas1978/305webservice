import { For, Show, createSignal } from "solid-js";
import { action, createAsync, useSubmission, redirect } from "@solidjs/router";
import { adminEnabled, clearCookie, isAuthed, issueCookie, passwordMatches } from "~/lib/adminAuth";
import {
  createLink, listLinks, normalizeSlug, setActive, updateTarget, validateTarget,
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

async function requireAuth() {
  "use server";
  const { getRequestEvent } = await import("solid-js/web");
  const ev = getRequestEvent();
  return isAuthed(ev?.request.headers.get("cookie") ?? null);
}

const loadState = async () => {
  "use server";
  if (!adminEnabled()) return { enabled: false, authed: false, links: [] as ShortLink[] };
  if (!(await requireAuth())) return { enabled: true, authed: false, links: [] as ShortLink[] };
  return { enabled: true, authed: true, links: await listLinks() };
};

const login = action(async (form: FormData) => {
  "use server";
  const password = String(form.get("password") ?? "");
  // Retraso fijo: encarece el probar contraseñas por fuerza bruta.
  await new Promise((r) => setTimeout(r, 400));
  if (!passwordMatches(password)) return { error: "Contraseña incorrecta." };
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
  if (!(await requireAuth())) return { error: "Sesión expirada." };
  const { getRequestEvent } = await import("solid-js/web");
  const host = new URL(getRequestEvent()!.request.url).host;

  const check = validateTarget(String(form.get("target") ?? ""), host);
  if (!check.ok) return { error: check.reason };

  const res = await createLink({
    slug: String(form.get("slug") ?? ""),
    target: check.url,
    label: String(form.get("label") ?? ""),
  });
  if (!res.ok) return { error: res.reason };
  throw redirect("/admin/links");
}, "adminSaveLink");

const editTarget = action(async (form: FormData) => {
  "use server";
  if (!(await requireAuth())) return { error: "Sesión expirada." };
  const { getRequestEvent } = await import("solid-js/web");
  const host = new URL(getRequestEvent()!.request.url).host;
  const check = validateTarget(String(form.get("target") ?? ""), host);
  if (!check.ok) return { error: check.reason };
  await updateTarget(normalizeSlug(String(form.get("slug") ?? "")), check.url);
  throw redirect("/admin/links");
}, "adminEditTarget");

const toggle = action(async (form: FormData) => {
  "use server";
  if (!(await requireAuth())) return { error: "Sesión expirada." };
  await setActive(normalizeSlug(String(form.get("slug") ?? "")), form.get("active") === "1");
  throw redirect("/admin/links");
}, "adminToggle");

export default function AdminLinks() {
  const state = createAsync(() => loadState());
  const loginSub = useSubmission(login);
  const saveSub = useSubmission(saveLink);
  const [slug, setSlug] = createSignal("");

  return (
    <main class="min-h-screen bg-navy px-5 py-14 text-paper">
      <title>Enlaces NFC — 305 Web Service</title>
      <meta name="robots" content="noindex, nofollow" />

      <div class="mx-auto max-w-4xl">
        <h1 class="text-2xl font-extrabold tracking-tight">Enlaces virtuales NFC</h1>

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
            <Show when={loginSub.result?.error}>
              <p class="mt-2 text-sm text-[#ff8f8f]">{loginSub.result?.error}</p>
            </Show>
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
            </div>
            <button type="submit" disabled={saveSub.pending} class="btn btn-primary self-start sm:mt-6">
              {saveSub.pending ? "Guardando…" : "Crear"}
            </button>
            <Show when={saveSub.result?.error}>
              <p class="text-sm text-[#ff8f8f] sm:col-span-3">{saveSub.result?.error}</p>
            </Show>
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
                  <form action={editTarget} method="post" class="mt-3 flex flex-wrap gap-2">
                    <input type="hidden" name="slug" value={l.slug} />
                    <input name="target" type="url" required value={l.target}
                      class="min-w-0 flex-1 rounded-lg border border-[rgba(247,249,252,0.2)] bg-transparent px-3 py-2 text-sm" />
                    <button type="submit" class="btn btn-outline !px-4 !py-2 text-sm">Guardar destino</button>
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
