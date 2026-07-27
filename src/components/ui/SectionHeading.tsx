import { Show, type JSX } from "solid-js";

interface Props {
  eyebrow?: string;
  title: string | JSX.Element;
  intro?: string | JSX.Element;
  align?: "left" | "center";
  onDark?: boolean;
  class?: string;
}

/** Encabezado de sección: eyebrow micro-caps + título + intro. */
export default function SectionHeading(props: Props) {
  const centered = () => props.align === "center";
  return (
    <div class={`${centered() ? "mx-auto max-w-2xl text-center" : "max-w-3xl"} ${props.class ?? ""}`}>
      <Show when={props.eyebrow}>
        <p class={`micro-caps ${props.onDark ? "text-turquoise" : "text-blue-ink"}`}>{props.eyebrow}</p>
      </Show>
      <h2
        class={`mt-4 text-[clamp(1.9rem,3.4vw,3rem)] font-extrabold leading-[1.08] tracking-tight ${
          props.onDark ? "text-paper" : "text-navy"
        }`}
      >
        {props.title}
      </h2>
      <Show when={props.intro}>
        <p class={`mt-5 text-body-lg leading-relaxed ${props.onDark ? "text-on-navy" : "text-body"}`}>
          {props.intro}
        </p>
      </Show>
    </div>
  );
}
