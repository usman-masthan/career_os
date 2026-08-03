import { NextResponse } from "next/server";

const cookieOptions = {
  httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/",
};

function isOwner(user) {
  const emails = (process.env.PORTFOLIO_OWNER_EMAILS || "")
    .split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);
  return user?.app_metadata?.portfolio_owner === true
    || emails.includes((user?.email || "").toLowerCase());
}

async function getUser(url, key, token) {
  if (!token) return null;
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: key, Authorization: `Bearer ${token}` }, cache: "no-store",
  });
  return response.ok ? response.json() : null;
}

export async function middleware(request) {
  const loginPath = request.nextUrl.pathname === "/admin/login";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  let token = request.cookies.get("sb-access-token")?.value;
  let user = url && key ? await getUser(url, key, token) : null;
  let refreshedSession = null;

  if (!user && url && key) {
    const refreshToken = request.cookies.get("sb-refresh-token")?.value;
    if (refreshToken) {
      const refresh = await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, {
        method: "POST", headers: { apikey: key, "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }), cache: "no-store",
      });
      if (refresh.ok) {
        refreshedSession = await refresh.json();
        token = refreshedSession.access_token;
        user = await getUser(url, key, token);
      }
    }
  }

  const allowed = isOwner(user);
  const response = !allowed && !loginPath
    ? NextResponse.redirect(new URL("/admin/login", request.url))
    : allowed && loginPath
      ? NextResponse.redirect(new URL("/admin", request.url))
      : NextResponse.next();

  if (refreshedSession && allowed) {
    response.cookies.set("sb-access-token", refreshedSession.access_token, {
      ...cookieOptions, maxAge: refreshedSession.expires_in,
    });
    response.cookies.set("sb-refresh-token", refreshedSession.refresh_token, {
      ...cookieOptions, maxAge: 60 * 60 * 24 * 30,
    });
  } else if (!allowed && !loginPath) {
    response.cookies.delete("sb-access-token");
    response.cookies.delete("sb-refresh-token");
  }
  return response;
}

export const config = { matcher: ["/admin/:path*"] };
