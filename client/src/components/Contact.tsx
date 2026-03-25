// components/Contact.tsx
import React, { useState } from 'react';
import { Mail, Globe, Copy, Check, ExternalLink } from 'lucide-react';

const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('mandaniainatiaheranto@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? I'd love to hear from you.
          </p>
          <div className="w-20 h-1 bg-primary-600 mx-auto mt-4"></div>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-light-secondary dark:bg-dark-secondary rounded-xl p-8 shadow-lg">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-light-bg dark:bg-dark-bg rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="text-primary-600" size={24} />
                  <span className="text-light-text dark:text-dark-text">mandaniainatiaheranto@gmail.com</span>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="p-2 hover:bg-light-secondary dark:hover:bg-dark-secondary rounded-lg transition-colors"
                  aria-label="Copy email"
                >
                  {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                </button>
              </div>
              
              <a
                href="https://github.com/tiahm"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-light-bg dark:bg-dark-bg rounded-lg hover:bg-primary-600/10 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Globe className="text-primary-600" size={24} />
                  <span className="text-light-text dark:text-dark-text">github.com/tiahm</span>
                </div>
                <ExternalLink size={20} className="text-light-text-secondary dark:text-dark-text-secondary" />
              </a>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-light-text-secondary dark:text-dark-text-secondary">
                I'm currently open for freelance opportunities, collaborations, and interesting projects.
                Feel free to reach out!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;