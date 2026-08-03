import { getProjects, getSiteContent, optional } from "../data";
import PageHeader from "../components/PageHeader";
import ProjectFilters from "../components/ProjectFilters";

export default async function ProjectsPage(){const [records,content]=await Promise.all([optional(getProjects),optional(()=>getSiteContent("projects"),{})]);const copy=content.data;return <main className="page"><PageHeader eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} status={`${records.data.length} ${copy.count_label||""}`}/><ProjectFilters projects={records.data} copy={copy.filters||{}}/></main>;}
