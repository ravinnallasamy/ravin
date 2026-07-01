import type { Metadata } from 'next';
import { Hero } from '@/components/certifications/Hero';
import { List } from '@/components/certifications/List';

export const metadata: Metadata = {
  title: 'Certifications',
  description: 'Certifications and credentials.',
};

export default function CertificationsPage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <List />
    </div>
  );
}
