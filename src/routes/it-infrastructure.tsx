import ServicePage from "~/components/pages/ServicePage";
export default function P() {
  return (
    <ServicePage locale="en" page="itInfrastructure" metaKey="itInfrastructure"
      offerIds={["it-infrastructure"]}
      heroTitle="IT Infrastructure & Support"
      heroIntro="Reliable networks, cloud, servers, backups and security for Miami businesses — with someone to call when you need help."
      heroService="it-infrastructure" />
  );
}
