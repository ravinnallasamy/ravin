import { getSkills } from '@/lib/content';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import Link from 'next/link';

const CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  ai: 'AI & ML',
  automation: 'Automation',
};

export function Skills({ compact = false, tinted = false }: { compact?: boolean; tinted?: boolean }) {
  const skills = getSkills();
  const categories = Object.entries(skills) as [keyof typeof skills, string[]][];

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
            <div className="grid gap-24 md:grid-cols-2">
              {categories.map(([key, tools]) => (
                <div
                  key={key}
                  className={`flex flex-col gap-12 rounded-2xl p-24 shadow-neu ${
                    tinted ? 'bg-paper' : 'bg-surface'
                  }`}
                >
                  <span className="text-mono-label font-mono uppercase tracking-wide text-ink-faint">
                    {CATEGORY_LABELS[key] ?? key}
                  </span>
                  <div className="flex flex-wrap gap-8">
                    {tools.map((tool) => (
                      <span
                        key={tool}
                        className={`rounded-full px-12 py-4 text-mono-label font-mono text-ink-muted shadow-neu-sm ${
                          tinted ? 'bg-surface' : 'bg-paper'
                        }`}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
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
