import ServicePage from "~/components/pages/ServicePage";
export default function P() {
  return (
    <ServicePage locale="es" page="automation" metaKey="automation"
      offerIds={["automation"]}
      heroTitle="Automatización e Integraciones"
      heroIntro="Elimina el trabajo repetitivo. Conecta las herramientas que ya usas para que leads, datos y seguimientos se muevan solos."
      heroService="automation" />
  );
}
