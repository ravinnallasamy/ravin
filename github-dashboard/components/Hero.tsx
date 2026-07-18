import { GitFork, Star, Users, Building2, Eye, GitCommitHorizontal } from 'lucide-react';
import siteJson from '@/content/site.json';
import type { MergedDashboard } from '../types';

function StatChip({
  icon,
  label,
  value,
  sublabel,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sublabel?: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-8 rounded-2xl border border-border/50 bg-paper px-16 py-12 shadow-sm">
      <span className="shrink-0 text-accent">{icon}</span>
      <div className="flex min-w-0 flex-col">
        <span className="font-display text-h3 text-ink leading-none">{value}</span>
        <span className="break-words font-mono text-mono-label text-ink-faint">{label}</span>
        {sublabel && (
          <span className="break-words font-mono text-mono-label text-ink-faint/70">{sublabel}</span>
        )}
      </div>
    </div>
  );
}

export function Hero({ dashboard }: { dashboard: MergedDashboard }) {
  const { statistics, meta } = dashboard;
  const currentYearContributions = dashboard.commitAggregate.yearly.find(
    (y) => y.key === String(new Date().getUTCFullYear()),
  )?.count ?? 0;

  const lastUpdated = new Date(meta.generatedAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <section className="flex min-w-0 flex-col gap-32 overflow-x-clip rounded-3xl border border-border/60 bg-gradient-to-b from-paper to-surface p-24 shadow-glass md:p-32">
      <div className="flex flex-col gap-8">
        <span className="font-mono text-mono-label uppercase tracking-wide text-ink-faint">
          Unified Developer Identity
        </span>
        <h1 className="break-words font-display text-h1 md:text-h1-lg text-ink">{siteJson.name}</h1>
        <p className="max-w-xl text-body text-ink-muted">
          {siteJson.role} · {siteJson.location} · Combined stats across {meta.accountsLoaded.length}{' '}
          {meta.accountsLoaded.length === 1 ? 'account' : 'accounts'}
        </p>
        <p className="font-mono text-mono-label text-ink-faint">Last updated {lastUpdated}</p>
      </div>

      <div className="grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-8">
        <StatChip
          icon={<GitFork size={18} aria-hidden />}
          label="Repositories"
          value={statistics.totalRepositories}
          sublabel={`${statistics.publicRepositories} public · ${statistics.privateRepositories} private`}
        />
        <StatChip icon={<Users size={18} aria-hidden />} label="Followers" value={statistics.totalFollowers} />
        <StatChip icon={<Users size={18} aria-hidden />} label="Following" value={statistics.totalFollowing} />
        <StatChip icon={<Star size={18} aria-hidden />} label="Stars" value={statistics.totalStars} />
        <StatChip icon={<GitFork size={18} aria-hidden />} label="Forks" value={statistics.totalForks} />
        <StatChip icon={<Building2 size={18} aria-hidden />} label="Organizations" value={statistics.totalOrganizations} />
        <StatChip
          icon={<GitCommitHorizontal size={18} aria-hidden />}
          label="Total Contributions"
          value={statistics.totalContributions}
        />
        <StatChip icon={<Eye size={18} aria-hidden />} label={`${new Date().getUTCFullYear()} Contributions`} value={currentYearContributions} />
      </div>
    </section>
  );
}
