import siteJson from '@/content/site.json';
import { getProjects } from '@/lib/content';
import { StatReadout } from '@/components/ui/StatReadout';
import { WelcomeChef } from '@/components/illustrations/WelcomeChef';
import { ContactCtaButton } from '@/components/ui/ContactCtaButton';

export function Hero() {
  const projects = getProjects();
  const shippedCount = projects.filter((p) => p.status === 'shipped').length;

  const badges = [
    siteJson.openToFreelance ? 'Open to freelance' : 'Not taking new work',
    siteJson.location,
    `${siteJson.experienceMonths} months building`,
  ];

  return (
    <section
      className="flex min-h-[calc(100svh-64px)] items-center"
      style={{ background: 'linear-gradient(180deg, #FBF8F3 0%, #F3EEE6 55%, #ECE4D8 100%)' }}
    >
      <div className="mx-auto grid w-full max-w-5xl gap-48 px-16 py-64 md:grid-cols-2 md:items-center md:gap-64 md:px-24">

        {/* ── Left: illustration & CTA ── */}
        <div className="flex flex-col items-center justify-center gap-24 text-center">
          <WelcomeChef />
          <div className="flex flex-col items-center gap-12">
            <p className="text-body font-medium text-ink-muted">Want to meet me? Or want to hire me?</p>
            <ContactCtaButton />
          </div>
        </div>

        {/* ── Right: content ── */}
        <div className="flex flex-col gap-24">
          <div className="flex flex-col gap-8">
            <h1 className="text-h1 md:text-h1-lg text-ink" style={{ textShadow: '0 1px 0 rgba(255,255,255,0.6)' }}>
              {siteJson.name}
            </h1>
            <p className="text-h3 text-ink-muted">{siteJson.role}</p>
          </div>
          <p className="max-w-md text-body text-ink-muted">{siteJson.mission}</p>
          <div className="flex flex-wrap gap-8">
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-border/70 bg-gradient-to-b from-paper to-surface-raised px-16 py-8 text-mono-label font-mono text-ink-muted shadow-skeu-sm"
              >
                {badge}
              </span>
            ))}
          </div>

          <div className="relative rounded-2xl border border-border/60 bg-gradient-to-b from-paper to-surface p-24 shadow-skeu md:p-32">
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
