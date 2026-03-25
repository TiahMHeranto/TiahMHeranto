// components/Skills.tsx
import React from 'react';
import { skillCategories } from '../data/skills';

const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-20 bg-light-secondary dark:bg-dark-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills & Expertise</h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            A diverse skill set spanning technology, security, and finance
          </p>
          <div className="w-20 h-1 bg-primary-600 mx-auto mt-4"></div>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category) => (
            <div
              key={category.name}
              className="bg-light-bg dark:bg-dark-bg rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">{category.icon}</span>
                <h3 className="text-xl font-semibold">{category.name}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-primary-600/10 text-primary-600 dark:text-primary-400 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;