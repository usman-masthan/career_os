"use client";

import Link from "next/link";
import { sendEvent } from "./Analytics";

export default function TrackedLink({ eventName = "outbound_click", details, href, children, ...props }) {
  const Component = href.startsWith("/") ? Link : "a";
  return <Component href={href} onClick={() => sendEvent(eventName, details)} {...props}>{children}</Component>;
}
