import type { Metadata } from 'next';
import { getExperience, getEducation, getCertifications } from '@/lib/content/content';
import { Reveal, RevealList, RevealItem } from '@/components/ui/Reveal';
import { Hero } from '@/components/experience-education/Hero';
import { CertificationsGrid } from '@/components/experience-education/CertificationsGrid';
import { ContentSection } from '@/components/ui/ContentSection';
import { CtaSection } from '@/components/ui/CtaSection';
import { Briefcase, GraduationCap, Award } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Experience & Education',
  description: 'Work history, education timeline, and verified certifications of Ravin Nallasamy.',
};

function SectionIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="flex h-40 w-40 items-center justify-center rounded-xl bg-accent/10 text-accent">
      <Icon size={20} />
    </div>
  );
}

function TimelineNode({ tone }: { tone: 'paper' | 'surface' }) {
  return (
    <span
      className={`absolute -left-[33px] md:-left-[41px] top-6 flex h-16 w-16 items-center justify-center rounded-full border border-border text-accent shadow-sm transition-transform hover:scale-110 ${
        tone === 'surface' ? 'bg-surface' : 'bg-paper'
      }`}
    >
      <span className="h-8 w-8 rounded-full bg-accent" />
    </span>
  );
}

export default function ExperienceEducationPage() {
  const experiences = getExperience();
  const educations = getEducation();
  const certifications = getCertifications();

  return (
    <div className="flex flex-col">
      <Hero />

      {/* ── Experience Timeline Section ── */}
      <ContentSection id="experience" tone="paper" borderTop>
          <div className="grid gap-32 md:grid-cols-[180px_1fr] md:gap-48 lg:grid-cols-[200px_1fr]">
            <Reveal>
              <div className="flex items-center gap-12 md:flex-col md:items-start md:gap-8">
                <SectionIcon icon={Briefcase} />
                <h2 className="text-h2 text-ink font-display font-bold">Experience</h2>
              </div>
            </Reveal>

            <div className="relative border-l-2 border-border/60 pl-24 md:pl-32">
              <RevealList className="flex flex-col gap-32">
                {experiences.map((exp, idx) => (
                  <RevealItem key={idx}>
                    <div className="relative">
                      <TimelineNode tone="paper" />

                      <div className="flex flex-col gap-16 rounded-3xl border border-border/60 bg-gradient-to-b from-paper to-surface p-24 shadow-skeu md:p-32">
                        <div className="flex flex-col gap-12">
                          <div className="flex flex-wrap items-center gap-8">
                            {exp.current && (
                              <span className="flex items-center gap-6 rounded-full bg-accent/10 px-10 py-2 font-mono text-mono-label text-accent">
                                <span className="h-6 w-6 rounded-full bg-accent animate-pulse" />
                                Current
                              </span>
                            )}
                            <span className="w-fit shrink-0 whitespace-nowrap rounded-full bg-surface-raised px-12 py-4 font-mono text-mono-label text-ink-muted shadow-sm">
                              {exp.period}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-display text-h3 text-ink font-semibold">{exp.role}</h3>
                            <p className="text-body font-medium text-ink-muted">{exp.company}</p>
                          </div>
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
      </ContentSection>

      {/* ── Education Timeline Section ── */}
      <ContentSection tone="surface" borderTop>
          <div className="grid gap-32 md:grid-cols-[180px_1fr] md:gap-48 lg:grid-cols-[200px_1fr]">
            <Reveal>
              <div className="flex items-center gap-12 md:flex-col md:items-start md:gap-8">
                <SectionIcon icon={GraduationCap} />
                <h2 className="text-h2 text-ink font-display font-bold">Education</h2>
              </div>
            </Reveal>

            <div className="relative border-l-2 border-border/60 pl-24 md:pl-32">
              <RevealList className="flex flex-col gap-32">
                {educations.map((edu, idx) => (
                  <RevealItem key={idx}>
                    <div className="relative">
                      <TimelineNode tone="surface" />

                      <div className="flex flex-col gap-16 rounded-3xl border border-border/40 bg-paper p-24 shadow-neu md:p-32">
                        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
                          <div>
                            <h3 className="font-display text-h3 text-ink font-semibold">{edu.degree}</h3>
                            <p className="text-body font-medium text-ink-muted">{edu.school}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-8 sm:flex-col sm:items-end">
                            <span className="w-fit rounded-full bg-surface px-12 py-4 font-mono text-mono-label text-ink-muted shadow-neu-sm">
                              {edu.period}
                            </span>
                            {edu.score && (
                              <span className="w-fit rounded-full bg-accent/10 px-12 py-4 font-mono text-mono-label text-accent">
                                {edu.score}
                              </span>
                            )}
                          </div>
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
      </ContentSection>

      {/* ── Certifications Section ── */}
      {certifications && certifications.length > 0 && (
        <ContentSection tone="paper" borderTop>
            <div className="flex flex-col gap-32">
              <Reveal>
                <div className="flex flex-col gap-8">
                  <SectionIcon icon={Award} />
                  <h2 className="text-h2 md:text-h2-lg text-ink font-display font-bold">Certifications</h2>
                </div>
              </Reveal>

              <CertificationsGrid certifications={certifications} />
            </div>
        </ContentSection>
      )}

      {/* ── Contact CTA Section ── */}
      <CtaSection
        tone="surface"
        title="Let's work together"
        description="Interested in how my experience can help your project succeed? Let's connect and discuss your requirements."
      />
    </div>
  );
}
