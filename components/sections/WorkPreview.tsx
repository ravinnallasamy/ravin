import Link from 'next/link';
import { getProjects } from '@/lib/content';
import { BuildLogEntry } from '@/components/ui/BuildLogEntry';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal, RevealList, RevealItem } from '@/components/ui/Reveal';

export function WorkPreview() {
  const topProjects = getProjects().slice(0, 3);

  return (
    <section className="mx-auto max-w-5xl px-16 py-64 md:px-24 md:py-96">
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

        <Link href="/work" className="text-body text-accent hover:text-accent-hover">
          See all work →
        </Link>
      </div>
    </section>
  );
}
