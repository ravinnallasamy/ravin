import type { Metadata } from 'next';
import { getSkills, getServices } from '@/lib/content';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal, RevealList, RevealItem } from '@/components/ui/Reveal';
import * as LucideIcons from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Skills & Services',
  description: 'Full-stack development, AI & RAG systems, and workflow automation services offered by Ravin Nallasamy.',
};

const CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend Development',
  backend: 'Backend & Databases',
  ai: 'AI & Machine Learning',
  automation: 'Automation & Integration',
};

export default function SkillsServicesPage() {
  const skills = getSkills();
  const services = getServices();
  const categories = Object.entries(skills) as [keyof typeof skills, string[]][];

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
              eyebrow="Expertise"
              title="Skills & Services"
              description="I build full-stack products and the intelligent AI systems inside them. From concept to implementation, I design systems that ship and scale."
            />
          </Reveal>
        </div>
      </section>

      {/* ── Services Section ── */}
      <section className="bg-paper border-t border-border/50">
        <div className="mx-auto max-w-5xl px-16 py-48 md:px-24 md:py-96">
          <div className="flex flex-col gap-32">
            <Reveal>
              <div className="flex flex-col gap-8">
                <span className="font-mono text-mono-label uppercase tracking-wide text-ink-faint">
                  What I Do
                </span>
                <h2 className="text-h2 md:text-h2-lg text-ink font-display">Services</h2>
              </div>
            </Reveal>

            <RevealList className="grid gap-24 md:grid-cols-3">
              {services.map((service) => {
                // Get Lucide Icon dynamically
                const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Cpu;

                return (
                  <RevealItem key={service.id}>
                    <div className="group relative flex h-full flex-col gap-24 rounded-3xl border border-border/60 bg-gradient-to-b from-paper to-surface p-24 shadow-skeu transition-all duration-300 hover:-translate-y-1 hover:shadow-skeu-sm md:p-32">
                      <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-accent-subtle text-accent transition-colors group-hover:bg-accent group-hover:text-paper">
                        <IconComponent size={24} />
                      </div>
                      
                      <div className="flex flex-col gap-12">
                        <h3 className="font-display text-h3 text-ink font-semibold">{service.title}</h3>
                        <p className="text-body text-ink-muted leading-relaxed">{service.description}</p>
                      </div>

                      <ul className="mt-auto flex flex-col gap-8 border-t border-border/40 pt-16">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-8 text-mono-label text-ink-muted">
                            <span className="mt-4 flex h-6 w-6 shrink-0 rounded-full bg-accent/30" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </RevealItem>
                );
              })}
            </RevealList>
          </div>
        </div>
      </section>

      {/* ── Skills & Tech Stack Section ── */}
      <section className="bg-surface border-t border-border/50">
        <div className="mx-auto max-w-5xl px-16 py-48 md:px-24 md:py-96">
          <div className="flex flex-col gap-32">
            <Reveal>
              <div className="flex flex-col gap-8">
                <span className="font-mono text-mono-label uppercase tracking-wide text-ink-faint">
                  Stack
                </span>
                <h2 className="text-h2 md:text-h2-lg text-ink font-display">Technical Toolkit</h2>
              </div>
            </Reveal>

            <RevealList className="grid gap-24 md:grid-cols-2">
              {categories.map(([key, tools]) => (
                <RevealItem key={key}>
                  <div className="flex flex-col gap-16 rounded-3xl border border-border/40 bg-paper p-24 shadow-neu md:p-32">
                    <h3 className="text-mono-label font-mono uppercase tracking-wider text-ink-faint border-b border-border/40 pb-8">
                      {CATEGORY_LABELS[key] ?? key}
                    </h3>
                    <div className="flex flex-wrap gap-8">
                      {tools.map((tool) => (
                        <span
                          key={tool}
                          className="rounded-full border border-border/70 bg-gradient-to-b from-paper to-surface px-12 py-6 text-mono-label font-mono text-ink-muted shadow-skeu-sm hover:border-accent hover:text-accent transition-colors cursor-default"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealList>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="bg-paper border-t border-border/50">
        <div className="mx-auto max-w-5xl px-16 py-64 text-center md:px-24 md:py-96">
          <Reveal className="flex flex-col items-center gap-24">
            <h2 className="text-h2 md:text-h2-lg text-ink font-display">Have a project in mind?</h2>
            <p className="max-w-md text-body text-ink-muted">
              Whether you need a custom AI integration, an automated workflow, or a polished full-stack application, let's build something exceptional together.
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
