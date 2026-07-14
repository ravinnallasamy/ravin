import type { ReactNode } from 'react';

/**
 * Shared shell for every non-hero page section.
 *
 * Captures the layout each section repeated by hand: a `<section>` with an
 * optional background tone / top border, wrapping the standard centered
 * `max-w-5xl` container with the site's responsive padding.
 *
 * The section only owns the outer chrome — pass the section's own layout
 * (flex/grid, gaps) via `innerClassName`.
 */
export function ContentSection({
  children,
  id,
  tone = 'none',
  borderTop = false,
  fullHeight = false,
  padding = 'default',
  className = '',
  innerClassName = '',
}: {
  children: ReactNode;
  id?: string;
  /** Background tone of the outer section. */
  tone?: 'paper' | 'surface' | 'none';
  /** Add the standard `border-t border-border/50` divider. */
  borderTop?: boolean;
  /** Stretch to `min-h-[100svh]` and vertically center the container. */
  fullHeight?: boolean;
  /** Vertical padding: `default` (py-48 md:py-96), `compact` (py-48 md:py-64), `cta` (py-64 md:py-96). */
  padding?: 'default' | 'compact' | 'cta';
  /** Extra classes for the outer `<section>` (e.g. `scroll-mt-24`, a custom border). */
  className?: string;
  /** Extra classes for the inner container (grid columns, text alignment, etc.). */
  innerClassName?: string;
}) {
  const toneClass = tone === 'paper' ? 'bg-paper' : tone === 'surface' ? 'bg-surface' : '';
  const paddingClass =
    padding === 'compact'
      ? 'py-48 md:py-64'
      : padding === 'cta'
        ? 'py-64 md:py-96'
        : 'py-48 md:py-96';

  return (
    <section
      id={id}
      className={`${toneClass} ${borderTop ? 'border-t border-border/50' : ''} ${
        fullHeight ? 'flex min-h-[100svh] flex-col justify-center' : ''
      } ${className}`}
    >
      <div
        className={`mx-auto w-full max-w-5xl px-16 sm:px-20 md:px-24 ${paddingClass} ${innerClassName}`}
      >
        {children}
      </div>
    </section>
  );
}
