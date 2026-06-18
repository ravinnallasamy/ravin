import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarClock } from 'lucide-react';
import socialJson from '@/content/social.json';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ContactForm } from '@/components/sections/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch, or book time directly.',
};

export default function ContactPage() {
  const hasBooking = socialJson.calBookingUrl && socialJson.calBookingUrl !== 'REPLACE_ME';

  return (
    <section className="mx-auto max-w-5xl px-16 py-64 md:px-24 md:py-96">
      <div className="grid gap-48 md:grid-cols-2">
        <div className="flex flex-col gap-32">
          <SectionHeading as="h1" eyebrow="Contact" title="Get in touch" />
          <ContactForm />
        </div>

        <div className="flex flex-col gap-32">
          <div className="flex flex-col gap-12">
            <h3 className="text-mono-label font-mono uppercase tracking-wide text-ink-faint">Elsewhere</h3>
            <div className="flex flex-col gap-8">
              <Link href={socialJson.github} target="_blank" rel="noopener noreferrer" className="text-body text-ink hover:text-accent">
                GitHub
              </Link>
              <Link href={`https://${socialJson.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-body text-ink hover:text-accent">
                LinkedIn
              </Link>
              <Link href={socialJson.leetcodeUsername} target="_blank" rel="noopener noreferrer" className="text-body text-ink hover:text-accent">
                LeetCode
              </Link>
              <Link href={`mailto:${socialJson.email}`} className="text-body text-ink hover:text-accent">
                {socialJson.email}
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-12">
            <h3 className="text-mono-label font-mono uppercase tracking-wide text-ink-faint">Book time</h3>
            {hasBooking ? (
              <iframe
                src={socialJson.calBookingUrl}
                className="h-[600px] w-full border border-border"
                title="Book a meeting"
              />
            ) : (
              <div className="flex aspect-[4/3] flex-col items-center justify-center gap-12 border border-border bg-surface-raised px-16 text-center">
                <CalendarClock size={20} className="text-ink-faint" aria-hidden />
                <p className="text-mono-label font-mono text-ink-faint">Booking link coming soon</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
