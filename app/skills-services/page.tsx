import type { Metadata } from 'next';
import { getSkills, getServices } from '@/lib/content/content';
import { Reveal, RevealList, RevealItem } from '@/components/ui/Reveal';
import { Hero } from '@/components/skills-services/Hero';
import { ContentSection } from '@/components/ui/ContentSection';
import { CtaSection } from '@/components/ui/CtaSection';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Check } from 'lucide-react';
import { getContentIcon } from '@/lib/utils/icons';
import { metaForRoute } from '@/lib/seo/seo';
import { jsonLdForRoute } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';

export const revalidate = 3600;

export const metadata: Metadata = metaForRoute('skills-services');

export default function SkillsServicesPage() {
  const { categories } = getSkills();
  const services = getServices();

  return (
    <div className="flex flex-col">
      <JsonLd data={jsonLdForRoute('skills-services')} />
      {/* ── Hero Section ── */}
      <Hero />

      {/* ── Services Section ── */}
      <ContentSection id="services" tone="paper" borderTop>
          <div className="flex flex-col gap-32">
            <Reveal>
              <SectionHeading eyebrow="What I Do" title="Services" />
            </Reveal>

            <RevealList className="grid gap-20 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                // Resolve the icon by name from the tree-shakeable content map.
                const IconComponent = getContentIcon(service.icon);

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
                            <Check size={14} className="shrink-0 text-accent" strokeWidth={2.5} />
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
      </ContentSection>

      {/* ── Skills & Tech Stack Section ── */}
      <ContentSection tone="surface" borderTop>
          <div className="flex flex-col gap-32">
            <Reveal>
              <SectionHeading eyebrow="Stack" title="Technical Toolkit" />
            </Reveal>

            <RevealList className="grid gap-16 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                const IconComponent = getContentIcon(category.icon);

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
      </ContentSection>

      {/* ── CTA Section ── */}
      <CtaSection
        title="Have a project in mind?"
        description="Whether you need a custom AI integration, an automated workflow, or a polished full-stack application, let's build something exceptional together."
      />
    </div>
  );
}
