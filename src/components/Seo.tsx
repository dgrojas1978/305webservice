import { Title, Meta, Link } from "@solidjs/meta";
import { canonical, SITE_URL } from "~/lib/site";

interface Props {
  title: string;
  description: string;
  /** Route path used for the canonical URL and og:url, e.g. "/services". */
  path: string;
}

export default function Seo(props: Props) {
  const url = canonical(props.path);
  return (
    <>
      <Title>{props.title}</Title>
      <Meta name="description" content={props.description} />
      <Link rel="canonical" href={url} />
      <Meta property="og:title" content={props.title} />
      <Meta property="og:description" content={props.description} />
      <Meta property="og:url" content={url} />
      <Meta property="og:image" content={`${SITE_URL}/og-image.png`} />
      <Meta property="og:image:width" content="1200" />
      <Meta property="og:image:height" content="630" />
      <Meta name="twitter:title" content={props.title} />
      <Meta name="twitter:description" content={props.description} />
      <Meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />
    </>
  );
}
