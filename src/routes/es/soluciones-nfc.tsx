import ServicePage from "~/components/pages/ServicePage";
export default function P() {
  return (
    <ServicePage locale="es" page="nfc" metaKey="nfc"
      offerIds={["nfc"]}
      heroTitle="Soluciones NFC"
      heroIntro="Convierte un toque en una acción de negocio real — comparte tu contacto, capta leads o abre tu página de reseñas. Con respaldo QR y compatibilidad honesta."
      heroService="nfc" />
  );
}
