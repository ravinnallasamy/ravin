import { HeroSection } from '@/components/ui/HeroSection';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { SkillsOrbit } from '@/components/illustrations/SkillsOrbit';
import { ContactCtaButton } from '@/components/ui/ContactCtaButton';

export function Hero() {
  return (
    <HeroSection scrollTo="services" innerClassName="grid items-center gap-32 sm:gap-48 md:grid-cols-2 md:gap-48 lg:gap-64">
      {/* ── Left: content ── */}
      <Reveal className="order-2 flex flex-col items-center gap-24 text-center md:order-1 md:items-start md:text-left">
        <SectionHeading
          as="h1"
          eyebrow="Expertise"
          title="Skills & Services"
          description="I build full-stack products and the intelligent AI systems inside them. From concept to implementation, I design systems that ship and scale."
        />
        <ContactCtaButton />
      </Reveal>

      {/* ── Right: illustration ── */}
      <div className="order-1 flex items-center justify-center md:order-2">
        <SkillsOrbit />
      </div>
    </HeroSection>
  );
}
