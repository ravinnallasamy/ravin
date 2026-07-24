import type { Metadata } from 'next';
import { Hero } from '@/components/work/Hero';
import { List } from '@/components/work/List';
import { Cta } from '@/components/work/Cta';
import { getProjects } from '@/lib/content/content';
import { metaForRoute } from '@/lib/seo/seo';
import { jsonLdForRoute } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';

export const revalidate = 3600;

export const metadata: Metadata = metaForRoute('work');

export default function WorkPage() {
  const projects = getProjects();

  return (
    <div className="flex flex-col">
      <JsonLd data={jsonLdForRoute('work', { projects })} />
      <Hero />
      <List />
      <Cta />
    </div>
  );
}
