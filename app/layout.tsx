import type { Metadata, Viewport } from 'next';
import './globals.css';
import siteData from '../data/site.json';

export const metadata: Metadata = {
  title: siteData.title,
  icons: {
    icon: siteData.favicon,
    apple: siteData.favicon,
  },
};

export const viewport: Viewport = {
  themeColor: siteData.themeColor,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
