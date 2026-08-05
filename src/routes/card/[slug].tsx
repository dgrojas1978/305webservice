import { useParams } from "@solidjs/router";
import { Show } from "solid-js";
import Seo from "~/components/Seo";
import DigitalCard from "~/components/card/DigitalCard";
import ClientCard from "~/components/card/ClientCard";
import InfiniteWindowsCard from "~/components/card/InfiniteWindowsCard";
import NotFoundPage from "~/components/pages/NotFoundPage";
import { CARD_PROFILES } from "~/data/card";

/**
 * Perfil canónico de la tarjeta digital (destino de /nfc/<slug> y del QR).
 *
 * El renderer se elige por el perfil: los tenants de cliente con marca propia
 * (`profile.client`, p. ej. CN Brandings) usan `ClientCard`; 305 sigue con su
 * concierge `DigitalCard`, sin cambios.
 */
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
          <Show when={p().id === "infinite-windows"} fallback={
            <Show when={p().client} fallback={<DigitalCard profile={p()} />}>
              <ClientCard profile={p()} />
            </Show>
          }>
            <InfiniteWindowsCard profile={p()} />
          </Show>
        </>
      )}
    </Show>
  );
}
