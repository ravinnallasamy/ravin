'use client';

import { useEffect, useRef, useState, Children, isValidElement, cloneElement } from 'react';

/**
 * Lightweight scroll-reveal built on IntersectionObserver + CSS transitions.
 *
 * This replaces the previous framer-motion implementation: the effect is a
 * simple fade-up-on-scroll, which does not need a full animation runtime.
 * Dropping framer-motion removes ~50KB of JS that had to be parsed and executed
 * on the main thread on nearly every page — a significant win for low-end CPUs.
 *
 * API is unchanged (Reveal / RevealList / RevealItem, each taking children +
 * optional className), so no callers needed to change.
 *
 * Motion is gated on `prefers-reduced-motion` via `motion-reduce:` classes plus
 * the reduced-motion CSS already in globals.css.
 */

/** Observe an element once; returns true after it first scrolls into view. */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No IntersectionObserver (very old browsers) → just show it.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect(); // reveal once, then stop observing
            break;
          }
        }
      },
      { rootMargin: '-40px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

// Shared transition classes. `motion-reduce:*` neutralizes the transform/opacity
// so reduced-motion users see content immediately with no movement.
const BASE =
  'transition-[opacity,transform] duration-500 ease-out will-change-[opacity,transform] motion-reduce:transition-none';
const HIDDEN = 'opacity-0 translate-y-3 motion-reduce:opacity-100 motion-reduce:translate-y-0';
const SHOWN = 'opacity-100 translate-y-0';

export function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`${BASE} ${inView ? SHOWN : HIDDEN} ${className}`}>
      {children}
    </div>
  );
}

/**
 * Container that staggers its RevealItem children once it enters view.
 * The stagger is applied as an incremental transition-delay on each item.
 */
export function RevealList({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>();

  const items = Children.toArray(children).map((child, i) => {
    if (!isValidElement(child)) return child;
    // Pass the container's in-view state + this item's index down to RevealItem.
    return cloneElement(child as React.ReactElement<RevealItemInternalProps>, {
      __inView: inView,
      __index: i,
    });
  });

  return (
    <div ref={ref} className={className}>
      {items}
    </div>
  );
}

type RevealItemInternalProps = {
  children: React.ReactNode;
  className?: string;
  /** Injected by RevealList — do not pass manually. */
  __inView?: boolean;
  __index?: number;
};

export function RevealItem({ children, className = '', __inView, __index = 0 }: RevealItemInternalProps) {
  // When used inside a RevealList, follow the list's shared in-view state and
  // stagger via delay. When used standalone (no injected props), reveal self.
  const standalone = __inView === undefined;
  const { ref, inView } = useInView<HTMLDivElement>();
  const visible = standalone ? inView : __inView;

  return (
    <div
      ref={standalone ? ref : undefined}
      className={`${BASE} ${visible ? SHOWN : HIDDEN} ${className}`}
      style={visible && !standalone ? { transitionDelay: `${__index * 80}ms` } : undefined}
    >
      {children}
    </div>
  );
}
