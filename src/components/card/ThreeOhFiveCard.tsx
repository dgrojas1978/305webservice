import type { CardProfile } from "~/data/card";

export default function ThreeOhFiveCard(_props: { profile: CardProfile }) {
  return (
    <iframe
      src="/card/305-experience/index.html"
      title="305 Web Service — Digital Card"
      class="block h-[100svh] w-full border-0 bg-[#050d1a]"
      allow="clipboard-write"
    />
  );
}
