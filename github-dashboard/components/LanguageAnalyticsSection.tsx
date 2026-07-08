import { PieChartGeneric, BarChartGeneric, CHART_PALETTE } from '../charts';
import { languagesToSlices } from '../utils/graph';
import { DashboardCard } from './DashboardCard';
import { EmptySectionState } from './DashboardStatus';
import type { LanguageStat } from '../types';

export function LanguageAnalyticsSection({ languages }: { languages: LanguageStat[] }) {
  if (languages.length === 0) {
    return (
      <DashboardCard eyebrow="Stack" title="Language Breakdown">
        <EmptySectionState message="No language data available yet." />
      </DashboardCard>
    );
  }

  const slices = languagesToSlices(languages, 6);
  const pieData = slices.map((s, i) => ({ label: s.label, value: s.value, color: CHART_PALETTE[i % CHART_PALETTE.length] }));
  const barData = slices.map((s) => ({ x: s.label, y: s.percentage }));

  return (
    <DashboardCard eyebrow="Stack" title="Language Breakdown">
      <div className="grid gap-24 md:grid-cols-2">
        <PieChartGeneric
          data={pieData}
          valueFormat="bytes"
          ariaLabel="Language distribution by bytes of code"
        />
        <BarChartGeneric
          data={barData}
          layout="vertical"
          valueFormat="percent"
          height={Math.max(180, barData.length * 36)}
          ariaLabel="Language share by percentage"
        />
      </div>
      <ul className="grid grid-cols-2 gap-8 md:grid-cols-3">
        {languages.slice(0, 9).map((lang, i) => (
          <li key={lang.name} className="flex items-center gap-8 text-mono-label text-ink-muted">
            <span
              className="h-8 w-8 shrink-0 rounded-full"
              style={{ backgroundColor: CHART_PALETTE[i % CHART_PALETTE.length] }}
              aria-hidden
            />
            <span className="truncate">{lang.name}</span>
            <span className="ml-auto text-ink-faint">{lang.percentage}%</span>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
