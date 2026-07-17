import Seo from "~/components/Seo";
import Layout from "~/components/layout/Layout";
import Container from "~/components/ui/Container";
import PageHero from "~/components/pages/PageHero";
import { C } from "~/data/content";
import { PATHS, altPath, type Locale } from "~/lib/i18n";
import { CONTACT_EMAIL } from "~/lib/site";

const BODY: Record<Locale, { updated: string; sections: { h: string; p: string }[] }> = {
  en: {
    updated: "July 2026",
    sections: [
      {
        h: "Information we collect",
        p: "When you submit our contact form we collect the information you provide: your name, company (optional), email, phone (optional), the service you are interested in, an approximate budget (optional) and your message.",
      },
      {
        h: "How we use it",
        p: "We use this information only to review your request and contact you about it. We do not sell, rent or share your information with third parties for marketing purposes.",
      },
      {
        h: "Where it is stored",
        p: "Form submissions are stored in a private database and are accessible only to the 305 Web Service team.",
      },
      {
        h: "Your choices",
        p: `You can ask us to correct or delete your information at any time by writing to ${"305webservice@gmail.com"}.`,
      },
    ],
  },
  es: {
    updated: "Julio 2026",
    sections: [
      {
        h: "Información que recopilamos",
        p: "Cuando envías nuestro formulario de contacto recopilamos la información que nos das: tu nombre, empresa (opcional), correo, teléfono (opcional), el servicio que te interesa, un presupuesto aproximado (opcional) y tu mensaje.",
      },
      {
        h: "Cómo la usamos",
        p: "Usamos esta información únicamente para revisar tu solicitud y contactarte al respecto. No vendemos, alquilamos ni compartimos tu información con terceros con fines de marketing.",
      },
      {
        h: "Dónde se guarda",
        p: "Los envíos del formulario se almacenan en una base de datos privada a la que solo accede el equipo de 305 Web Service.",
      },
      {
        h: "Tus opciones",
        p: `Puedes pedirnos corregir o eliminar tu información en cualquier momento escribiendo a ${"305webservice@gmail.com"}.`,
      },
    ],
  },
};

export default function PrivacyPage(props: { locale: Locale }) {
  const t = () => C[props.locale];
  const body = () => BODY[props.locale];

  return (
    <Layout locale={props.locale} page="privacy">
      <Seo
        title={t().meta.privacy.title}
        description={t().meta.privacy.description}
        path={PATHS.privacy[props.locale]}
        altPath={altPath("privacy", props.locale)}
        locale={props.locale}
      />

      <PageHero eyebrow="305 Web Service">{t().privacy.title}</PageHero>

      <section class="bg-paper py-24 md:py-32">
        <Container>
          <p class="micro-caps text-body">
            {t().privacy.updated}: {body().updated}
          </p>
          <div class="mt-12 max-w-2xl space-y-12">
            {body().sections.map((s) => (
              <div>
                <h2 class="text-h3 uppercase text-navy">{s.h}</h2>
                <div class="rule-t mt-4" />
                <p class="mt-5 text-base leading-relaxed text-body">{s.p}</p>
              </div>
            ))}
            <p class="border-t border-hairline pt-8 text-sm text-body">
              305 Web Service · Miami, Florida ·{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} class="link-underline font-medium text-blue">
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </Container>
      </section>
    </Layout>
  );
}
