"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function login(formData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) redirect("/admin/login?error=configuration");

  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  if (!response.ok) redirect("/admin/login?error=credentials");

  const session = await response.json();
  cookies().set("sb-access-token", session.access_token, {
    ...cookieOptions, maxAge: session.expires_in,
  });
  cookies().set("sb-refresh-token", session.refresh_token, {
    ...cookieOptions, maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/admin");
}

export async function logout() {
  cookies().delete("sb-access-token");
  cookies().delete("sb-refresh-token");
  redirect("/admin/login");
}
