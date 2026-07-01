import type { Metadata } from 'next';
import { Hero } from '@/components/coding/Hero';
import { GithubStats } from '@/components/coding/GithubStats';
import { LeetcodeStats } from '@/components/coding/LeetcodeStats';

export const metadata: Metadata = {
  title: 'Coding',
  description: 'Live GitHub and LeetCode stats.',
};

export default function CodingPage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <GithubStats />
      <LeetcodeStats />
    </div>
  );
}
