import Link from 'next/link';
import siteJson from '@/content/site.json';
import { Reveal } from '@/components/ui/Reveal';

export function ContactPanel() {
  return (
    <section className="mx-auto max-w-5xl px-16 py-48 md:px-24 md:py-80">
      <Reveal>
        <div className="flex flex-col items-start gap-16 rounded-xl border border-border bg-accent-subtle p-32 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-h2 text-ink">{siteJson.statusLine}</h2>
            <p className="mt-8 text-body text-ink-muted">Tell me what you&apos;re building and what&apos;s not working yet.</p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 rounded-full bg-accent px-24 py-12 text-body text-paper hover:bg-accent-hover"
          >
            Get in touch
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
