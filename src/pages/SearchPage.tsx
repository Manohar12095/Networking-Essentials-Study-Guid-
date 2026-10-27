import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, ArrowRight, Sparkles } from 'lucide-react';
import { searchTopics, SearchResult } from '../lib/search';
import { TOPICS } from '../data/topics';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setResults(searchTopics(val, TOPICS));
  };

  const sampleKeywords = [
    'Bellman-Ford',
    'Dijkstra',
    'TIME-WAIT',
    'Cookie',
    '2^h − 2',
    'MX record',
    'Poison reverse',
    'Multi-homing',
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in">
      <div className="space-y-1 pb-3 border-b border-[var(--rule)]">
        <h1 className="font-sans font-bold text-xl sm:text-2xl text-[var(--ink)] flex items-center gap-2">
          <SearchIcon size={22} className="text-[var(--packet)]" />
          <span>Search Study Guide & Keywords</span>
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted)] font-serif">
          Find formulas, algorithms, RFC definitions, and exam keywords instantly.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="Search by topic, formula, algorithm (e.g. Bellman-Ford, Dijkstra, SYN)..."
          className="w-full px-4 py-3 pl-11 rounded-lg border-2 border-[var(--rule)] focus:border-[var(--packet)] bg-[var(--surface)] text-[var(--ink)] font-sans text-sm sm:text-base outline-none shadow-sm transition-all"
        />
        <SearchIcon
          size={19}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              inputRef.current?.focus();
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--muted)] hover:text-[var(--ink)]"
          >
            Clear
          </button>
        )}
      </div>

      {/* Quick Suggestion Chips */}
      {!query && (
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] font-semibold flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#D99B00]" />
            <span>Popular Exam Queries:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sampleKeywords.map((kw) => (
              <button
                key={kw}
                onClick={() => {
                  setQuery(kw);
                  setResults(searchTopics(kw, TOPICS));
                }}
                className="px-2.5 py-1 rounded-full bg-[var(--surface)] border border-[var(--rule)] text-xs font-mono text-[var(--ink)] hover:border-[var(--packet)] transition-colors"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Display */}
      {query && (
        <div className="space-y-3">
          <div className="text-xs font-mono text-[var(--muted)]">
            Found {results.length} match{results.length === 1 ? '' : 'es'} for "{query}"
          </div>

          {results.length === 0 ? (
            <div className="p-8 text-center rounded-lg bg-[var(--surface)] border border-dashed border-[var(--rule)] space-y-2">
              <div className="text-sm font-sans font-bold text-[var(--ink)]">
                No matching topics or keywords found.
              </div>
              <p className="text-xs text-[var(--muted)] font-serif">
                Try searching for broader terms like "subnet", "handshake", "DNS", "routing", or "table".
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((res, idx) => (
                <Link
                  key={idx}
                  to={`/topic/${res.topicSlug}${
                    res.sectionId ? `#${res.sectionId}` : ''
                  }`}
                  className="block p-4 rounded-lg bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--packet)] transition-all border-b-0 text-inherit shadow-sm group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[var(--paper)] border border-[var(--rule)] font-mono text-[10px] font-bold text-[var(--muted)]">
                        UNIT {res.unit}
                      </span>
                      {res.sectionTitle && (
                        <span className="text-[11px] font-mono text-[var(--packet)] truncate">
                          Section: {res.sectionTitle}
                        </span>
                      )}
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-[var(--muted)] group-hover:text-[var(--packet)] transition-colors shrink-0"
                    />
                  </div>

                  <div className="font-sans font-bold text-sm sm:text-base text-[var(--ink)] group-hover:text-[var(--packet)] transition-colors">
                    {res.topicTitle}
                  </div>

                  <div className="text-xs text-[var(--muted)] font-serif line-clamp-2 mt-1">
                    {res.snippet}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
