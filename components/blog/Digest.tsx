import Link from 'next/link';
import { getTechDigest } from '@/lib/blog';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function Digest() {
  const digest = getTechDigest();

  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-5xl px-16 py-48 md:px-24 md:py-96">
        <div className="flex flex-col gap-32">
          <SectionHeading eyebrow="Reading" title="Tech digest" />
          {digest.length > 0 ? (
            <ul className="flex flex-col gap-12">
              {digest.map((item) => (
                <li key={item.url} className="rounded-xl border-none bg-paper p-16 shadow-neu-sm">
                  <Link href={item.url} target="_blank" rel="noopener noreferrer" className="text-body text-ink hover:text-accent">
                    {item.title}
                  </Link>
                  <p className="mt-4 font-mono text-mono-label text-ink-faint">
                    {item.source} · {item.date}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-xl border-none bg-paper p-24 font-mono text-mono-label text-ink-faint shadow-neu-sm">
              Tech digest coming soon.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
