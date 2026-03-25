// components/Projects.tsx
import React from 'react';
import { Globe, ExternalLink, Code, Shield, TrendingUp, Network, Database } from 'lucide-react';
import { projects } from '../data/projects';

const getIcon = (category: string) => {
  switch(category) {
    case 'Web Development': return <Code size={24} />;
    case 'Automation': return <Database size={24} />;
    case 'Networking & Security': return <Shield size={24} />;
    case 'Finance & Trading': return <TrendingUp size={24} />;
    default: return <Network size={24} />;
  }
};

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            A collection of my work spanning web development, automation, networking, and financial analytics
          </p>
          <div className="w-20 h-1 bg-primary-600 mx-auto mt-4"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-light-secondary dark:bg-dark-secondary rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative h-48 bg-gradient-to-br from-primary-600/20 to-secondary-600/20 flex items-center justify-center">
                <div className="text-primary-600 group-hover:scale-110 transition-transform duration-300">
                  {getIcon(project.category)}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-primary-600/10 text-primary-600 dark:text-primary-400 rounded text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex space-x-4">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm hover:text-primary-600 transition-colors"
                    >
                      <Globe size={16} className="mr-1" />
                      Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm hover:text-primary-600 transition-colors"
                    >
                      <ExternalLink size={16} className="mr-1" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;