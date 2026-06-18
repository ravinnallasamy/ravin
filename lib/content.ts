import siteJson from '@/content/site.json';
import socialJson from '@/content/social.json';
import skillsJson from '@/content/skills.json';
import projectsJson from '@/content/projects.json';
import certificationsJson from '@/content/certifications.json';

export interface Site {
  name: string;
  role: string;
  location: string;
  mission: string;
  experienceMonths: number;
  openToFreelance: boolean;
  statusLine: string;
}

export interface Social {
  github: string;
  linkedin: string;
  leetcodeUsername: string;
  email: string;
  calBookingUrl: string;
}

export interface Skills {
  frontend: string[];
  backend: string[];
  ai: string[];
  automation: string[];
}

export type ProjectStatus = 'shipped' | 'in-progress' | 'archived';

export interface ProjectRepo {
  label: string;
  url: string;
}

export interface Project {
  slug: string;
  priority: number;
  title: string;
  tagline: string;
  summary: string;
  highlights: string[];
  stack: string[];
  status: ProjectStatus;
  year: string;
  collection?: string;
  repos: ProjectRepo[];
  demo: string | null;
  cover: string;
  _notes?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  year: string;
  credentialUrl: string;
  image: string;
}

export function getSite(): Site {
  return siteJson;
}

export function getSocial(): Social {
  return socialJson as Social;
}

export function getSkills(): Skills {
  return skillsJson;
}

export function getProjects(): Project[] {
  return (projectsJson as Project[])
    .slice()
    .sort((a, b) => a.priority - b.priority);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function getCertifications(): Certification[] {
  return certificationsJson as Certification[];
}
