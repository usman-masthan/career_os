import { unstable_cache } from "next/cache";

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL;
const REVALIDATE_SECONDS = 300;

function apiUrl() {
  if (!configuredApiUrl) throw new Error("NEXT_PUBLIC_API_URL is required");
  return configuredApiUrl.replace(/\/$/, "");
}

async function request(path) {
  const response = await fetch(`${apiUrl()}${path}`, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!response.ok) throw new Error(`${path} returned ${response.status}`);
  return response.json();
}

const cached = (path, key) => unstable_cache(() => request(path), [key], {
  revalidate: REVALIDATE_SECONDS,
  tags: [key],
});

export const getSiteContent = (pageKey = "home") => cached(`/site-content/${encodeURIComponent(pageKey)}`, `site-content-${pageKey}`)();
export const getProfile = cached("/profile", "profile");
export const getProjects = cached("/projects", "projects");
export const getSkills = cached("/skills", "skills");
export const getExperiences = cached("/experiences", "experiences");
export const getEducation = cached("/education", "education");
export const getCredentials = cached("/credentials", "credentials");
export const getResearch = cached("/research", "research");
export const getAchievements = cached("/achievements", "achievements");
export const getPublications = cached("/publications", "publications");
export const getProject = (slug) => cached(`/projects/${encodeURIComponent(slug)}`, `project-${slug}`)();
export const getHome = cached("/home", "home-aggregate");
export const getCertifications = unstable_cache(() => request("/certifications"), ["certifications"], {
  revalidate: 60,
  tags: ["certifications"],
});

export async function optional(load, emptyValue = []) {
  try {
    return { data: await load(), unavailable: false };
  } catch (error) {
    console.error("Supabase-backed portfolio data unavailable:", error);
    return { data: emptyValue, unavailable: true };
  }
}

export function formatPeriod(start, end, location) {
  const format = (value) => value && new Intl.DateTimeFormat("en", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
  const dates = [format(start), end ? format(end) : (start ? "Present" : "")].filter(Boolean).join(" – ");
  return [dates, location].filter(Boolean).join(" · ");
}
