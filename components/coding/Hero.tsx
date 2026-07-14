import { HeroSection } from '@/components/ui/HeroSection';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { BuildingSite } from '@/components/illustrations/BuildingSite';
import { GlassButton } from '@/components/ui/GlassButton';
import { Github, Code2 } from 'lucide-react';

export function Hero() {
  return (
    <HeroSection scrollTo="github-dashboard" innerClassName="grid items-center gap-32 sm:gap-48 md:grid-cols-2 md:gap-48 lg:gap-64">
      {/* ── Left: content ── */}
      <Reveal className="order-2 flex flex-col items-center text-center gap-24 md:order-1 md:items-start md:text-left">
        <SectionHeading as="h1" eyebrow="Coding" title="GitHub & LeetCode activity" />

        <div className="flex flex-wrap justify-center gap-16 md:justify-start">
          <GlassButton href="#github-dashboard" variant="light">
            <Github size={18} className="relative" />
            <span className="relative font-medium">GitHub Dashboard</span>
          </GlassButton>

          <GlassButton href="#leetcode-dashboard" variant="accent">
            <Code2 size={18} className="relative" />
            <span className="relative font-medium">LeetCode Dashboard</span>
          </GlassButton>
        </div>
      </Reveal>

      {/* ── Right: illustration ── */}
      <div className="order-1 flex items-center justify-center md:order-2">
        <BuildingSite />
      </div>
    </HeroSection>
  );
}
