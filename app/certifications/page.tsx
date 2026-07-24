import type { Metadata } from 'next';
import { Hero } from '@/components/certifications/Hero';
import { List } from '@/components/certifications/List';
import { getCertifications } from '@/lib/content/content';
import { metaForRoute } from '@/lib/seo/seo';
import { jsonLdForRoute } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';

export const revalidate = 3600;

export const metadata: Metadata = metaForRoute('certifications');

export default function CertificationsPage() {
  const certifications = getCertifications();

  return (
    <div className="flex flex-col">
      <JsonLd data={jsonLdForRoute('certifications', { certifications })} />
      <Hero />
      <List />
    </div>
  );
}
