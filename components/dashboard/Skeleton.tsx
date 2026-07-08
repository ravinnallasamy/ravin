/**
 * Shimmering placeholder blocks for loading states. Single source of truth for
 * BOTH dashboard modules (each re-exports this file).
 */

export function Skeleton({
  className = '',
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return <div className={`animate-pulse rounded-xl bg-surface-raised ${className}`} style={style} aria-hidden />;
}

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="flex flex-col gap-16 rounded-3xl border border-border/60 bg-paper p-24 shadow-neu md:p-32">
      <Skeleton className="h-16 w-1/3" />
      <div className="flex flex-col gap-8">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
}

export function SkeletonStatGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-16 md:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-8 rounded-2xl border border-border/50 bg-paper p-16 shadow-sm">
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-24 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart({ height = 240 }: { height?: number }) {
  return <Skeleton className="w-full" style={{ height }} />;
}
