import type { Metadata } from 'next';
import Link from 'next/link';
import siteJson from '@/content/site.json';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SkillsGrid } from '@/components/sections/SkillsGrid';
import { MediaSlot } from '@/components/ui/MediaSlot';

export const metadata: Metadata = {
  title: 'About',
  description: siteJson.mission,
};

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <section className="mx-auto max-w-5xl px-16 py-64 md:px-24 md:py-96">
        <div className="grid gap-32 md:grid-cols-[1fr_240px] md:items-start">
          <div className="flex flex-col gap-24">
            <SectionHeading eyebrow="About" title={siteJson.name} />
            <p className="max-w-2xl text-body text-ink-muted">{siteJson.mission}</p>
            <p className="max-w-2xl text-body text-ink-muted">
              {siteJson.experienceMonths} months in, based in {siteJson.location}, {siteJson.statusLine.toLowerCase()}.
            </p>
            <Link
              href="/Ravin-Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit rounded-full border border-border px-16 py-8 text-body text-ink hover:border-border-strong"
            >
              Download resume →
            </Link>
          </div>
          <MediaSlot src="/images/about/headshot.jpg" alt={`Headshot of ${siteJson.name}`} aspect="1/1" />
        </div>
      </section>

      <SkillsGrid />
    </div>
  );
}
