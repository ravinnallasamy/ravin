import Link from 'next/link';
import siteJson from '@/content/site.json';
import { Reveal } from '@/components/ui/Reveal';

export function ContactPanel() {
  return (
    <section
      className="relative overflow-hidden px-16 py-48 md:py-96"
      style={{ background: 'linear-gradient(135deg, #DCC9A8 0%, #B08968 50%, #8C6A4A 100%)' }}
    >
      {/* decorative blurred blobs for glass depth */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-white/30 blur-2xl md:h-96 md:w-96" />
      <div className="pointer-events-none absolute -bottom-32 right-16 h-96 w-96 rounded-full bg-white/20 blur-2xl md:h-128 md:w-128" />

      <div className="relative mx-auto max-w-5xl">
        <Reveal>
          <div className="flex flex-col items-start gap-16 rounded-2xl border border-white/40 bg-white/20 p-32 shadow-glass backdrop-blur-glass md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-h2 text-ink drop-shadow-sm">{siteJson.statusLine}</h2>
              <p className="mt-8 text-body text-ink/80">Tell me what you&apos;re building and what&apos;s not working yet.</p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 rounded-full border border-white/40 bg-white/40 px-24 py-12 text-body text-ink backdrop-blur-glass transition-colors hover:bg-white/60"
            >
              Get in touch
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
