import type { JSX } from "solid-js";
import Container from "~/components/ui/Container";

interface Props {
  eyebrow?: string;
  children: JSX.Element; // título (h1)
  intro?: string;
}

/** Cabecera navy de páginas interiores — el header transparente vive sobre ella. */
export default function PageHero(props: Props) {
  return (
    <section data-surface="navy" class="bg-navy pb-20 pt-36 md:pb-28 md:pt-48">
      <Container>
        {props.eyebrow && <p class="micro-caps text-turquoise">{props.eyebrow}</p>}
        <h1 class="mt-6 text-h1 uppercase text-paper">{props.children}</h1>
        {props.intro && (
          <p class="mt-8 max-w-xl text-body-lg text-on-navy">{props.intro}</p>
        )}
      </Container>
    </section>
  );
}
