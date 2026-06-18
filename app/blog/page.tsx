import type { Metadata } from 'next';
import Link from 'next/link';
import { getTechDigest } from '@/lib/blog';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BlogPreview } from '@/components/sections/BlogPreview';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Writing on what I build, plus a running tech digest.',
};

export default function BlogPage() {
  const digest = getTechDigest();

  return (
    <div className="flex flex-col">
      <section className="mx-auto max-w-5xl px-16 py-64 md:px-24 md:py-96">
        <div className="flex flex-col gap-32">
          <SectionHeading eyebrow="Writing" title="Posts" />
          <BlogPreview />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-16 py-64 md:px-24 md:py-96">
        <div className="flex flex-col gap-32">
          <SectionHeading eyebrow="Reading" title="Tech digest" />
          {digest.length > 0 ? (
            <ul className="flex flex-col gap-12">
              {digest.map((item) => (
                <li key={item.url} className="border border-border bg-paper p-16">
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
            <p className="border border-border bg-surface-raised p-24 font-mono text-mono-label text-ink-faint">
              Tech digest coming soon.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
