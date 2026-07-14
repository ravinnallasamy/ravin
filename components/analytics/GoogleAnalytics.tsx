'use client';

import Script from 'next/script';
import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { GA_MEASUREMENT_ID, isGaEnabled, pageview } from '@/lib/analytics/gtag';

// Tracks client-side route changes. Split into its own component because
// useSearchParams() must live under a Suspense boundary in the App Router.
function RouteChangeTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    pageview(url);
  }, [pathname, searchParams]);

  return null;
}

/**
 * Loads the GA4 gtag.js library and initialises the property, then tracks
 * every client-side navigation. Renders nothing (and loads no script) unless
 * NEXT_PUBLIC_GA_MEASUREMENT_ID is set, so the site works with or without it.
 *
 * `send_page_view: false` disables gtag's own initial page_view so we don't
 * double-count — RouteChangeTracker emits the first (and every) page view.
 */
export function GoogleAnalytics() {
  if (!isGaEnabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
        `}
      </Script>
      <Suspense fallback={null}>
        <RouteChangeTracker />
      </Suspense>
    </>
  );
}
