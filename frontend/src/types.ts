export interface ProfileLink {
  label: string;
  url: string;
}

export interface SocialProfile {
  platform: 'github' | 'linkedin' | 'website' | 'x' | 'other';
  label: string;
  url: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  summary: string;
  highlights: string[];
  technologies: string[];
}

export interface EducationEntry {
  institution: string;
  degree: string;
  startDate: string;
  endDate?: string;
  summary?: string;
}

export interface CertificateEntry {
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface ProjectEntry {
  name: string;
  summary: string;
  url?: string;
  technologies: string[];
}

export interface ProfileDocument {
  _id: 'main';
  name: string;
  headline: string;
  summary: string;
  location: string;
  email: string;
  photoUrl?: string;
  links: ProfileLink[];
  socialLinks: SocialProfile[];
  skills: string[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  certificates: CertificateEntry[];
  projects: ProjectEntry[];
}
