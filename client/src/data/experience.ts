// data/experience.ts
import { type Experience } from '../types';

export const experiences: Experience[] = [
  {
    id: 1,
    company: "Dilann Tours",
    role: "Full-Stack Developer & Automation Specialist",
    period: "2023 - Present",
    description: [
      "Developed full-stack web application for tour management using Vite+React+TypeScript and Express.js+PostgreSQL",
      "Created VBA automation platform that reduced vehicle scheduling time by 60%",
      "Implemented real-time booking system with integrated payment processing"
    ],
    technologies: ["React", "TypeScript", "Express.js", "PostgreSQL", "VBA"]
  },
  {
    id: 2,
    company: "RAMANANDRAIBE Exportation",
    role: "Web Developer & Process Optimizer",
    period: "2022 - 2023",
    description: [
      "Built enterprise process management platform with Symfony and MySQL",
      "Optimized export documentation workflow reducing processing time by 40%",
      "Implemented secure authentication and authorization systems"
    ],
    technologies: ["Symfony", "PHP", "MySQL", "Bootstrap", "Security"]
  },
  {
    id: 3,
    company: "AUXIMAD",
    role: "Network Administrator & Developer",
    period: "2021 - 2022",
    description: [
      "Developed network traffic prioritization tool for QoS management",
      "Managed network infrastructure for 200+ users",
      "Implemented security protocols and monitoring systems"
    ],
    technologies: ["Python", "Networking", "Security", "Monitoring"]
  },
  {
    id: 4,
    company: "Konecta",
    role: "IT Support Specialist",
    period: "2020 - 2021",
    description: [
      "Provided technical support for enterprise clients",
      "Managed ticketing system and resolved complex technical issues",
      "Implemented remote support solutions and documentation"
    ],
    technologies: ["ITIL", "Ticketing Systems", "Customer Support"]
  }
];