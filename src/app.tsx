import { MetaProvider, Title, Meta, Link } from "@solidjs/meta";
import { Router, useLocation } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Show, Suspense } from "solid-js";
import ChaterioWidget from "./components/ChaterioWidget";
import "./app.css";

export default function App() {
  return (
    <Router
      root={(props) => {
        // El asistente flota en todo el sitio MENOS en las tarjetas digitales
        // (/card/*): ahí quedaría flotando sobre una experiencia de pantalla
        // completa que pertenece a otro contexto.
        const location = useLocation();
        const showChat = () => !location.pathname.startsWith("/card/");
        return (
        <MetaProvider>
          {/* fallbacks globales — cada página los sobreescribe vía <Seo> */}
          <Title>305 Web Service | Web Design & Digital Solutions in Miami</Title>
          <Meta charset="utf-8" />
          <Meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta
            name="description"
            content="Web design and development, online stores, automation, SEO and digital support for businesses in Miami."
          />
          <Meta property="og:site_name" content="305 Web Service" />
          <Meta property="og:type" content="website" />
          <Meta name="twitter:card" content="summary_large_image" />
          {/* Favicons — icono «305» */}
          <Link rel="icon" href="/favicon.ico" sizes="32x32" />
          <Link rel="icon" href="/icon.svg" type="image/svg+xml" />
          <Link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <Link rel="manifest" href="/site.webmanifest" />
          <Meta name="theme-color" content="#071426" />
          <Suspense>{props.children}</Suspense>
          <Show when={showChat()}>
            <ChaterioWidget />
          </Show>
        </MetaProvider>
        );
      }}
    >
      <FileRoutes />
    </Router>
  );
}
