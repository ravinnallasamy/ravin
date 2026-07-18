import { getExperience, getEducation, getCertifications, getSite } from '@/lib/content/content';
import { HeroSection } from '@/components/ui/HeroSection';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { StatReadout } from '@/components/ui/StatReadout';
import { ContactCtaButton } from '@/components/ui/ContactCtaButton';
import { TeddyPeek } from '@/components/experience-education/teddy/TeddyPeek';

export function Hero() {
  const experiences = getExperience();
  const educations = getEducation();
  const certifications = getCertifications();
  const currentRole = experiences.find((exp) => exp.current);
  const internships = experiences.filter((exp) => !exp.current).length;
  const degrees = educations.filter((edu) => edu.level !== 'schooling').length;
  const firstName = getSite().name.split(' ')[0];

  return (
    <HeroSection
      gradient
      centered
      padding="flat"
      scrollTo="experience"
      className="overflow-hidden"
      innerClassName="grid gap-32 sm:gap-48 md:grid-cols-2 md:items-center md:gap-48 lg:gap-64"
    >
        {/* ── Left: content ── */}
        <Reveal className="flex flex-col items-center gap-24 text-center md:items-start md:text-left">
          <SectionHeading
            as="h1"
            eyebrow="Journey"
            title="Experience & Education"
            description="A timeline of my professional work, academic background, and industry credentials."
          />
          <ContactCtaButton />
        </Reveal>

        {/* ── Right: stat readout panel, with teddy peeking over the top edge ── */}
        <Reveal className="relative mt-72 md:mt-0 rounded-2xl border border-border/60 bg-gradient-to-b from-paper to-surface p-20 shadow-skeu sm:p-24 md:p-32">
          <TeddyPeek name={firstName} />

          {currentRole && (
            <div className="mb-24 flex items-center gap-8 border-b border-border/40 pb-24">
              <span className="h-8 w-8 shrink-0 rounded-full bg-accent animate-pulse" />
              <div className="flex flex-col">
                <span className="font-mono text-mono-label uppercase tracking-wide text-ink-faint">
                  Currently
                </span>
                <span className="font-display text-body font-semibold text-ink">{currentRole.role}</span>
                <span className="text-body text-ink-muted">{currentRole.company}</span>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-x-24 gap-y-20 sm:gap-32">
            <StatReadout label="internships" value={String(internships)} />
            <StatReadout label="degrees" value={String(degrees)} />
            <StatReadout label="certifications" value={String(certifications.length)} />
            <StatReadout label="status" value={currentRole ? 'employed' : 'available'} />
          </div>
        </Reveal>
    </HeroSection>
  );
}
