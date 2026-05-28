export function trackEvent(event: string, props?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  const w = window as typeof window & { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag === "function") {
    w.gtag("event", event, props ?? {});
  }
}

export const erpEvents = {
  clickDemo:        () => trackEvent("erp_click_demo"),
  clickDownload:    (platform: string) => trackEvent("erp_click_download", { platform }),
  clickWhatsApp:    (source: string) => trackEvent("erp_click_whatsapp", { source }),
  clickQuote:       () => trackEvent("erp_click_quote"),
  clickComparePlans:() => trackEvent("erp_click_compare_plans"),
  submitDemo:       () => trackEvent("erp_submit_demo_request"),
  submitQuote:      () => trackEvent("erp_submit_quote_request"),
  viewPricing:      (plan: string) => trackEvent("erp_view_pricing", { plan }),
};
