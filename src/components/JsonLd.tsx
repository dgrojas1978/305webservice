/** Renders a JSON-LD structured-data script tag. */
export default function JsonLd(props: { data: Record<string, unknown> }) {
  return (
    <script type="application/ld+json" innerHTML={JSON.stringify(props.data)} />
  );
}
