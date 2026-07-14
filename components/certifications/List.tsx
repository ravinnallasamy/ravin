import Link from 'next/link';
import { getCertifications } from '@/lib/content/content';
import { BuildLogEntry } from '@/components/ui/BuildLogEntry';
import { MediaSlot } from '@/components/ui/MediaSlot';
import { RevealList, RevealItem } from '@/components/ui/Reveal';

export function List() {
  const certifications = getCertifications();

  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-5xl px-16 py-48 md:px-24 md:py-96">
        <RevealList className="flex flex-col gap-16">
          {certifications.map((cert) => (
            <RevealItem key={cert.id}>
              <BuildLogEntry
                slug={cert.id}
                summary={`${cert.title} — ${cert.issuer}`}
                date={cert.year === 'REPLACE_ME' ? undefined : cert.year}
              >
                <div className="flex flex-col gap-16 md:flex-row md:items-start">
                  <MediaSlot src={cert.image} alt={`${cert.title} certificate`} aspect="4/3" className="w-full md:w-1/3" />
                  <div className="flex flex-col gap-8">
                    {cert.credentialUrl && cert.credentialUrl !== 'REPLACE_ME' ? (
                      <Link href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-body text-accent hover:text-accent-hover">
                        View credential →
                      </Link>
                    ) : (
                      <p className="font-mono text-mono-label text-ink-faint">credential link coming soon</p>
                    )}
                  </div>
                </div>
              </BuildLogEntry>
            </RevealItem>
          ))}
        </RevealList>
      </div>
    </section>
  );
}
