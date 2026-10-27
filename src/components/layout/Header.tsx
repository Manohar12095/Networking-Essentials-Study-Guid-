import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bookmark, Wifi, WifiOff } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { FontSizeControl } from './FontSizeControl';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Shortcut '/' opens search unless user is already typing in an input
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        navigate('/search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  return (
    <header className="sticky top-0 z-40 bg-[var(--surface)] border-b border-[var(--rule)] px-4 py-2.5 transition-colors no-print">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 border-b-0 text-inherit hover:opacity-90 no-underline"
          title="Return to Study Guide Home"
        >
          <div className="w-8 h-8 rounded bg-[var(--ink)] text-[var(--mark)] flex items-center justify-center font-sans font-bold text-sm tracking-tight shadow-sm">
            16M
          </div>
          <div className="leading-tight">
            <div className="font-sans font-bold text-sm sm:text-base text-[var(--ink)]">
              Computer Networks
            </div>
            <div className="text-[11px] text-[var(--muted)] font-mono hidden sm:block">
              Exam Blueprint & Answer Engine
            </div>
          </div>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Offline / Online Status Pill */}
          <div
            className={`hidden md:flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono border ${
              isOnline
                ? 'border-[var(--signal)]/30 text-[var(--signal)] bg-[var(--signal)]/5'
                : 'border-[var(--alert)]/30 text-[var(--alert)] bg-[var(--alert)]/5'
            }`}
            title={
              isOnline
                ? 'Connected. PWA cache enabled for offline revision.'
                : 'Offline mode active. All content available from local storage.'
            }
          >
            {isOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
            <span>{isOnline ? 'Available offline' : 'Offline'}</span>
          </div>

          {/* Quick Search */}
          <button
            onClick={() => navigate('/search')}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded border border-[var(--rule)] bg-[var(--paper)] text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--packet)] transition-colors text-xs font-sans"
            aria-label="Search study guide"
            title="Search topics and exam keywords (Press /)"
          >
            <Search size={15} />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden lg:inline px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--rule)] text-[10px] font-mono">
              /
            </kbd>
          </button>

          {/* Bookmarks */}
          <Link
            to="/saved"
            className="p-2 rounded border border-[var(--rule)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--packet)] transition-colors border-b-0"
            title="View bookmarked questions"
            aria-label="Bookmarked questions"
          >
            <Bookmark size={16} />
          </Link>

          {/* Font Controls */}
          <div className="hidden sm:block">
            <FontSizeControl />
          </div>

          {/* Theme Mode Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
