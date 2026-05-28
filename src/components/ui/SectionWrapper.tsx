import { JSX } from "solid-js";

interface SectionWrapperProps {
  id?: string;
  class?: string;
  innerClass?: string;
  children: JSX.Element;
}

export default function SectionWrapper(props: SectionWrapperProps) {
  return (
    <section id={props.id} class={`py-16 lg:py-24 ${props.class ?? ""}`}>
      <div class={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${props.innerClass ?? ""}`}>
        {props.children}
      </div>
    </section>
  );
}
