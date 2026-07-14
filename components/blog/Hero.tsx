import { HeroSection } from '@/components/ui/HeroSection';
import { GlassButton } from '@/components/ui/GlassButton';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { NewspaperReader } from '@/components/illustrations/NewspaperReader';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <HeroSection scrollTo="posts" innerClassName="grid items-center gap-32 sm:gap-48 md:grid-cols-2 md:gap-48 lg:gap-64">
      {/* ── Left: Content ── */}
      <Reveal className="order-2 flex flex-col items-center text-center gap-24 md:order-1 md:items-start md:text-left">
        <SectionHeading
          as="h1"
          eyebrow="Writing"
          title="Blog & Logs"
          description="I write about building full-stack products, integrating intelligent AI agents, and lessons learned along the way. Hot off the press, straight to your screen."
        />
        
        <div className="flex flex-wrap justify-center gap-16 md:justify-start">
          <GlassButton href="/contact?utm_source=blog" variant="accent">
            <span className="relative font-medium">Want to discuss with me?</span>
            <ArrowRight size={18} className="relative transition-transform duration-300 group-hover:translate-x-3" />
          </GlassButton>
        </div>
      </Reveal>

      {/* ── Right: Illustration ── */}
      <div className="order-1 flex items-center justify-center md:order-2">
        <NewspaperReader />
      </div>
    </HeroSection>
  );
}
