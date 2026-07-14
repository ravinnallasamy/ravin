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
              className="absolute left-8 top-1/2 -translate-y-1/2 rounded-full bg-ink/60 p-8 text-paper shadow-glass backdrop-blur-glass transition-colors hover:bg-ink/80"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Next image"
              className="absolute right-8 top-1/2 -translate-y-1/2 rounded-full bg-ink/60 p-8 text-paper shadow-glass backdrop-blur-glass transition-colors hover:bg-ink/80"
            >
              ›
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-8">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Show ${image.alt}`}
              aria-current={index === activeIndex}
              className={`h-8 w-8 rounded-full transition-colors ${
                index === activeIndex ? 'bg-ink' : 'bg-border hover:bg-border-strong'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
