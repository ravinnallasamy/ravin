import { getAllPosts } from '@/lib/blog';
import { BuildLogEntry } from '@/components/ui/BuildLogEntry';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal, RevealList, RevealItem } from '@/components/ui/Reveal';

export function Posts() {
  const posts = getAllPosts();

  return (
    <section id="posts">
      <div className="mx-auto max-w-5xl px-16 py-48 md:px-24 md:py-96">
        <div className="flex flex-col gap-32">
          <Reveal>
            <SectionHeading eyebrow="Writing" title="Posts" />
          </Reveal>
          <RevealList className="flex flex-col gap-16">
            {posts.map((post) => (
              <RevealItem key={post.slug}>
                <BuildLogEntry slug={post.slug} href={`/blog/${post.slug}`} summary={post.title} date={post.date}>
                  <p className="text-body text-ink-muted">{post.summary}</p>
                </BuildLogEntry>
              </RevealItem>
            ))}
          </RevealList>
        </div>
      </div>
    </section>
  );
}
