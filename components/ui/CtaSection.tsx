import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { ContentSection } from '@/components/ui/ContentSection';

/**
 * End-of-page "Get in touch" CTA band shared by the work,
 * skills-services, and experience-education pages.
 */
export function CtaSection({
  title,
  description,
  href = '/contact',
  tone = 'paper',
}: {
  title: string;
  description: string;
  href?: string;
  tone?: 'paper' | 'surface';
}) {
  return (
    <ContentSection tone={tone} borderTop padding="cta" innerClassName="text-center">
      <Reveal className="flex flex-col items-center gap-24">
        <h2 className="text-h2 md:text-h2-lg text-ink font-display">{title}</h2>
        <p className="max-w-md text-body text-ink-muted">{description}</p>
        <Link
          href={href}
          className="group relative inline-flex overflow-hidden rounded-full bg-accent px-24 py-12 text-body text-paper transition-all hover:bg-accent-hover"
        >
          <span className="relative font-medium">Get in touch →</span>
        </Link>
      </Reveal>
    </ContentSection>
  );
}
