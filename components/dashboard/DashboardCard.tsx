/**
 * Shared card shell for dashboard sections, matching the site's surface/shadow
 * tokens. Single source of truth for BOTH the github-dashboard and
 * leetcode-dashboard modules (each re-exports this file).
 */

export function DashboardCard({
  title,
  eyebrow,
  action,
  children,
  className = '',
}: {
  title?: string;
  eyebrow?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex min-w-0 flex-col gap-16 overflow-x-clip rounded-3xl border border-border/60 bg-paper p-24 shadow-neu md:p-32 ${className}`}>
      {(title || eyebrow || action) && (
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between sm:gap-16">
          <div className="flex min-w-0 flex-col gap-4">
            {eyebrow && (
              <span className="font-mono text-mono-label uppercase text-ink-faint">{eyebrow}</span>
            )}
            {title && <h3 className="font-display text-h3 text-ink">{title}</h3>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
