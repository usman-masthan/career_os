import { unstable_cache } from "next/cache";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
const REVALIDATE_SECONDS = 300;

async function request(path) {
  const response = await fetch(`${API_URL}${path}`, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!response.ok) throw new Error(`${path} returned ${response.status}`);
  return response.json();
}

// Cache resources separately so a failing integration cannot take healthy
// sections with it. Published content may intentionally be five minutes stale.
export const getSiteContent = unstable_cache(() => request("/site-content"), ["public-site-content"], { revalidate: REVALIDATE_SECONDS, tags: ["site-content"] });
export const getProjects = unstable_cache(() => request("/projects"), ["public-projects"], { revalidate: REVALIDATE_SECONDS, tags: ["projects"] });
export const getSkills = unstable_cache(() => request("/skills"), ["public-skills"], { revalidate: REVALIDATE_SECONDS, tags: ["skills"] });

export async function safely(load, fallback) {
  try {
    return { data: await load(), unavailable: false };
  } catch (error) {
    console.error("Public portfolio data unavailable:", error);
    return { data: fallback, unavailable: true };
  }
}
