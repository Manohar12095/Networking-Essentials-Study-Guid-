import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import {
  runDijkstra,
  EXAM_NODES,
  EXAM_LINKS,
  EXAM_NODE_POSITIONS,
  PRACTICE_NODES,
  PRACTICE_LINKS,
  PRACTICE_NODE_POSITIONS,
} from '../../lib/dijkstra';

export const DijkstraStepper: React.FC = () => {
  const [isPractice, setIsPractice] = useState(false);
  const [sourceNode, setSourceNode] = useState('B');
  const [stepIndex, setStepIndex] = useState(4); // Default to full completed state or step 0

  const currentNodes = isPractice ? PRACTICE_NODES : EXAM_NODES;
  const currentLinks = isPractice ? PRACTICE_LINKS : EXAM_LINKS;
  const currentPositions = isPractice ? PRACTICE_NODE_POSITIONS : EXAM_NODE_POSITIONS;

  const simulation = useMemo(
    () => runDijkstra(sourceNode, currentNodes, currentLinks),
    [sourceNode, currentNodes, currentLinks]
  );

  const totalSteps = simulation.tableRows.length;
  // stepIndex: 0 = start (only source in S), 1..totalSteps = steps completed
  const currentRows = simulation.tableRows.slice(0, stepIndex);
  const latestRow = currentRows[currentRows.length - 1];

  // Active fixed nodes so far
  const fixedNodesSet = [sourceNode, ...currentRows.map((r) => r.fixedNode)];

  // Active tree edges confirmed up to this step
  const confirmedTreeEdges = simulation.treeEdges.filter(
    (e) => fixedNodesSet.includes(e.u) && fixedNodesSet.includes(e.v)
  );

  const handleNext = () => {
    setStepIndex((prev) => Math.min(totalSteps, prev + 1));
  };

  const handlePrev = () => {
    setStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleReset = () => {
    setStepIndex(0);
  };

  const togglePractice = () => {
    if (!isPractice) {
      setIsPractice(true);
      setSourceNode('A');
      setStepIndex(4);
    } else {
      setIsPractice(false);
      setSourceNode('B');
      setStepIndex(4);
    }
  };

  const otherNodes = currentNodes.filter((n) => n !== sourceNode);

  return (
    <div className="my-6 p-4 sm:p-5 rounded-lg bg-[var(--surface)] border border-[var(--rule)] shadow-sm interactive-tool">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--rule)]">
        <div>
          <div className="font-sans font-bold text-base text-[var(--ink)]">
            Dijkstra Shortest Path First (SPF) Interactive Simulator
          </div>
          <div className="text-xs text-[var(--muted)] font-sans mt-0.5">
            {isPractice
              ? 'Practice Example (Router A LSDB Concept)'
              : 'Official Exam Question (Shortest Path Tree at Node B)'}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={togglePractice}
            className="px-2.5 py-1 rounded text-xs font-sans border border-[var(--rule)] text-[var(--packet)] hover:border-[var(--packet)] transition-colors"
          >
            {isPractice ? 'Back to Exam Question (Node B)' : 'Load Practice Graph'}
          </button>

          <div className="flex items-center gap-1 border-l border-[var(--rule)] pl-2">
            <span className="text-xs font-mono text-[var(--muted)] mr-1">Root:</span>
            <select
              value={sourceNode}
              onChange={(e) => {
                setSourceNode(e.target.value);
                setStepIndex(4);
              }}
              className="px-2 py-1 rounded border border-[var(--rule)] bg-[var(--paper)] text-xs font-mono font-bold text-[var(--ink)]"
            >
              {currentNodes.map((n) => (
                <option key={n} value={n}>
                  Node {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stepping controls */}
      <div className="flex items-center justify-between gap-2 p-3 mb-4 rounded bg-[var(--paper)] border border-[var(--rule)]">
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            disabled={stepIndex === 0}
            className="p-1.5 rounded border border-[var(--rule)] text-[var(--muted)] hover:text-[var(--ink)] disabled:opacity-30 transition-colors"
            title="Reset to initial state"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={handlePrev}
            disabled={stepIndex === 0}
            className="flex items-center gap-1 px-2.5 py-1 rounded border border-[var(--rule)] text-xs font-sans text-[var(--ink)] hover:bg-[var(--surface)] disabled:opacity-30"
          >
            <ChevronLeft size={14} /> Prev Step
          </button>
          <div className="px-2.5 py-1 rounded bg-[var(--surface)] border border-[var(--rule)] text-xs font-mono font-bold text-[var(--ink)]">
            Step {stepIndex} of {totalSteps}
          </div>
          <button
            onClick={handleNext}
            disabled={stepIndex === totalSteps}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--packet)] text-white text-xs font-sans font-semibold hover:opacity-95 disabled:opacity-30"
          >
            Next Step <ChevronRight size={14} />
          </button>
        </div>

        <div className="text-xs font-mono text-[var(--signal)] font-medium">
          Fixed Set S: &#123;{fixedNodesSet.join(', ')}&#125;
        </div>
      </div>

      {/* Live Canvas / SVG View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center mb-5">
        <div className="relative border border-[var(--rule)] rounded-lg p-2 bg-[var(--paper)]">
          <svg viewBox="0 0 500 400" className="w-full h-auto select-none" aria-hidden="true">
            {/* Links */}
            {currentLinks.map((link, idx) => {
              const p1 = currentPositions[link.u];
              const p2 = currentPositions[link.v];
              const isTree = confirmedTreeEdges.some(
                (e) =>
                  (e.u === link.u && e.v === link.v) ||
                  (e.u === link.v && e.v === link.u)
              );
              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2;

              return (
                <g key={idx}>
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={isTree ? '#E4572E' : 'var(--ink)'}
                    strokeWidth={isTree ? '3.5' : '1.8'}
                    strokeDasharray={isTree ? 'none' : 'none'}
                    strokeLinecap="round"
                  />
                  <circle
                    cx={midX}
                    cy={midY}
                    r="10"
                    fill="var(--surface)"
                    stroke={isTree ? '#E4572E' : 'var(--rule)'}
                    strokeWidth="1.2"
                  />
                  <text
                    x={midX}
                    y={midY + 3.5}
                    textAnchor="middle"
                    fill={isTree ? '#E4572E' : 'var(--ink)'}
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {link.cost}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {currentNodes.map((node) => {
              const pos = currentPositions[node];
              const isSource = node === sourceNode;
              const isNewlyFixed = latestRow?.fixedNode === node;
              const isFixed = fixedNodesSet.includes(node);

              return (
                <g key={node} transform={`translate(${pos.x}, ${pos.y})`}>
                  <circle
                    r="22"
                    fill={
                      isNewlyFixed
                        ? 'var(--mark)'
                        : isSource
                        ? 'var(--packet)'
                        : isFixed
                        ? '#FCE7D6'
                        : 'var(--surface)'
                    }
                    stroke={
                      isNewlyFixed
                        ? '#B45309'
                        : isSource
                        ? 'var(--ink)'
                        : isFixed
                        ? '#E4572E'
                        : 'var(--rule)'
                    }
                    strokeWidth={isFixed ? '2.5' : '1.5'}
                  />
                  <text
                    textAnchor="middle"
                    y="4"
                    fill={isSource ? '#FFFFFF' : 'var(--ink)'}
                    fontSize="13"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {node}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="text-[10px] text-center text-[var(--muted)] font-mono mt-1">
            Red highlighted links = Confirmed tree edges in set S
          </div>
        </div>

        {/* Dynamic step explanation */}
        <div className="space-y-3">
          <div className="p-3.5 rounded-lg bg-[var(--surface)] border border-[var(--rule)]">
            <div className="font-sans font-bold text-xs text-[var(--muted)] uppercase tracking-wider mb-1">
              Current Step Explanation
            </div>
            <div className="text-xs sm:text-sm text-[var(--ink)] leading-relaxed font-sans">
              {stepIndex === 0
                ? `Root node ${sourceNode} initialized with distance 0. Direct neighbors evaluated. Set S = {${sourceNode}}.`
                : latestRow?.explanation}
            </div>
          </div>

          {/* Final routing table when finished */}
          {stepIndex === totalSteps && (
            <div className="p-3 rounded-lg bg-[var(--signal)]/10 border border-[var(--signal)]/30">
              <div className="font-sans font-bold text-xs text-[var(--signal)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 size={14} />
                <span>Computed Routing Table at Node {sourceNode}</span>
              </div>
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="text-[var(--muted)] border-b border-[var(--signal)]/30">
                    <th className="py-1">Dest</th>
                    <th className="py-1">Path</th>
                    <th className="py-1">Cost</th>
                    <th className="py-1">Next Hop</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--signal)]/20">
                  {simulation.finalRoutingTable.map((route) => (
                    <tr key={route.dest}>
                      <td className="py-1 font-bold">{route.dest}</td>
                      <td className="py-1">{route.pathStr}</td>
                      <td className="py-1 text-[var(--packet)] font-bold">
                        {route.cost}
                      </td>
                      <td className="py-1 font-bold text-[var(--ink)]">
                        {route.nextHop}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Row-by-Row Execution Table (Identical to Exam Screenshot) */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] mb-1.5 font-medium">
          Dijkstra Table Evolution (Reproduces Exam Paper Format Exactly)
        </div>
        <div className="table-scroll-container">
          <table className="w-full text-left text-xs sm:text-sm border-collapse bg-[var(--surface)]">
            <thead>
              <tr className="bg-[var(--paper)] border-b border-[var(--rule)] font-mono text-[var(--ink)]">
                <th className="px-3.5 py-2">Step</th>
                {otherNodes.map((n) => (
                  <th key={n} className="px-3.5 py-2">
                    Dest {n}
                  </th>
                ))}
                <th className="px-3.5 py-2">S (Nodes Fixed)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--rule)]/60 font-mono">
              {currentRows.map((row) => (
                <tr key={row.step} className="hover:bg-[var(--paper)]/50 transition-colors">
                  <td className="px-3.5 py-2 font-bold">{row.step}</td>
                  {otherNodes.map((n) => {
                    const entry = row.entries[n];
                    const isNewlyFixedInThisRow = row.fixedNode === n;
                    const textDisplay =
                      entry?.cost === Infinity
                        ? '∞'
                        : `(${entry.cost}, ${entry.predecessor})`;

                    return (
                      <td
                        key={n}
                        className={`px-3.5 py-2 ${
                          isNewlyFixedInThisRow
                            ? 'bg-[var(--mark)]/35 font-bold text-black rounded'
                            : 'text-[var(--ink)]'
                        }`}
                      >
                        {textDisplay}
                      </td>
                    );
                  })}
                  <td className="px-3.5 py-2 font-bold text-[var(--signal)]">
                    {row.setS}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
