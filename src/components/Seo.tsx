import { Title, Meta, Link } from "@solidjs/meta";
import { canonical, SITE_URL } from "~/lib/site";
import type { Locale } from "~/lib/i18n";

interface Props {
  title: string;
  description: string;
  /** Ruta usada para canonical y og:url, p. ej. "/services". */
  path: string;
  /** Ruta equivalente en el otro idioma (hreflang alternate). */
  altPath?: string;
  locale: Locale;
}

export default function Seo(props: Props) {
  const url = canonical(props.path);
  const altLocale = props.locale === "en" ? "es" : "en";
  return (
    <>
      <Title>{props.title}</Title>
      <Meta name="description" content={props.description} />
      <Link rel="canonical" href={url} />
      {props.altPath && (
        <>
          <Link rel="alternate" hreflang={altLocale} href={canonical(props.altPath)} />
          <Link rel="alternate" hreflang={props.locale} href={url} />
          <Link
            rel="alternate"
            hreflang="x-default"
            href={canonical(props.locale === "en" ? props.path : props.altPath)}
          />
        </>
      )}
      <Meta property="og:title" content={props.title} />
      <Meta property="og:description" content={props.description} />
      <Meta property="og:url" content={url} />
      <Meta property="og:locale" content={props.locale === "en" ? "en_US" : "es_US"} />
      <Meta property="og:image" content={`${SITE_URL}/og-image.png`} />
      <Meta property="og:image:width" content="1200" />
      <Meta property="og:image:height" content="630" />
      <Meta name="twitter:title" content={props.title} />
      <Meta name="twitter:description" content={props.description} />
      <Meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />
    </>
  );
}
