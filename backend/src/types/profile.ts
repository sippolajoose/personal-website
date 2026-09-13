export interface ProfileLink {
  label: string;
  url: string;
}

export interface LocalizedText {
  fi: string;
  en: string;
}

export type LocalizedTextValue = string | LocalizedText;

export interface SocialProfile {
  platform: 'github' | 'linkedin' | 'website' | 'x' | 'other';
  label: string;
  url: string;
}

export interface ExperienceEntry {
  company: string;
  role: LocalizedTextValue;
  startDate: string;
  endDate?: string;
  summary: LocalizedTextValue;
  highlights: LocalizedTextValue[];
  technologies: string[];
}

export interface EducationEntry {
  institution: LocalizedTextValue;
  degree: LocalizedTextValue;
  startDate: string;
  endDate?: string;
  summary?: LocalizedTextValue;
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
  summary: LocalizedTextValue;
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
