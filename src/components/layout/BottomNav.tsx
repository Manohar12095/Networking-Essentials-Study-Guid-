import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Layers, BookOpen, CheckSquare, Bookmark } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/unit/3', label: 'Units', icon: Layers },
    { to: '/revise', label: 'Revise', icon: BookOpen },
    { to: '/quiz', label: 'Quiz', icon: CheckSquare },
    { to: '/saved', label: 'Saved', icon: Bookmark },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface)] border-t border-[var(--rule)] lg:hidden transition-colors shadow-sm no-print"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-14 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 px-1 border-b-0 transition-colors text-center ${
                  isActive
                    ? 'text-[var(--packet)] font-semibold'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`
              }
            >
              <Icon size={19} className="mb-0.5" />
              <span className="text-[11px] font-sans tracking-tight">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
