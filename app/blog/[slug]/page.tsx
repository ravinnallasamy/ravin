import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllPosts, getPostBySlug } from '@/lib/blog';

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-16 py-48 md:px-24 md:py-96">
      <div className="flex flex-col gap-24">
        <Link href="/blog" className="text-mono-label font-mono text-ink-faint hover:text-ink-muted">
          ← all posts
        </Link>
        <div className="flex flex-col gap-8">
          <span className="font-mono text-mono-label text-ink-faint">{post.date}</span>
          <h1 className="text-h1 text-ink">{post.title}</h1>
          <p className="text-h3 text-ink-muted">{post.summary}</p>
        </div>
        <div className="flex flex-col gap-16 text-body leading-relaxed text-ink [&_a]:text-accent [&_a]:underline">
          <MDXRemote source={post.content} />
        </div>
      </div>
    </article>
  );
}
