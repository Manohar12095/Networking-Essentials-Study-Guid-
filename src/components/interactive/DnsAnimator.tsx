import React, { useState } from 'react';
import { RotateCcw, ChevronLeft, ChevronRight, Database, Server, Laptop } from 'lucide-react';

interface DnsStep {
  step: number;
  from: string;
  to: string;
  type: 'query' | 'referral' | 'answer';
  packet: string;
  caption: string;
}

const ALL_DNS_STEPS: DnsStep[] = [
  {
    step: 1,
    from: 'User Computer',
    to: 'Local Resolver',
    type: 'query',
    packet: 'Query: "What is IP of www.example.com?" (Recursive)',
    caption: 'Step 1: Client web browser sends a recursive DNS lookup to the local ISP resolver.',
  },
  {
    step: 2,
    from: 'Local Resolver',
    to: 'Root Name Server (.)',
    type: 'query',
    packet: 'Query: "Where is www.example.com?"',
    caption: 'Step 2: Resolver queries one of the 13 Root Server clusters for the top-level domain.',
  },
  {
    step: 3,
    from: 'Root Name Server (.)',
    to: 'Local Resolver',
    type: 'referral',
    packet: 'Referral: "Ask the .com TLD Name Servers at IP 192.5.6.30"',
    caption: 'Step 3: Root returns an NS referral pointing down to the .com TLD registry servers.',
  },
  {
    step: 4,
    from: 'Local Resolver',
    to: '.com TLD Server',
    type: 'query',
    packet: 'Query: "Where is www.example.com?"',
    caption: 'Step 4: Resolver queries the .com TLD registry server.',
  },
  {
    step: 5,
    from: '.com TLD Server',
    to: 'Local Resolver',
    type: 'referral',
    packet: 'Referral: "Ask authoritative NS for example.com at IP 198.41.0.4"',
    caption: 'Step 5: TLD server delegates authority by returning example.com’s authoritative name server.',
  },
  {
    step: 6,
    from: 'Local Resolver',
    to: 'Authoritative Server',
    type: 'query',
    packet: 'Query: "A record for www.example.com"',
    caption: 'Step 6: Resolver contacts example.com’s Authoritative Server.',
  },
  {
    step: 7,
    from: 'Authoritative Server',
    to: 'Local Resolver',
    type: 'answer',
    packet: 'Answer: Type A = 93.184.216.34 (TTL = 3600s)',
    caption: 'Step 7: Authoritative Server delivers the definitive IP address (93.184.216.34).',
  },
  {
    step: 8,
    from: 'Local Resolver',
    to: 'User Computer',
    type: 'answer',
    packet: 'Response: www.example.com is at 93.184.216.34',
    caption: 'Step 8: Resolver caches the record locally and delivers the IP to client browser.',
  },
];

