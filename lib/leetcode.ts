import socialJson from '@/content/social.json';

export interface LeetcodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
}

function getUsername(): string {
  return socialJson.leetcodeUsername.replace(/\/$/, '').split('/').pop() ?? '';
}

export async function getLeetcodeStats(): Promise<LeetcodeStats | null> {
  const username = getUsername();
  if (!username) return null;

  try {
    const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const json = await res.json();
    if (json.status !== 'success') return null;

    return {
      totalSolved: json.totalSolved,
      easySolved: json.easySolved,
      mediumSolved: json.mediumSolved,
      hardSolved: json.hardSolved,
      ranking: json.ranking,
    };
  } catch {
    return null;
  }
}
