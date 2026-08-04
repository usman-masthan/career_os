import { revalidatePath, revalidateTag } from "next/cache";

const PUBLIC_TABLES = new Set([
  "profile",
  "projects",
  "skills",
  "experiences",
  "education",
  "credentials",
  "research",
  "achievements",
  "publications",
  "site_content",
  "project_skills",
  "project_evidence",
  "project_media",
]);

const TABLE_TAGS = {
  profile: ["profile"],
  projects: ["projects"],
  skills: ["skills"],
  experiences: ["experiences"],
  education: ["education"],
  credentials: ["credentials", "certifications"],
  research: ["research"],
  achievements: ["achievements"],
  publications: ["publications"],
};

export async function POST(request) {
  const configuredSecret = process.env.REVALIDATE_SECRET;
  const suppliedSecret = request.headers.get("x-revalidate-secret");

  if (!configuredSecret || suppliedSecret !== configuredSecret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const table = payload?.table;
  if (payload?.schema !== "public" || !PUBLIC_TABLES.has(table)) {
    return Response.json({ error: "Unsupported database event" }, { status: 400 });
  }

  const tags = new Set(["home-aggregate", ...(TABLE_TAGS[table] || [])]);
  if (table === "site_content") {
    const pageKey = payload.record?.page_key || payload.old_record?.page_key;
    if (pageKey) tags.add(`site-content-${pageKey}`);
  }
  if (table === "projects") {
    const slug = payload.record?.slug || payload.old_record?.slug;
    if (slug) tags.add(`project-${slug}`);
  }

  for (const tag of tags) revalidateTag(tag);
  revalidatePath("/", "layout");

  return Response.json({ revalidated: true, table, tags: [...tags] });
}
