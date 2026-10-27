import React from 'react';
import {
  EXAM_NODE_POSITIONS,
  EXAM_LINKS,
} from '../../lib/dijkstra';

interface TopologySvgProps {
  highlightTree?: boolean;
  activeNode?: string;
  tentativeDistances?: Record<string, number>;
  activeEdges?: { u: string; v: string }[];
}

export const TopologySvg: React.FC<TopologySvgProps> = ({
  highlightTree = true,
  activeNode,
  tentativeDistances = { B: 0, A: 2, C: 3, D: 5, E: 5 },
  activeEdges,
}) => {
  // Official Shortest Path Tree edges from B: B-A, A-C, C-D, B-E
  const defaultTreeEdges = [
    { u: 'A', v: 'B' },
    { u: 'A', v: 'C' },
    { u: 'C', v: 'D' },
    { u: 'B', v: 'E' },
  ];

  const treeToUse = activeEdges || (highlightTree ? defaultTreeEdges : []);

  const isTreeEdge = (u: string, v: string) => {
    return treeToUse.some(
      (e) => (e.u === u && e.v === v) || (e.u === v && e.v === u)
    );
  };

  const positions = EXAM_NODE_POSITIONS;

  return (
    <div
      role="img"
      aria-label="Link State Routing Exam Graph with Shortest Path Tree from Node B"
      className="my-5 p-4 rounded-lg bg-[var(--surface)] border border-[var(--rule)] shadow-sm max-w-2xl mx-auto"
    >
      <div className="text-center font-sans font-bold text-sm sm:text-base text-[var(--ink)] mb-1">
        Exam Question Topology (Shortest Path Tree Rooted at Node B)
      </div>
      <div className="text-center text-xs font-mono text-[var(--muted)] mb-3">
        Red links = Tree edges | Red numbers = Final least costs from Node B
      </div>

      <svg
        viewBox="0 0 500 440"
        className="w-full h-auto select-none"
        aria-hidden="true"
      >
        <title>Node B Shortest Path Tree</title>
        <desc>
          Nodes A, B, C, D, E with link costs. Tree edges B-A (2), A-C (1), C-D (2), B-E (5) in red.
        </desc>

        {/* Links */}
        {EXAM_LINKS.map((link, idx) => {
          const p1 = positions[link.u];
          const p2 = positions[link.v];
          const tree = isTreeEdge(link.u, link.v);
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;

          return (
            <g key={idx}>
              <line
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={tree ? '#E4572E' : 'var(--ink)'}
                strokeWidth={tree ? '3.5' : '2'}
                strokeLinecap="round"
              />
              {/* Cost Badge */}
              <circle
                cx={midX}
                cy={midY}
                r="11"
                fill="var(--surface)"
                stroke={tree ? '#E4572E' : 'var(--rule)'}
                strokeWidth="1.5"
              />
              <text
                x={midX}
                y={midY + 4}
                textAnchor="middle"
                fill={tree ? '#E4572E' : 'var(--ink)'}
                fontSize="11"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {link.cost}
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {Object.entries(positions).map(([node, pos]) => {
          const isActive = activeNode === node;
          const isRoot = node === 'B';
          const distVal = tentativeDistances[node];

          return (
            <g key={node} transform={`translate(${pos.x}, ${pos.y})`}>
              {/* Node Circle */}
              <circle
                r="24"
                fill={
                  isActive
                    ? 'var(--mark)'
                    : isRoot
                    ? 'var(--packet)'
                    : '#FCE7D6'
                }
                stroke={isRoot ? 'var(--ink)' : '#E4572E'}
                strokeWidth="2.5"
              />
              {/* Node Letter */}
              <text
                textAnchor="middle"
                y="-2"
                fill={isRoot ? '#FFFFFF' : '#14213D'}
                fontSize="14"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                {node}
              </text>
              {/* Distance from B (red numeral under letter as in exam paper) */}
              <text
                textAnchor="middle"
                y="15"
                fill={isRoot ? '#FFD84D' : '#E4572E'}
                fontSize="12"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {distVal !== undefined ? (distVal === Infinity ? '∞' : distVal) : ''}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
