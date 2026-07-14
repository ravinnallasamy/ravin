import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectBySlug, getProjects } from '@/lib/content/content';
import { MediaSlot } from '@/components/ui/MediaSlot';
import { ImageCarousel } from '@/components/ui/ImageCarousel';
import { StatusPill } from '@/components/ui/StatusPill';
import { BackLink } from '@/components/ui/BackLink';
import { TrackedLink } from '@/components/analytics/TrackedLink';
import { projectJsonLd } from '@/lib/utils/seo';

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

// Prerender all known projects at build; only these slugs are served (unknown
// slugs 404 immediately). Revalidate hourly to pick up content edits.
export const dynamicParams = false;
export const revalidate = 3600;

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
    <article className="mx-auto max-w-5xl px-16 py-48 md:px-24 md:py-96">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd(project)) }}
      />
      <div className="flex flex-col gap-32">
        <div className="flex flex-col gap-16">
          <BackLink href="/work" label="All work" />
          <div className="flex flex-wrap items-center gap-12">
            <StatusPill status={project.status} />
            <span className="font-mono text-mono-label text-ink-faint">{project.year}</span>
          </div>
          <h1 className="text-h1 md:text-h1-lg text-ink">{project.title}</h1>
          <p className="max-w-2xl text-h3 text-ink-muted">{project.tagline}</p>
        </div>

        {(project.problem || project.solution) && (
          <div className="grid gap-32 md:grid-cols-2">
            {project.problem && (
              <div className="flex flex-col gap-12">
                <h2 className="text-mono-label font-mono uppercase tracking-wide text-ink-faint">Problem</h2>
                <p className="text-body text-ink-muted">{project.problem}</p>
              </div>
            )}
            {project.solution && (
              <div className="flex flex-col gap-12">
                <h2 className="text-mono-label font-mono uppercase tracking-wide text-ink-faint">Solution</h2>
                <p className="text-body text-ink-muted">{project.solution}</p>
              </div>
            )}
          </div>
        )}

        <div className="rounded-xl border border-white/40 bg-surface-raised/60 shadow-glass backdrop-blur-glass">
          {project.screenshots && project.screenshots.length > 0 ? (
            <ImageCarousel
              images={project.screenshots.map((src, index) => ({
                src,
                alt: `${project.title} — screenshot ${index + 1}`,
              }))}
              aspect="16/9"
              fit="contain"
              className="p-32"
            />
          ) : (
            <MediaSlot src={project.cover} alt={`Screenshot of ${project.title}`} aspect="16/9" fit="contain" className="p-32" />
          )}
        </div>

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
                  className="rounded-full border-none bg-surface px-12 py-4 font-mono text-mono-label text-ink-muted shadow-neu-sm"
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
              <TrackedLink
                key={repo.url}
                href={repo.url}
                eventLabel={`${project.title} — ${repo.label}`}
                location="project_detail_repo"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-none bg-surface px-16 py-8 text-body text-ink shadow-neu-sm transition-shadow hover:shadow-neu-inset"
              >
                {repo.label} →
              </TrackedLink>
            ))}
            {project.demo && project.demo !== 'REPLACE_ME' && (
              <TrackedLink
                href={project.demo}
                eventLabel={`${project.title} — demo`}
                location="project_detail_demo"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-accent px-16 py-8 text-body text-paper shadow-glass hover:bg-accent-hover"
              >
                View demo →
              </TrackedLink>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
