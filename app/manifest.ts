import type { MetadataRoute } from 'next';
import { seo } from '@/lib/seo/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: seo.siteName,
    short_name: seo.siteName,
    description: seo.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#faf7f2',
    theme_color: '#faf7f2',
    icons: [
      { src: '/images/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/images/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
