import { PostContent } from '@/components/blog/PostContent';
import type { Section } from '@/lib/content/blog';

export function PostSection({ section }: { section: Section }) {
  return (
    <section className="scroll-mt-96">
      <h2
        className="text-h2 sm:text-h2-lg text-ink font-bold tracking-tight mb-24"
        style={{ textShadow: '0 1px 0 rgba(255,255,255,0.6)' }}
      >
        {section.title}
      </h2>
      <div className="flex flex-col gap-16 text-body leading-relaxed text-ink [&_a]:text-accent [&_a]:underline">
        <PostContent content={section.blocks} />
      </div>
    </section>
  );
}
