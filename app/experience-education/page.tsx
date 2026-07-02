import type { Metadata } from 'next';
import { getExperience, getEducation, getCertifications } from '@/lib/content';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal, RevealList, RevealItem } from '@/components/ui/Reveal';
import { Briefcase, GraduationCap, Award, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Experience & Education',
  description: 'Work history, education timeline, and verified certifications of Ravin Nallasamy.',
};

export default function ExperienceEducationPage() {
  const experiences = getExperience();
  const educations = getEducation();
  const certifications = getCertifications();

  return (
    <div className="flex flex-col">
      {/* ── Hero Section ── */}
      <section 
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #FBF8F3 0%, #F3EEE6 100%)' }}
      >
        <div className="mx-auto max-w-5xl px-16 py-64 md:px-24 md:py-96">
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="Journey"
              title="Experience & Education"
              description="A timeline of my professional work, academic background, and industry credentials."
            />
          </Reveal>
        </div>
      </section>

      {/* ── Experience Timeline Section ── */}
      <section className="bg-paper border-t border-border/50">
        <div className="mx-auto max-w-5xl px-16 py-48 md:px-24 md:py-96">
          <div className="grid gap-48 md:grid-cols-[200px_1fr]">
            <Reveal>
              <div className="flex items-center gap-12 md:flex-col md:items-start md:gap-8">
                <div className="flex h-40 w-40 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Briefcase size={20} />
                </div>
                <h2 className="text-h2 text-ink font-display font-bold">Experience</h2>
              </div>
            </Reveal>

            <div className="relative border-l-2 border-border/60 pl-24 md:pl-32">
              <RevealList className="flex flex-col gap-32">
                {experiences.map((exp, idx) => (
                  <RevealItem key={idx}>
                    <div className="relative">
                      {/* Timeline Node */}
                      <span className="absolute -left-[33px] md:-left-[41px] top-6 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-paper text-accent shadow-sm transition-transform hover:scale-110">
                        <span className="h-8 w-8 rounded-full bg-accent" />
                      </span>

                      <div className="flex flex-col gap-16 rounded-3xl border border-border/60 bg-gradient-to-b from-paper to-surface p-24 shadow-skeu md:p-32">
                        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
                          <div>
                            <h3 className="font-display text-h3 text-ink font-semibold">{exp.role}</h3>
                            <p className="text-body font-medium text-ink-muted">{exp.company}</p>
                          </div>
                          <span className="w-fit rounded-full bg-surface-raised px-12 py-4 font-mono text-mono-label text-ink-muted shadow-sm">
                            {exp.period}
                          </span>
                        </div>

                        <ul className="flex flex-col gap-8 border-t border-border/40 pt-16">
                          {exp.description.map((point, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-8 text-body text-ink-muted">
                              <span className="mt-8 flex h-6 w-6 shrink-0 rounded-full bg-ink-faint" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>

                        {exp.skills && exp.skills.length > 0 && (
                          <div className="flex flex-wrap gap-8 border-t border-border/40 pt-16">
                            {exp.skills.map((skill) => (
                              <span
                                key={skill}
                                className="rounded-full bg-surface px-12 py-4 font-mono text-mono-label text-ink-muted shadow-neu-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </RevealItem>
                ))}
              </RevealList>
            </div>
          </div>
        </div>
      </section>

      {/* ── Education Timeline Section ── */}
      <section className="bg-surface border-t border-border/50">
        <div className="mx-auto max-w-5xl px-16 py-48 md:px-24 md:py-96">
          <div className="grid gap-48 md:grid-cols-[200px_1fr]">
            <Reveal>
              <div className="flex items-center gap-12 md:flex-col md:items-start md:gap-8">
                <div className="flex h-40 w-40 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <GraduationCap size={20} />
                </div>
                <h2 className="text-h2 text-ink font-display font-bold">Education</h2>
              </div>
            </Reveal>

            <div className="relative border-l-2 border-border/60 pl-24 md:pl-32">
              <RevealList className="flex flex-col gap-32">
                {educations.map((edu, idx) => (
                  <RevealItem key={idx}>
                    <div className="relative">
                      {/* Timeline Node */}
                      <span className="absolute -left-[33px] md:-left-[41px] top-6 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-surface text-accent shadow-sm transition-transform hover:scale-110">
                        <span className="h-8 w-8 rounded-full bg-accent" />
                      </span>

                      <div className="flex flex-col gap-16 rounded-3xl border border-border/40 bg-paper p-24 shadow-neu md:p-32">
                        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
                          <div>
                            <h3 className="font-display text-h3 text-ink font-semibold">{edu.degree}</h3>
                            <p className="text-body font-medium text-ink-muted">{edu.school}</p>
                          </div>
                          <span className="w-fit rounded-full bg-surface px-12 py-4 font-mono text-mono-label text-ink-muted shadow-neu-sm">
                            {edu.period}
                          </span>
                        </div>

                        <ul className="flex flex-col gap-8 border-t border-border/40 pt-16">
                          {edu.details.map((detail, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-8 text-body text-ink-muted">
                              <span className="mt-8 flex h-6 w-6 shrink-0 rounded-full bg-ink-faint" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </RevealItem>
                ))}
              </RevealList>
            </div>
          </div>
        </div>
      </section>

      {/* ── Certifications Section ── */}
      {certifications && certifications.length > 0 && (
        <section className="bg-paper border-t border-border/50">
          <div className="mx-auto max-w-5xl px-16 py-48 md:px-24 md:py-96">
            <div className="flex flex-col gap-32">
              <Reveal>
                <div className="flex flex-col gap-8">
                  <div className="flex h-40 w-40 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Award size={20} />
                  </div>
                  <h2 className="text-h2 md:text-h2-lg text-ink font-display font-bold">Certifications</h2>
                </div>
              </Reveal>

              <RevealList className="grid gap-24 md:grid-cols-2">
                {certifications.map((cert) => (
                  <RevealItem key={cert.id}>
                    <div className="group relative flex items-center gap-16 rounded-3xl border border-border/60 bg-gradient-to-b from-paper to-surface p-16 shadow-skeu transition-all hover:-translate-y-0.5 hover:shadow-skeu-sm md:p-24">
                      {cert.image && (
                        <div className="relative h-64 w-64 shrink-0 overflow-hidden rounded-2xl border border-border/40 bg-surface">
                          <Image
                            src={cert.image}
                            alt={cert.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                            priority={false}
                          />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col gap-4">
                        <span className="font-mono text-[10px] uppercase tracking-wide text-ink-faint">
                          {cert.issuer}
                        </span>
                        <h3 className="font-display text-body font-semibold text-ink group-hover:text-accent transition-colors">
                          {cert.title}
                        </h3>
                      </div>
                      
                      {cert.credentialUrl && cert.credentialUrl !== 'REPLACE_ME' && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-32 w-32 items-center justify-center rounded-full bg-surface hover:bg-accent-subtle hover:text-accent text-ink-muted transition-colors"
                          aria-label={`View credential for ${cert.title}`}
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </RevealItem>
                ))}
              </RevealList>
            </div>
          </div>
        </section>
      )}

      {/* ── Contact CTA Section ── */}
      <section className="bg-surface border-t border-border/50">
        <div className="mx-auto max-w-5xl px-16 py-64 text-center md:px-24 md:py-96">
          <Reveal className="flex flex-col items-center gap-24">
            <h2 className="text-h2 md:text-h2-lg text-ink font-display">Let's work together</h2>
            <p className="max-w-md text-body text-ink-muted">
              Interested in how my experience can help your project succeed? Let's connect and discuss your requirements.
            </p>
            <Link
              href="/contact"
              className="group relative inline-flex overflow-hidden rounded-full bg-accent px-24 py-12 text-body text-paper transition-all hover:bg-accent-hover"
            >
              <span className="relative font-medium">Get in touch →</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
