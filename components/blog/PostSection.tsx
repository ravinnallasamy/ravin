import { PostContent } from '@/components/blog/PostContent';
import type { Section } from '@/lib/blog';

export function PostSection({ section }: { section: Section }) {
  return (
    <section className="relative rounded-2xl border border-border/60 bg-gradient-to-b from-paper to-surface p-24 shadow-skeu-sm md:p-32">
      <h2
        className="text-h2 text-ink font-bold tracking-tight mb-20"
        style={{ textShadow: '0 1px 0 rgba(255,255,255,0.6)' }}
      >
        {section.title}
      </h2>
      <div className="flex flex-col gap-12 text-body leading-relaxed text-ink [&_a]:text-accent [&_a]:underline">
        <PostContent content={section.blocks} />
      </div>
    </section>
  );
}
