import ServicePage from "~/components/pages/ServicePage";
export default function P() {
  return (
    <ServicePage locale="es" page="websitePackages" metaKey="websitePackages"
      offerIds={["website-starter", "business-website", "online-store"]}
      heroTitle="Paquetes web"
      heroIntro="Webs profesionales que convierten visitas en llamadas, mensajes y cotizaciones — desde un starter de $499 hasta una web empresarial o tienda en línea."
      heroPrice="Desde $499" heroService="website-starter" />
  );
}
