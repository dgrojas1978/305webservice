import { Title, Meta } from "@solidjs/meta";
import Header from "~/components/layout/Header";
import Footer from "~/components/layout/Footer";
import Hero from "~/components/sections/Hero";
import FeaturedProducts from "~/components/sections/FeaturedProducts";
import Benefits from "~/components/sections/Benefits";
import Industries from "~/components/sections/Industries";
import Testimonials from "~/components/sections/Testimonials";
import TrustSection from "~/components/sections/TrustSection";
import CTABanner from "~/components/sections/CTABanner";

export default function HomePage() {
  return (
    <>
      <Title>305 Web Service — Software que hace crecer tu negocio</Title>
      <Meta
        name="description"
        content="Soluciones de software, sistemas internos, POS, automatización y desarrollo web para pequeñas y medianas empresas. Implementación en 24h, soporte incluido."
      />
      <Meta property="og:title" content="305 Web Service — Software para negocios" />
      <Meta
        property="og:description"
        content="POS, gestión de citas, desarrollo a medida y más. Tecnología que hace crecer tu negocio."
      />

      <Header />
      <main>
        <Hero />
        <FeaturedProducts />
        <Benefits />
        <Industries />
        <TrustSection />
        <Testimonials />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
