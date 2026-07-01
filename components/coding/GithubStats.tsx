import { getGithubStats } from '@/lib/github';
import { StatReadout } from '@/components/ui/StatReadout';
import { Reveal } from '@/components/ui/Reveal';

export async function GithubStats() {
  const github = await getGithubStats();

  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-5xl px-16 py-48 md:px-24 md:py-96">
        <Reveal>
          <div className="flex flex-col gap-16">
            <h3 className="text-mono-label font-mono uppercase tracking-wide text-ink-faint">GitHub</h3>
            {github ? (
              <div className="grid grid-cols-2 gap-32 rounded-xl border-none bg-surface p-24 shadow-neu md:grid-cols-4">
                <StatReadout label="repositories" value={String(github.repoCount)} />
                <StatReadout label="commits (year)" value={String(github.recentCommits)} />
                <StatReadout label="pull requests" value={String(github.recentPullRequests)} />
                <StatReadout label="top language" value={github.topLanguages[0] ?? '—'} />
              </div>
            ) : (
              <p className="rounded-xl border-none bg-surface p-24 font-mono text-mono-label text-ink-faint shadow-neu">
                GitHub stats unavailable right now.
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
