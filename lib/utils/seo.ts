import siteJson from '@/content/site.json';
import socialJson from '@/content/social.json';
import type { Project } from '@/lib/content/content';

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteJson.name,
    jobTitle: siteJson.role,
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteJson.location,
    },
    url: 'https://ravinnallasamy.netlify.app',
    sameAs: [socialJson.github, `https://${socialJson.linkedin}`],
    email: `mailto:${socialJson.email}`,
  };
}

export function projectJsonLd(project: Project) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: project.title,
    description: project.summary,
    programmingLanguage: project.stack,
    codeRepository: project.repos[0]?.url,
    dateCreated: project.year,
  };
}
