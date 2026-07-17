import { A } from "@solidjs/router";
import type { JSX } from "solid-js";

interface ButtonLinkProps {
  href: string;
  children: JSX.Element;
  variant?: "primary" | "outline";
  class?: string;
  external?: boolean;
  ariaLabel?: string;
}

/**
 * Botones del sistema «Monumento 305»: micro-caps, inversión limpia
 * de color, sin sombras ni bordes redondeados. Todo CTA es un enlace real.
 */
export function ButtonLink(props: ButtonLinkProps) {
  const cls = () =>
    `btn ${props.variant === "outline" ? "btn-outline" : "btn-primary"} ${props.class ?? ""}`;

  if (props.external) {
    return (
      <a
        href={props.href}
        target="_blank"
        rel="noopener noreferrer"
        class={cls()}
        aria-label={props.ariaLabel}
      >
        {props.children}
      </a>
    );
  }
  return (
    <A href={props.href} class={cls()} aria-label={props.ariaLabel}>
      {props.children}
    </A>
  );
}

export function WhatsAppIcon(props: { class?: string }) {
  return (
    <svg
      class={props.class ?? "h-4 w-4"}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.852L.057 23.743a.5.5 0 00.612.612l5.9-1.476A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.66-.523-5.17-1.427l-.37-.22-3.828.957.975-3.763-.241-.387A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  );
}
