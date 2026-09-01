import ServicePage from "~/components/pages/ServicePage";
export default function P() {
  return (
    <ServicePage locale="es" page="automation" metaKey="automation"
      offerIds={["automation"]}
      heroTitle="Marketing Digital y Automatización"
      heroIntro="Más clientes, menos trabajo manual. Campañas, rutas de reseñas y seguimientos que corren solos — conectados a las herramientas que ya usas."
      heroService="automation" />
  );
}
