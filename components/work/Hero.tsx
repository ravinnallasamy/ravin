'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlitchQuotes, QuoteAnimation } from '@/components/work/GlitchQuotes';

export function Hero() {
  const [pulseKey, setPulseKey] = useState(0);
  const [index, setIndex] = useState(0);

  return (
    <section className="relative flex min-h-[calc(100svh-64px)] items-center overflow-hidden">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-32 px-16 py-48 md:grid-cols-2 md:gap-48 md:px-24">

        {/* Animation — left column, clearly visible. Capped to the section's available height so a wide-but-short
            viewport can't force the square wider (and thus taller) than the section, which would get clipped. */}
        <div className="order-2 flex w-full items-center justify-center md:order-1">
          <div className="aspect-square w-full max-w-[min(60vh,32rem)]">
            <QuoteAnimation index={index} />
          </div>
        </div>

        {/* Content — right column */}
        <div className="order-1 flex flex-col items-start gap-32 text-left md:order-2">

          <span className="font-mono text-mono-label uppercase tracking-wide text-ink-faint">
            Work
          </span>

          {/* Fixed-height quote box — reserves max quote height so typing never shifts layout */}
          <div className="flex min-h-[7rem] w-full items-center md:min-h-[8rem]">
            <GlitchQuotes
              onLand={() => setPulseKey((k) => k + 1)}
              onIndexChange={(i) => setIndex(i)}
            />
          </div>

          {/* CTA — pulses once each time a quote finishes landing */}
          <motion.a
            key={pulseKey}
            href="#projects"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="group relative overflow-hidden rounded-full bg-accent px-32 py-16 font-display text-body text-paper shadow-glass transition-colors hover:bg-accent-hover"
          >
            <span className="relative">View My Work ↓</span>
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
          </motion.a>

          {/* De-emphasised subtitle */}
          <p className="font-mono text-mono-label text-ink-faint">
            Everything I&apos;ve shipped &mdash; sorted by what I&apos;d point you to first.
          </p>

        </div>
      </div>
    </section>
  );
}
