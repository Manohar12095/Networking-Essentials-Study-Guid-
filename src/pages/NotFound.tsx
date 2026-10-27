import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4 animate-fade-in">
      <div className="w-14 h-14 rounded-full bg-[var(--alert)]/15 text-[var(--alert)] flex items-center justify-center mx-auto">
        <AlertCircle size={28} />
      </div>
      <h1 className="text-2xl font-extrabold text-[var(--ink)]">404 - Page Not Found</h1>
      <p className="text-xs sm:text-sm text-[var(--muted)] font-serif leading-relaxed">
        The requested URL was not found in the study guide syllabus.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[var(--packet)] text-white text-xs font-sans font-bold border-b-0 hover:opacity-90 shadow-sm"
      >
        <Home size={14} />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};
