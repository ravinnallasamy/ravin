import type { Metadata } from 'next';
import { Hero } from '@/components/blog/Hero';
import { Posts } from '@/components/blog/Posts';
import { Digest } from '@/components/blog/Digest';
import { getAllPosts } from '@/lib/content/blog';
import { metaForRoute } from '@/lib/seo/seo';
import { jsonLdForRoute } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';

export const revalidate = 3600;

export const metadata: Metadata = metaForRoute('blog');

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="flex flex-col">
      <JsonLd data={jsonLdForRoute('blog', { posts })} />
      <Hero />
      <Posts />
      <Digest />
    </div>
  );
}
