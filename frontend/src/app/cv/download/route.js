import { getEducation, getExperiences, getProfile, getProjects, getSkills } from "../../data";

export const dynamic = "force-dynamic";

const ascii = value => String(value || "").normalize("NFKD").replace(/[^\x20-\x7E]/g, "-");
const escapePdf = value => ascii(value).replace(/([\\()])/g, "\\$1");
const wrap = (value, width = 92) => {
  const words = ascii(value).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    if (`${line} ${word}`.trim().length > width) { if (line) lines.push(line); line = word; }
    else line = `${line} ${word}`.trim();
  }
  if (line) lines.push(line);
  return lines;
};

function createPdf(lines) {
  const commands = ["BT", "/F1 10 Tf", "48 756 Td", "13 TL"];
  lines.slice(0, 50).forEach((line, index) => {
    const size = line.style === "title" ? 19 : line.style === "heading" ? 11 : 9;
    commands.push(`/${line.style === "title" || line.style === "heading" ? "F2" : "F1"} ${size} Tf`);
    if (index > 0) commands.push("T*");
    commands.push(`(${escapePdf(line.text)}) Tj`);
  });
  commands.push("ET");
  const stream = commands.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => { offsets.push(Buffer.byteLength(pdf)); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach(offset => { pdf += `${String(offset).padStart(10, "0")} 00000 n \n`; });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf);
}

export async function GET() {
  const [profiles, experiences, education, projects, skills] = await Promise.all([
    getProfile(), getExperiences(), getEducation(), getProjects(), getSkills(),
  ]);
  const profile = profiles[0] || {};
  const featuredProjects = projects.filter(project => project.featured).slice(0, 3);
  const featuredSkills = skills.filter(skill => skill.featured).map(skill => skill.name).slice(0, 8);
  const lines = [
    { text: profile.display_name, style: "title" },
    { text: `${profile.headline} | ${profile.location}` },
    { text: [profile.email, profile.linkedin_url, profile.github_url].filter(Boolean).join(" | ") },
    { text: "PROFILE", style: "heading" },
    ...wrap(profile.bio).map(text => ({ text })),
    { text: "SELECTED SECURITY PROJECTS", style: "heading" },
    ...featuredProjects.flatMap(project => [
      { text: project.title, style: "heading" },
      ...wrap(project.recruiter_summary || project.summary).map(text => ({ text })),
      ...(project.repository_url ? [{ text: project.repository_url }] : []),
    ]),
    { text: "EXPERIENCE", style: "heading" },
    ...experiences.slice(0, 2).flatMap(item => [
      { text: `${item.role} | ${item.organisation}`, style: "heading" },
      ...wrap(item.description).slice(0, 2).map(text => ({ text })),
    ]),
    { text: "EDUCATION", style: "heading" },
    ...education.slice(0, 1).map(item => ({ text: `${item.qualification} ${item.field_of_study} | ${item.institution} | ${item.description || "In progress"}` })),
    { text: "CORE CAPABILITIES", style: "heading" },
    { text: featuredSkills.join(" | ") },
  ];
  const pdf = createPdf(lines);
  return new Response(pdf, { headers: {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="${ascii(profile.slug || "portfolio")}-cv.pdf"`,
    "Cache-Control": "no-store",
  }});
}
