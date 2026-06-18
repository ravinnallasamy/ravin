import { Hero } from '@/components/sections/Hero';
import { WorkPreview } from '@/components/sections/WorkPreview';
import { SkillsGrid } from '@/components/sections/SkillsGrid';
import { ContactPanel } from '@/components/sections/ContactPanel';
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
      <SkillsGrid compact />
      <ContactPanel />
    </>
  );
}
