import { Hero } from '@/components/home/Hero';
import { WorkPreview } from '@/components/home/WorkPreview';
import { AboutSection } from '@/components/home/AboutSection';
import { Skills } from '@/components/home/Skills';
import { ContactPanel } from '@/components/home/ContactPanel';
import { personJsonLd } from '@/lib/utils/seo';

// Content is static (JSON/MDX); revalidate hourly so the page is served
// prerendered and cached while still picking up content edits.
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />
      <Hero />
      <AboutSection />
      <Skills tinted />
      <WorkPreview />
      <ContactPanel />
    </>
  );
}
