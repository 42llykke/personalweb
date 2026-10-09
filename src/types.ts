export interface PersonalInfo {
  name: string;
  nameEn: string;
  roles: string[];
  location: string;
  phone: string;
  email: string;
  photoUrl: string;
  summaryParagraph: string;
  summaryExtended?: string;
  highlights: {
    label: string;
    value: string;
  }[];
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  major: string;
  period: string;
  expectedGraduation?: string;
  gpa?: string;
  courses: string[];
}

export interface InternshipItem {
  id: string;
  company: string;
  departmentRole: string;
  period: string;
  bullets: string[];
}

export interface SocialMediaPractice {
  platform: string;
  accountType: string;
  period: string;
  summary: string;
  metrics: {
    label: string;
    value: string;
    subtext?: string;
  }[];
  bullets: string[];
}

export interface SkillItem {
  category: string;
  skills: string;
}

export interface AwardItem {
  id: string;
  year: string;
  title: string;
  level: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  role: string;
  period: string;
  tag: string;
  summary: string;
  bullets: string[];
  deliverables: string[];
}

export interface PortfolioItem {
  id: string;
  iconType: string;
  category: string;
  direction: string;
  title: string;
  client: string;
  year: string;
  summary: string;
  details: string[];
  tags: string[];
  image: string;
  pages?: string[];
}

export type PersonaMode = 'executor' | 'creator';
export type CursorMode = 'default' | 'hover' | 'drag' | 'speed';
export type Language = 'zh' | 'en';

export interface ResumeData {
  personal: PersonalInfo;
  education: EducationItem[];
  internships: InternshipItem[];
  projects: ProjectItem[];
  portfolio?: PortfolioItem[];
  socialMedia: SocialMediaPractice;
  skills: SkillItem[];
  awards: AwardItem[];
}
