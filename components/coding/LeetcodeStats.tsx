import { getLeetcodeStats } from '@/lib/leetcode';
import { StatReadout } from '@/components/ui/StatReadout';
import { Reveal } from '@/components/ui/Reveal';

export async function LeetcodeStats() {
  const leetcode = await getLeetcodeStats();

  return (
    <section>
      <div className="mx-auto max-w-5xl px-16 py-48 md:px-24 md:py-96">
        <Reveal>
          <div className="flex flex-col gap-16">
            <h3 className="text-mono-label font-mono uppercase tracking-wide text-ink-faint">LeetCode</h3>
            {leetcode ? (
              <div className="grid grid-cols-2 gap-32 rounded-xl border-none bg-surface p-24 shadow-neu md:grid-cols-4">
                <StatReadout label="solved" value={String(leetcode.totalSolved)} />
                <StatReadout label="easy" value={String(leetcode.easySolved)} />
                <StatReadout label="medium" value={String(leetcode.mediumSolved)} />
                <StatReadout label="hard" value={String(leetcode.hardSolved)} />
              </div>
            ) : (
              <p className="rounded-xl border-none bg-surface-raised p-24 font-mono text-mono-label text-ink-faint shadow-neu">
                LeetCode stats unavailable right now.
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
