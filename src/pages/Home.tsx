import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckSquare,
  ArrowRight,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { TOPICS } from '../data/topics';
import { UNITS } from '../data/units';
import { storage, LastReadInfo } from '../lib/storage';
import { PacketJourneyStrip } from '../components/interactive/PacketJourneyStrip';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [revisedSlugs, setRevisedSlugs] = useState<string[]>([]);
  const [lastRead, setLastRead] = useState<LastReadInfo | null>(null);

  useEffect(() => {
    setRevisedSlugs(storage.getProgress());
    setLastRead(storage.getLastRead());
  }, []);

  const totalQuestions = TOPICS.length; // 7
  const revisedCount = revisedSlugs.length;
  const progressPercent = Math.round((revisedCount / totalQuestions) * 100);

  // Default to first topic if no lastRead
  const continueSlug = lastRead?.slug || 'vlsm';
  const continueTitle = lastRead?.title || 'Variable Length Subnet Mask (VLSM)';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-8 animate-fade-in">
      {/* Packet Journey Live Hero Strip */}
      <PacketJourneyStrip />

      {/* Main Title & Value Proposition */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--mark)]/20 border border-[var(--mark)] text-xs font-mono font-bold text-[#8A6D00] dark:text-[#FFD84D]">
          <span>SYLLABUS BLUEPRINT</span>
          <span>•</span>
          <span>ALL 16-MARK QUESTIONS</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--ink)] tracking-tight">
          Computer Networks Exam Guide
        </h1>
        <p className="text-sm sm:text-base text-[var(--muted)] max-w-xl mx-auto font-serif leading-relaxed">
          The examiner's marking sheet meets a network engineer's blueprint.
          Written directly in 16-mark structured exam answer format for effortless revision.
        </p>
      </div>

      {/* Progress & Continue Hero Card */}
      <div className="p-5 sm:p-6 rounded-lg bg-[var(--surface)] border border-[var(--rule)] shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Progress Circular Dial / Stat */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[var(--rule)]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[var(--signal)]"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-sans font-extrabold text-sm text-[var(--ink)]">
                {progressPercent}%
              </span>
            </div>

            <div>
              <div className="font-sans font-bold text-sm sm:text-base text-[var(--ink)]">
                {revisedCount} of {totalQuestions} Questions Mastered
              </div>
              <div className="text-xs text-[var(--muted)] font-sans">
                {revisedCount === 7
                  ? 'Ready for 100% exam score!'
                  : `${totalQuestions - revisedCount} key questions remaining to revise`}
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={() => navigate(`/topic/${continueSlug}`)}
            className="w-full sm:w-auto px-5 py-3 rounded-lg bg-[var(--packet)] text-white font-sans font-bold text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-md transition-all active:scale-95"
          >
            <span>Continue: {continueTitle.slice(0, 26)}...</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/revise"
          className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--packet)] transition-all flex items-center gap-4 text-inherit border-b-0 group shadow-sm"
        >
          <div className="w-12 h-12 rounded-lg bg-[var(--packet)]/10 text-[var(--packet)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <BookOpen size={24} />
          </div>
          <div>
            <div className="font-sans font-bold text-base text-[var(--ink)] group-hover:text-[var(--packet)] transition-colors">
              Revision Cards
            </div>
            <div className="text-xs text-[var(--muted)] font-serif">
              One-screen high-yield summaries, 5 key points, keywords & diagram previews.
            </div>
          </div>
        </Link>

        <Link
          to="/quiz"
          className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--rule)] hover:border-[var(--signal)] transition-all flex items-center gap-4 text-inherit border-b-0 group shadow-sm"
        >
          <div className="w-12 h-12 rounded-lg bg-[var(--signal)]/10 text-[var(--signal)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <CheckSquare size={24} />
          </div>
          <div>
            <div className="font-sans font-bold text-base text-[var(--ink)] group-hover:text-[var(--signal)] transition-colors">
              Exam Practice Quiz
            </div>
            <div className="text-xs text-[var(--muted)] font-serif">
              42 test questions with instant explanations to test recall under exam pressure.
            </div>
          </div>
        </Link>
      </div>

      {/* Units Syllabus Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--rule)]">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--ink)]">
            Syllabus by Units (7 Important Questions)
          </h2>
          <span className="text-xs font-mono text-[var(--muted)]">
            16 marks each
          </span>
        </div>

        <div className="space-y-4">
          {UNITS.map((unitInfo) => {
            const unitTopics = TOPICS.filter((t) => t.unit === unitInfo.unit);
            const unitRevisedCount = unitTopics.filter((t) =>
              revisedSlugs.includes(t.slug)
            ).length;

            return (
              <div
                key={unitInfo.unit}
                className="p-4 sm:p-5 rounded-lg bg-[var(--surface)] border border-[var(--rule)] shadow-sm space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <Link
                      to={`/unit/${unitInfo.unit}`}
                      className="font-sans font-bold text-base sm:text-lg text-[var(--ink)] hover:text-[var(--packet)] border-b-0"
                    >
                      {unitInfo.title}
                    </Link>
                    <p className="text-xs text-[var(--muted)] font-serif mt-0.5">
                      {unitInfo.description}
                    </p>
                  </div>
                  <div className="px-2.5 py-1 rounded bg-[var(--paper)] border border-[var(--rule)] text-xs font-mono text-[var(--muted)]">
                    {unitRevisedCount} / {unitTopics.length} revised
                  </div>
                </div>

                {/* Topics in this unit */}
                <div className="divide-y divide-[var(--rule)]/60 pt-1">
                  {unitTopics.map((topic, idx) => {
                    const isRevised = revisedSlugs.includes(topic.slug);

                    return (
                      <Link
                        key={topic.slug}
                        to={`/topic/${topic.slug}`}
                        className="py-3 flex items-center justify-between gap-3 text-inherit border-b-0 hover:bg-[var(--paper)]/50 px-2 rounded transition-colors group"
                      >
                        <div className="flex items-start gap-3">
                          <span className="font-mono text-xs font-bold text-[var(--muted)] mt-0.5">
                            #{idx + 1}
                          </span>
                          <div>
                            <div className="font-sans font-bold text-sm sm:text-base text-[var(--ink)] group-hover:text-[var(--packet)] transition-colors">
                              {topic.title}
                            </div>
                            <div className="text-xs text-[var(--muted)] font-serif line-clamp-1 mt-0.5">
                              {topic.oneLineDefinition}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-[var(--muted)]">
                            <Clock size={12} />
                            <span>10 min</span>
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[var(--mark)] text-black font-mono font-bold text-[10px]">
                            16M
                          </span>
                          {isRevised ? (
                            <CheckCircle2
                              size={18}
                              className="text-[var(--signal)]"
                            />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-[var(--rule)]" />
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* End of Page Attribution */}
      <div className="pt-6 pb-2 border-t border-[var(--rule)]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[var(--muted)]">
        <span>Computer Networks 16-Mark Study Guide</span>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[var(--surface)] border border-[var(--rule)]">
          <span>Created by</span>
          <span className="font-bold text-[var(--ink)]">S. Manohar</span>
        </div>
      </div>
    </div>
  );
};
