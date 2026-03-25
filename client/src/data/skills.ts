// data/skills.ts
import { type SkillCategory } from '../types';

export const skillCategories: SkillCategory[] = [
  {
    name: "Web Development",
    icon: "🌐",
    skills: ["React", "TypeScript", "Node.js", "Express.js", "Symfony", "PHP", "PostgreSQL", "MongoDB", "REST APIs"]
  },
  {
    name: "Game Development",
    icon: "🎮",
    skills: ["Unity", "C#", "Game Design", "2D/3D Graphics"]
  },
  {
    name: "Automations & AI",
    icon: "🤖",
    skills: ["Python", "VBA", "Automation Scripts", "Machine Learning Basics", "Data Processing"]
  },
  {
    name: "Virtualization & Containers",
    icon: "🐳",
    skills: ["Docker", "Kubernetes", "VMware", "VirtualBox", "KVM"]
  },
  {
    name: "Cybersecurity & Networking",
    icon: "🔒",
    skills: ["Network Security", "Penetration Testing", "Firewalls", "IDS/IPS", "Wireshark", "Metasploit", "IoT Security"]
  },
  {
    name: "Finance & Trading",
    icon: "📈",
    skills: ["Financial Analysis", "Trading Strategies", "CFA Program", "Market Data Analysis", "Risk Management", "Quantitative Analysis"]
  }
];