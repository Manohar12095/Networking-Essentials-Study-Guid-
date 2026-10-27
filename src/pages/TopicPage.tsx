import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  Share2,
  Printer,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { TOPIC_MAP, TOPICS } from '../data/topics';
import { storage } from '../lib/storage';
import { BlockRenderer } from '../components/content/BlockRenderer';
import { MarksGutter } from '../components/content/MarksGutter';

export const TopicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const topic = TOPIC_MAP.get(slug || '');

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isRevised, setIsRevised] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [copiedSectionId, setCopiedSectionId] = useState<string | null>(null);
  const [shareFeedback, setShareFeedback] = useState(false);

  useEffect(() => {
    if (!topic) return;
    setIsBookmarked(storage.isBookmarked(topic.slug));
    setIsRevised(storage.isRevised(topic.slug));
    storage.setLastRead({ slug: topic.slug, title: topic.title });
    window.scrollTo(0, 0);
  }, [topic]);

  if (!topic) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[var(--ink)]">Topic Not Found</h1>
        <p className="text-sm text-[var(--muted)]">
          The requested study guide question does not exist.
        </p>
        <Link
          to="/"
          className="inline-block px-4 py-2 rounded bg-[var(--packet)] text-white text-xs font-sans font-bold"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const currentIndex = TOPICS.findIndex((t) => t.slug === topic.slug);
  const prevTopic = currentIndex > 0 ? TOPICS[currentIndex - 1] : null;
  const nextTopic = currentIndex < TOPICS.length - 1 ? TOPICS[currentIndex + 1] : null;

  const toggleBookmark = () => {
    const updated = storage.toggleBookmark(topic.slug);
    setIsBookmarked(updated);
  };

  const toggleRevised = () => {
    const updated = storage.toggleProgress(topic.slug);
    setIsRevised(updated);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${topic.title} — Computer Networks 16-Mark Answer`,
      text: topic.oneLineDefinition,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.warn('Share dismissed', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const copySectionText = (sectionId: string, sectionTitle: string) => {
    const section = topic.sections.find((s) => s.id === sectionId);
    if (!section) return;

    let textOut = `${sectionTitle} (${section.marks} marks)\n\n`;
    for (const block of section.blocks) {
      if (block.type === 'paragraph') textOut += `${block.text}\n\n`;
      else if (block.type === 'bullets' || block.type === 'steps') {
        textOut += block.items.map((it, i) => `${i + 1}. ${it}`).join('\n') + '\n\n';
      } else if (block.type === 'keypoints') {
        textOut += `Key Points:\n` + block.items.map((it) => `- ${it}`).join('\n') + '\n\n';
      } else if (block.type === 'formula') {
        textOut += `Formulas:\n` + block.lines.join('\n') + '\n\n';
      } else if (block.type === 'table') {
        textOut += `${block.headers.join(' | ')}\n`;
        textOut += block.rows.map((r) => r.join(' | ')).join('\n') + '\n\n';
      } else if (block.type === 'code') {
        textOut += `${block.code}\n\n`;
      }
    }

    navigator.clipboard.writeText(textOut);
    setCopiedSectionId(sectionId);
    setTimeout(() => setCopiedSectionId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      {/* Sticky Top Action Bar */}
      <div className="sticky top-[53px] z-30 bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--rule)] rounded-lg px-3 py-2 flex items-center justify-between gap-2 shadow-sm no-print">
        <Link
          to={`/unit/${topic.unit}`}
          className="flex items-center gap-1.5 text-xs font-sans text-[var(--muted)] hover:text-[var(--ink)] border-b-0 shrink-0"
        >
          <ArrowLeft size={15} />
          <span className="hidden sm:inline">Unit {topic.unit}</span>
        </Link>

        <div className="font-sans font-bold text-xs sm:text-sm text-[var(--ink)] truncate max-w-[50%]">
          {topic.title}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Bookmark Button */}
          <button
            onClick={toggleBookmark}
            className={`p-1.5 rounded border transition-colors ${
              isBookmarked
                ? 'border-[var(--mark)] bg-[var(--mark)]/20 text-[#B45309]'
                : 'border-[var(--rule)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
            title={isBookmarked ? 'Bookmarked' : 'Bookmark this question'}
            aria-label="Bookmark"
          >
            <Bookmark size={15} className={isBookmarked ? 'fill-current' : ''} />
          </button>

          {/* Revised Check Button */}
          <button
            onClick={toggleRevised}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-sans font-semibold border transition-colors ${
              isRevised
                ? 'border-[var(--signal)] bg-[var(--signal)] text-white'
                : 'border-[var(--rule)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--signal)]'
            }`}
            title="Mark as revised"
          >
            <CheckCircle2 size={14} />
            <span className="hidden sm:inline">
              {isRevised ? 'Revised' : 'Mark as Revised'}
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded border border-[var(--rule)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
            title="Share question"
            aria-label="Share"
          >
            <Share2 size={15} />
          </button>
        </div>
      </div>

      {shareFeedback && (
        <div className="p-2 rounded bg-[var(--signal)] text-white text-xs font-sans text-center no-print">
          Link copied to clipboard!
        </div>
      )}

      {/* Answer Sheet Container */}
      <article className="answer-sheet bg-[var(--surface)] border border-[var(--rule)] rounded-lg p-5 sm:p-8 space-y-7 shadow-sm">
        {/* Document Header */}
        <header className="space-y-3 pb-6 border-b border-[var(--rule)]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[var(--paper)] border border-[var(--rule)] font-mono text-xs text-[var(--muted)] font-bold">
              UNIT {topic.unit} • QUESTION #{topic.order}
            </span>
            <span className="px-2 py-0.5 rounded bg-[var(--mark)] text-[#14213D] font-mono text-xs font-bold shadow-sm">
              16 MARKS
            </span>
            <span className="flex items-center gap-1 text-xs text-[var(--muted)] font-mono ml-auto">
              <Clock size={13} />
              <span>12 min read</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] tracking-tight">
            {topic.title}
          </h1>

          <p className="text-base text-[var(--muted)] font-serif leading-relaxed italic border-l-2 border-[var(--packet)] pl-3">
            "{topic.oneLineDefinition}"
          </p>

          {/* Exam keywords list */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            <span className="text-xs font-mono text-[var(--muted)] font-semibold mr-1">
              Keywords:
            </span>
            {topic.examKeywords.map((kw, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-full bg-[var(--paper)] border border-[var(--rule)] text-xs font-mono text-[var(--ink)]"
              >
                {kw}
              </span>
            ))}
          </div>
        </header>

        {/* Collapsible "Write This In The Exam" 5-Part Skeleton Box */}
        <div className="rounded-lg border-2 border-[var(--packet)]/40 bg-[var(--packet)]/5 p-4 space-y-2">
          <button
            onClick={() => setShowSkeleton(!showSkeleton)}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2 font-sans font-extrabold text-sm text-[var(--packet)] uppercase tracking-wider">
              <Sparkles size={16} />
              <span>Write This in the Exam (5-Part Skeleton for 16 Marks)</span>
            </div>
            {showSkeleton ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showSkeleton && (
            <div className="pt-2 border-t border-[var(--packet)]/20 space-y-1.5">
              <div className="text-xs text-[var(--muted)] font-sans mb-2">
                Memorize this 5-point layout to guarantee full coverage in the exam hall:
              </div>
              <ol className="space-y-1.5 text-xs sm:text-sm font-sans text-[var(--ink)] list-none">
                {topic.writeInExam.map((line, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-mono font-bold text-[var(--packet)] shrink-0">
                      {idx + 1}.
                    </span>
                    <span>{line.replace(/^[0-9]\.\s*/, '')}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* 5 Core Answer Sections with MarksGutter */}
        <div className="space-y-8">
          {topic.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="relative pt-2 space-y-3"
            >
              {/* Section Header with Marks Badge & Copy as Text */}
              <div className="flex items-center justify-between gap-3 pb-2 border-b border-[var(--rule)]">
                <div className="flex items-center gap-3">
                  <MarksGutter marks={section.marks} />
                  <h2 className="font-sans font-bold text-lg sm:text-xl text-[var(--ink)]">
                    {section.title}
                  </h2>
                </div>

                <button
                  onClick={() => copySectionText(section.id, section.title)}
                  className="p-1.5 rounded border border-[var(--rule)] bg-[var(--paper)] text-[var(--muted)] hover:text-[var(--ink)] text-xs font-sans flex items-center gap-1 transition-colors no-print"
                  title="Copy section as plain text"
                >
                  {copiedSectionId === section.id ? (
                    <>
                      <Check size={13} className="text-green-500" />
                      <span className="text-[10px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span className="hidden sm:inline text-[10px]">Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Section Blocks */}
              <div className="space-y-3">
                {section.blocks.map((block, bIdx) => (
                  <BlockRenderer key={bIdx} block={block} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer actions: Print / PDF & Nav Buttons */}
        <footer className="pt-6 border-t border-[var(--rule)] space-y-4 no-print">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-1.5 rounded border border-[var(--rule)] bg-[var(--paper)] text-xs font-sans font-semibold text-[var(--ink)] hover:border-[var(--packet)] transition-colors"
            >
              <Printer size={15} />
              <span>Print or Save as PDF Answer Sheet</span>
            </button>

            <button
              onClick={toggleRevised}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-sans font-bold transition-colors ${
                isRevised
                  ? 'bg-[var(--signal)] text-white'
                  : 'bg-[var(--packet)] text-white hover:opacity-90'
              }`}
            >
              <CheckCircle2 size={15} />
              <span>{isRevised ? 'Completed & Revised' : 'Mark Question as Revised'}</span>
            </button>
          </div>

          {/* Prev / Next Topic Links */}
          <div className="grid grid-cols-2 gap-3 pt-3">
            {prevTopic ? (
              <Link
                to={`/topic/${prevTopic.slug}`}
                className="p-3 rounded-lg border border-[var(--rule)] hover:border-[var(--packet)] bg-[var(--paper)] flex flex-col border-b-0 text-inherit transition-all"
              >
                <span className="text-[10px] font-mono uppercase text-[var(--muted)] flex items-center gap-1">
                  <ChevronLeft size={13} /> Previous Topic
                </span>
                <span className="font-sans font-bold text-xs sm:text-sm text-[var(--ink)] line-clamp-1 mt-0.5">
                  {prevTopic.shortTitle}
                </span>
              </Link>
            ) : (
              <div />
            )}

            {nextTopic && (
              <Link
                to={`/topic/${nextTopic.slug}`}
                className="p-3 rounded-lg border border-[var(--rule)] hover:border-[var(--packet)] bg-[var(--paper)] flex flex-col items-end text-right border-b-0 text-inherit transition-all"
              >
                <span className="text-[10px] font-mono uppercase text-[var(--muted)] flex items-center gap-1">
                  Next Topic <ChevronRight size={13} />
                </span>
                <span className="font-sans font-bold text-xs sm:text-sm text-[var(--ink)] line-clamp-1 mt-0.5">
                  {nextTopic.shortTitle}
                </span>
              </Link>
            )}
          </div>
        </footer>
      </article>
    </div>
  );
};
