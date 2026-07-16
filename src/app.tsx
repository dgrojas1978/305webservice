import { MetaProvider, Title, Meta, Link } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>
            305 Web Service | Web Design, Custom Software & IT Solutions in Miami
          </Title>
          <Meta charset="utf-8" />
          <Meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta
            name="description"
            content="Professional websites starting at $499, custom software, automation, networking, servers and IT support for businesses in Miami."
          />
          <Meta property="og:site_name" content="305 Web Service" />
          <Meta property="og:type" content="website" />
          <Meta property="og:locale" content="en_US" />
          <Meta name="twitter:card" content="summary_large_image" />
          {/* Favicons */}
          <Link rel="icon" href="/favicon.ico" sizes="32x32" />
          <Link rel="icon" href="/icon.svg" type="image/svg+xml" />
          <Link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <Link rel="manifest" href="/site.webmanifest" />
          <Meta name="theme-color" content="#0B1D3A" />
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
