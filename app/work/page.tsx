import type { Metadata } from 'next';
import { getProjects } from '@/lib/content';
import { BuildLogEntry } from '@/components/ui/BuildLogEntry';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Projects I have designed, built, and shipped — full-stack products and the AI systems inside them.',
};

export default function WorkPage() {
  const projects = getProjects();

  const grouped = new Map<string, typeof projects>();
  const standalone: typeof projects = [];

  for (const project of projects) {
    if (project.collection) {
      const existing = grouped.get(project.collection) ?? [];
      existing.push(project);
      grouped.set(project.collection, existing);
    } else {
      standalone.push(project);
    }
  }

  const renderedCollections = new Set<string>();

  return (
    <section className="mx-auto max-w-5xl px-16 py-64 md:px-24 md:py-96">
      <div className="flex flex-col gap-32">
        <SectionHeading
          eyebrow="Work"
          title="Everything I've shipped"
          description="Sorted by what I'd point you to first."
        />

        <div className="flex flex-col gap-32">
          {projects.map((project) => {
            if (project.collection) {
              if (renderedCollections.has(project.collection)) return null;
              renderedCollections.add(project.collection);
              const items = grouped.get(project.collection)!;
              return (
                <div key={project.collection} className="flex flex-col gap-16">
                  <h3 className="text-mono-label font-mono uppercase tracking-wide text-ink-faint">
                    {project.collection.replace(/-/g, ' ')}
                  </h3>
                  {items.map((p) => (
                    <BuildLogEntry
                      key={p.slug}
                      slug={p.slug}
                      href={`/work/${p.slug}`}
                      summary={`${p.title}: ${p.tagline}`}
                      status={p.status}
                      date={p.year}
                    />
                  ))}
                </div>
              );
            }

            return (
              <BuildLogEntry
                key={project.slug}
                slug={project.slug}
                href={`/work/${project.slug}`}
                summary={`${project.title}: ${project.tagline}`}
                status={project.status}
                date={project.year}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
