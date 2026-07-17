import type { JSX } from "solid-js";

/** Contenedor editorial: máx. 1440px, gutter fluido clamp(24px, 5vw, 88px). */
export default function Container(props: { children: JSX.Element; class?: string }) {
  return <div class={`container-site ${props.class ?? ""}`}>{props.children}</div>;
}
