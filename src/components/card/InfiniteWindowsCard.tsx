import AnalyticsListener from "~/components/AnalyticsListener";
import type { CardProfile } from "~/data/card";

/**
 * Infinite Windows is intentionally isolated from the 305 card stylesheet.
 * The approved standalone experience is the visual source of truth; the host
 * route only supplies the canonical URL, SEO and shared card infrastructure.
 */
export default function InfiniteWindowsCard(_props: { profile: CardProfile }) {
  return (
    <>
      <AnalyticsListener />
      <iframe
        title="Infinite Windows digital card"
        src="/card/infinite-windows-experience/index.html"
        style={{ width: "100%", height: "100svh", border: "0", display: "block", background: "#090b0c" }}
      />
    </>
  );
}
