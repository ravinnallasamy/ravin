import { getAllPosts } from '@/lib/blog';
import { BuildLogEntry } from '@/components/ui/BuildLogEntry';
import { RevealList, RevealItem } from '@/components/ui/Reveal';

export function BlogPreview() {
  const posts = getAllPosts();

  return (
    <RevealList className="flex flex-col gap-16">
      {posts.map((post) => (
        <RevealItem key={post.slug}>
          <BuildLogEntry slug={post.slug} href={`/blog/${post.slug}`} summary={post.title} date={post.date}>
            <p className="text-body text-ink-muted">{post.summary}</p>
          </BuildLogEntry>
        </RevealItem>
      ))}
    </RevealList>
  );
}
