// components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 border-t border-light-border dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          © 2026 Tiaheranto Mandaniaina. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;