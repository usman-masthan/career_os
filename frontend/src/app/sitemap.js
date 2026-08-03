import { getProfile, getProjects, getSiteContent, optional } from "./data";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const [profiles,projects,shell]=await Promise.all([optional(getProfile),optional(getProjects),optional(()=>getSiteContent("shell"),{})]);
  const base=(profiles.data[0]?.website_url||process.env.NEXT_PUBLIC_SITE_URL||"").replace(/\/$/,"");
  if(!base)return [];
  const staticRoutes=["",...new Set((shell.data.navigation||[]).map(item=>item.href))];
  return [
    ...staticRoutes.map(path => ({ url:`${base}${path}`, changeFrequency:path===""?"weekly":"monthly", priority:path===""?1:0.7 })),
    ...projects.data.map(item => ({url:`${base}/projects/${item.slug}`,changeFrequency:"monthly",priority:0.8,lastModified:item.updated_at})),
  ];
}
