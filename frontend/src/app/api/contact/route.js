import { NextResponse } from "next/server";

const REQUEST_TIMEOUT_MS = 10_000;

function contactEndpoint() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  if (!apiBase) throw new Error("NEXT_PUBLIC_API_URL is not configured");
  return `${apiBase.replace(/\/$/, "")}/contact`;
}

export async function POST(request) {
  try {
    const body = await request.text();
    const response = await fetch(contactEndpoint(), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    const payload = await response.text();
    return new NextResponse(payload || null, {
      status: response.status,
      headers: { "content-type": response.headers.get("content-type") || "application/json" },
    });
  } catch (error) {
    console.error("Contact API proxy failed:", error);
    return NextResponse.json(
      { error: { code: "CONTACT_API_UNAVAILABLE", message: "Unable to submit your message right now." } },
      { status: 502 },
    );
  }
}
