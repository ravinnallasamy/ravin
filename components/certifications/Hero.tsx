import { HeroSection } from '@/components/ui/HeroSection';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';

export function Hero() {
  return (
    <HeroSection>
      <Reveal>
        <SectionHeading as="h1" eyebrow="Credentials" title="Certifications" />
      </Reveal>
    </HeroSection>
  );
}
