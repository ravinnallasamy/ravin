import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { PostHero } from '@/components/blog/PostHero';
import { PostSection } from '@/components/blog/PostSection';
import { PostCta } from '@/components/blog/PostCta';

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
    <article className="flex flex-col min-h-screen bg-paper">
      {/* ── Blog Post Hero Section ── */}
      <PostHero title={post.title} date={post.date} summary={post.summary} />

      {/* ── Blog Post Content Sections & Final CTA ── */}
      <div className="mx-auto w-full max-w-5xl px-16 py-48 md:px-24 md:py-64 flex flex-col gap-32">
        <div className="flex flex-col gap-32">
          {post.sections.map((section, index) => (
            <PostSection key={index} section={section} />
          ))}
        </div>
        
        {/* ── Final Blog CTA ── */}
        <PostCta slug={post.slug} />
      </div>
    </article>
  );
}
