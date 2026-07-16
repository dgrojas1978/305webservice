import type { JSX } from "solid-js";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout(props: { children: JSX.Element }) {
  return (
    <>
      <a href="#main" class="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main">{props.children}</main>
      <Footer />
    </>
  );
}
