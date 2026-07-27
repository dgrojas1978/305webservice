import ServicePage from "~/components/pages/ServicePage";
export default function P() {
  return (
    <ServicePage locale="en" page="customSoftware" metaKey="customSoftware"
      offerIds={["custom-software"]}
      heroTitle="Custom Business Software"
      heroIntro="Replace spreadsheets and disconnected tools with a secure app, portal or dashboard built around how your business actually works."
      heroService="custom-software" />
  );
}
