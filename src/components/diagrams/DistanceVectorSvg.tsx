import React from 'react';
import { DV_NODE_POSITIONS, DEFAULT_DV_LINKS } from '../../lib/distanceVector';

export const DistanceVectorSvg: React.FC = () => {
  const nodes = Object.entries(DV_NODE_POSITIONS);

  return (
    <div
      role="img"
      aria-label="Distance Vector 5-Router Topology and Router A Routing Table"
      className="my-5 p-4 rounded-lg bg-[var(--surface)] border border-[var(--rule)] shadow-sm max-w-4xl mx-auto"
    >
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Topology SVG */}
        <div className="w-full md:w-3/5">
          <svg
            viewBox="0 0 520 370"
            className="w-full h-auto select-none"
            aria-hidden="true"
          >
            <title>Distance Vector Network Topology</title>
            <desc>
              5 Routers A, B, C, D, E with link costs A-B 2, A-D 7, B-C 3, B-D 4,
              C-E 2, D-E 1.
            </desc>

            {/* Links and Cost Badges */}
            {DEFAULT_DV_LINKS.map((link, idx) => {
              const p1 = DV_NODE_POSITIONS[link.u];
              const p2 = DV_NODE_POSITIONS[link.v];
              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2;

              return (
                <g key={idx}>
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke="var(--ink)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Cost Pill */}
                  <circle
                    cx={midX}
                    cy={midY}
                    r="12"
                    fill="var(--surface)"
                    stroke="var(--rule)"
                    strokeWidth="1.5"
                  />
                  <text
                    x={midX}
                    y={midY + 4}
                    textAnchor="middle"
                    fill="var(--ink)"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {link.cost}
                  </text>
                </g>
              );
            })}

            {/* Router Nodes */}
            {nodes.map(([node, pos]) => {
              const isRouterA = node === 'A';

              return (
                <g key={node} transform={`translate(${pos.x}, ${pos.y})`}>
                  {/* Router Cylinder / Disc */}
                  <circle
                    r="24"
                    fill={isRouterA ? 'var(--packet)' : 'var(--surface)'}
                    stroke={isRouterA ? 'var(--ink)' : 'var(--packet)'}
                    strokeWidth="3"
                  />
                  <text
                    textAnchor="middle"
                    y="5"
                    fill={isRouterA ? '#FFFFFF' : 'var(--ink)'}
                    fontSize="14"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {node}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Router A Converged Routing Table */}
        <div className="w-full md:w-2/5 p-3 rounded-lg bg-[var(--paper)] border border-[var(--rule)]">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[var(--rule)]">
            <div className="font-sans font-bold text-xs sm:text-sm text-[var(--ink)]">
              Router A — Converged Table
            </div>
            <span className="px-1.5 py-0.5 rounded bg-[var(--signal)]/15 text-[var(--signal)] text-[10px] font-mono font-bold">
              Corrected
            </span>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--rule)]">
                <th className="py-1">Destination</th>
                <th className="py-1">Cost</th>
                <th className="py-1">Next Hop</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--rule)]/60 font-mono">
              <tr>
                <td className="py-1.5 font-bold">A</td>
                <td className="py-1.5">0</td>
                <td className="py-1.5 text-[var(--muted)]">–</td>
              </tr>
              <tr>
                <td className="py-1.5 font-bold">B</td>
                <td className="py-1.5 text-[var(--packet)] font-bold">2</td>
                <td className="py-1.5 font-bold">B</td>
              </tr>
              <tr>
                <td className="py-1.5 font-bold">C</td>
                <td className="py-1.5 text-[var(--packet)] font-bold">5</td>
                <td className="py-1.5 font-bold">B</td>
              </tr>
              <tr className="bg-[var(--mark)]/15">
                <td className="py-1.5 font-bold">D</td>
                <td className="py-1.5 text-[var(--packet)] font-bold">6</td>
                <td className="py-1.5 font-bold text-[var(--ink)]">
                  B <span className="text-[9px] text-[var(--signal)] font-sans">(not D)</span>
                </td>
              </tr>
              <tr className="bg-[var(--mark)]/15">
                <td className="py-1.5 font-bold">E</td>
                <td className="py-1.5 text-[var(--packet)] font-bold">7</td>
                <td className="py-1.5 font-bold text-[var(--ink)]">
                  B <span className="text-[9px] text-[var(--signal)] font-sans">(not D)</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-2 text-[10px] text-[var(--muted)] font-sans leading-tight">
            Shortest path to D is A → B → D (cost 2+4=6). Shortest path to E is A → B → C → E (cost 2+3+2=7). Both exit via Next-Hop B.
          </div>
        </div>
      </div>
    </div>
  );
};
