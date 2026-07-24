import type { Metadata } from 'next';
import { Poppins, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import { NavBar } from '@/components/ui/NavBar';
import { Footer } from '@/components/ui/Footer';
import { ResumeChatWidget } from '@/components/ui/ResumeChatWidget';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { GA_MEASUREMENT_ID, isGaEnabled } from '@/lib/analytics/gtag';
import { buildMetadata } from '@/lib/seo/seo';
import { rootJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';

const display = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const body = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = buildMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="flex min-h-screen flex-col">
        <JsonLd data={rootJsonLd()} />
        {isGaEnabled && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="beforeInteractive"
            />
            <Script id="ga4-init" strategy="beforeInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
              `}
            </Script>
          </>
        )}
        <GoogleAnalytics />
        <NavBar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ResumeChatWidget />
      </body>
    </html>
  );
}
