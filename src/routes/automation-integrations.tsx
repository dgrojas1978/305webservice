import ServicePage from "~/components/pages/ServicePage";
export default function P() {
  return (
    <ServicePage locale="en" page="automation" metaKey="automation"
      offerIds={["automation"]}
      heroTitle="Automation & Integrations"
      heroIntro="Cut the repetitive work. Connect the tools you already use so leads, data and follow-ups move on their own."
      heroService="automation" />
  );
}
