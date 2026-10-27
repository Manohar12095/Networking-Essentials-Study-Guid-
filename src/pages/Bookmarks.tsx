import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, ArrowRight } from 'lucide-react';
import { TOPICS } from '../data/topics';
import { storage } from '../lib/storage';

export const Bookmarks: React.FC = () => {
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState<string[]>([]);

  useEffect(() => {
    setBookmarkedSlugs(storage.getBookmarks());
  }, []);

  const savedTopics = TOPICS.filter((t) => bookmarkedSlugs.includes(t.slug));

  const removeBookmark = (slug: string) => {
    storage.toggleBookmark(slug);
    setBookmarkedSlugs(storage.getBookmarks());
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in">
      <div className="pb-3 border-b border-[var(--rule)]">
        <h1 className="font-sans font-bold text-xl sm:text-2xl text-[var(--ink)] flex items-center gap-2">
          <Bookmark size={22} className="text-[#D99B00] fill-[#D99B00]" />
          <span>Saved Questions ({savedTopics.length})</span>
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted)] font-serif mt-1">
          Pinned questions for quick last-minute revision before the exam.
        </p>
      </div>

      {savedTopics.length === 0 ? (
        <div className="p-8 sm:p-12 text-center rounded-lg bg-[var(--surface)] border border-dashed border-[var(--rule)] space-y-3">
          <div className="w-12 h-12 rounded-full bg-[var(--paper)] text-[var(--muted)] flex items-center justify-center mx-auto">
            <Bookmark size={22} />
          </div>
          <div className="font-sans font-bold text-base text-[var(--ink)]">
            No saved topics yet.
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted)] font-serif max-w-sm mx-auto">
            Tap the bookmark icon at the top of any 16-mark topic to keep it here for quick access.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[var(--packet)] text-white text-xs font-sans font-bold border-b-0 hover:opacity-90"
          >
            <span>Browse Topics</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {savedTopics.map((topic) => (
            <div
              key={topic.slug}
              className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--packet)] transition-all flex items-start justify-between gap-4 shadow-sm"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[var(--paper)] border border-[var(--rule)] font-mono text-[10px] font-bold text-[var(--muted)]">
                    UNIT {topic.unit}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-[var(--mark)] text-black font-mono text-[10px] font-bold">
                    16M
                  </span>
                </div>
                <Link
                  to={`/topic/${topic.slug}`}
                  className="font-sans font-bold text-base text-[var(--ink)] hover:text-[var(--packet)] border-b-0 block"
                >
                  {topic.title}
                </Link>
                <div className="text-xs text-[var(--muted)] font-serif line-clamp-1">
                  {topic.oneLineDefinition}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={`/topic/${topic.slug}`}
                  className="px-3 py-1.5 rounded bg-[var(--paper)] hover:bg-[var(--rule)] text-xs font-sans font-semibold text-[var(--ink)] border-b-0"
                >
                  Read
                </Link>
                <button
                  onClick={() => removeBookmark(topic.slug)}
                  className="p-1.5 rounded text-[var(--muted)] hover:text-[var(--alert)] transition-colors"
                  title="Remove from saved"
                  aria-label="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
