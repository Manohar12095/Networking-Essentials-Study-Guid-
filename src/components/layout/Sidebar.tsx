import React, { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, CheckSquare, Bookmark, CheckCircle } from 'lucide-react';
import { TOPICS } from '../../data/topics';
import { storage } from '../../lib/storage';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  // Re-read progress when route changes so sidebar reflects current state
  const revisedSlugs = useMemo(() => storage.getProgress(), [location.pathname]);

  const unit3Topics = TOPICS.filter((t) => t.unit === 3);
  const unit4Topics = TOPICS.filter((t) => t.unit === 4);
  const unit5Topics = TOPICS.filter((t) => t.unit === 5);

  return (
    <aside
      className="hidden lg:block w-64 shrink-0 border-r border-[var(--rule)] bg-[var(--surface)] p-4 min-h-[calc(100vh-53px)] sticky top-[53px] self-start no-print overflow-y-auto text-sm"
      aria-label="Desktop sidebar"
    >
      <div className="space-y-6">
        {/* Core Navigation */}
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted)] mb-2 px-2">
            Navigation
          </div>
          <div className="space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded border-b-0 transition-colors ${
                  isActive
                    ? 'bg-[var(--packet)]/10 text-[var(--packet)] font-medium'
                    : 'text-[var(--ink)] hover:bg-[var(--paper)]'
                }`
              }
            >
              <Home size={17} />
              <span>Dashboard Home</span>
            </NavLink>

            <NavLink
              to="/revise"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded border-b-0 transition-colors ${
                  isActive
                    ? 'bg-[var(--packet)]/10 text-[var(--packet)] font-medium'
                    : 'text-[var(--ink)] hover:bg-[var(--paper)]'
                }`
              }
            >
              <BookOpen size={17} />
              <span>Revision Cards</span>
            </NavLink>

            <NavLink
              to="/quiz"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded border-b-0 transition-colors ${
                  isActive
                    ? 'bg-[var(--packet)]/10 text-[var(--packet)] font-medium'
                    : 'text-[var(--ink)] hover:bg-[var(--paper)]'
                }`
              }
            >
              <CheckSquare size={17} />
              <span>Exam Practice Quiz</span>
            </NavLink>

            <NavLink
              to="/saved"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded border-b-0 transition-colors ${
                  isActive
                    ? 'bg-[var(--packet)]/10 text-[var(--packet)] font-medium'
                    : 'text-[var(--ink)] hover:bg-[var(--paper)]'
                }`
              }
            >
              <Bookmark size={17} />
              <span>Saved Bookmarks</span>
            </NavLink>
          </div>
        </div>

        {/* Unit 3 Questions */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted)]">
              Unit 3 (Network)
            </span>
            <NavLink
              to="/unit/3"
              className="text-[11px] text-[var(--packet)] hover:underline border-b-0"
            >
              View
            </NavLink>
          </div>
          <div className="space-y-1">
            {unit3Topics.map((topic) => {
              const revised = revisedSlugs.includes(topic.slug);
              return (
                <NavLink
                  key={topic.slug}
                  to={`/topic/${topic.slug}`}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-1.5 rounded border-b-0 transition-colors text-xs ${
                      isActive
                        ? 'bg-[var(--packet)]/10 text-[var(--packet)] font-semibold'
                        : 'text-[var(--ink)] hover:bg-[var(--paper)]'
                    }`
                  }
                >
                  <span className="truncate">{topic.shortTitle}</span>
                  {revised && (
                    <CheckCircle
                      size={14}
                      className="text-[var(--signal)] shrink-0 ml-1"
                    />
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Unit 4 Questions */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted)]">
              Unit 4 (Transport)
            </span>
            <NavLink
              to="/unit/4"
              className="text-[11px] text-[var(--packet)] hover:underline border-b-0"
            >
              View
            </NavLink>
          </div>
          <div className="space-y-1">
            {unit4Topics.map((topic) => {
              const revised = revisedSlugs.includes(topic.slug);
              return (
                <NavLink
                  key={topic.slug}
                  to={`/topic/${topic.slug}`}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-1.5 rounded border-b-0 transition-colors text-xs ${
                      isActive
                        ? 'bg-[var(--packet)]/10 text-[var(--packet)] font-semibold'
                        : 'text-[var(--ink)] hover:bg-[var(--paper)]'
                    }`
                  }
                >
                  <span className="truncate">{topic.shortTitle}</span>
                  {revised && (
                    <CheckCircle
                      size={14}
                      className="text-[var(--signal)] shrink-0 ml-1"
                    />
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Unit 5 Questions */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted)]">
              Unit 5 (Application)
            </span>
            <NavLink
              to="/unit/5"
              className="text-[11px] text-[var(--packet)] hover:underline border-b-0"
            >
              View
            </NavLink>
          </div>
          <div className="space-y-1">
            {unit5Topics.map((topic) => {
              const revised = revisedSlugs.includes(topic.slug);
              return (
                <NavLink
                  key={topic.slug}
                  to={`/topic/${topic.slug}`}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-1.5 rounded border-b-0 transition-colors text-xs ${
                      isActive
                        ? 'bg-[var(--packet)]/10 text-[var(--packet)] font-semibold'
                        : 'text-[var(--ink)] hover:bg-[var(--paper)]'
                    }`
                  }
                >
                  <span className="truncate">{topic.shortTitle}</span>
                  {revised && (
                    <CheckCircle
                      size={14}
                      className="text-[var(--signal)] shrink-0 ml-1"
                    />
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Creator Info */}
        <div className="pt-4 border-t border-[var(--rule)]/60 text-center">
          <div className="text-[11px] font-mono text-[var(--muted)]">
            Created by <span className="font-bold text-[var(--ink)]">S. Manohar</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
