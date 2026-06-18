import { Hero } from '@/components/sections/Hero';
import { WorkPreview } from '@/components/sections/WorkPreview';
import { SkillsGrid } from '@/components/sections/SkillsGrid';
import { ContactPanel } from '@/components/sections/ContactPanel';

export default function Home() {
  return (
    <>
      <Hero />
      <WorkPreview />
      <SkillsGrid compact />
      <ContactPanel />
    </>
  );
}
