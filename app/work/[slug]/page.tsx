import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProjectBySlug, getProjects } from '@/lib/content';
import { MediaSlot } from '@/components/ui/MediaSlot';
import { StatusPill } from '@/components/ui/StatusPill';
import { projectJsonLd } from '@/lib/seo';

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.tagline,
    openGraph: {
      title: project.title,
      description: project.tagline,
      images: [project.cover],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-5xl px-16 py-64 md:px-24 md:py-96">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd(project)) }}
      />
      <div className="flex flex-col gap-32">
        <div className="flex flex-col gap-16">
          <Link href="/work" className="text-mono-label font-mono text-ink-faint hover:text-ink-muted">
            ← all work
          </Link>
          <div className="flex flex-wrap items-center gap-12">
            <StatusPill status={project.status} />
            <span className="font-mono text-mono-label text-ink-faint">{project.year}</span>
          </div>
          <h1 className="text-h1 md:text-h1-lg text-ink">{project.title}</h1>
          <p className="max-w-2xl text-h3 text-ink-muted">{project.tagline}</p>
        </div>

        <MediaSlot src={project.cover} alt={`Screenshot of ${project.title}`} aspect="16/9" />

        <p className="max-w-2xl text-body text-ink-muted">{project.summary}</p>

        <div className="grid gap-32 md:grid-cols-2">
          <div className="flex flex-col gap-12">
            <h2 className="text-mono-label font-mono uppercase tracking-wide text-ink-faint">Highlights</h2>
            <ul className="flex flex-col gap-8">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="text-body text-ink">
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-12">
            <h2 className="text-mono-label font-mono uppercase tracking-wide text-ink-faint">Stack</h2>
            <div className="flex flex-wrap gap-8">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-border bg-surface-raised px-12 py-4 font-mono text-mono-label text-ink-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {(project.repos.length > 0 || project.demo) && (
          <div className="flex flex-wrap gap-12">
            {project.repos.map((repo) => (
              <Link
                key={repo.url}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border px-16 py-8 text-body text-ink hover:border-border-strong"
              >
                {repo.label} →
              </Link>
            ))}
            {project.demo && project.demo !== 'REPLACE_ME' && (
              <Link
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-accent px-16 py-8 text-body text-paper hover:bg-accent-hover"
              >
                View demo →
              </Link>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
