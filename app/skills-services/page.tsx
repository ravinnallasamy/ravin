import type { Metadata } from 'next';
import { getSkills, getServices } from '@/lib/content';
import { Reveal, RevealList, RevealItem } from '@/components/ui/Reveal';
import { Hero } from '@/components/skills-services/Hero';
import * as LucideIcons from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Skills & Services',
  description: 'Full-stack development, AI & RAG engineering, conversational AI, mobile apps, automation, and SEO/AEO services offered by Ravin Nallasamy.',
};

export default function SkillsServicesPage() {
  const { categories } = getSkills();
  const services = getServices();

  return (
    <div className="flex flex-col">
      {/* ── Hero Section ── */}
      <Hero />

      {/* ── Services Section ── */}
      <section id="services" className="bg-paper border-t border-border/50">
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

            <RevealList className="grid gap-20 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                // Get Lucide Icon dynamically
                const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Cpu;

                return (
                  <RevealItem key={service.id}>
                    <div className="group relative flex h-full flex-col gap-16 overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-paper to-surface p-24 shadow-skeu-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-skeu">
                      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/0 blur-2xl transition-colors duration-300 group-hover:bg-accent/20" />

                      <div className="flex h-48 w-48 items-center justify-center rounded-xl bg-accent-subtle text-accent transition-colors group-hover:bg-accent group-hover:text-paper">
                        <IconComponent size={22} />
                      </div>

                      <div className="flex flex-col gap-6">
                        <h3 className="font-display text-h3 text-ink font-semibold">{service.title}</h3>
                        <p className="text-body text-ink-muted leading-relaxed">{service.description}</p>
                      </div>

                      <ul className="mt-auto flex flex-col gap-8 border-t border-border/40 pt-12">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-8 text-mono-label text-ink-muted">
                            <LucideIcons.Check size={14} className="shrink-0 text-accent" strokeWidth={2.5} />
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

            <RevealList className="grid gap-16 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                const IconComponent = (LucideIcons as any)[category.icon] || LucideIcons.Cpu;

                return (
                  <RevealItem key={category.key}>
                    <div className="group flex h-full flex-col gap-12 rounded-2xl border border-border/60 bg-gradient-to-b from-paper to-surface p-20 shadow-skeu-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-skeu">
                      <div className="flex items-center gap-10">
                        <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-xl bg-accent-subtle text-accent transition-colors group-hover:bg-accent group-hover:text-paper">
                          <IconComponent size={16} />
                        </div>
                        <h3 className="font-display text-base text-ink font-semibold leading-tight">{category.label}</h3>
                      </div>

                      <div className="flex flex-wrap gap-8 border-t border-border/40 pt-12">
                        {category.items.map((tool) => (
                          <span
                            key={tool}
                            className="whitespace-nowrap rounded-full border border-border/70 bg-gradient-to-b from-paper to-surface px-10 py-4 text-xs font-mono text-ink-muted shadow-skeu-sm transition-colors hover:border-accent hover:text-accent cursor-default"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </RevealItem>
                );
              })}
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
              Whether you need a custom AI integration, an automated workflow, or a polished full-stack application, let&apos;s build something exceptional together.
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