export const DnsAnimator: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // 0 = idle, 1..8 = step
  const [useCache, setUseCache] = useState(false);

  // If cache is enabled, steps 2 to 7 are skipped!
  // Active steps in cache mode: step 1 -> step 8
  const activeSteps = useCache
    ? [ALL_DNS_STEPS[0], ALL_DNS_STEPS[7]]
    : ALL_DNS_STEPS;

  const currentStep =
    currentStepIndex > 0 ? activeSteps[currentStepIndex - 1] : null;

  const handleNext = () => {
    setCurrentStepIndex((prev) => Math.min(activeSteps.length, prev + 1));
  };

  const handlePrev = () => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  const parties = [
    { id: 'User Computer', label: 'Client Host', sub: 'Browser / App', icon: Laptop },
    { id: 'Local Resolver', label: 'Local Resolver', sub: 'ISP / 8.8.8.8', icon: Server },
    { id: 'Root Name Server (.)', label: 'Root (.)', sub: 'Root Servers', icon: Database },
    { id: '.com TLD Server', label: '.com TLD', sub: 'Top-Level Domain', icon: Database },
    { id: 'Authoritative Server', label: 'Auth Server', sub: 'example.com NS', icon: Database },
  ];

  return (
    <div className="my-6 p-4 sm:p-5 rounded-lg bg-[var(--surface)] border border-[var(--rule)] shadow-sm interactive-tool">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--rule)]">
        <div>
          <div className="font-sans font-bold text-base text-[var(--ink)]">
            DNS 8-Step Resolution Sequence Animator
          </div>
          <div className="text-xs text-[var(--muted)] font-sans mt-0.5">
            Walk through recursive and iterative queries resolving www.example.com
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setUseCache(!useCache);
              setCurrentStepIndex(0);
            }}
            className={`px-2.5 py-1 rounded text-xs font-sans font-semibold transition-colors ${
              useCache
                ? 'bg-[var(--signal)] text-white'
                : 'border border-[var(--rule)] text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            {useCache ? 'Cache Active (Steps 2–7 Skipped)' : 'Enable Cached Answer Mode'}
          </button>

          <button
            onClick={handleReset}
            disabled={currentStepIndex === 0}
            className="p-1.5 rounded border border-[var(--rule)] text-[var(--muted)] hover:text-[var(--ink)] disabled:opacity-30"
            title="Reset"
          >
            <RotateCcw size={15} />
          </button>
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-1 px-2.5 py-1 rounded border border-[var(--rule)] text-xs font-sans disabled:opacity-30"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <div className="px-2.5 py-1 rounded bg-[var(--paper)] text-xs font-mono font-bold">
            {currentStepIndex === 0
              ? 'Ready'
              : `Step ${currentStep?.step} of 8`}
          </div>
          <button
            onClick={handleNext}
            disabled={currentStepIndex === activeSteps.length}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--packet)] text-white text-xs font-sans font-semibold disabled:opacity-30"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* 5 Parties Display */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-4">
        {parties.map((p) => {
          const isSender = currentStep?.from === p.id;
          const isReceiver = currentStep?.to === p.id;
          const Icon = p.icon;

          return (
            <div
              key={p.id}
              className={`p-3 rounded-lg border text-center transition-all ${
                isSender
                  ? 'border-[var(--packet)] bg-[var(--packet)]/10 ring-2 ring-[var(--packet)]'
                  : isReceiver
                  ? 'border-[var(--signal)] bg-[var(--signal)]/10 ring-2 ring-[var(--signal)]'
                  : 'border-[var(--rule)] bg-[var(--paper)]'
              }`}
            >
              <Icon
                size={22}
                className={`mx-auto mb-1.5 ${
                  isSender
                    ? 'text-[var(--packet)]'
                    : isReceiver
                    ? 'text-[var(--signal)]'
                    : 'text-[var(--muted)]'
                }`}
              />
              <div className="font-sans font-bold text-xs text-[var(--ink)] truncate">
                {p.label}
              </div>
              <div className="text-[10px] text-[var(--muted)] font-mono truncate">
                {p.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Packet Banner */}
      {currentStep ? (
        <div className="p-4 rounded-lg bg-[var(--paper)] border border-[var(--rule)] animate-fade-in space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-[var(--packet)]">
              Step {currentStep.step}: {currentStep.from} → {currentStep.to}
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                currentStep.type === 'query'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
                  : currentStep.type === 'referral'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200'
              }`}
            >
              {currentStep.type}
            </span>
          </div>

          <div className="p-2.5 rounded bg-[var(--surface)] border border-[var(--rule)] font-mono text-xs text-[var(--ink)]">
            {currentStep.packet}
          </div>

          <div className="text-xs text-[var(--ink)] font-sans leading-relaxed">
            {currentStep.caption}
          </div>
        </div>
      ) : (
        <div className="p-4 text-center rounded-lg bg-[var(--paper)] border border-dashed border-[var(--rule)] text-xs text-[var(--muted)] font-sans">
          Click <span className="font-bold text-[var(--packet)]">"Next"</span> to step through the 8 DNS resolution packets from client query to final IP answer.
        </div>
      )}
    </div>
  );
};
