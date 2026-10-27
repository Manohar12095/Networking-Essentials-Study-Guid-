import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Maximize2,
  CheckCircle2,
} from 'lucide-react';
import { TOPICS } from '../data/topics';
import { storage } from '../lib/storage';
import { Lightbox } from '../components/content/Lightbox';

// Map topic to primary image
const TOPIC_IMAGES: Record<string, { src: string; caption: string }> = {
  vlsm: {
    src: './images/vlsm-network.png',
    caption: 'VLSM network diagram (LAN A: 100, B: 50, C: 25, D: 2)',
  },
  'distance-vector': {
    src: './images/distance-vector.png',
    caption: 'Distance vector 5-router topology and router tables',
  },
  'link-state': {
    src: './images/link-state-question.jpg',
    caption: 'Official exam graph and Node B Dijkstra table',
  },
  'udp-tcp-states': {
    src: './images/tcp-state-diagram.png',
    caption: 'TCP 11-State Finite State Machine (FSM)',
  },
  sctp: {
    src: './images/sctp-handshake-multistreaming.png',
    caption: 'SCTP 4-way cookie handshake and multi-streaming queues',
  },
  dns: {
    src: './images/dns-resolution.png',
    caption: 'DNS 8-step resolution sequence and inverted hierarchy',
  },
  smtp: {
    src: './images/smtp-architecture.png',
    caption: 'Email architecture, SMTP command flow, and POP3/IMAP',
  },
};

export const RevisionMode: React.FC = () => {
  const [topicIndex, setTopicIndex] = useState(0);
  const [mode, setMode] = useState<'quick' | 'full'>('quick');
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const topic = TOPICS[topicIndex];
  const imageInfo = TOPIC_IMAGES[topic.slug];
  const isRevised = storage.isRevised(topic.slug);

  const handleNext = () => {
    setTopicIndex((prev) => (prev + 1) % TOPICS.length);
  };

  const handlePrev = () => {
    setTopicIndex((prev) => (prev - 1 + TOPICS.length) % TOPICS.length);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in">
      {/* Top Header & Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--rule)]">
        <div>
          <div className="font-sans font-bold text-lg text-[var(--ink)] flex items-center gap-2">
            <BookOpen size={20} className="text-[var(--packet)]" />
            <span>Fast Revision Cards</span>
          </div>
          <div className="text-xs text-[var(--muted)] font-serif mt-0.5">
            Card {topicIndex + 1} of {TOPICS.length} • Night-before-exam recall cards
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick vs Full toggle */}
          <div className="flex items-center border border-[var(--rule)] bg-[var(--surface)] p-0.5 rounded text-xs font-sans">
            <button
              onClick={() => setMode('quick')}
              className={`px-3 py-1 rounded font-semibold transition-colors ${
                mode === 'quick'
                  ? 'bg-[var(--packet)] text-white'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              Quick Mode
            </button>
            <button
              onClick={() => setMode('full')}
              className={`px-3 py-1 rounded font-semibold transition-colors ${
                mode === 'full'
                  ? 'bg-[var(--packet)] text-white'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              Full Cards
            </button>
          </div>

          <div className="flex items-center gap-1 border-l border-[var(--rule)] pl-2">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded border border-[var(--rule)] bg-[var(--surface)] hover:bg-[var(--paper)] text-[var(--ink)]"
              aria-label="Previous card"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 rounded border border-[var(--rule)] bg-[var(--surface)] hover:bg-[var(--paper)] text-[var(--ink)]"
              aria-label="Next card"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Revision Card Sheet */}
      <div className="p-5 sm:p-7 rounded-lg bg-[var(--surface)] border-2 border-[var(--packet)]/30 shadow-md space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-[var(--paper)] border border-[var(--rule)] font-mono text-[11px] font-bold text-[var(--muted)]">
                UNIT {topic.unit}
              </span>
              <span className="px-2 py-0.5 rounded bg-[var(--mark)] text-black font-mono text-[11px] font-bold">
                16 MARKS
              </span>
              {isRevised && (
                <span className="flex items-center gap-1 text-[11px] font-mono text-[var(--signal)] font-bold">
                  <CheckCircle2 size={13} /> Revised
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--ink)] tracking-tight">
              {topic.title}
            </h2>
          </div>

          <Link
            to={`/topic/${topic.slug}`}
            className="hidden sm:flex items-center gap-1 text-xs font-sans text-[var(--packet)] font-bold hover:underline shrink-0 border-b-0"
          >
            <span>Open Answer Sheet</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Definition in one sentence */}
        <div className="p-3.5 rounded-lg bg-[var(--paper)] border border-[var(--rule)]">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--packet)] font-bold mb-1">
            Exam Definition (Sentence-1)
          </div>
          <div className="text-sm sm:text-base text-[var(--ink)] font-serif leading-relaxed">
            {topic.oneLineDefinition}
          </div>
        </div>

        {/* 5 to 7 Key Revision Points */}
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] font-bold">
            Must-State Key Points (5 to 7 Exam Lines):
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-[var(--ink)] font-sans">
            {topic.revisionPoints.map((point, pIdx) => (
              <li
                key={pIdx}
                className="flex items-start gap-2.5 p-2 rounded bg-[var(--paper)]/60 border border-[var(--rule)]/60"
              >
                <span className="w-5 h-5 rounded-full bg-[var(--mark)]/30 text-[#8A6D00] dark:text-[#FFD84D] font-mono font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  {pIdx + 1}
                </span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Diagram Thumbnail (opens Lightbox) */}
        {imageInfo && mode === 'full' && (
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] font-bold">
              Key Exam Diagram (Tap to Expand):
            </div>
            <div
              className="relative group cursor-pointer overflow-hidden rounded-lg border border-[var(--rule)] bg-white max-w-sm mx-auto p-2"
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={imageInfo.src}
                alt={imageInfo.caption}
                className="w-full h-40 object-contain mx-auto"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-sans gap-1.5">
                <Maximize2 size={16} />
                <span>Tap to view full resolution</span>
              </div>
            </div>
          </div>
        )}

        {/* Exam Keywords */}
        <div className="pt-3 border-t border-[var(--rule)]">
          <div className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] font-bold mb-2">
            Keywords Grader Looks For:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {topic.examKeywords.map((kw, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded bg-[var(--paper)] border border-[var(--rule)] text-xs font-mono font-bold text-[var(--ink)]"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="pt-3 border-t border-[var(--rule)] flex items-center justify-between">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 text-xs font-sans font-semibold text-[var(--muted)] hover:text-[var(--ink)]"
          >
            <ChevronLeft size={15} /> Prev Card
          </button>

          <Link
            to={`/topic/${topic.slug}`}
            className="px-4 py-2 rounded bg-[var(--packet)] text-white text-xs font-sans font-bold hover:opacity-95 border-b-0 flex items-center gap-1.5 shadow-sm"
          >
            <span>Read 16-Mark Answer Sheet</span>
            <ArrowRight size={14} />
          </Link>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 text-xs font-sans font-semibold text-[var(--muted)] hover:text-[var(--ink)]"
          >
            Next Card <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {imageInfo && (
        <Lightbox
          src={imageInfo.src}
          alt={imageInfo.caption}
          caption={imageInfo.caption}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
};
