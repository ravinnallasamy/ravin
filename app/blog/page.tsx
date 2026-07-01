import type { Metadata } from 'next';
import { Hero } from '@/components/blog/Hero';
import { Posts } from '@/components/blog/Posts';
import { Digest } from '@/components/blog/Digest';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Writing on what I build, plus a running tech digest.',
};

export default function BlogPage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Posts />
      <Digest />
    </div>
  );
}
