import { getSkills } from '@/lib/content/content';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { ContentSection } from '@/components/ui/ContentSection';
import Link from 'next/link';

export function Skills({ compact = false, tinted = false }: { compact?: boolean; tinted?: boolean }) {
  const { highlights } = getSkills();

  return (
    <ContentSection
      fullHeight
      padding="compact"
      tone={tinted ? 'surface' : 'none'}
      className={tinted ? 'border-t border-border/40' : ''}
    >
        <div className="flex flex-col gap-32">
          {!compact && (
            <Reveal className="text-center md:text-left">
              <SectionHeading eyebrow="Stack" title="What I build with" />
            </Reveal>
          )}
          <Reveal>
            <div className="flex flex-wrap justify-center gap-12 sm:gap-16 md:justify-start">
              {highlights.map((skill) => (
                <span
                  key={skill.label}
                  className={`rounded-full px-16 py-8 text-body font-medium text-ink shadow-neu-sm sm:px-24 sm:py-12 sm:text-h3 ${
                    tinted ? 'bg-paper' : 'bg-surface'
                  }`}
                >
                  {skill.label}
                </span>
              ))}
            </div>
          </Reveal>
          {!compact && (
            <Reveal className="flex justify-center md:justify-start w-full">
              <Link
                href="/skills-services"
                className={`inline-flex w-fit items-center rounded-full px-16 py-12 text-body text-accent shadow-neu-sm transition-shadow hover:shadow-neu-inset ${
                  tinted ? 'bg-paper' : 'bg-surface'
                }`}
              >
                Skills & services →
              </Link>
            </Reveal>
          )}
        </div>
    </ContentSection>
  );
}
