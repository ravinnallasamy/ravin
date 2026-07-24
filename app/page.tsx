import { Hero } from '@/components/home/Hero';
import { WorkPreview } from '@/components/home/WorkPreview';
import { AboutSection } from '@/components/home/AboutSection';
import { Skills } from '@/components/home/Skills';
import { ContactPanel } from '@/components/home/ContactPanel';
import type { Metadata } from 'next';
import { metaForRoute } from '@/lib/seo/seo';
import { jsonLdForRoute } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = metaForRoute('home');

// Content is static (JSON/MDX); revalidate hourly so the page is served
// prerendered and cached while still picking up content edits.
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <JsonLd data={jsonLdForRoute('home')} />
      <Hero />
      <AboutSection />
      <Skills tinted />
      <WorkPreview />
      <ContactPanel />
    </>
  );
}
