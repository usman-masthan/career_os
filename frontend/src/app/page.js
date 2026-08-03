import Navbar from './components/Navbar'
import Hero from './components/Hero'

async function fetchJson(path) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBase) {
    throw new Error('NEXT_PUBLIC_API_URL is not set');
  }

  const response = await fetch(`${apiBase}${path}`, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}`);
  }

  return response.json();
}

export async function generateMetadata() {
  const content = await fetchJson('/api/site-content');

  return {
    title: content?.seo?.title || 'Portfolio',
    description: content?.seo?.description || '',
  };
}

export default async function Home() {
  const [content, projects, skills] = await Promise.all([
    fetchJson('/api/site-content'),
    fetchJson('/api/projects'),
    fetchJson('/api/skills'),
  ]);

  return (
      <main>
        <Navbar />
        <Hero content={content} projects={projects} skills={skills} />
      </main>
  )
}