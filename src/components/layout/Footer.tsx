import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, BookOpen, CheckSquare, Layers, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="w-full mt-auto bg-[var(--surface)] border-t border-[var(--rule)] pt-8 pb-24 lg:pb-8 px-4 sm:px-6 transition-colors no-print"
      aria-label="Site Footer"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Section: Branding, Links & Back to Top */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 pb-6 border-b border-[var(--rule)]/60 text-center md:text-left">
          <div className="space-y-1.5 max-w-sm">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="w-6 h-6 rounded bg-[var(--ink)] text-[var(--mark)] flex items-center justify-center font-sans font-black text-xs">
                16M
              </span>
              <span className="font-sans font-extrabold text-base text-[var(--ink)] tracking-tight">
                Computer Networks Study Guide
              </span>
            </div>
            <p className="text-xs text-[var(--muted)] font-serif leading-relaxed">
              Autonomous, offline-first exam revision blueprint covering all high-yield 16-mark syllabus questions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-sans">
            <Link
              to="/unit/3"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)] hover:border-[var(--packet)] transition-colors border-b-0"
            >
              <Layers size={13} className="text-[var(--packet)]" />
              <span>Units 3, 4, 5</span>
            </Link>
            <Link
              to="/revise"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)] hover:border-[var(--packet)] transition-colors border-b-0"
            >
              <BookOpen size={13} className="text-[var(--packet)]" />
              <span>Revision Cards</span>
            </Link>
            <Link
              to="/quiz"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)] hover:border-[var(--signal)] transition-colors border-b-0"
            >
              <CheckSquare size={13} className="text-[var(--signal)]" />
              <span>Practice Quiz</span>
            </Link>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--paper)] border border-[var(--rule)] text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--rule)] transition-colors"
              title="Scroll back to top"
            >
              <ArrowUp size={13} />
              <span>Top</span>
            </button>
          </div>
        </div>

        {/* Bottom Section: Primary Attribution & Status */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          {/* Creator Credit Badge - Clearly & Prominently Displayed */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[var(--paper)] border border-[var(--rule)] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[var(--signal)] animate-pulse" />
            <span className="text-[var(--muted)]">Created by</span>
            <span className="font-bold text-sm text-[var(--ink)] tracking-tight">
              S. Manohar
            </span>
          </div>

          {/* Offline / Independent indicator */}
          <div className="flex items-center gap-2 text-[var(--muted)] text-[11px]">
            <ShieldCheck size={14} className="text-[var(--signal)]" />
            <span>Standalone & Offline Capable • GitHub Pages Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
