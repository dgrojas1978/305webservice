import { Show, type JSX } from "solid-js";

interface Props {
  eyebrow?: string;
  title: string;
  intro?: string | JSX.Element;
  align?: "left" | "center";
  onDark?: boolean;
}

export default function SectionHeading(props: Props) {
  const centered = () => (props.align ?? "center") === "center";
  return (
    <div class={`max-w-2xl ${centered() ? "mx-auto text-center" : ""} mb-12`}>
      <Show when={props.eyebrow}>
        <p
          class={`mb-3 text-sm font-semibold uppercase tracking-wider ${
            props.onDark ? "text-blue-300" : "text-brand-blue"
          }`}
        >
          {props.eyebrow}
        </p>
      </Show>
      <h2
        class={`text-3xl font-bold tracking-tight sm:text-4xl ${
          props.onDark ? "text-white" : "text-ink"
        }`}
      >
        {props.title}
      </h2>
      <Show when={props.intro}>
        <p class={`mt-4 text-lg leading-relaxed ${props.onDark ? "text-slate-300" : "text-ink-muted"}`}>
          {props.intro}
        </p>
      </Show>
    </div>
  );
}
