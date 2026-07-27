import siteJson from '@/content/site.json';
import { getProjects } from '@/lib/content/content';
import { HeroSection } from '@/components/ui/HeroSection';
import { StatReadout } from '@/components/ui/StatReadout';
import { WelcomeChef } from '@/components/illustrations/WelcomeChef';
import { ContactCtaButton } from '@/components/ui/ContactCtaButton';

export function Hero() {
  const projects = getProjects();
  const shippedCount = projects.filter((p) => p.status === 'shipped').length;

  return (
    <HeroSection
      gradient
      centered
      padding="flat"
      scrollTo="about"
      innerClassName="grid gap-32 sm:gap-48 md:grid-cols-2 md:items-center md:gap-48 lg:gap-64"
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
        <div className="flex flex-col items-center gap-24 text-center md:items-start md:text-left">
          {/* Name & role */}
          <div className="flex flex-col gap-8">
            <span className="font-mono text-mono-label uppercase text-ink-faint">
              {siteJson.statusLine}
            </span>
            <h1 className="text-h1 sm:text-h1-md lg:text-h1-lg text-ink" style={{ textShadow: '0 1px 0 rgba(255,255,255,0.6)' }}>
              {siteJson.name}
            </h1>
            <p className="text-h3 sm:text-h3-lg text-ink-muted">{siteJson.role}</p>
          </div>

          {/* Mission */}
          <p className="max-w-lg text-body leading-relaxed text-ink-muted">
            {siteJson.mission} {shippedCount} live builds so far, and counting — real products, real users.
          </p>

          {/* Stats card */}
          <div className="relative w-full rounded-2xl border border-border/60 bg-gradient-to-b from-paper to-surface p-20 shadow-skeu sm:p-24 md:p-32">
            <div className="grid grid-cols-2 gap-x-24 gap-y-20 sm:gap-32">
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
