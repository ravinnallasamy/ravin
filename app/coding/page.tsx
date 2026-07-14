import type { Metadata } from 'next';
import { Hero } from '@/components/coding/Hero';
import { MonthlyActivitySplit } from '@/components/coding/MonthlyActivitySplit';
import { DashboardSection } from '@/components/coding/DashboardSection';
import { CtaSection } from '@/components/ui/CtaSection';
import { loadDashboard as loadGithubDashboard } from '@/github-dashboard/api';
import { isDashboardConfigured } from '@/github-dashboard/constants/env';
import {
  DashboardSkeleton as GithubDashboardSkeleton,
  DashboardErrorState as GithubDashboardErrorState,
  DashboardUnconfiguredState as GithubDashboardUnconfiguredState,
  PartialDataBanner,
  Hero as GithubHero,
  DailyActivitySection,
  ProfileSummarySection,
  CommitAnalyticsSection,
  LanguageAnalyticsSection,
  RepoInsightsSection,
  RepositoryTable,
  ActivityTimelineSection,
  OrganizationsSection,
} from '@/github-dashboard/components';
import { loadDashboard as loadLeetcodeDashboard } from '@/leetcode-dashboard/api';
import { isLeetcodeConfigured } from '@/leetcode-dashboard/constants/env';
import {
  DashboardSkeleton as LeetcodeDashboardSkeleton,
  DashboardErrorState as LeetcodeDashboardErrorState,
  DashboardUnconfiguredState as LeetcodeDashboardUnconfiguredState,
  Hero as LeetcodeHero,
  ProblemOverviewSection,
  DifficultyDistributionSection,
  ContestAnalyticsSection,
  RecentActivitySection,
  TopicDistributionSection,
  PersonalInsightsSection,
} from '@/leetcode-dashboard/components';

export const metadata: Metadata = {
  title: 'Coding',
  description: 'Live GitHub and LeetCode stats.',
};

export default function CodingPage() {
  return (
    <div className="flex flex-col">
      <Hero />

      <DashboardSection
        id="github-dashboard"
        configured={isDashboardConfigured()}
        content={<GithubDashboardContent />}
        skeleton={<GithubDashboardSkeleton />}
        unconfigured={<GithubDashboardUnconfiguredState />}
      />

      <DashboardSection
        id="leetcode-dashboard"
        configured={isLeetcodeConfigured()}
        content={<LeetcodeDashboardContent />}
        skeleton={<LeetcodeDashboardSkeleton />}
        unconfigured={<LeetcodeDashboardUnconfiguredState />}
      />

      <CtaSection
        title="Like what you see?"
        description="These numbers come from real projects and daily problem-solving. If you want that same consistency on your team, let's talk."
      />
    </div>
  );
}

async function GithubDashboardContent() {
  const result = await loadGithubDashboard();

  if (!result.ok) {
    return <GithubDashboardErrorState error={result.error} />;
  }

  const dashboard = result.data;

  return (
    <div className="flex flex-col gap-24">
      <PartialDataBanner errors={dashboard.meta.errors} />
      <GithubHero dashboard={dashboard} />
      <ProfileSummarySection
        languages={dashboard.languages}
        repositories={dashboard.repositories}
        commitAggregate={dashboard.commitAggregate}
      />
      <DailyActivitySection daily={dashboard.commitAggregate.daily} />
      <MonthlyActivitySplit
        title="Contributions by Month"
        unitLabel="contribution"
        days={dashboard.heatmap.cells.map((cell) => ({ date: cell.date, count: cell.count }))}
      />
      <CommitAnalyticsSection
        commitAggregate={dashboard.commitAggregate}
        streaks={dashboard.streaks}
        peaks={dashboard.peaks}
      />
      <LanguageAnalyticsSection languages={dashboard.languages} />
      <RepoInsightsSection repositories={dashboard.repositories} />
      <RepositoryTable repositories={dashboard.repositories} />
      <div className="grid gap-24 lg:grid-cols-2">
        <ActivityTimelineSection events={dashboard.events} />
        <OrganizationsSection organizations={dashboard.organizations} />
      </div>
    </div>
  );
}

async function LeetcodeDashboardContent() {
  const result = await loadLeetcodeDashboard();

  if (!result.ok) {
    return <LeetcodeDashboardErrorState error={result.error} />;
  }

  const dashboard = result.data;
  const { profile, problemStats, calendar, contest, recent, topics } = dashboard;

  return (
    <div className="flex flex-col gap-24">
      <LeetcodeHero
        username={dashboard.username}
        profile={profile.data}
        problemStats={problemStats.data}
        contest={contest.data}
        generatedAt={dashboard.meta.generatedAt}
      />

      {problemStats.data && <ProblemOverviewSection stats={problemStats.data} />}
      {problemStats.data && <DifficultyDistributionSection stats={problemStats.data} />}

      {calendar.data && (
        <MonthlyActivitySplit
          title="Submissions by Month"
          unitLabel="submission"
          days={calendar.data.days.map((day) => ({ date: day.date, count: day.count }))}
          levelColors={['#ECE4D8', '#C8EAE3', '#7FD6C2', '#2FBBA0', '#00b8a3']}
        />
      )}

      <ContestAnalyticsSection contest={contest.data} />
      <RecentActivitySection recent={recent.data} />
      <TopicDistributionSection topics={topics.data} />

      <PersonalInsightsSection problemStats={problemStats.data} calendar={calendar.data} />
    </div>
  );
}
