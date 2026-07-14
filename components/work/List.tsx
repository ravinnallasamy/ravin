import { getProjects } from '@/lib/content/content';
import { BuildLogEntry } from '@/components/ui/BuildLogEntry';
import { RevealList, RevealItem } from '@/components/ui/Reveal';
import { ContentSection } from '@/components/ui/ContentSection';

export function List() {
  const projects = getProjects();

  const grouped = new Map<string, typeof projects>();

  for (const project of projects) {
    if (project.collection) {
      const existing = grouped.get(project.collection) ?? [];
      existing.push(project);
      grouped.set(project.collection, existing);
    }
  }

  const renderedCollections = new Set<string>();

  return (
    <ContentSection id="projects" tone="surface" className="scroll-mt-24">
        <RevealList className="flex flex-col gap-32">
          {projects.map((project) => {
            if (project.collection) {
              if (renderedCollections.has(project.collection)) return null;
              renderedCollections.add(project.collection);
              const items = grouped.get(project.collection)!;
              return (
                <RevealItem key={project.collection} className="flex flex-col gap-16">
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
                </RevealItem>
              );
            }

            return (
              <RevealItem key={project.slug}>
                <BuildLogEntry
                  slug={project.slug}
                  href={`/work/${project.slug}`}
                  summary={`${project.title}: ${project.tagline}`}
                  status={project.status}
                  date={project.year}
                />
              </RevealItem>
            );
          })}
        </RevealList>
    </ContentSection>
  );
}
