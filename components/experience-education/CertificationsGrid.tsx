'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import { RevealList, RevealItem } from '@/components/ui/Reveal';
import type { Certification } from '@/lib/content/content';

export function CertificationsGrid({ certifications }: { certifications: Certification[] }) {
  const [activeCert, setActiveCert] = useState<Certification | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!activeCert) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveCert(null);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [activeCert]);

  return (
    <>
      <RevealList className="grid gap-24 md:grid-cols-2">
        {certifications.map((cert) => (
          <RevealItem key={cert.id}>
            <div className="group relative flex items-center gap-16 rounded-3xl border border-border/60 bg-gradient-to-b from-paper to-surface p-16 shadow-skeu transition-all hover:-translate-y-0.5 hover:shadow-skeu-sm md:p-24">
              {cert.image && (
                <button
                  type="button"
                  onClick={() => setActiveCert(cert)}
                  className="relative h-64 w-64 shrink-0 overflow-hidden rounded-2xl border border-border/40 bg-surface transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label={`View certificate: ${cert.title}`}
                >
                  <Image
                    src={cert.image}
                    alt={cert.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                    priority={false}
                  />
                </button>
              )}
              <div className="flex-1 flex flex-col gap-4">
                <span className="font-mono text-[10px] uppercase tracking-wide text-ink-faint">
                  {cert.issuer}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveCert(cert)}
                  className="text-left font-display text-body font-semibold text-ink transition-colors group-hover:text-accent"
                >
                  {cert.title}
                </button>
              </div>

              {cert.credentialUrl && cert.credentialUrl !== 'REPLACE_ME' && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-32 w-32 items-center justify-center rounded-full bg-surface text-ink-muted transition-colors hover:bg-accent-subtle hover:text-accent"
                  aria-label={`View credential for ${cert.title}`}
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </RevealItem>
        ))}
      </RevealList>

      <AnimatePresence>
        {activeCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/70 p-16 backdrop-blur-md md:p-48"
            onClick={() => setActiveCert(null)}
            role="dialog"
            aria-modal="true"
            aria-label={activeCert.title}
          >
            <motion.div
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
              className="relative flex w-full max-w-3xl flex-col items-center gap-16"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveCert(null)}
                className="absolute -top-40 right-0 flex h-32 w-32 items-center justify-center rounded-full bg-paper/90 text-ink shadow-skeu-sm transition-colors hover:bg-accent-subtle hover:text-accent md:-top-48"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="relative w-full overflow-hidden rounded-2xl border border-white/20 bg-paper shadow-glass">
                <Image
                  src={activeCert.image}
                  alt={activeCert.title}
                  width={1200}
                  height={900}
                  sizes="90vw"
                  className="w-full h-auto max-h-[75svh] object-contain"
                  priority
                />
              </div>

              <p className="text-center text-body font-medium text-paper">{activeCert.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
