import Link from 'next/link';
import siteJson from '@/content/site.json';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ImageCarousel } from '@/components/ui/ImageCarousel';

const aboutPhotos = [
  { src: '/images/about/photo-1.jpg', alt: `${siteJson.name} — photo 1` },
  { src: '/images/about/photo-2.jpg', alt: `${siteJson.name} — photo 2` },
  { src: '/images/about/photo-3.jpg', alt: `${siteJson.name} — photo 3` },
];

export function AboutSection() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col justify-center px-16 py-48 md:px-24 md:py-96">
      <div className="grid gap-32 md:grid-cols-[1fr_240px] md:items-start">
        <div className="flex flex-col gap-24">
          <SectionHeading as="h1" eyebrow="About" title={siteJson.name} />
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
        <ImageCarousel images={aboutPhotos} aspect="1/1" />
      </div>
    </section>
  );
}
