import ServicePage from "~/components/pages/ServicePage";
export default function P() {
  return (
    <ServicePage locale="es" page="itInfrastructure" metaKey="itInfrastructure"
      offerIds={["it-infrastructure"]}
      heroTitle="Infraestructura IT y Soporte"
      heroIntro="Redes, nube, servidores, respaldos y seguridad confiables para negocios de Miami — con alguien a quién llamar cuando necesites ayuda."
      heroService="it-infrastructure" />
  );
}
