import ServicePage from "~/components/pages/ServicePage";
export default function P() {
  return (
    <ServicePage locale="en" page="nfc" metaKey="nfc"
      offerIds={["nfc"]}
      heroTitle="NFC Business Solutions"
      heroIntro="Turn a tap into a real business action — share contact details, capture leads or open your review page. With a QR fallback and honest compatibility."
      heroService="nfc" />
  );
}
