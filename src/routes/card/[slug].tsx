import { Meta } from "@solidjs/meta";
import { useParams } from "@solidjs/router";
import { Show } from "solid-js";
import Seo from "~/components/Seo";
import DigitalCard from "~/components/card/DigitalCard";
import ClientCard from "~/components/card/ClientCard";
import PersonCard from "~/components/card/PersonCard";
import InfiniteWindowsCard from "~/components/card/InfiniteWindowsCard";
import ThreeOhFiveCard from "~/components/card/ThreeOhFiveCard";
import NotFoundPage from "~/components/pages/NotFoundPage";
import { CARD_PROFILES } from "~/data/card";

/**
 * Perfil canónico de la tarjeta digital (destino de /nfc/<slug> y del QR).
 *
 * El renderer se elige por el perfil: los tenants de cliente con marca propia
 * (`profile.client`, p. ej. CN Brandings) usan `ClientCard`; las tarjetas
 * personales (`profile.personCard`, p. ej. Mabel Toledo) usan `PersonCard`;
 * 305 e Infinite Windows usan experiencias de marca aisladas para evitar
 * estilos cruzados. `DigitalCard` queda como el renderer por defecto.
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
          <Show when={p().nfc.noindex}>
            <Meta name="robots" content="noindex,nofollow" />
          </Show>
          {/* Orden: experiencias de marca aisladas (Infinite Windows, 305) ->
              tarjeta personal (Mabel) -> tenant de cliente -> concierge por defecto. */}
          <Show when={p().id === "infinite-windows"} fallback={
            <Show when={p().id === "305"} fallback={
              <Show when={p().personCard} fallback={
                <Show when={p().client} fallback={<DigitalCard profile={p()} />}>
                  <ClientCard profile={p()} />
                </Show>
              }>
                <PersonCard profile={p()} />
              </Show>
            }>
              <ThreeOhFiveCard profile={p()} />
            </Show>
          }>
            <InfiniteWindowsCard profile={p()} />
          </Show>
        </>
      )}
    </Show>
  );
}
