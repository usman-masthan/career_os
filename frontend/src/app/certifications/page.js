import PageHeader from "../components/PageHeader";
import TrackedLink from "../components/TrackedLink";
import { getCertifications, getSiteContent, optional } from "../data";

export const revalidate = 60;
export async function generateMetadata(){const {data}=await optional(()=>getSiteContent("certifications"),{});return data.seo||{};}

const formatDate = value => value && new Intl.DateTimeFormat("en", {
  month: "short", year: "numeric", timeZone: "UTC",
}).format(new Date(`${value}T00:00:00Z`));

const publicLink = item => item.verification_url || item.credential_url;
const statusLabel = (item, copy) => {
  if (item.verification_status === "verified" && publicLink(item)) return copy.verified_label;
  if (publicLink(item)) return copy.verification_label;
  return copy.record_label;
};

export default async function Certifications() {
  const [records, content] = await Promise.all([optional(getCertifications), optional(() => getSiteContent("certifications"), {})]);
  const { data, unavailable } = records;
  const copy = content.data;
  const schema = data.map(item => ({
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    name: item.name,
    dateCreated: item.issued_at || undefined,
    recognizedBy: { "@type": "Organization", name: item.issuer },
    url: publicLink(item) || undefined,
  }));

  return <main className="page">
    {data.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />}
    <PageHeader eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} status={`${data.length} ${data.length === 1 ? copy.count_singular : copy.count_plural}`} />
    {unavailable && <p className="section-note" role="status">{copy.unavailable_message}</p>}
    {!unavailable && data.length === 0 && <p className="section-note" role="status">{copy.empty_message}</p>}
    {data.length > 0 && <div className="cert-grid">{data.map((item, index) => {
      const link = publicLink(item);
      return <article key={item.id}>
        <header><span>{String(index + 1).padStart(2, "0")}</span><b>{statusLabel(item, copy)}</b></header>
        <small>{item.issuer}</small>
        <h2>{item.name}</h2>
        {(item.issued_at || item.expires_at) && <p className="credential-dates">
          {item.issued_at && <>{copy.issued_label} {formatDate(item.issued_at)}</>}
          {item.issued_at && item.expires_at && " · "}
          {item.expires_at && <>{copy.expires_label} {formatDate(item.expires_at)}</>}
        </p>}
        {link && <TrackedLink href={link} details={{ subject_type: "certification", subject_slug: item.external_identifier || item.id }}>{copy.verify_label}</TrackedLink>}
      </article>;
    })}</div>}
  </main>;
}
