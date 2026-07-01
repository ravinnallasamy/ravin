import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';

export function Hero() {
  return (
    <section className="mx-auto flex min-h-[calc(100svh-64px)] max-w-5xl flex-col justify-center px-16 py-48 md:px-24 md:py-96">
      <Reveal>
        <SectionHeading as="h1" eyebrow="Credentials" title="Certifications" />
      </Reveal>
    </section>
  );
}
