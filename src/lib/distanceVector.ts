export interface Link {
  u: string;
  v: string;
  cost: number;
}

export interface RoutingEntry {
  cost: number;
  nextHop: string;
}

export type RoutingTable = Record<string, RoutingEntry>;

export interface RouterRoundState {
  table: RoutingTable;
  changedDestinations: string[];
}

export interface DVRound {
  round: number;
  description: string;
  states: Record<string, RouterRoundState>;
}

export const DEFAULT_DV_NODES = ['A', 'B', 'C', 'D', 'E'];

export const DEFAULT_DV_LINKS: Link[] = [
  { u: 'A', v: 'B', cost: 2 },
  { u: 'A', v: 'D', cost: 7 },
  { u: 'B', v: 'C', cost: 3 },
  { u: 'B', v: 'D', cost: 4 },
  { u: 'C', v: 'E', cost: 2 },
  { u: 'D', v: 'E', cost: 1 },
];

export const DV_NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  A: { x: 80, y: 170 },
  B: { x: 260, y: 60 },
  C: { x: 440, y: 170 },
  D: { x: 170, y: 310 },
  E: { x: 350, y: 310 },
};

export function computeDistanceVectorRounds(
  nodes: string[] = DEFAULT_DV_NODES,
  links: Link[] = DEFAULT_DV_LINKS
): DVRound[] {
  const neighbors: Record<string, { node: string; cost: number }[]> = {};
  for (const n of nodes) {
    neighbors[n] = [];
  }
  for (const l of links) {
    neighbors[l.u].push({ node: l.v, cost: l.cost });
    neighbors[l.v].push({ node: l.u, cost: l.cost });
  }

  // Sort neighbors alphabetically for consistent tie-breaking
  for (const n of nodes) {
    neighbors[n].sort((a, b) => a.node.localeCompare(b.node));
  }

  // Round 0 (initialization)
  const round0States: Record<string, RouterRoundState> = {};
  for (const u of nodes) {
    const table: RoutingTable = {};
    for (const v of nodes) {
      if (u === v) {
        table[v] = { cost: 0, nextHop: '–' };
      } else {
        const edge = neighbors[u].find((nb) => nb.node === v);
        if (edge) {
          table[v] = { cost: edge.cost, nextHop: v };
        } else {
          table[v] = { cost: Infinity, nextHop: '–' };
        }
      }
    }
    round0States[u] = {
      table,
      changedDestinations: Object.keys(table),
    };
  }

  const rounds: DVRound[] = [
    {
      round: 0,
      description:
        'Initial state: each router knows only directly connected neighbors. All other paths are infinite.',
      states: round0States,
    },
  ];

  let prevStates = round0States;
  let currentRoundNum = 1;
  const maxRounds = 6;

  while (currentRoundNum <= maxRounds) {
    const currentStates: Record<string, RouterRoundState> = {};
    let anyChanges = false;

    for (const u of nodes) {
      const newTable: RoutingTable = {};
      const changedDestinations: string[] = [];

      for (const dest of nodes) {
        if (u === dest) {
          newTable[dest] = { cost: 0, nextHop: '–' };
          continue;
        }

        let bestCost = Infinity;
        let bestNextHop = '–';

        // Check direct link if any
        const directEdge = neighbors[u].find((nb) => nb.node === dest);
        if (directEdge) {
          bestCost = directEdge.cost;
          bestNextHop = dest;
        }

        // Apply Bellman-Ford equation: min over neighbors v of { c(u, v) + Dv(dest) }
        // neighbors[u] is sorted alphabetically, so strict inequality "<" retains alphabetical tie-breaker
        for (const { node: v, cost: linkCost } of neighbors[u]) {
          const neighborDistToDest = prevStates[v].table[dest]?.cost ?? Infinity;
          if (neighborDistToDest !== Infinity) {
            const totalCost = linkCost + neighborDistToDest;
            if (totalCost < bestCost) {
              bestCost = totalCost;
              bestNextHop = v;
            }
          }
        }

        newTable[dest] = { cost: bestCost, nextHop: bestNextHop };

        const prevEntry = prevStates[u].table[dest];
        if (
          !prevEntry ||
          prevEntry.cost !== bestCost ||
          prevEntry.nextHop !== bestNextHop
        ) {
          changedDestinations.push(dest);
          anyChanges = true;
        }
      }

      currentStates[u] = {
        table: newTable,
        changedDestinations,
      };
    }

    if (!anyChanges) {
      break;
    }

    let description = `Round ${currentRoundNum}: `;
    if (currentRoundNum === 1) {
      description +=
        'Routers exchange vectors with direct neighbors. Routes to 2-hop destinations (e.g. A to C, E to B) are discovered.';
    } else if (currentRoundNum === 2) {
      description +=
        'Routes propagate further. Router A finds a cheaper path to E via B (cost 7 instead of 8 via D). The network has now CONVERGED.';
    } else {
      description += 'Stable routing state reached.';
    }

    rounds.push({
      round: currentRoundNum,
      description,
      states: currentStates,
    });

    prevStates = currentStates;
    currentRoundNum++;
  }

  return rounds;
}
