import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { BuildingSite } from '@/components/illustrations/BuildingSite';
import { getSocial } from '@/lib/content';
import { Github, Code2 } from 'lucide-react';

export function Hero() {
  const social = getSocial();

  return (
    <section className="mx-auto grid min-h-[calc(100svh-64px)] max-w-5xl items-center gap-48 px-16 py-48 md:grid-cols-2 md:gap-64 md:px-24 md:py-96">
      {/* ── Left: content ── */}
      <Reveal className="order-2 flex flex-col gap-24 md:order-1">
        <SectionHeading as="h1" eyebrow="Coding" title="GitHub & LeetCode activity" />

        <div className="flex flex-wrap gap-16">
          <a
            href={social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative isolate flex items-center gap-8 overflow-hidden rounded-2xl border border-white/50 bg-white/30 px-20 py-12 text-body text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_2px_rgba(30,42,58,0.08),0_8px_24px_rgba(30,42,58,0.12)] backdrop-blur-glass transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_2px_rgba(30,42,58,0.1),0_12px_32px_rgba(30,42,58,0.18)] active:translate-y-0 active:shadow-[inset_0_2px_4px_rgba(30,42,58,0.15)]"
          >
            <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/40 via-transparent to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
            <Github size={18} className="relative" />
            <span className="relative font-medium">GitHub</span>
          </a>

          <a
            href={social.leetcodeUsername}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative isolate flex items-center gap-8 overflow-hidden rounded-2xl border border-white/50 bg-gradient-to-b from-accent to-accent-hover px-20 py-12 text-body text-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_4px_rgba(30,42,58,0.2),0_8px_24px_rgba(150,113,79,0.35)] backdrop-blur-glass transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-2px_4px_rgba(30,42,58,0.22),0_12px_32px_rgba(150,113,79,0.45)] active:translate-y-0 active:shadow-[inset_0_2px_6px_rgba(30,42,58,0.3)]"
          >
            <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/25 via-transparent to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
            <Code2 size={18} className="relative" />
            <span className="relative font-medium">LeetCode</span>
          </a>
        </div>
      </Reveal>

      {/* ── Right: illustration ── */}
      <div className="order-1 flex items-center justify-center md:order-2">
        <BuildingSite />
      </div>
    </section>
  );
}
