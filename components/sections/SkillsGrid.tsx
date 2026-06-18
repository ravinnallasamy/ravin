import { getSkills } from '@/lib/content';
import { SectionHeading } from '@/components/ui/SectionHeading';

const CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  ai: 'AI & ML',
  automation: 'Automation',
};

export function SkillsGrid({ compact = false }: { compact?: boolean }) {
  const skills = getSkills();
  const categories = Object.entries(skills) as [keyof typeof skills, string[]][];

  return (
    <section className="mx-auto max-w-5xl px-16 py-64 md:px-24 md:py-96">
      <div className="flex flex-col gap-32">
        {!compact && <SectionHeading eyebrow="Stack" title="What I build with" />}
        <div className="grid gap-24 md:grid-cols-2">
          {categories.map(([key, tools]) => (
            <div key={key} className="flex flex-col gap-12 rounded bg-surface-raised p-24">
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
      </div>
    </section>
  );
}
