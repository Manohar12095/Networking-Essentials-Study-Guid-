import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import {
  computeDistanceVectorRounds,
  DEFAULT_DV_NODES,
} from '../../lib/distanceVector';

export const DistanceVectorStepper: React.FC = () => {
  const rounds = useMemo(() => computeDistanceVectorRounds(), []);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [selectedRouter, setSelectedRouter] = useState('A');

  const currentRound = rounds[currentRoundIndex] || rounds[0];
  const totalRounds = rounds.length;

  const currentRouterState = currentRound.states[selectedRouter];
  const table = currentRouterState?.table || {};
  const changedDests = currentRouterState?.changedDestinations || [];

  const handleNext = () => {
    setCurrentRoundIndex((prev) => Math.min(totalRounds - 1, prev + 1));
  };

  const handlePrev = () => {
    setCurrentRoundIndex((prev) => Math.max(0, prev - 1));
  };

  const handleReset = () => {
    setCurrentRoundIndex(0);
  };

  return (
    <div className="my-6 p-4 sm:p-5 rounded-lg bg-[var(--surface)] border border-[var(--rule)] shadow-sm interactive-tool">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--rule)]">
        <div>
          <div className="font-sans font-bold text-base text-[var(--ink)]">
            Distance Vector Round-by-Round Stepper
          </div>
          <div className="text-xs text-[var(--muted)] font-sans mt-0.5">
            Step through Bellman-Ford exchanges and monitor routing table evolution
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleReset}
            disabled={currentRoundIndex === 0}
            className="p-1.5 rounded border border-[var(--rule)] text-[var(--muted)] hover:text-[var(--ink)] disabled:opacity-30 transition-colors"
            title="Reset to Round 0"
            aria-label="Reset"
          >
            <RotateCcw size={15} />
          </button>
          <button
            onClick={handlePrev}
            disabled={currentRoundIndex === 0}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded border border-[var(--rule)] text-xs font-sans text-[var(--ink)] hover:bg-[var(--paper)] disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={15} /> Prev
          </button>
          <div className="px-2.5 py-1 rounded bg-[var(--paper)] font-mono text-xs text-[var(--ink)] font-bold">
            Round {currentRound.round} of {totalRounds - 1}
          </div>
          <button
            onClick={handleNext}
            disabled={currentRoundIndex === totalRounds - 1}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-[var(--packet)] text-white text-xs font-sans font-semibold hover:opacity-95 disabled:opacity-30 transition-opacity"
          >
            Next <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Description of Round */}
      <div className="p-3 mb-4 rounded bg-[var(--paper)] border border-[var(--rule)] text-xs sm:text-sm text-[var(--ink)] font-sans">
        <span className="font-bold font-mono text-[var(--packet)] mr-1.5">
          [Round {currentRound.round}]:
        </span>
        {currentRound.description}
      </div>

      {/* Router Selection Tabs */}
      <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-1">
        <span className="text-xs font-mono text-[var(--muted)] mr-2 shrink-0">
          Inspect Router:
        </span>
        {DEFAULT_DV_NODES.map((node) => {
          const isSelected = selectedRouter === node;
          const hasChanges = currentRound.states[node]?.changedDestinations.length > 0;

          return (
            <button
              key={node}
              onClick={() => setSelectedRouter(node)}
              className={`px-3 py-1 rounded text-xs font-mono font-bold transition-colors flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[var(--packet)] text-white'
                  : 'bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--rule)]/50'
              }`}
            >
              <span>Router {node}</span>
              {hasChanges && (
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--mark)] shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Table for Selected Router */}
      <div className="table-scroll-container mb-4">
        <table className="w-full text-left text-xs sm:text-sm border-collapse bg-[var(--surface)]">
          <thead>
            <tr className="bg-[var(--paper)] border-b border-[var(--rule)] text-[var(--muted)] font-mono">
              <th className="px-3.5 py-2">Destination</th>
              <th className="px-3.5 py-2">Metric Cost</th>
              <th className="px-3.5 py-2">Next Hop</th>
              <th className="px-3.5 py-2">Round Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--rule)]/60 font-mono">
            {DEFAULT_DV_NODES.map((dest) => {
              const entry = table[dest];
              const costDisplay =
                entry?.cost === Infinity ? '∞' : entry?.cost?.toString() ?? '∞';
              const isChanged = changedDests.includes(dest);

              return (
                <tr
                  key={dest}
                  className={`transition-colors ${
                    isChanged ? 'bg-[var(--mark)]/20 font-bold' : 'hover:bg-[var(--paper)]/50'
                  }`}
                >
                  <td className="px-3.5 py-2 font-bold text-[var(--ink)]">
                    {dest} {dest === selectedRouter && '(Self)'}
                  </td>
                  <td className="px-3.5 py-2 text-[var(--packet)]">
                    {costDisplay}
                  </td>
                  <td className="px-3.5 py-2 text-[var(--ink)]">
                    {entry?.nextHop || '–'}
                  </td>
                  <td className="px-3.5 py-2 font-sans text-xs">
                    {isChanged ? (
                      <span className="px-2 py-0.5 rounded bg-[var(--mark)] text-black font-semibold text-[10px]">
                        Updated this round
                      </span>
                    ) : (
                      <span className="text-[var(--muted)] text-[11px]">Unchanged</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Convergence indicator */}
      {currentRoundIndex >= 2 && (
        <div className="p-2.5 rounded bg-[var(--signal)]/10 border border-[var(--signal)]/30 text-[var(--signal)] text-xs font-sans font-medium flex items-center justify-between">
          <span>The network has achieved mathematical convergence. No further cost reductions are possible.</span>
          <span className="font-mono text-[11px] font-bold">Stable state</span>
        </div>
      )}
    </div>
  );
};
