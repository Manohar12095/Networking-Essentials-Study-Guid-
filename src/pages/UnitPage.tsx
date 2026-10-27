import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ChevronRight, Layers } from 'lucide-react';
import { UNITS } from '../data/units';
import { TOPICS } from '../data/topics';
import { storage } from '../lib/storage';

export const UnitPage: React.FC = () => {
  const { n } = useParams<{ n: string }>();
  const unitNum = parseInt(n || '3', 10);
  const unitInfo = UNITS.find((u) => u.unit === unitNum) || UNITS[0];

  const topics = TOPICS.filter((t) => t.unit === unitNum);
  const [revisedSlugs, setRevisedSlugs] = useState<string[]>([]);

  useEffect(() => {
    setRevisedSlugs(storage.getProgress());
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs font-sans text-[var(--muted)] hover:text-[var(--ink)] border-b-0"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>

        {/* Unit switch tabs */}
        <div className="flex items-center gap-1 border border-[var(--rule)] bg-[var(--surface)] p-0.5 rounded text-xs font-mono">
          {[3, 4, 5].map((u) => (
            <Link
              key={u}
              to={`/unit/${u}`}
              className={`px-2.5 py-1 rounded border-b-0 font-bold transition-colors ${
                u === unitNum
                  ? 'bg-[var(--packet)] text-white'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              Unit {u}
            </Link>
          ))}
        </div>
      </div>

      {/* Unit Header Card */}
      <div className="p-5 sm:p-6 rounded-lg bg-[var(--surface)] border border-[var(--rule)] shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--packet)] font-bold uppercase tracking-wider">
          <Layers size={15} />
          <span>Unit {unitNum} Syllabus</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-extrabold text-[var(--ink)]">
          {unitInfo.title}
        </h1>
        <p className="text-sm sm:text-base text-[var(--muted)] font-serif leading-relaxed">
          {unitInfo.description}
        </p>
      </div>

      {/* Topics List in this Unit */}
      <div className="space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-[var(--muted)]">
          Important 16-Mark Questions in this Unit ({topics.length})
        </div>

        <div className="space-y-3">
          {topics.map((topic, idx) => {
            const isRevised = revisedSlugs.includes(topic.slug);

            return (
              <div
                key={topic.slug}
                className="p-4 sm:p-5 rounded-lg bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--packet)] shadow-sm transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded bg-[var(--paper)] text-[var(--ink)] font-mono font-bold text-xs flex items-center justify-center border border-[var(--rule)] shrink-0 mt-0.5">
                      #{idx + 1}
                    </span>
                    <div>
                      <Link
                        to={`/topic/${topic.slug}`}
                        className="font-sans font-bold text-base sm:text-lg text-[var(--ink)] hover:text-[var(--packet)] border-b-0 leading-tight"
                      >
                        {topic.title}
                      </Link>
                      <div className="text-xs text-[var(--muted)] font-serif line-clamp-2 mt-1">
                        {topic.oneLineDefinition}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                    <span className="px-2 py-0.5 rounded bg-[var(--mark)] text-black font-mono font-bold text-xs">
                      16 marks
                    </span>
                    {isRevised ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--signal)]/15 text-[var(--signal)] text-xs font-mono font-bold">
                        <CheckCircle2 size={14} /> Revised
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-[var(--muted)]">
                        Not revised
                      </span>
                    )}
                  </div>
                </div>

                {/* Exam Keywords Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[var(--rule)]/60">
                  <span className="text-[11px] font-mono text-[var(--muted)] mr-1">
                    Keywords:
                  </span>
                  {topic.examKeywords.slice(0, 5).map((kw, kIdx) => (
                    <span
                      key={kIdx}
                      className="px-2 py-0.5 rounded-full bg-[var(--paper)] border border-[var(--rule)] text-[11px] font-mono text-[var(--ink)]"
                    >
                      {kw}
                    </span>
                  ))}
                  <Link
                    to={`/topic/${topic.slug}`}
                    className="ml-auto text-xs text-[var(--packet)] font-sans font-semibold flex items-center gap-1 hover:underline border-b-0"
                  >
                    <span>Read Exam Answer</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
