'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export function ScrollDownIndicator({
  targetId,
  label = 'Scroll down',
  className = '',
}: {
  targetId: string;
  label?: string;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  const bounce: Variants = {
    animate: shouldReduceMotion
      ? {}
      : { y: [0, 8, 0], transition: { repeat: Infinity, duration: 1.6, ease: 'easeInOut' } },
  };

  return (
    <a
      href={`#${targetId}`}
      className={`group flex flex-col items-center gap-4 text-mono-label font-mono uppercase tracking-wide text-ink-faint transition-colors hover:text-accent ${className}`}
    >
      <span>{label}</span>
      <motion.span variants={bounce} animate="animate">
        <ChevronDown size={20} />
      </motion.span>
    </a>
  );
}
