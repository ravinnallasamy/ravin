import { SkeletonCard, SkeletonChart, SkeletonStatGrid } from './Skeleton';

/** Full-page loading placeholder shown while the dashboard streams in via Suspense. */
export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-24" aria-busy="true" aria-label="Loading dashboard">
      <div className="flex flex-col gap-24 rounded-3xl border border-border/60 bg-paper p-24 shadow-glass md:p-32">
        <SkeletonStatGrid count={6} />
      </div>
      <SkeletonCard lines={4} />
      <div className="grid gap-24 md:grid-cols-2">
        <SkeletonCard lines={4} />
        <div className="rounded-3xl border border-border/60 bg-paper p-24 shadow-neu md:p-32">
          <SkeletonChart height={240} />
        </div>
      </div>
      <div className="rounded-3xl border border-border/60 bg-paper p-24 shadow-neu md:p-32">
        <SkeletonChart height={200} />
      </div>
      <div className="grid gap-24 md:grid-cols-2">
        <SkeletonCard lines={4} />
        <SkeletonCard lines={4} />
      </div>
      <SkeletonCard lines={6} />
    </div>
  );
}
