import 'server-only';

/**
 * Token rotation reminder. Purely informational — never blocks a request,
 * never throws. `GITHUB_TOKEN_LAST_ROTATED` is optional; when unset there is
 * simply nothing to report on.
 */

const EXPIRING_SOON_DAYS = 80;
const OVERDUE_DAYS = 90;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface TokenHealthStatus {
  daysSinceRotation: number | null;
  isExpiringSoon: boolean;
  isOverdue: boolean;
  message: string;
}

/** Reads GITHUB_TOKEN_LAST_ROTATED (ISO date string) and reports rotation age. */
export function checkTokenHealth(): TokenHealthStatus {
  const raw = process.env.GITHUB_TOKEN_LAST_ROTATED?.trim();

  if (!raw) {
    return {
      daysSinceRotation: null,
      isExpiringSoon: false,
      isOverdue: false,
      message:
        'GITHUB_TOKEN_LAST_ROTATED is not set; rotation age cannot be tracked.',
    };
  }

  const lastRotated = new Date(raw);
  if (Number.isNaN(lastRotated.getTime())) {
    return {
      daysSinceRotation: null,
      isExpiringSoon: false,
      isOverdue: false,
      message: `GITHUB_TOKEN_LAST_ROTATED ("${raw}") is not a valid ISO date.`,
    };
  }

  const daysSinceRotation = Math.floor(
    (Date.now() - lastRotated.getTime()) / MS_PER_DAY,
  );
  const isOverdue = daysSinceRotation > OVERDUE_DAYS;
  const isExpiringSoon = !isOverdue && daysSinceRotation > EXPIRING_SOON_DAYS;

  const message = isOverdue
    ? `GitHub tokens are ${daysSinceRotation} days old and overdue for rotation (> ${OVERDUE_DAYS} days).`
    : isExpiringSoon
      ? `GitHub tokens are ${daysSinceRotation} days old; rotate soon (> ${EXPIRING_SOON_DAYS} days).`
      : `GitHub tokens were rotated ${daysSinceRotation} days ago.`;

  return { daysSinceRotation, isExpiringSoon, isOverdue, message };
}
