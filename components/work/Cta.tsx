import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';

export function Cta() {
  return (
    <section className="bg-paper border-t border-border/50">
      <div className="mx-auto max-w-5xl px-16 py-64 text-center md:px-24 md:py-96">
        <Reveal className="flex flex-col items-center gap-24">
          <h2 className="text-h2 md:text-h2-lg text-ink font-display">Liked what you saw?</h2>
          <p className="max-w-md text-body text-ink-muted">
            There&apos;s more where that came from. Let&apos;s build your next project together.
          </p>
          <Link
            href="/contact?utm_source=work"
            className="group relative inline-flex overflow-hidden rounded-full bg-accent px-24 py-12 text-body text-paper transition-all hover:bg-accent-hover"
          >
            <span className="relative font-medium">Get in touch →</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
