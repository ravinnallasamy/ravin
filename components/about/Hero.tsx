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
    <section id="about" className="flex min-h-screen flex-col justify-center md:min-h-[100svh]">
      <div className="mx-auto w-full max-w-5xl px-16 py-48 md:px-24 md:py-64">
        <div className="grid gap-32 md:grid-cols-[1fr_320px] md:items-start">
          <div className="flex flex-col gap-24">
            <SectionHeading as="h1" eyebrow="About" title={siteJson.name} />
            <p className="max-w-2xl text-body text-ink-muted">{siteJson.mission}</p>
            <p className="max-w-2xl text-body text-ink-muted">
              {siteJson.experienceMonths} months in, based in {siteJson.location}, {siteJson.statusLine.toLowerCase()}.
            </p>
            <div className="flex flex-wrap items-center gap-16">
              <Link
                href="/resume/Ravin-resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-accent px-24 py-12 text-body font-semibold text-paper shadow-skeu-sm hover:bg-accent-hover transition-colors"
              >
                Download resume ↓
              </Link>
              <Link
                href="/experience-education"
                className="inline-flex items-center justify-center rounded-full border border-border/80 bg-gradient-to-b from-paper to-surface-raised/40 px-24 py-12 text-body font-medium text-ink hover:border-border-strong transition-colors"
              >
                Experience & education →
              </Link>
            </div>
          </div>
          <ImageCarousel images={aboutPhotos} aspect="3/4" showArrows={false} />
        </div>
      </div>
    </section>
  );
}
