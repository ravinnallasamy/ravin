/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.0.226'],

  // Serve images as-is instead of routing them through Next's on-the-fly
  // Image Optimization endpoint (/_next/image). That endpoint is a server
  // function that requires the Netlify Next runtime; this deploy publishes
  // `.next` directly without it, so the endpoint 502s. All images in this
  // project are already hand-optimized WebP at fixed sizes, so there is
  // nothing to gain from runtime optimization — <Image> now emits a plain
  // <img> pointing at the real file, which works on any host.
  images: {
    unoptimized: true,
  },

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
