"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

// Replace with your real GA4 Measurement ID when deploying
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX";

// ---- Type helper ----
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

// ---- Core track helpers ----
export function pageview(url: string) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

type GTagEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: unknown;
};

export function event({ action, category, label, value, ...rest }: GTagEvent) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
    ...rest,
  });
}

// ---- Pre-built PRD Section 31 events ----
export const trackWhatsAppClick = (label: string) =>
  event({ action: "click_whatsapp", category: "engagement", label });

export const trackStartBooking = (serviceLabel: string) =>
  event({ action: "start_booking", category: "booking", label: serviceLabel });

export const trackSubmitBooking = (bookingId: string, serviceLabel: string) =>
  event({ action: "submit_booking", category: "booking", label: serviceLabel, booking_id: bookingId });

export const trackViewService = (serviceId: string, serviceName: string) =>
  event({ action: "view_service", category: "discovery", label: serviceName, item_id: serviceId });

export const trackViewRoute = (routeId: string, routeName: string) =>
  event({ action: "view_route", category: "discovery", label: routeName, item_id: routeId });

export const trackSearchTransport = (query: string) =>
  event({ action: "search_transport", category: "engagement", label: query });

// ---- Auto pageview tracker component ----
export function GoogleAnalyticsPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const url = searchParams?.size
      ? `${pathname}?${searchParams.toString()}`
      : pathname;
    pageview(url);
  }, [pathname, searchParams]);

  return null;
}
