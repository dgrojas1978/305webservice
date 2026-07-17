import { onCleanup, onMount } from "solid-js";

/**
 * Observa los elementos .reveal / .reveal-line / .reveal-rule de la página
 * y les añade .in la primera vez que entran al viewport (una sola vez).
 * Sin JS, el CSS los deja visibles (las reglas dependen de html.js).
 */
export default function RevealObserver() {
  onMount(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document
        .querySelectorAll(".reveal, .reveal-line, .reveal-rule, .reveal-mask")
        .forEach((el) => el.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    document
      .querySelectorAll(".reveal, .reveal-line, .reveal-rule, .reveal-mask")
      .forEach((el) => io.observe(el));

    onCleanup(() => io.disconnect());
  });

  return null;
}
