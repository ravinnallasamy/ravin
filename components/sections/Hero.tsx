import siteJson from '@/content/site.json';
import { getProjects } from '@/lib/content';
import { StatReadout } from '@/components/ui/StatReadout';

export function Hero() {
  const projects = getProjects();
  const shippedCount = projects.filter((p) => p.status === 'shipped').length;

  const badges = [
    siteJson.openToFreelance ? 'Open to freelance' : 'Not taking new work',
    siteJson.location,
    `${siteJson.experienceMonths} months building`,
  ];

  return (
    <section className="mx-auto max-w-5xl px-16 py-64 md:px-24 md:py-128">
      <div className="grid gap-48 md:grid-cols-2 md:items-center md:gap-64">
        <div className="flex flex-col gap-24">
          <div className="flex flex-col gap-8">
            <h1 className="text-h1 md:text-h1-lg text-ink">{siteJson.name}</h1>
            <p className="text-h3 text-ink-muted">{siteJson.role}</p>
          </div>
          <p className="max-w-md text-body text-ink-muted">{siteJson.mission}</p>
          <div className="flex flex-wrap gap-8">
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-border bg-surface-raised px-16 py-8 text-mono-label font-mono text-ink-muted"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <svg
            viewBox="0 0 200 200"
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-32 h-[220px] w-[220px] text-border-strong motion-reduce:hidden md:block"
          >
            <path
              d="M20 100 Q60 20 100 100 T180 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="320"
              className="hero-line-draw"
            />
          </svg>

          <div className="relative rounded-xl border border-border bg-surface p-24 shadow-sm md:p-32">
            <div className="grid grid-cols-2 gap-32">
              <StatReadout label="months building" value={String(siteJson.experienceMonths)} />
              <StatReadout label="projects shipped" value={String(shippedCount)} />
              <StatReadout label="problems solved" value={`${projects.length}+`} />
              <StatReadout label="status" value={siteJson.openToFreelance ? 'available' : 'booked'} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
