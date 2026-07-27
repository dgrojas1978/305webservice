import ServicePage from "~/components/pages/ServicePage";
export default function P() {
  return (
    <ServicePage locale="es" page="customSoftware" metaKey="customSoftware"
      offerIds={["custom-software"]}
      heroTitle="Software a Medida"
      heroIntro="Reemplaza hojas de cálculo y herramientas desconectadas con una app, portal o panel seguro construido alrededor de cómo trabaja tu negocio."
      heroService="custom-software" />
  );
}
