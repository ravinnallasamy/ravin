import { ArrowRight } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';

export function PostCta({ slug }: { slug: string }) {
  return (
    <section className="relative overflow-hidden border-t border-border/50 bg-gradient-to-b from-surface-raised to-paper">
      {/* Decorative background blurs */}
      <div className="pointer-events-none absolute -left-96 top-0 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-96 bottom-0 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />

      <div className="mx-auto w-full max-w-3xl px-16 py-64 sm:px-20 md:px-24 md:py-96 flex flex-col items-center text-center gap-20">
        <h2
          className="text-h2 sm:text-h2-lg font-bold text-ink relative tracking-tight"
          style={{ textShadow: '0 1px 0 rgba(255,255,255,0.6)' }}
        >
          Want to discuss a project or build together?
        </h2>
        <p className="text-h3 text-ink-muted max-w-xl relative leading-relaxed">
          I design full-stack systems and integrate intelligent semantic AI modules. If you need a partner to take your ideas from concept to a production-ready scaled release, let&apos;s talk shop.
        </p>

        <div className="relative mt-12">
          <GlassButton href={`/contact?utm_source=blog:${slug}`} variant="accent" size="md">
            <span className="relative font-semibold">Let&apos;s connect</span>
            <ArrowRight size={16} className="relative transition-transform duration-300 group-hover:translate-x-4" />
          </GlassButton>
        </div>
      </div>
    </section>
  );
}
