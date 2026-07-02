'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { SpotlightBees } from '@/components/work/animation-svg/spotlight-bees';
import { SleepyMug } from '@/components/work/animation-svg/sleepy-mug';
import { RocketCommit } from '@/components/work/animation-svg/rocket-commit';
import { GradBugs } from '@/components/work/animation-svg/grad-bugs';

type Quote = {
  text: string;
  Animation: React.FC;
};

export const QUOTES: Quote[] = [
  {
    text: "The bug wasn't a mistake — it was the feature auditioning for the lead role.",
    Animation: SpotlightBees,
  },
  {
    text: "I write code at night so the coffee can sleep too.",
    Animation: SleepyMug,
  },
  {
    text: "Every great product started as a terrible commit message.",
    Animation: RocketCommit,
  },
  {
    text: "I don't delete bugs. I promote them to undocumented features.",
    Animation: GradBugs,
  },
];

const TYPE_MS = 42;
const HOLD_MS = 2000;
const GLITCH_MS = 380;

type Phase = 'typing' | 'holding' | 'glitching';

export function GlitchQuotes({
  onLand,
  onIndexChange,
}: {
  onLand?: () => void;
  onIndexChange?: (i: number) => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<Phase>('typing');
  const onLandRef = useRef(onLand);
  const onIndexChangeRef = useRef(onIndexChange);
  onLandRef.current = onLand;
  onIndexChangeRef.current = onIndexChange;

  useEffect(() => {
    if (shouldReduceMotion) {
      setText(QUOTES[index].text);
      return;
    }

    const quote = QUOTES[index].text;

    if (phase === 'typing') {
      if (text.length < quote.length) {
        const t = setTimeout(() => setText(quote.slice(0, text.length + 1)), TYPE_MS);
        return () => clearTimeout(t);
      }
      onLandRef.current?.();
      const t = setTimeout(() => setPhase('holding'), HOLD_MS);
      return () => clearTimeout(t);
    }

    if (phase === 'holding') {
      const t = setTimeout(() => setPhase('glitching'), 10);
      return () => clearTimeout(t);
    }

    if (phase === 'glitching') {
      const t = setTimeout(() => {
        const next = (index + 1) % QUOTES.length;
        setText('');
        setIndex(next);
        onIndexChangeRef.current?.(next);
        setPhase('typing');
      }, GLITCH_MS);
      return () => clearTimeout(t);
    }
  }, [phase, text, index, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return (
      <p className="text-h2 md:text-h1-lg font-display text-ink text-left">
        {QUOTES[index].text}
      </p>
    );
  }

  return (
    <div className="relative w-full">
      <p
        data-glitch-text={text}
        className={`text-h2 md:text-h1-lg font-display text-ink text-left ${phase === 'glitching' ? 'glitch-text glitch-scanlines' : ''}`}
      >
        {text}
        <span
          className="ml-1 inline-block w-[2px] animate-pulse bg-accent align-middle"
          style={{ height: '0.9em' }}
        />
      </p>
    </div>
  );
}

export function QuoteAnimation({ index }: { index: number }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.04 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="h-full w-full"
      >
        {(() => {
          const { Animation } = QUOTES[index];
          return <Animation />;
        })()}
      </motion.div>
    </AnimatePresence>
  );
}
