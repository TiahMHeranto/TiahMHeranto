// types/index.ts
export interface NavItem {
  label: string;
  href: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
  category: string;
  featured: boolean;
}

export interface SkillCategory {
  name: string;
  icon: string;
  skills: string[];
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  period: string;
  description: string[];
  technologies: string[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}