import Link from 'next/link';
import { ArrowRight, Briefcase, FileDown, Mail, Sparkles } from 'lucide-react';
import { Reveal, RevealList, RevealItem } from '@/components/ui/Reveal';

export function ContactPanel() {
  return (
    <section
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-16 py-48 sm:px-20 md:px-24 md:py-64"
      style={{ background: 'linear-gradient(135deg, #1E2A3A 0%, #223247 55%, #16202D 100%)' }}
    >
      {/* decorative warm glow blobs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-accent/30 blur-3xl md:h-[26rem] md:w-[26rem]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-[#DCC9A8]/20 blur-3xl md:h-[32rem] md:w-[32rem]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),transparent_60%)]" />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-32">
        <Reveal>
          <div className="flex flex-col items-center gap-12 text-center">
            <span className="inline-flex items-center gap-8 rounded-full border border-accent/40 bg-accent/10 px-16 py-6 font-mono text-mono-label uppercase tracking-wide text-[#E8CFA8]">
              <Sparkles size={13} />
              Let&apos;s work together
            </span>
            <h2 className="max-w-2xl text-h2 md:text-h2-lg text-paper">
              Got an idea worth building? <span className="text-[#E8CFA8]">Let&apos;s make it real.</span>
            </h2>
            <p className="max-w-lg text-body text-paper/70">
              Whether you&apos;re hiring or building — I&apos;m one message away from turning it into something shipped.
            </p>
          </div>
        </Reveal>

        <RevealList className="grid gap-24 md:grid-cols-2">
          <RevealItem>
            <div className="group relative flex h-full flex-col gap-20 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-24 shadow-glass sm:p-32 backdrop-blur-glass transition-all hover:border-accent/40 hover:bg-white/[0.09]">
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/20 blur-2xl transition-opacity group-hover:opacity-100" />
              <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-accent/20 text-[#E8CFA8]">
                <Briefcase size={22} />
              </div>
              <div className="flex flex-col gap-8">
                <h3 className="text-h3 font-display font-semibold text-paper">For freelance & project work</h3>
                <p className="text-body text-paper/70">
                  Need a full-stack build, an AI integration, or a workflow automated end-to-end? Tell me what you&apos;re building and what&apos;s not working yet.
                </p>
              </div>
              <Link
                href="/contact?utm_source=home"
                className="mt-auto inline-flex w-fit items-center gap-8 rounded-full bg-accent px-24 py-12 text-body font-medium text-paper shadow-md transition-all hover:bg-accent-hover hover:shadow-lg"
              >
                <Mail size={16} />
                Start a project
              </Link>
            </div>
          </RevealItem>

          <RevealItem>
            <div className="group relative flex h-full flex-col gap-20 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-24 shadow-glass sm:p-32 backdrop-blur-glass transition-all hover:border-accent/40 hover:bg-white/[0.09]">
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/20 blur-2xl transition-opacity group-hover:opacity-100" />
              <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-accent/20 text-[#E8CFA8]">
                <FileDown size={22} />
              </div>
              <div className="flex flex-col gap-8">
                <h3 className="text-h3 font-display font-semibold text-paper">For recruiters & hiring teams</h3>
                <p className="text-body text-paper/70">
                  Evaluating me for a full-stack or AI engineering role? Grab my résumé for the full breakdown of experience, stack, and shipped work.
                </p>
              </div>
              <div className="mt-auto flex flex-wrap gap-12">
                <a
                  href="/resume/Ravin-resume.pdf"
                  download
                  className="inline-flex w-fit items-center gap-8 rounded-full bg-accent px-24 py-12 text-body font-medium text-paper shadow-md transition-all hover:bg-accent-hover hover:shadow-lg"
                >
                  <FileDown size={16} />
                  Download résumé
                </a>
                <Link
                  href="/contact?utm_source=home"
                  className="inline-flex w-fit items-center gap-8 rounded-full border border-white/25 px-24 py-12 text-body text-paper transition-colors hover:border-white/40 hover:bg-white/10"
                >
                  Contact me
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </RevealItem>
        </RevealList>
      </div>
    </section>
  );
}
