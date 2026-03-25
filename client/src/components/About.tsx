// components/About.tsx
import React from 'react';
import { Briefcase, GraduationCap, Target, TrendingUp } from 'lucide-react';
import { experiences } from '../data/experience';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-light-secondary dark:bg-dark-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto"></div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold mb-4">The Intersection of Security & Finance</h3>
            <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6 leading-relaxed">
              I'm a Master's student in IoT & Cybersecurity with a Bachelor's in Network & Systems Administration, 
              combining deep technical expertise with a growing passion for finance. Currently, I'm building my 
              company <span className="font-semibold text-primary-600">TiahM</span> while pursuing my CFA/CMA 
              certification, creating a unique blend of skills at the crossroads of technology and finance.
            </p>
            <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6 leading-relaxed">
              My journey from network administrator to full-stack developer and now to a cybersecurity and finance 
              professional reflects my commitment to continuous learning and building systems that matter. Whether 
              it's securing IoT devices, optimizing network traffic, or analyzing market trends, I approach every 
              challenge with the same mindset: build secure, efficient, and intelligent solutions.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="flex items-center space-x-3">
                <GraduationCap className="text-primary-600" size={24} />
                <div>
                  <p className="font-semibold">Education</p>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">MSc IoT & Cybersecurity</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Briefcase className="text-primary-600" size={24} />
                <div>
                  <p className="font-semibold">Experience</p>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">4+ Years</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Target className="text-primary-600" size={24} />
                <div>
                  <p className="font-semibold">Current Focus</p>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Building TiahM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <TrendingUp className="text-primary-600" size={24} />
                <div>
                  <p className="font-semibold">Journey</p>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">CFA Candidate</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-semibold mb-6">Professional Journey</h3>
            <div className="space-y-6">
              {experiences.map((exp) => (
                <div key={exp.id} className="border-l-4 border-primary-600 pl-4">
                  <h4 className="text-xl font-semibold">{exp.company}</h4>
                  <p className="text-primary-600 mb-2">{exp.role} | {exp.period}</p>
                  <ul className="list-disc list-inside space-y-1 text-light-text-secondary dark:text-dark-text-secondary">
                    {exp.description.map((item, idx) => (
                      <li key={idx} className="text-sm">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;