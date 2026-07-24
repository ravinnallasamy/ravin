'use client';

import { useEffect, useRef, useState } from 'react';
import { ImageOff } from 'lucide-react';

type MediaSlotProps = {
  src: string;
  alt: string;
  aspect?: string;
  fit?: 'cover' | 'contain';
  className?: string;
};

const ASPECT_CLASS: Record<string, string> = {
  '16/9': 'aspect-[16/9]',
  '1/1': 'aspect-square',
  '4/3': 'aspect-[4/3]',
  '3/4': 'aspect-[3/4]',
};

export function MediaSlot({ src, alt, aspect = '16/9', fit = 'cover', className = '' }: MediaSlotProps) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const aspectClass = ASPECT_CLASS[aspect] ?? ASPECT_CLASS['16/9'];

  useEffect(() => {
    // New src → clear any prior failure so a valid image isn't stuck on the
    // fallback from a previous src.
    setFailed(false);

    // Re-check on mount only for the case where a cached image errored before
    // React hydrated and could attach onError. `img.complete` is true both for
    // a finished load AND for a lazy image that hasn't started loading yet, so
    // `complete && naturalWidth === 0` is NOT enough — that false-positives on
    // every below-the-fold lazy image. Only trust it once the browser has
    // actually committed to a source (`currentSrc`) and still has no pixels.
    const img = imgRef.current;
    if (img && img.complete && img.currentSrc && img.naturalWidth === 0) {
      setFailed(true);
    }
  }, [src]);

  if (failed) {
    return (
      <div
        className={`${aspectClass} ${className} flex flex-col items-center justify-center gap-12 rounded-xl border border-white/40 bg-surface-raised/60 px-16 text-center shadow-glass backdrop-blur-glass`}
      >
        <ImageOff size={20} className="text-ink-faint" aria-hidden />
        <p className="text-mono-label text-ink-faint">{alt}</p>
        <p className="font-mono text-mono-label text-ink-faint break-all">{src}</p>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      loading="lazy"
      className={`${aspectClass} ${className} rounded-xl ${fit === 'contain' ? 'object-contain' : 'object-cover'}`}
      onError={() => setFailed(true)}
    />
  );
}
