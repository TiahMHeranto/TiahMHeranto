// components/Quote.tsx
import React from 'react';

const Quote: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="text-6xl mb-6">"</div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 leading-relaxed">
          I used to build quietly. Now I'm building in public — merging cybersecurity with financial intelligence to create systems that are both secure and strategic.
        </h2>
        <p className="text-white/80 text-lg">- Heranto (TiahM)</p>
      </div>
    </section>
  );
};

export default Quote;