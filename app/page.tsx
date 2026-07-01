import { Hero } from '@/components/home/Hero';
import { WorkPreview } from '@/components/home/WorkPreview';
import { AboutSection } from '@/components/about/Hero';
import { Skills } from '@/components/about/Skills';
import { ContactPanel } from '@/components/home/ContactPanel';
import { personJsonLd } from '@/lib/seo';

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />
      <Hero />
      <WorkPreview />
      <AboutSection />
      <Skills compact tinted />
      <ContactPanel />
    </>
  );
}
