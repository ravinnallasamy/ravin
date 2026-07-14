import { getAllPosts } from '@/lib/content/blog';
import { BuildLogEntry } from '@/components/ui/BuildLogEntry';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal, RevealList, RevealItem } from '@/components/ui/Reveal';
import { ContentSection } from '@/components/ui/ContentSection';

export function Posts() {
  const posts = getAllPosts();

  return (
    <ContentSection id="posts">
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
    </ContentSection>
  );
}
