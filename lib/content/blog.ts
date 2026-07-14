import fs from 'fs';
import path from 'path';
import techDigestJson from '@/content/techDigest.json';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export interface ContentBlock {
  type: 'paragraph' | 'heading' | 'code' | 'list';
  text?: string;
  items?: string[]; // for lists
}

export interface Section {
  title: string;
  blocks: ContentBlock[];
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  summary: string;
  sections: Section[];
}

export interface TechDigestItem {
  title: string;
  url: string;
  source: string;
  date: string;
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }
  const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.json'));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
      return JSON.parse(raw) as Post;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | undefined {
  const filePath = path.join(BLOG_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    return undefined;
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw) as Post;
  } catch (e) {
    return undefined;
  }
}

// Static seed for now — can later be fed by an n8n automation that pulls
// an RSS feed into this same shape and writes it back to techDigest.json.
export function getTechDigest(): TechDigestItem[] {
  return (techDigestJson as TechDigestItem[]).filter((item) => item.title !== 'REPLACE_ME');
}
