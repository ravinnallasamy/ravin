'use client';

/**
 * Hero identity strip: avatar, name, ranking/rating/reputation chips, total
 * solved, and last-updated timestamp. Profile fields are individually
 * optional (LeetCode users can hide real name / country), so each renders
 * conditionally rather than falling back to a fake value.
 */

import { motion, useReducedMotion } from 'framer-motion';
import { Github, Globe, Linkedin, MapPin, Trophy, Twitter } from 'lucide-react';
import type { ContestData, LeetcodeProfile, ProblemStats } from '../types';

interface HeroProps {
  username: string;
  profile: LeetcodeProfile | null;
  problemStats: ProblemStats | null;
  contest: ContestData | null;
  generatedAt: string;
}

function StatChip({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex min-w-0 items-center gap-8 rounded-2xl border border-border/50 bg-paper px-16 py-12 shadow-sm">
      <div className="flex min-w-0 flex-col">
        <span className="break-words font-display text-h3 text-ink leading-none">{value}</span>
        <span className="break-words font-mono text-mono-label text-ink-faint">{label}</span>
      </div>
    </div>
  );
}

export function Hero({ username, profile, problemStats, contest, generatedAt }: HeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const lastUpdated = new Date(generatedAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <motion.section
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex min-w-0 flex-col gap-32 overflow-x-clip rounded-3xl border border-border/60 bg-gradient-to-b from-paper to-surface p-24 shadow-glass md:p-32"
    >
      <div className="flex min-w-0 flex-col gap-24 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-16">
          {profile?.avatarUrl && (
            <img
              src={profile.avatarUrl}
              alt=""
              width={72}
              height={72}
              className="h-64 w-64 shrink-0 rounded-2xl border border-border/60 object-cover shadow-sm"
            />
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <span className="font-mono text-mono-label uppercase text-ink-faint">LeetCode Analytics</span>
            <h1 className="break-words font-display text-h1 md:text-h1-lg text-ink">
              {profile?.realName || username}
            </h1>
            <div className="flex flex-wrap items-center gap-12 text-mono-label text-ink-faint">
              <span>@{username}</span>
              {profile?.country && (
                <span className="inline-flex items-center gap-4">
                  <MapPin size={13} aria-hidden />
                  {profile.country}
                </span>
              )}
              {profile?.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 hover:text-accent">
                  <Github size={13} aria-hidden />
                  GitHub
                </a>
              )}
              {profile?.twitterUrl && (
                <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 hover:text-accent">
                  <Twitter size={13} aria-hidden />
                  Twitter
                </a>
              )}
              {profile?.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 hover:text-accent">
                  <Linkedin size={13} aria-hidden />
                  LinkedIn
                </a>
              )}
              {profile?.websites?.[0] && (
                <a href={profile.websites[0]} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 hover:text-accent">
                  <Globe size={13} aria-hidden />
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
        <p className="font-mono text-mono-label text-ink-faint">Last updated {lastUpdated}</p>
      </div>

      <div className="grid grid-cols-2 gap-12 md:grid-cols-3 lg:grid-cols-6">
        <StatChip label="Total solved" value={problemStats?.totalSolved ?? '—'} />
        {profile?.ranking != null && <StatChip label="Global ranking" value={`#${profile.ranking.toLocaleString()}`} />}
        {contest && (
          <StatChip
            label="Contest rating"
            value={
              <span className="inline-flex items-center gap-4">
                <Trophy size={14} className="text-accent" aria-hidden />
                {Math.round(contest.ranking.rating)}
              </span>
            }
          />
        )}
        {profile?.reputation != null && <StatChip label="Reputation" value={profile.reputation} />}
      </div>
    </motion.section>
  );
}
