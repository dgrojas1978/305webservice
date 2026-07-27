import type { JSX } from "solid-js";
import Header from "./Header";
import Footer from "./Footer";
import RevealObserver from "~/components/Reveal";
import AnalyticsListener from "~/components/AnalyticsListener";
import { C } from "~/data/content";
import type { Locale, PageKey } from "~/lib/i18n";

interface Props {
  children: JSX.Element;
  locale: Locale;
  page: PageKey;
}

export default function Layout(props: Props) {
  return (
    <>
      <a href="#main" class="skip-link">{C[props.locale].nav.skip}</a>
      <span id="top" />
      <Header locale={props.locale} page={props.page} />
      <main id="main">{props.children}</main>
      <Footer locale={props.locale} />
      <RevealObserver />
      <AnalyticsListener />
    </>
  );
}
