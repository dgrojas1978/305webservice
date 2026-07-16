import type { JSX } from "solid-js";

export default function Container(props: { children: JSX.Element; class?: string }) {
  return (
    <div class={`mx-auto w-full max-w-content px-4 sm:px-6 lg:px-8 ${props.class ?? ""}`}>
      {props.children}
    </div>
  );
}
