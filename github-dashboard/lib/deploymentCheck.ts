import 'server-only';

/**
 * Runtime production-safety check for the GitHub dashboard's env config.
 * Distinct from `constants/env.ts`: that module is the typed accessor used
 * by the service layer to *operate*; this one is a read-only audit used by
 * the health route to *report* on configuration hygiene (placeholders,
 * missing vars, environment) without ever handing back secret values.
 */

const PLACEHOLDER_VALUES = new Set([
  'your_token_here',
  'your-primary-username',
  'your-secondary-username',
  'ghp_xxxxxxxxxxxxxxxxxxxx',
  'ghp_yyyyyyyyyyyyyyyyyyyy',
  'xxx',
  'changeme',
  '',
]);

const REQUIRED_VARS = [
  'GITHUB_USERNAME_PRIMARY',
  'GITHUB_TOKEN_PRIMARY',
  'GITHUB_USERNAME_SECONDARY',
  'GITHUB_TOKEN_SECONDARY',
] as const;

export interface DeploymentSecurityStatus {
  allVariablesPresent: boolean;
  noPlaceholders: boolean;
  environment: string;
  issues: string[];
}

function isPlaceholder(value: string): boolean {
  return PLACEHOLDER_VALUES.has(value.trim().toLowerCase());
}

/**
 * Audits the four required GitHub vars for presence and placeholder values.
 * Never returns the values themselves — only which names have issues.
 */
export function checkDeploymentSecurity(): DeploymentSecurityStatus {
  const environment = process.env.NODE_ENV ?? 'unknown';
  const issues: string[] = [];

  let allVariablesPresent = true;
  let noPlaceholders = true;

  for (const name of REQUIRED_VARS) {
    const value = process.env[name];

    if (value === undefined || value.trim() === '') {
      allVariablesPresent = false;
      issues.push(`${name} is not set.`);
      continue;
    }

    if (isPlaceholder(value)) {
      noPlaceholders = false;
      issues.push(`${name} is still set to a placeholder value.`);
    }
  }

  // Only PRIMARY is strictly required to operate (SECONDARY is an optional
  // second account, per constants/env.ts). Missing SECONDARY alone is not a
  // deployment blocker, so don't let it flip allVariablesPresent to false.
  const primaryMissing = issues.some((issue) =>
    issue.startsWith('GITHUB_USERNAME_PRIMARY') || issue.startsWith('GITHUB_TOKEN_PRIMARY'),
  );
  const secondaryPartial =
    (process.env.GITHUB_USERNAME_SECONDARY?.trim() ? 1 : 0) +
      (process.env.GITHUB_TOKEN_SECONDARY?.trim() ? 1 : 0) ===
    1;
  if (secondaryPartial) {
    issues.push(
      'GITHUB_USERNAME_SECONDARY and GITHUB_TOKEN_SECONDARY must both be set, or both left unset.',
    );
  }
  allVariablesPresent = !primaryMissing;

  console.log(`[github-dashboard] deployment check running in NODE_ENV=${environment}`);

  return { allVariablesPresent, noPlaceholders, environment, issues };
}
