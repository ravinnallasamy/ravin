import Link from 'next/link';
import { getProjects } from '@/lib/content/content';
import { BuildLogEntry } from '@/components/ui/BuildLogEntry';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal, RevealList, RevealItem } from '@/components/ui/Reveal';
import { ContentSection } from '@/components/ui/ContentSection';

export function WorkPreview() {
  const topProjects = getProjects().slice(0, 3);

  return (
    <ContentSection tone="paper" fullHeight padding="compact" className="border-t border-border/40">
        <div className="flex flex-col gap-32">
          <Reveal className="text-center md:text-left">
            <SectionHeading
              eyebrow="Selected work"
              title="What I've shipped"
              description="A few of the products and systems I've built end to end."
            />
          </Reveal>

          <RevealList className="flex flex-col gap-16">
            {topProjects.map((project) => (
              <RevealItem key={project.slug}>
                <BuildLogEntry
                  slug={project.slug}
                  href={`/work/${project.slug}`}
                  summary={`${project.title}: ${project.tagline}`}
                  status={project.status}
                  date={project.year}
                />
              </RevealItem>
            ))}
          </RevealList>

          <div className="flex justify-center md:justify-start w-full">
            <Link
              href="/work"
              className="inline-flex w-fit items-center rounded-full bg-surface px-16 py-8 text-body text-accent shadow-neu-sm transition-shadow hover:shadow-neu-inset"
            >
              See all work →
            </Link>
          </div>
        </div>
    </ContentSection>
  );
}
