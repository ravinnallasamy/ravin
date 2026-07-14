/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.0.226'],

  // Long-lived HTTP caching for immutable static assets so browsers and CDNs
  // can preload/reuse them without re-downloading on every visit.
  async headers() {
    // 1 year, immutable — safe for content-addressed / rarely-changing assets.
    const immutable = 'public, max-age=31536000, immutable';
    // 1 day in browser, 1 week on CDN with background revalidation — for assets
    // that can change (images, resume) but rarely do.
    const longStaleWhileRevalidate =
      'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400';

    return [
      {
        // Next.js build output (JS/CSS chunks) — already hashed, cache forever.
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: immutable }],
      },
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: longStaleWhileRevalidate }],
      },
      {
        source: '/resume/:path*',
        headers: [{ key: 'Cache-Control', value: longStaleWhileRevalidate }],
      },
      {
        // Top-level public files (favicon, llms.txt, robots, sitemap).
        source: '/:file(favicon.png|llms.txt|robots.txt|sitemap.xml)',
        headers: [{ key: 'Cache-Control', value: longStaleWhileRevalidate }],
      },
    ];
  },
};

module.exports = nextConfig;
