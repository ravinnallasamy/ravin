import type { ReactNode } from 'react';
import Link from 'next/link';

/**
 * Skeuomorphic glass CTA button shared by the hero/CTA sections.
 *
 * Two finishes: `accent` (warm accent gradient, paper text) and `light`
 * (frosted white glass, ink text). Children render above the sheen overlay,
 * so give each child the `relative` class (matches existing usage).
 *
 * Renders a plain `<a>` for in-page `#anchor` targets and a Next `Link`
 * otherwise.
 */
export function GlassButton({
  href,
  variant = 'light',
  size = 'md',
  children,
}: {
  href: string;
  variant?: 'accent' | 'light';
  /** `md` = px-20 py-12 (hero buttons), `lg` = px-24 py-14 (post CTA). */
  size?: 'md' | 'lg';
  children: ReactNode;
}) {
  const base =
    'group relative isolate inline-flex items-center gap-8 overflow-hidden rounded-2xl border border-white/50 text-body backdrop-blur-glass transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer';
  const sizeClass = size === 'lg' ? 'px-24 py-14' : 'px-20 py-12';
  const variantClass =
    variant === 'accent'
      ? 'bg-gradient-to-b from-accent to-accent-hover text-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_4px_rgba(30,42,58,0.2),0_8px_24px_rgba(150,113,79,0.35)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-2px_4px_rgba(30,42,58,0.22),0_12px_32px_rgba(150,113,79,0.45)] active:shadow-[inset_0_2px_6px_rgba(30,42,58,0.3)]'
      : 'bg-white/30 text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_2px_rgba(30,42,58,0.08),0_8px_24px_rgba(30,42,58,0.12)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_2px_rgba(30,42,58,0.1),0_12px_32px_rgba(30,42,58,0.18)] active:shadow-[inset_0_2px_4px_rgba(30,42,58,0.15)]';
  const sheenClass =
    variant === 'accent'
      ? 'from-white/25 opacity-90'
      : 'from-white/40 opacity-80';

  const className = `${base} ${sizeClass} ${variantClass}`;
  const sheen = (
    <span
      className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b via-transparent to-transparent transition-opacity duration-300 group-hover:opacity-100 ${sheenClass}`}
    />
  );

  if (href.startsWith('#')) {
    return (
      <a href={href} className={className}>
        {sheen}
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {sheen}
      {children}
    </Link>
  );
}
