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
};

export function MediaSlot({ src, alt, aspect = '16/9', fit = 'cover', className = '' }: MediaSlotProps) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const aspectClass = ASPECT_CLASS[aspect] ?? ASPECT_CLASS['16/9'];

  useEffect(() => {
    // A server-rendered <img> that 404s can fail before React hydrates and
    // attaches onError, so check whether it already failed on mount too.
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setFailed(true);
    }
  }, [src]);

  if (failed) {
    return (
      <div
        className={`${aspectClass} ${className} flex flex-col items-center justify-center gap-12 border border-border bg-surface-raised px-16 text-center`}
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
      className={`${aspectClass} ${className} ${fit === 'contain' ? 'object-contain' : 'object-cover'}`}
      onError={() => setFailed(true)}
    />
  );
}
