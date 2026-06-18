import { getAllPosts } from '@/lib/blog';
import { BuildLogEntry } from '@/components/ui/BuildLogEntry';

export function BlogPreview() {
  const posts = getAllPosts();

  return (
    <div className="flex flex-col gap-16">
      {posts.map((post) => (
        <BuildLogEntry
          key={post.slug}
          slug={post.slug}
          href={`/blog/${post.slug}`}
          summary={post.title}
          date={post.date}
        >
          <p className="text-body text-ink-muted">{post.summary}</p>
        </BuildLogEntry>
      ))}
    </div>
  );
}
