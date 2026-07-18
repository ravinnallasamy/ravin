import Link from 'next/link';
import siteJson from '@/content/site.json';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ImageCarousel } from '@/components/ui/ImageCarousel';
import { ContentSection } from '@/components/ui/ContentSection';

const aboutPhotos = [
  { src: '/images/about/photo-1.webp', alt: `${siteJson.name} — photo 1` },
  { src: '/images/about/photo-2.webp', alt: `${siteJson.name} — photo 2` },
  { src: '/images/about/photo-3.webp', alt: `${siteJson.name} — photo 3` },
];

export function AboutSection() {
  return (
    <ContentSection id="about" fullHeight padding="compact">
        <div className="grid gap-32 md:grid-cols-[1fr_minmax(0,280px)] md:items-start lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col items-center text-center gap-24 md:items-start md:text-left">
            <SectionHeading as="h1" eyebrow="About" title={siteJson.name} />
            <p className="max-w-2xl text-body text-ink-muted mx-auto md:mx-0">{siteJson.mission}</p>
            <p className="max-w-2xl text-body text-ink-muted mx-auto md:mx-0">
              {siteJson.experienceMonths} months in, based in {siteJson.location}, {siteJson.statusLine.toLowerCase()}.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-16 md:justify-start">
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
    </ContentSection>
  );
}
