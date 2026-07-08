import Link from 'next/link';
import { getProjects } from '@/lib/content';
import { BuildLogEntry } from '@/components/ui/BuildLogEntry';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal, RevealList, RevealItem } from '@/components/ui/Reveal';

export function WorkPreview() {
  const topProjects = getProjects().slice(0, 3);

  return (
    <section className="flex min-h-screen flex-col justify-center bg-paper border-t border-border/40 md:min-h-[100svh]">
      <div className="mx-auto w-full max-w-5xl px-16 py-48 md:px-24 md:py-64">
        <div className="flex flex-col gap-32">
          <Reveal>
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

          <Link
            href="/work"
            className="inline-flex w-fit items-center rounded-full bg-surface px-16 py-8 text-body text-accent shadow-neu-sm transition-shadow hover:shadow-neu-inset"
          >
            See all work →
          </Link>
        </div>
      </div>
    </section>
  );
}
