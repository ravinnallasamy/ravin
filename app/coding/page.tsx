import type { Metadata } from 'next';
import { getGithubStats } from '@/lib/github';
import { getLeetcodeStats } from '@/lib/leetcode';
import { StatReadout } from '@/components/ui/StatReadout';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = {
  title: 'Coding',
  description: 'Live GitHub and LeetCode stats.',
};

export default async function CodingPage() {
  const [github, leetcode] = await Promise.all([getGithubStats(), getLeetcodeStats()]);

  return (
    <section className="mx-auto max-w-5xl px-16 py-64 md:px-24 md:py-96">
      <div className="flex flex-col gap-48">
        <SectionHeading eyebrow="Coding" title="GitHub & LeetCode activity" />

        <div className="flex flex-col gap-16">
          <h3 className="text-mono-label font-mono uppercase tracking-wide text-ink-faint">GitHub</h3>
          {github ? (
            <div className="grid grid-cols-2 gap-32 border border-border bg-surface p-24 md:grid-cols-4">
              <StatReadout label="repositories" value={String(github.repoCount)} />
              <StatReadout label="commits (year)" value={String(github.recentCommits)} />
              <StatReadout label="pull requests" value={String(github.recentPullRequests)} />
              <StatReadout label="top language" value={github.topLanguages[0] ?? '—'} />
            </div>
          ) : (
            <p className="border border-border bg-surface-raised p-24 font-mono text-mono-label text-ink-faint">
              GitHub stats unavailable right now.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-16">
          <h3 className="text-mono-label font-mono uppercase tracking-wide text-ink-faint">LeetCode</h3>
          {leetcode ? (
            <div className="grid grid-cols-2 gap-32 border border-border bg-surface p-24 md:grid-cols-4">
              <StatReadout label="solved" value={String(leetcode.totalSolved)} />
              <StatReadout label="easy" value={String(leetcode.easySolved)} />
              <StatReadout label="medium" value={String(leetcode.mediumSolved)} />
              <StatReadout label="hard" value={String(leetcode.hardSolved)} />
            </div>
          ) : (
            <p className="border border-border bg-surface-raised p-24 font-mono text-mono-label text-ink-faint">
              LeetCode stats unavailable right now.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
