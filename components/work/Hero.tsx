'use client';

import { useState } from 'react';
import { GlitchQuotes, QuoteAnimation } from '@/components/work/GlitchQuotes';
import { ContactCtaButton } from '@/components/ui/ContactCtaButton';

export function Hero() {
  const [index, setIndex] = useState(0);

  return (
    <section className="relative flex min-h-[calc(100svh-64px)] items-center overflow-hidden">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-stretch gap-32 px-16 py-48 md:grid-cols-2 md:gap-48 md:px-24">

        {/* Animation — left column, clearly visible. Capped to the section's available height so a wide-but-short
            viewport can't force the square wider (and thus taller) than the section, which would get clipped. */}
        <div className="order-2 flex w-full flex-col items-center justify-center gap-24 md:order-1">
          <div className="aspect-square w-full max-w-[min(60vh,32rem)]">
            <QuoteAnimation index={index} />
          </div>
        </div>

        {/* Content — right column */}
        <div className="order-1 flex flex-col items-start gap-32 text-left md:order-2">

          <span className="font-mono text-mono-label uppercase tracking-wide text-ink-faint">
            Work
          </span>

          {/* Fixed-height quote box — reserves max quote height (longest quote wraps to 4 lines at this type scale) so typing never shifts layout below it */}
          <div className="flex h-[14rem] w-full items-center md:h-[18rem]">
            <GlitchQuotes onIndexChange={(i) => setIndex(i)} />
          </div>

          {/* Secondary CTA — mirrors the home hero's "want to hire me?" prompt */}
          <div className="mt-auto flex flex-col items-start gap-12">
            <p className="text-body font-medium text-ink-muted">Like what you see? Or want to hire me?</p>
            <ContactCtaButton />
          </div>

        </div>
      </div>
    </section>
  );
}
