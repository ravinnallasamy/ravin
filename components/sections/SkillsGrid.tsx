import { getSkills } from '@/lib/content';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';

const CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  ai: 'AI & ML',
  automation: 'Automation',
};

export function SkillsGrid({ compact = false, tinted = false }: { compact?: boolean; tinted?: boolean }) {
  const skills = getSkills();
  const categories = Object.entries(skills) as [keyof typeof skills, string[]][];

  return (
    <section className={tinted ? 'bg-surface' : undefined}>
      <div className="mx-auto max-w-5xl px-16 py-48 md:px-24 md:py-80">
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
                  className={`flex flex-col gap-12 rounded-xl p-24 shadow-sm ${tinted ? 'border border-border bg-paper' : 'bg-surface-raised'}`}
                >
                  <span className="text-mono-label font-mono uppercase tracking-wide text-ink-faint">
                    {CATEGORY_LABELS[key] ?? key}
                  </span>
                  <div className="flex flex-wrap gap-8">
                    {tools.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-full border border-border bg-paper px-12 py-4 text-mono-label font-mono text-ink-muted"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
