import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function PostCta({ slug }: { slug: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-b from-paper to-surface-raised p-32 md:p-48 shadow-skeu text-center flex flex-col items-center justify-center gap-20 mt-48">
      {/* Decorative background blurs */}
      <div className="pointer-events-none absolute -left-48 -top-48 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-48 -bottom-48 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />

      <h3
        className="text-h3 font-bold text-ink relative"
        style={{ textShadow: '0 1px 0 rgba(255,255,255,0.6)' }}
      >
        Want to discuss a project or build together?
      </h3>
      <p className="text-body text-ink-muted max-w-xl relative leading-relaxed">
        I design full-stack systems and integrate intelligent semantic AI modules. If you need a partner to take your ideas from concept to a production-ready scaled release, let&apos;s talk shop.
      </p>

      <div className="relative mt-8">
        <Link
          href={`/contact?utm_source=blog:${slug}`}
          className="group relative isolate flex items-center gap-8 overflow-hidden rounded-2xl border border-white/50 bg-gradient-to-b from-accent to-accent-hover px-24 py-14 text-body text-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_4px_rgba(30,42,58,0.2),0_8px_24px_rgba(150,113,79,0.35)] backdrop-blur-glass transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-2px_4px_rgba(30,42,58,0.22),0_12px_32px_rgba(150,113,79,0.45)] active:translate-y-0 active:shadow-[inset_0_2px_6px_rgba(30,42,58,0.3)] cursor-pointer"
        >
          <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/25 via-transparent to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="relative font-semibold">Let&apos;s connect</span>
          <ArrowRight size={18} className="relative transition-transform duration-300 group-hover:translate-x-4" />
        </Link>
      </div>
    </div>
  );
}
