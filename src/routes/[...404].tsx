import { useLocation } from "@solidjs/router";
import NotFoundPage from "~/components/pages/NotFoundPage";

export default function NotFound() {
  const location = useLocation();
  const locale = () =>
    location.pathname === "/es" || location.pathname.startsWith("/es/") ? "es" : "en";
  return <NotFoundPage locale={locale()} />;
}
