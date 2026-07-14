import { CalendarClock } from 'lucide-react';
import socialJson from '@/content/social.json';
import { ContentSection } from '@/components/ui/ContentSection';
import { TrackedLink } from '@/components/analytics/TrackedLink';

export function Elsewhere() {
  const hasBooking = socialJson.calBookingUrl && socialJson.calBookingUrl !== 'REPLACE_ME';

  return (
    <ContentSection tone="surface">
        <div className="grid gap-32 md:grid-cols-2 md:gap-48">
          <div className="flex flex-col gap-12">
            <h3 className="text-mono-label font-mono uppercase tracking-wide text-ink-faint">Elsewhere</h3>
            <div className="flex flex-col gap-8">
              <TrackedLink href={socialJson.github} eventLabel="GitHub" location="contact_elsewhere" target="_blank" rel="noopener noreferrer" className="text-body text-ink hover:text-accent">
                GitHub
              </TrackedLink>
              <TrackedLink href={`https://${socialJson.linkedin}`} eventLabel="LinkedIn" location="contact_elsewhere" target="_blank" rel="noopener noreferrer" className="text-body text-ink hover:text-accent">
                LinkedIn
              </TrackedLink>
              <TrackedLink href={socialJson.leetcodeUsername} eventLabel="LeetCode" location="contact_elsewhere" target="_blank" rel="noopener noreferrer" className="text-body text-ink hover:text-accent">
                LeetCode
              </TrackedLink>
              <TrackedLink href={`mailto:${socialJson.email}`} eventLabel="Email" channel="email" location="contact_elsewhere" className="text-body text-ink hover:text-accent">
                {socialJson.email}
              </TrackedLink>
            </div>
          </div>

          <div className="flex flex-col gap-12">
            <h3 className="text-mono-label font-mono uppercase tracking-wide text-ink-faint">Book time</h3>
            {hasBooking ? (
              <iframe
                src={socialJson.calBookingUrl}
                className="h-[480px] w-full rounded-xl border border-white/40 shadow-glass backdrop-blur-glass sm:h-[600px]"
                title="Book a meeting"
              />
            ) : (
              <div className="flex aspect-[4/3] flex-col items-center justify-center gap-12 rounded-xl border border-white/40 bg-paper/60 px-16 text-center shadow-glass backdrop-blur-glass">
                <CalendarClock size={20} className="text-ink-faint" aria-hidden />
                <p className="text-mono-label font-mono text-ink-faint">Booking link coming soon</p>
              </div>
            )}
          </div>
        </div>
    </ContentSection>
  );
}
