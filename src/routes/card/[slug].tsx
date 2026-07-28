import { useParams } from "@solidjs/router";
import { Show } from "solid-js";
import Seo from "~/components/Seo";
import DigitalCard from "~/components/card/DigitalCard";
import NotFoundPage from "~/components/pages/NotFoundPage";
import { CARD_PROFILES } from "~/data/card";

/** Perfil canónico de la tarjeta digital (destino de /nfc/<slug> y del QR). */
export default function CardRoute() {
  const params = useParams();
  const profile = () => CARD_PROFILES[params.slug];

  return (
    <Show when={profile()} fallback={<NotFoundPage locale="en" />}>
      {(p) => (
        <>
          <Seo
            title={`${p().company.name} — Digital Card`}
            description={p().company.positioning.en}
            path={p().nfc.canonicalPath}
            locale="en"
          />
          <DigitalCard profile={p()} />
        </>
      )}
    </Show>
  );
}
