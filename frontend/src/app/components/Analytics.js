"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const apiBase = process.env.NEXT_PUBLIC_API_URL;

export function sendEvent(eventName, details = {}) {
  if (!apiBase || typeof window === "undefined") return;
  let referrerHost = null;
  try { referrerHost = document.referrer ? new URL(document.referrer).hostname : null; } catch {}
  fetch(`${apiBase}/analytics/events`, {
    method: "POST", headers: { "content-type": "application/json" }, keepalive: true,
    body: JSON.stringify({ event_name: eventName, path: window.location.pathname, referrer_host: referrerHost, ...details }),
  }).catch(() => {});
}

export default function Analytics() {
  const pathname = usePathname();
  useEffect(() => { sendEvent("page_view"); }, [pathname]);
  return null;
}
