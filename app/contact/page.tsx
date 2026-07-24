import type { Metadata } from 'next';
import { Hero } from '@/components/contact/Hero';
import { Elsewhere } from '@/components/contact/Elsewhere';
import { metaForRoute } from '@/lib/seo/seo';
import { jsonLdForRoute } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';

export const revalidate = 3600;

export const metadata: Metadata = metaForRoute('contact');

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <JsonLd data={jsonLdForRoute('contact')} />
      <Hero />
      <Elsewhere />
    </div>
  );
}
