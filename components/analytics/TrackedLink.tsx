'use client';

import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { trackOutboundClick, trackContactChannel } from '@/lib/analytics/gtag';

type Channel = 'whatsapp' | 'email' | 'phone';

interface TrackedLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Human-readable label recorded in GA4 (e.g. "GitHub"). */
  eventLabel: string;
  /** Where on the site the link lives (e.g. "contact_elsewhere"). */
  location?: string;
  /** If set, fire a contact_channel_click for email/phone/whatsapp instead of a generic outbound_click. */
  channel?: Channel;
  children: ReactNode;
}

/**
 * A plain <a> that reports a GA4 event on click before navigating. Use for
 * outbound links (social profiles, email/phone, demos) so click-throughs are
 * captured — internal <Link> navigations are already counted as page views.
 */
export function TrackedLink({ eventLabel, location, channel, href, children, ...rest }: TrackedLinkProps) {
  const handleClick = () => {
    if (channel) {
      trackContactChannel(channel, location);
    } else {
      trackOutboundClick({ label: eventLabel, url: href ?? '', location });
    }
  };

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
