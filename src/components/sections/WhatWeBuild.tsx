import { For, type JSX } from "solid-js";
import Container from "~/components/ui/Container";
import { ButtonLink } from "~/components/ui/Button";
import { C } from "~/data/content";
import { PATHS, type Locale } from "~/lib/i18n";

/**
 * «What we build» — tres paneles editoriales apilados que demuestran
 * capacidad, no proyectos de cliente. Las demostraciones son abstractas,
 * construidas en HTML/CSS/SVG ligero: ninguna captura falsa, ninguna
 * marca, ningún dato de negocio inventado. Son decorativas para
 * lectores de pantalla (aria-hidden): el texto del panel ya las explica.
 */

/* ---------------- demostración 01 · sitio web ---------------- */
function BrowserDemo(props: { locale: Locale }) {
  const d = () => C[props.locale].whatWeBuild.demos.browser;
  return (
    <div aria-hidden="true" class="border border-hairline bg-paper">
      {/* barra superior */}
      <div class="demo-el flex items-center gap-3 border-b border-hairline px-5 py-3">
        <span class="h-2.5 w-2.5 bg-blue" />
        <span class="h-px w-16 bg-hairline" />
        <span class="ml-auto flex gap-4">
          <For each={d().nav}>
            {(item) => <span class="text-[9px] font-semibold uppercase tracking-[0.2em] text-body">{item}</span>}
          </For>
        </span>
      </div>
      {/* titular monumental */}
      <div class="demo-el px-5 pb-6 pt-8 sm:px-8 sm:pt-10">
        <p class="text-[9px] font-semibold uppercase tracking-[0.24em] text-blue">Miami · Florida</p>
        <p class="mt-3 text-[clamp(2rem,4.4vw,3.4rem)] font-black uppercase leading-[0.95] tracking-tight text-navy">
          {d().head1}
          <br />
          {d().head2}
        </p>
        <span class="mt-5 inline-block bg-blue px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-white">
          {d().cta}
        </span>
      </div>
      {/* bloques de contenido */}
      <div class="demo-el grid grid-cols-3 gap-px border-t border-hairline bg-hairline">
        <For each={[0, 1, 2]}>
          {() => (
            <div class="space-y-2 bg-paper px-5 py-6">
              <span class="block h-1.5 w-8 bg-turquoise" />
              <span class="block h-px w-full bg-hairline" />
              <span class="block h-px w-4/5 bg-hairline" />
              <span class="block h-px w-3/5 bg-hairline" />
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

/* ---------------- demostración 02 · e-commerce ---------------- */
function ShopDemo(props: { locale: Locale }) {
  const d = () => C[props.locale].whatWeBuild.demos.shop;
  const line = "border-[rgba(247,249,252,0.16)]";
  return (
    <div aria-hidden="true" class={`border bg-navy ${line}`}>
      <div class={`demo-el flex items-center justify-between border-b px-5 py-3 ${line}`}>
        <span class="text-[9px] font-semibold uppercase tracking-[0.24em] text-turquoise">{d().title}</span>
        <span class="h-2.5 w-2.5 bg-blue" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr]">
        {/* cuadrícula parcial de productos */}
        <div class={`demo-el grid grid-cols-2 gap-px border-b sm:border-b-0 sm:border-r ${line}`}>
          <For each={["01", "02", "03", "04"]}>
            {(n) => (
              <div class="group bg-navy p-4 transition-colors duration-200 hover:bg-[rgba(20,108,255,0.12)]">
                <div class={`flex aspect-[4/3] items-end border p-2 transition-colors duration-200 group-hover:border-blue ${line}`}>
                  <span class="block h-1 w-1/2 bg-[rgba(247,249,252,0.28)] transition-colors duration-200 group-hover:bg-turquoise" />
                </div>
                <p class="mt-2.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-on-navy">
                  {d().product} {n}
                </p>
                <span class="mt-1.5 block h-px w-8 bg-[rgba(247,249,252,0.24)]" />
              </div>
            )}
          </For>
        </div>

        {/* panel de carrito */}
        <div class="demo-el flex flex-col justify-between p-5">
          <div class="space-y-4">
            <For each={["01", "02"]}>
              {(n) => (
                <div>
                  <p class="text-[9px] font-semibold uppercase tracking-[0.18em] text-on-navy">
                    {d().product} {n}
                  </p>
                  <div class="mt-2 flex items-center gap-3">
                    <span class="text-[9px] uppercase tracking-[0.16em] text-on-navy-faint">{d().qty}</span>
                    <span class={`flex items-center gap-2.5 border px-2 py-1 ${line}`}>
                      <span class="block h-px w-1.5 bg-on-navy" />
                      <span class="text-[10px] font-bold text-paper">1</span>
                      <span class="relative block h-px w-1.5 bg-on-navy before:absolute before:left-[3px] before:top-[-3px] before:block before:h-1.5 before:w-px before:bg-on-navy" />
                    </span>
                  </div>
                </div>
              )}
            </For>
          </div>

          <div class={`mt-6 border-t pt-4 ${line}`}>
            <div class="flex items-baseline justify-between">
              <span class="text-[9px] font-semibold uppercase tracking-[0.2em] text-on-navy-faint">{d().total}</span>
              <span class="h-1.5 w-12 bg-turquoise" />
            </div>
            <span class="mt-4 block bg-blue py-2 text-center text-[9px] font-semibold uppercase tracking-[0.2em] text-white">
              {d().checkout}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- demostración 03 · sistemas internos ---------------- */
function DashDemo(props: { locale: Locale }) {
  const d = () => C[props.locale].whatWeBuild.demos.dash;
  const line = "border-[rgba(247,249,252,0.16)]";
  // alturas ilustrativas, sin significado comercial
  const bars = [34, 52, 40, 66, 48, 72];
  return (
    <div aria-hidden="true" class={`border bg-navy ${line}`}>
      <div class="grid grid-cols-[auto_1fr]">
        {/* navegación lateral */}
        <div class={`demo-el space-y-4 border-r px-4 py-5 sm:px-5 ${line}`}>
          <span class="block h-2.5 w-2.5 bg-blue" />
          <For each={d().nav}>
            {(item, i) => (
              <p
                class={`text-[9px] font-semibold uppercase tracking-[0.16em] ${
                  i() === 0 ? "text-turquoise" : "text-on-navy-faint"
                }`}
              >
                {item}
              </p>
            )}
          </For>
        </div>

        <div class="p-5">
          {/* gráfico ilustrativo */}
          <div class="demo-el">
            <span class="text-[9px] font-semibold uppercase tracking-[0.2em] text-on-navy-faint">
              {d().table}
            </span>
            <svg class="mt-4 h-16 w-full" viewBox="0 0 120 40" preserveAspectRatio="none" role="presentation">
              <line x1="0" y1="39.5" x2="120" y2="39.5" stroke="rgba(247,249,252,0.16)" stroke-width="1" />
              {bars.map((h, i) => (
                <rect
                  x={i * 20 + 4}
                  y={40 - h / 2}
                  width="12"
                  height={h / 2}
                  fill={i === bars.length - 1 ? "#20d7c5" : "#146cff"}
                  opacity={i === bars.length - 1 ? "1" : "0.55"}
                />
              ))}
            </svg>
          </div>

          {/* tabla de actividad */}
          <div class={`demo-el mt-5 border-t ${line}`}>
            <For each={[{ n: "01", ok: true }, { n: "02", ok: false }, { n: "03", ok: true }]}>
              {(row) => (
                <div class={`flex items-center gap-3 border-b py-2.5 ${line}`}>
                  <span class={`h-1.5 w-1.5 ${row.ok ? "bg-turquoise" : "bg-blue"}`} />
                  <span class="text-[9px] font-semibold uppercase tracking-[0.16em] text-on-navy">
                    {d().item} {row.n}
                  </span>
                  <span class="ml-auto text-[9px] uppercase tracking-[0.16em] text-on-navy-faint">
                    {row.ok ? d().done : d().wip}
                  </span>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- panel ---------------- */
interface PanelProps {
  locale: Locale;
  index: number;
  surface: "navy" | "paper" | "blue";
  reversed?: boolean;
  demo: JSX.Element;
}

function Panel(props: PanelProps) {
  const p = () => C[props.locale].whatWeBuild.panels[props.index];

  const bg = () =>
    props.surface === "navy" ? "bg-navy" : props.surface === "blue" ? "bg-blue" : "bg-paper";
  const onNavy = () => props.surface === "navy";
  const onBlue = () => props.surface === "blue";

  // Sobre azul eléctrico el texto navy solo alcanza AA como «texto grande»,
  // por eso ahí todo va en cuerpo mayor y peso bold.
  const eyebrowCls = () =>
    onBlue()
      ? "text-base font-bold uppercase tracking-[0.2em] text-navy"
      : `micro-caps ${onNavy() ? "text-turquoise" : "text-blue"}`;
  const titleCls = () => (onNavy() ? "text-paper" : "text-navy");
  const textCls = () =>
    onBlue()
      ? "text-xl font-bold leading-relaxed text-navy"
      : onNavy()
        ? "text-body-lg text-on-navy"
        : "text-body-lg text-body";
  const capCls = () =>
    onBlue()
      ? "text-base font-bold uppercase tracking-[0.18em] text-navy"
      : `micro-caps ${onNavy() ? "text-on-navy-faint" : "text-body"}`;
  const capTick = () => (onBlue() ? "bg-navy" : "bg-turquoise");
  const ghostCls = () =>
    onNavy() ? "monument-ghost-navy" : onBlue() ? "monument-ghost-blue" : "monument-ghost";

  return (
    <div
      data-surface={onNavy() ? "navy" : undefined}
      class={`relative overflow-hidden ${bg()} py-16 md:flex md:min-h-[78vh] md:items-center md:py-[clamp(80px,9vw,144px)]`}
    >
      {/* fragmento monumental del 305 — textura al borde inferior,
          nunca a la altura del titular */}
      <span
        aria-hidden="true"
        class={`monument ${ghostCls()} pointer-events-none absolute -bottom-[0.34em] select-none text-[clamp(12rem,28vw,24rem)] ${
          props.reversed ? "-right-[0.1em]" : "-left-[0.1em]"
        }`}
      >
        305
      </span>

      <Container class="relative z-10">
        <div class="grid grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-10">
          {/* texto */}
          <div
            class={`order-1 md:col-span-5 ${
              props.reversed ? "md:order-2 md:col-start-8" : "md:order-1"
            }`}
          >
            <p class={`reveal ${eyebrowCls()}`}>
              {p().no} · {p().category}
            </p>
            {/* dos líneas exactas: el titular del panel no compite con el h2 de sección */}
            <h3
              class={`reveal-line mt-7 text-[clamp(2rem,3.2vw,2.9rem)] font-black uppercase leading-[1.05] tracking-tight ${titleCls()}`}
              data-delay="1"
            >
              <span class="ln"><span class="li">{p().titleLines[0]}</span></span>
              <span class="ln"><span class="li">{p().titleLines[1]}</span></span>
            </h3>
            <p class={`reveal mt-8 max-w-prose ${textCls()}`} data-delay="2">
              {p().text}
            </p>
            <ul class="reveal mt-9 flex flex-wrap items-center gap-x-7 gap-y-3" data-delay="3">
              <For each={p().caps}>
                {(cap) => (
                  <li class="flex items-center gap-2.5">
                    <span class={`h-[2px] w-3 ${capTick()}`} aria-hidden="true" />
                    <span class={capCls()}>{cap}</span>
                  </li>
                )}
              </For>
            </ul>
          </div>

          {/* demostración visual */}
          <div
            class={`reveal-mask order-2 md:col-span-6 ${
              props.reversed ? "md:order-1 md:col-start-1" : "md:order-2 md:col-start-7"
            }`}
          >
            {props.demo}
          </div>
        </div>
      </Container>
    </div>
  );
}

/* ---------------- sección ---------------- */
export default function WhatWeBuild(props: { locale: Locale }) {
  const t = () => C[props.locale].whatWeBuild;

  return (
    <section id="what-we-build" aria-labelledby="what-we-build-title">
      {/* encabezado */}
      <div class="bg-paper pb-16 pt-section md:pb-24">
        <Container>
          <p class="reveal micro-caps text-blue">{t().eyebrow}</p>
          <h2 id="what-we-build-title" class="reveal-line mt-6 text-h2 uppercase text-navy" data-delay="1">
            <span class="ln"><span class="li">{t().titleLines[0]}</span></span>
            <span class="ln"><span class="li">{t().titleLines[1]}</span></span>
            <span class="ln"><span class="li">{t().titleLines[2]}</span></span>
          </h2>
          <p class="reveal mt-8 max-w-prose text-body-lg text-body" data-delay="2">
            {t().text}
          </p>
        </Container>
      </div>

      {/* paneles */}
      <Panel locale={props.locale} index={0} surface="navy" demo={<BrowserDemo locale={props.locale} />} />
      <Panel locale={props.locale} index={1} surface="paper" reversed demo={<ShopDemo locale={props.locale} />} />
      <Panel locale={props.locale} index={2} surface="blue" demo={<DashDemo locale={props.locale} />} />

      {/* franja CTA compacta */}
      <div data-surface="navy" class="bg-navy py-14 md:py-16">
        <Container>
          <div class="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <p class="text-h3 uppercase leading-tight">
              <span class="text-on-navy">{t().cta.line1}</span>
              <br />
              <span class="text-paper">{t().cta.line2}</span>
            </p>
            <ButtonLink href={PATHS.contact[props.locale]}>{t().cta.button}</ButtonLink>
          </div>
        </Container>
      </div>
    </section>
  );
}
