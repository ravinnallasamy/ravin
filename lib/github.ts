import socialJson from '@/content/social.json';

export interface GithubStats {
  repoCount: number;
  topLanguages: string[];
  recentCommits: number;
  recentPullRequests: number;
}

function getUsername(): string {
  return socialJson.github.replace(/\/$/, '').split('/').pop() ?? '';
}

const QUERY = `
  query GithubStats($login: String!) {
    user(login: $login) {
      repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
        totalCount
        nodes {
          primaryLanguage {
            name
          }
        }
      }
      contributionsCollection {
        totalCommitContributions
        totalPullRequestContributions
      }
    }
  }
`;

export async function getGithubStats(): Promise<GithubStats | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: QUERY, variables: { login: getUsername() } }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const json = await res.json();
    const user = json?.data?.user;
    if (!user) return null;

    const languageCounts = new Map<string, number>();
    for (const repo of user.repositories.nodes as { primaryLanguage: { name: string } | null }[]) {
      const lang = repo.primaryLanguage?.name;
      if (!lang) continue;
      languageCounts.set(lang, (languageCounts.get(lang) ?? 0) + 1);
    }
    const topLanguages = [...languageCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);

    return {
      repoCount: user.repositories.totalCount,
      topLanguages,
      recentCommits: user.contributionsCollection.totalCommitContributions,
      recentPullRequests: user.contributionsCollection.totalPullRequestContributions,
    };
  } catch {
    return null;
  }
}
