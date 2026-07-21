import type { MetadataRoute } from 'next';
import { getProjects } from '@/lib/content/content';
import { getAllPosts } from '@/lib/content/blog';

const BASE_URL = 'https://ravinnallasamy.netlify.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/work', '/certifications', '/coding', '/blog', '/contact'].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  const projectRoutes = getProjects().map((project) => ({
    url: `${BASE_URL}/work/${project.slug}`,
    lastModified: new Date(),
  }));

  const postRoutes = getAllPosts().map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
