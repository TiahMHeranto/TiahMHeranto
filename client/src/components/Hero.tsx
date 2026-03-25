// components/Hero.tsx
import React from 'react';
import { Globe, ChevronRight, Code, Shield, TrendingUp } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center pt-16 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-600/5 rounded-full blur-3xl"></div>
        <svg className="absolute bottom-0 left-0 w-full opacity-10" viewBox="0 0 1440 320">
          <path fill="currentColor" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center lg:text-left lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-2/3">
            <div className="inline-flex items-center space-x-2 bg-primary-600/10 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full mb-6">
              <span className="text-xl">👋</span>
              <span className="font-medium">Hi, I'm Heranto (TiahM)</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Securing Systems,
              </span>
              <br />
              <span>Building Solutions,</span>
              <br />
              <span className="bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent">
                Trading the Future
              </span>
            </h1>
            
            <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary mb-8 max-w-2xl mx-auto lg:mx-0">
              Building at the intersection of Technology, Finance, and Systems Thinking. 
              Master's student in IoT & Cybersecurity, freelance full-stack developer, and CFA aspirant.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium group"
              >
                View Projects
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center px-6 py-3 border border-light-border dark:border-dark-border rounded-lg hover:bg-light-secondary dark:hover:bg-dark-secondary transition-colors duration-200 font-medium"
              >
                Contact Me
              </a>
              <a
                href="https://github.com/tiahm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-light-border dark:border-dark-border rounded-lg hover:bg-light-secondary dark:hover:bg-dark-secondary transition-colors duration-200 font-medium"
              >
                <Globe className="mr-2" size={20} />
                GitHub
              </a>
            </div>
          </div>
          
          <div className="hidden lg:block lg:w-1/3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-light-secondary dark:bg-dark-secondary p-6 rounded-2xl transform hover:scale-105 transition-transform duration-300">
                <Shield className="w-12 h-12 text-primary-600 mb-3" />
                <p className="font-semibold">Cybersecurity</p>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">IoT Security Expert</p>
              </div>
              <div className="bg-light-secondary dark:bg-dark-secondary p-6 rounded-2xl transform hover:scale-105 transition-transform duration-300 mt-8">
                <Code className="w-12 h-12 text-secondary-600 mb-3" />
                <p className="font-semibold">Full-Stack Dev</p>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">React & Node.js</p>
              </div>
              <div className="bg-light-secondary dark:bg-dark-secondary p-6 rounded-2xl transform hover:scale-105 transition-transform duration-300">
                <TrendingUp className="w-12 h-12 text-primary-600 mb-3" />
                <p className="font-semibold">Finance</p>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">CFA Journey</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;