'use client';

import { useEffect, useState } from 'react';
import { MediaSlot } from '@/components/ui/MediaSlot';

type ImageCarouselProps = {
  images: { src: string; alt: string }[];
  aspect?: '16/9' | '1/1' | '4/3';
  intervalMs?: number;
  className?: string;
};

export function ImageCarousel({ images, aspect = '1/1', intervalMs = 4000, className = '' }: ImageCarouselProps) {
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

  return (
    <div className={`flex flex-col items-center gap-12 ${className}`}>
      <MediaSlot src={active.src} alt={active.alt} aspect={aspect} />
      {images.length > 1 && (
        <div className="flex gap-8">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setActiveIndex(index)}
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
