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
          <Title>305 Web Service — Software para empresas</Title>
          <Meta charset="utf-8" />
          <Meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta
            name="description"
            content="305 Web Service: soluciones de software, sistemas internos, automatización y desarrollo web para pequeñas y medianas empresas."
          />
          <Meta property="og:site_name" content="305 Web Service" />
          <Meta property="og:type" content="website" />
          <Meta property="og:image" content="/og-image.png" />
          <Meta name="twitter:card" content="summary_large_image" />
          <Link rel="preconnect" href="https://fonts.googleapis.com" />
          <Link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <Link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300..900;1,14..32,300..900&display=swap"
          />
          {/* Favicons */}
          <Link rel="icon" href="/favicon.ico" sizes="32x32" />
          <Link rel="icon" href="/icon.svg" type="image/svg+xml" />
          <Link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <Link rel="manifest" href="/site.webmanifest" />
          <Meta name="theme-color" content="#2563EB" />
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
