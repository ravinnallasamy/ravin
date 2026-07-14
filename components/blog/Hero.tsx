import Link from 'next/link';
import { HeroSection } from '@/components/ui/HeroSection';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { NewspaperReader } from '@/components/illustrations/NewspaperReader';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <HeroSection scrollTo="posts" innerClassName="grid items-center gap-48 md:grid-cols-2 md:gap-64">
      {/* ── Left: Content ── */}
      <Reveal className="order-2 flex flex-col items-start gap-24 md:order-1">
        <SectionHeading
          as="h1"
          eyebrow="Writing"
          title="Blog & Logs"
          description="I write about building full-stack products, integrating intelligent AI agents, and lessons learned along the way. Hot off the press, straight to your screen."
        />
        
        <div className="flex flex-wrap gap-16">
          <Link
            href="/contact?utm_source=blog"
            className="group relative isolate flex items-center gap-8 overflow-hidden rounded-2xl border border-white/50 bg-gradient-to-b from-accent to-accent-hover px-20 py-12 text-body text-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_4px_rgba(30,42,58,0.2),0_8px_24px_rgba(150,113,79,0.35)] backdrop-blur-glass transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-2px_4px_rgba(30,42,58,0.22),0_12px_32px_rgba(150,113,79,0.45)] active:translate-y-0 active:shadow-[inset_0_2px_6px_rgba(30,42,58,0.3)] cursor-pointer"
          >
            <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/25 via-transparent to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative font-medium">Want to discuss with me?</span>
            <ArrowRight size={18} className="relative transition-transform duration-300 group-hover:translate-x-3" />
          </Link>
        </div>
      </Reveal>

      {/* ── Right: Illustration ── */}
      <div className="order-1 flex items-center justify-center md:order-2">
        <NewspaperReader />
      </div>
    </HeroSection>
  );
}
