'use client';

import { useEffect, useState } from 'react';
import { MediaSlot } from '@/components/ui/MediaSlot';

type ImageCarouselProps = {
  images: { src: string; alt: string }[];
  aspect?: '16/9' | '1/1' | '4/3' | '3/4';
  fit?: 'cover' | 'contain';
  intervalMs?: number;
  className?: string;
  showArrows?: boolean;
};

export function ImageCarousel({
  images,
  aspect = '1/1',
  fit = 'cover',
  intervalMs = 4000,
  className = '',
  showArrows = true,
}: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [images.length, intervalMs]);

  if (images.length === 0) return null;

  const active = images[activeIndex];

  const goTo = (index: number) => setActiveIndex(((index % images.length) + images.length) % images.length);

  return (
    <div className={`flex flex-col items-center gap-12 ${className}`}>
      <div className="relative w-full">
        <MediaSlot src={active.src} alt={active.alt} aspect={aspect} fit={fit} className="w-full" />
        {showArrows && images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Previous image"
              className="absolute left-8 top-1/2 flex h-44 w-44 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 text-paper shadow-glass backdrop-blur-glass transition-colors hover:bg-ink/80"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Next image"
              className="absolute right-8 top-1/2 flex h-44 w-44 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 text-paper shadow-glass backdrop-blur-glass transition-colors hover:bg-ink/80"
            >
              ›
            </button>
          </>
        )}
      </div>
      {/* Dots carry their own 44px hit area, so no extra gap is needed; the
          negative margin keeps the visible row of dots optically tight. */}
      {images.length > 1 && (
        <div className="-my-12 flex">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Show ${image.alt}`}
              aria-current={index === activeIndex}
              // 44x44 hit area via padding; the visible dot stays 8x8 (::before).
              className={`relative h-44 w-44 rounded-full transition-colors before:absolute before:left-1/2 before:top-1/2 before:h-8 before:w-8 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:transition-colors before:content-[''] ${
                index === activeIndex
                  ? 'before:bg-ink'
                  : 'before:bg-border hover:before:bg-border-strong'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
