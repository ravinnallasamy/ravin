import { HeroSection } from '@/components/ui/HeroSection';
import { BackLink } from '@/components/ui/BackLink';

export function PostHero({
  title,
  date,
  summary,
}: {
  title: string;
  date: string;
  summary: string;
}) {
  return (
    <HeroSection gradient padding="flat" className="border-b border-border/40">
      <div className="flex flex-col gap-24">
        <BackLink href="/blog" label="All posts" />
        <div className="flex flex-col gap-12">
          <span className="font-mono text-mono-label text-accent font-semibold tracking-wider">
            {date}
          </span>
          <h1
            className="text-h1 md:text-h1-lg text-ink font-bold tracking-tight max-w-4xl"
            style={{ textShadow: '0 1px 0 rgba(255,255,255,0.6)' }}
          >
            {title}
          </h1>
          <p className="text-h3 text-ink-muted max-w-2xl leading-relaxed mt-8">
            {summary}
          </p>
        </div>
      </div>
    </HeroSection>
  );
}
