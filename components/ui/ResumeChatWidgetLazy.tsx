'use client';

import dynamic from 'next/dynamic';

/**
 * Client boundary that defers loading the resume chat widget.
 *
 * The widget is a large client island (framer-motion + streaming chat UI) that
 * nothing above the fold depends on. Keeping it out of the initial bundle stops
 * it from contributing to main-thread blocking during first load / first scroll
 * on mobile, where that cost is most visible.
 *
 * `ssr: false` lives here rather than in `app/layout.tsx` because Next does not
 * allow it inside a Server Component. The widget already renders nothing until
 * it has mounted, so skipping SSR changes no markup.
 */
const ResumeChatWidget = dynamic(
  () => import('@/components/ui/ResumeChatWidget').then((m) => m.ResumeChatWidget),
  { ssr: false },
);

export function ResumeChatWidgetLazy() {
  return <ResumeChatWidget />;
}
