import type { ReactNode } from 'react';
import { ScrollDownIndicator } from '@/components/ui/ScrollDownIndicator';

/**
 * Shared hero shell used by every page's top section.
 *
 * Captures the layout that every page's `Hero.tsx` repeated by hand:
 * a full-viewport-minus-navbar section, a centered max-width inner
 * container with the standard responsive padding, and (optionally) the
 * warm paper gradient background.
 *
 * Pass the section's own grid/flex layout via `innerClassName`; the shell
 * only owns the outer chrome so each hero keeps full control of its content
 * arrangement.
 */
export function HeroSection({
  children,
  gradient = false,
  maxWidth = '5xl',
  centered = false,
  padding = 'tall',
  scrollTo,
  scrollOffsetClassName = '-translate-x-1/2',
  innerClassName = '',
  className = '',
}: {
  children: ReactNode;
  /** Apply the warm paper→surface gradient background. */
  gradient?: boolean;
  /** Inner container max width. Matches Tailwind's `max-w-*` scale. */
  maxWidth?: '5xl' | '6xl';
  /** Vertically center content (flex) instead of the default top-justified stack. */
  centered?: boolean;
  /** Vertical padding: `tall` (py-48 md:py-96) for text heroes, `flat` (py-64) for gradient/illustration heroes. */
  padding?: 'tall' | 'flat';
  /** Render a bottom-anchored scroll-down indicator linking to this element id. Forces `relative` on the section. */
  scrollTo?: string;
  /** Horizontal transform for the scroll indicator (defaults to centered). */
  scrollOffsetClassName?: string;
  /** Extra classes for the inner container (grid columns, gaps, etc.). */
  innerClassName?: string;
  /** Extra classes for the outer `<section>` (e.g. `relative`, `overflow-hidden`). */
  className?: string;
}) {
  const maxWidthClass = maxWidth === '6xl' ? 'max-w-6xl' : 'max-w-5xl';
  const paddingClass = padding === 'flat' ? 'py-64' : 'py-48 md:py-96';

  return (
    <section
      className={`flex min-h-[calc(100svh-64px)] ${scrollTo ? 'relative' : ''} ${centered ? 'items-center' : 'flex-col justify-center'} ${gradient ? 'bg-hero-warm' : ''} ${className}`}
    >
      <div
        className={`mx-auto w-full ${maxWidthClass} px-16 ${paddingClass} md:px-24 ${innerClassName}`}
      >
        {children}
      </div>
      {scrollTo && (
        <ScrollDownIndicator
          targetId={scrollTo}
          className={`absolute bottom-32 left-1/2 ${scrollOffsetClassName} md:bottom-48`}
        />
      )}
    </section>
  );
}
