import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/content/blog';
import { PostHero } from '@/components/blog/PostHero';
import { PostSection } from '@/components/blog/PostSection';
import { PostCta } from '@/components/blog/PostCta';

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

// Prerender all known posts at build; only these slugs are served (unknown
// slugs 404 immediately). Revalidate hourly to pick up content edits.
export const dynamicParams = false;
export const revalidate = 3600;

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
    <article className="flex flex-col min-h-[100svh] bg-paper">
      {/* ── Blog Post Hero Section ── */}
      <PostHero title={post.title} date={post.date} summary={post.summary} />

      {/* ── Blog Post Content Sections ── */}
      <div className="mx-auto w-full max-w-3xl px-16 py-48 sm:px-20 md:px-24 md:py-64 flex flex-col gap-48">
        {post.sections.map((section, index) => (
          <PostSection key={index} section={section} />
        ))}
      </div>

      {/* ── Final Blog CTA (full-bleed band) ── */}
      <PostCta slug={post.slug} />
    </article>
  );
}
