import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import techDigestJson from '@/content/techDigest.json';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export interface PostFrontmatter {
  title: string;
  date: string;
  summary: string;
}

export interface Post extends PostFrontmatter {
  slug: string;
  content: string;
}

export interface TechDigestItem {
  title: string;
  url: string;
  source: string;
  date: string;
}

export function getAllPosts(): Post[] {
  const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.mdx'));

  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '');
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
      const { data, content } = matter(raw);
      return { slug, content, ...(data as PostFrontmatter) };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

// Static seed for now — can later be fed by an n8n automation that pulls
// an RSS feed into this same shape and writes it back to techDigest.json.
export function getTechDigest(): TechDigestItem[] {
  return (techDigestJson as TechDigestItem[]).filter((item) => item.title !== 'REPLACE_ME');
}
