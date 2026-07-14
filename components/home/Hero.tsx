import siteJson from '@/content/site.json';
import { getProjects } from '@/lib/content';
import { HeroSection } from '@/components/ui/HeroSection';
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
    <HeroSection
      gradient
      centered
      padding="flat"
      scrollTo="about"
      scrollOffsetClassName="-translate-x-[calc(50%+100px)]"
      innerClassName="grid gap-48 md:grid-cols-2 md:items-center md:gap-64"
    >
        {/* ── Left: illustration & CTA ── */}
        <div className="flex flex-col items-center justify-center gap-24 text-center">
          <WelcomeChef />
          <div className="flex flex-col items-center gap-12">
            <p className="text-body font-medium text-ink-muted">Want to meet me? Or want to hire me?</p>
            <ContactCtaButton />
          </div>
        </div>

        {/* ── Right: content ── */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-mono-label uppercase tracking-wide text-ink-faint">
              {siteJson.statusLine}
            </span>
            <h1 className="text-h1 md:text-h1-lg text-ink" style={{ textShadow: '0 1px 0 rgba(255,255,255,0.6)' }}>
              {siteJson.name}
            </h1>
            <p className="text-h3 text-ink-muted">{siteJson.role}</p>
          </div>
          <p className="max-w-md text-body text-ink-muted">
            {siteJson.mission} {shippedCount} live builds so far, and counting — real products, real users.
          </p>
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

    </HeroSection>
  );
}
