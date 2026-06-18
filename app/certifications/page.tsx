import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CertificationsPreview } from '@/components/sections/CertificationsPreview';

export const metadata: Metadata = {
  title: 'Certifications',
  description: 'Certifications and credentials.',
};

export default function CertificationsPage() {
  return (
    <section className="mx-auto max-w-5xl px-16 py-64 md:px-24 md:py-96">
      <div className="flex flex-col gap-32">
        <SectionHeading eyebrow="Credentials" title="Certifications" />
        <CertificationsPreview />
      </div>
    </section>
  );
}
