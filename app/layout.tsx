import type { Metadata } from 'next';
import { Poppins, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import { NavBar } from '@/components/ui/NavBar';
import { Footer } from '@/components/ui/Footer';
import { ResumeChatWidget } from '@/components/ui/ResumeChatWidget';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { GA_MEASUREMENT_ID, isGaEnabled } from '@/lib/analytics/gtag';
import siteJson from '@/content/site.json';

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

export const metadata: Metadata = {
  metadataBase: new URL('https://ravinnallasamy.netlify.app'),
  title: {
    default: `${siteJson.name} — ${siteJson.role}`,
    template: `%s — ${siteJson.name}`,
  },
  description: siteJson.mission,
  openGraph: {
    title: `${siteJson.name} — ${siteJson.role}`,
    description: siteJson.mission,
    images: ['/images/og/default.jpg'],
  },
  icons: {
    icon: '/images/favicon.png',
  },
  verification: {
    google: 'luXW8ymReaj0fOcaI1XBF4SOXz0wNAr9-mM2C8B__r4',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="flex min-h-screen flex-col">
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
