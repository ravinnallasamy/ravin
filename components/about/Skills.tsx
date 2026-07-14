import { getSkills } from '@/lib/content';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import Link from 'next/link';

export function Skills({ compact = false, tinted = false }: { compact?: boolean; tinted?: boolean }) {
  const { highlights } = getSkills();

  return (
    <section className={`flex min-h-screen flex-col justify-center md:min-h-[100svh] ${
      tinted ? 'bg-surface border-t border-border/40' : ''
    }`}>
      <div className="mx-auto w-full max-w-5xl px-16 py-48 md:px-24 md:py-64">
        <div className="flex flex-col gap-32">
          {!compact && (
            <Reveal>
              <SectionHeading eyebrow="Stack" title="What I build with" />
            </Reveal>
          )}
          <Reveal>
            <div className="flex flex-wrap gap-16">
              {highlights.map((skill) => (
                <span
                  key={skill.label}
                  className={`rounded-full px-24 py-12 text-h3 font-medium text-ink shadow-neu-sm ${
                    tinted ? 'bg-paper' : 'bg-surface'
                  }`}
                >
                  {skill.label}
                </span>
              ))}
            </div>
          </Reveal>
          {!compact && (
            <Reveal>
              <Link
                href="/skills-services"
                className={`inline-flex w-fit items-center rounded-full px-16 py-8 text-body text-accent shadow-neu-sm transition-shadow hover:shadow-neu-inset ${
                  tinted ? 'bg-paper' : 'bg-surface'
                }`}
              >
                Skills & services →
              </Link>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
