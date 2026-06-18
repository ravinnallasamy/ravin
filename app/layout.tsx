import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Ravin Nallasamy's Portfolio",
  icons: {
    icon: '/images/image.png?v=2',
    apple: '/images/image.png?v=2',
  },
};

export const viewport: Viewport = {
  themeColor: '#1e40af',
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
