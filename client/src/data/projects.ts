// data/projects.ts
import { type Project } from '../types';

export const projects: Project[] = [
  {
    id: 1,
    title: "Dilann Tours Web App",
    description: "A comprehensive full-stack web application for tour management, featuring real-time booking, itinerary planning, and customer management systems. Built with modern web technologies for optimal performance and user experience.",
    technologies: ["Vite", "React", "TypeScript", "Tailwind CSS", "Express.js", "PostgreSQL"],
    category: "Web Development",
    featured: true,
    githubUrl: "https://github.com/tiahm/dilann-tours-web",
  },
  {
    id: 2,
    title: "Dilann Tours VBA Platform",
    description: "Advanced vehicle scheduling platform built in Excel VBA, automating complex scheduling logic and resource allocation. Reduced manual planning time by 60% and eliminated scheduling conflicts.",
    technologies: ["Excel VBA", "Automation", "Data Processing"],
    category: "Automation",
    featured: true,
    githubUrl: "https://github.com/tiahm/dilann-vba-platform",
  },
  {
    id: 3,
    title: "RAMANANDRAIBE Exportation Platform",
    description: "Enterprise process management platform for export operations, streamlining supply chain workflows and documentation. Built with Symfony framework for robust business process optimization.",
    technologies: ["Symfony", "PHP", "MySQL", "Bootstrap"],
    category: "Web Development",
    featured: true,
    githubUrl: "https://github.com/tiahm/ramanandraibe-export",
  },
  {
    id: 4,
    title: "AUXIMAD Traffic Manager",
    description: "Network traffic prioritization tool with intuitive GUI for managing QoS policies. Enables network administrators to prioritize critical traffic and optimize bandwidth allocation.",
    technologies: ["Python", "Tkinter", "Network Protocols", "QoS"],
    category: "Networking & Security",
    featured: true,
    githubUrl: "https://github.com/tiahm/auximad-traffic-manager",
  },
  {
    id: 5,
    title: "TiahM Trade Analytics",
    description: "Next-generation trading analytics platform combining market data analysis with cybersecurity principles. Features real-time market monitoring, risk assessment algorithms, and secure transaction verification. Currently in active development.",
    technologies: ["React", "FastAPI", "Python", "Pandas", "WebSocket", "Cryptography"],
    category: "Finance & Trading",
    featured: true,
    githubUrl: "https://github.com/tiahm/tiahm-trade-analytics",
  }
];