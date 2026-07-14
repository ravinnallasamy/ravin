import siteJson from '@/content/site.json';
import socialJson from '@/content/social.json';
import skillsJson from '@/content/skills.json';
import projectsJson from '@/content/projects.json';
import certificationsJson from '@/content/certifications.json';
import servicesJson from '@/content/services.json';
import experienceJson from '@/content/experience.json';
import educationJson from '@/content/education.json';

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
  phone: string;
  calBookingUrl: string;
}

export interface SkillHighlight {
  label: string;
  category: string;
}

export interface SkillCategory {
  key: string;
  label: string;
  icon: string;
  description: string;
  items: string[];
}

export interface Skills {
  highlights: SkillHighlight[];
  categories: SkillCategory[];
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
  problem?: string;
  solution?: string;
  highlights: string[];
  stack: string[];
  status: ProjectStatus;
  year: string;
  collection?: string;
  repos: ProjectRepo[];
  demo: string | null;
  cover: string;
  screenshots?: string[];
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

export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
}

export interface ExperienceEntry {
  role: string;
  company: string;
  period: string;
  current?: boolean;
  description: string[];
  skills: string[];
}

export interface EducationEntry {
  degree: string;
  school: string;
  period: string;
  score?: string;
  level?: 'degree' | 'schooling';
  details: string[];
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

export function getServices(): Service[] {
  return servicesJson as Service[];
}

export function getExperience(): ExperienceEntry[] {
  return experienceJson as ExperienceEntry[];
}

export function getEducation(): EducationEntry[] {
  return educationJson as EducationEntry[];
}
