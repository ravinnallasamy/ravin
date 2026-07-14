// ---------------------------------------------------------------------------
// Google Analytics 4 (GA4) helpers.
//
// The Measurement ID is PUBLIC by design (Google embeds it in the browser),
// so it is hardcoded here rather than read from an env var — this guarantees
// analytics always loads in production without depending on host env config.
// ---------------------------------------------------------------------------

export const GA_MEASUREMENT_ID = 'G-2ERFTGKG3D';

/** True only when a GA4 Measurement ID is configured. */
export const isGaEnabled = GA_MEASUREMENT_ID.length > 0;

// Minimal typing for the gtag global injected by the GA script.
type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

/** Whether gtag is actually available on the page (script loaded + client). */
function gtagReady(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function' && isGaEnabled;
}

/**
 * Report a client-side page view to GA4. The App Router does NOT emit a page
 * view on client navigation automatically — GoogleAnalytics.tsx calls this on
 * every route change so single-page navigations are counted.
 */
export function pageview(url: string): void {
  if (!gtagReady()) return;
  window.gtag!('event', 'page_view', {
    page_path: url,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/**
 * Fire a custom GA4 event with arbitrary parameters. Use this for every
 * meaningful interaction (form submit, chat open, outbound click, …) so the
 * property collects a wide variety of engagement data, not just page views.
 *
 * @param action  GA4 event name, snake_case (e.g. 'contact_form_submit').
 * @param params  Event parameters — appear as custom dimensions/metrics in GA4.
 */
export function trackEvent(
  action: string,
  params: Record<string, string | number | boolean | undefined> = {},
): void {
  if (!gtagReady()) return;
  // Strip undefined values so GA4 doesn't record empty params.
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined),
  );
  window.gtag!('event', action, clean);
}

// ---------------------------------------------------------------------------
// Named event helpers — a small, discoverable catalogue of the events the
// site fires, so call sites stay consistent and typo-free.
// ---------------------------------------------------------------------------

/** An outbound link to another site (GitHub, LinkedIn, LeetCode, demos, …). */
export function trackOutboundClick(params: {
  label: string;
  url: string;
  location?: string;
}): void {
  trackEvent('outbound_click', {
    link_label: params.label,
    link_url: params.url,
    link_location: params.location,
  });
}

/** A project/work card or its repo/demo link being opened. */
export function trackProjectClick(params: {
  slug: string;
  title: string;
  kind: 'card' | 'repo' | 'demo';
}): void {
  trackEvent('project_click', {
    project_slug: params.slug,
    project_title: params.title,
    click_kind: params.kind,
  });
}

/** The resume-chat widget being opened, from whichever trigger. */
export function trackChatOpen(source: string): void {
  trackEvent('resume_chat_open', { open_source: source });
}

/** A question submitted to the resume-chat assistant. */
export function trackChatQuestion(questionLength: number): void {
  trackEvent('resume_chat_question', { question_length: questionLength });
}

/** The resume PDF being viewed/downloaded. */
export function trackResumeView(source: string): void {
  trackEvent('resume_view', { view_source: source });
}

/** The contact form being submitted. Report success/failure + traffic source. */
export function trackContactSubmit(params: {
  status: 'success' | 'error';
  utmSource?: string;
}): void {
  trackEvent('contact_form_submit', {
    form_status: params.status,
    utm_source: params.utmSource,
  });
}

/** A WhatsApp / phone / email quick-contact action. */
export function trackContactChannel(channel: 'whatsapp' | 'email' | 'phone', location?: string): void {
  trackEvent('contact_channel_click', { channel, link_location: location });
}
