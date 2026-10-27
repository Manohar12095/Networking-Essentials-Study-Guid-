import React, { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { storage, ThemeMode } from '../../lib/storage';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>(storage.getTheme());

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.add('light');
      }
    } else {
      root.classList.add(theme);
    }
    storage.setTheme(theme);
  }, [theme]);

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded border border-[var(--rule)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--packet)] transition-colors flex items-center gap-1.5 text-xs font-sans"
      title={`Current theme: ${theme}. Click to change`}
      aria-label="Toggle visual theme"
    >
      {theme === 'light' && <Sun size={16} className="text-[#E8B923]" />}
      {theme === 'dark' && <Moon size={16} className="text-[var(--packet)]" />}
      {theme === 'system' && <Monitor size={16} className="text-[var(--muted)]" />}
      <span className="capitalize hidden sm:inline">{theme}</span>
    </button>
  );
};
