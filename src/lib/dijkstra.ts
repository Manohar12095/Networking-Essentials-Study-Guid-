export interface DijkstraLink {
  u: string;
  v: string;
  cost: number;
}

export interface DijkstraNodePosition {
  x: number;
  y: number;
}

export interface DijkstraTableRow {
  step: number;
  fixedNode: string;
  setS: string;
  entries: Record<string, { cost: number; predecessor: string }>;
  explanation: string;
}

export interface RoutingTableResult {
  dest: string;
  path: string[];
  pathStr: string;
  cost: number;
  nextHop: string;
}

export interface DijkstraSimulationResult {
  source: string;
  nodes: string[];
  tableRows: DijkstraTableRow[];
  finalRoutingTable: RoutingTableResult[];
  treeEdges: { u: string; v: string }[];
}

// Exam question graph
export const EXAM_NODES = ['A', 'B', 'C', 'D', 'E'];
export const EXAM_LINKS: DijkstraLink[] = [
  { u: 'A', v: 'B', cost: 2 },
  { u: 'A', v: 'C', cost: 1 },
  { u: 'A', v: 'D', cost: 7 },
  { u: 'C', v: 'D', cost: 2 },
  { u: 'B', v: 'E', cost: 5 },
  { u: 'D', v: 'E', cost: 3 },
];

export const EXAM_NODE_POSITIONS: Record<string, DijkstraNodePosition> = {
  B: { x: 70, y: 220 },
  A: { x: 230, y: 80 },
  C: { x: 230, y: 220 },
  D: { x: 420, y: 220 },
  E: { x: 230, y: 360 },
};

// Practice example graph (from link-state-concept.png)
export const PRACTICE_NODES = ['A', 'B', 'C', 'D', 'E'];
export const PRACTICE_LINKS: DijkstraLink[] = [
  { u: 'A', v: 'B', cost: 2 },
  { u: 'A', v: 'D', cost: 1 },
  { u: 'B', v: 'C', cost: 3 },
  { u: 'B', v: 'D', cost: 4 },
  { u: 'B', v: 'E', cost: 2 },
  { u: 'C', v: 'E', cost: 5 },
  { u: 'D', v: 'E', cost: 1 },
];

export const PRACTICE_NODE_POSITIONS: Record<string, DijkstraNodePosition> = {
  A: { x: 80, y: 180 },
  B: { x: 250, y: 70 },
  C: { x: 440, y: 140 },
  D: { x: 180, y: 310 },
  E: { x: 360, y: 290 },
};

export function runDijkstra(
  source: string,
  nodes: string[],
  links: DijkstraLink[]
): DijkstraSimulationResult {
  const adj: Record<string, { node: string; cost: number }[]> = {};
  for (const n of nodes) adj[n] = [];
  for (const l of links) {
    adj[l.u].push({ node: l.v, cost: l.cost });
    adj[l.v].push({ node: l.u, cost: l.cost });
  }

  // Current tentative costs and predecessors
  const dist: Record<string, number> = {};
  const pred: Record<string, string> = {};
  for (const n of nodes) {
    if (n === source) {
      dist[n] = 0;
      pred[n] = '-';
    } else {
      const edge = adj[source].find((e) => e.node === n);
      if (edge) {
        dist[n] = edge.cost;
        pred[n] = source;
      } else {
        dist[n] = Infinity;
        pred[n] = '–';
      }
    }
  }

  const S: string[] = [source];
  const tableRows: DijkstraTableRow[] = [];
  const otherNodes = nodes.filter((n) => n !== source);

  let step = 1;
  while (S.length < nodes.length) {
    // Find unfixed node with minimum distance (break ties alphabetically)
    const candidates = nodes
      .filter((n) => !S.includes(n))
      .sort((a, b) => {
        if (dist[a] !== dist[b]) return dist[a] - dist[b];
        return a.localeCompare(b);
      });

    if (candidates.length === 0 || dist[candidates[0]] === Infinity) break;

    const u = candidates[0];
    S.push(u);

    // Snapshot at the moment u is fixed (before u's neighbors are relaxed)
    const snapshotEntries: Record<string, { cost: number; predecessor: string }> = {};
    for (const n of otherNodes) {
      snapshotEntries[n] = {
        cost: dist[n],
        predecessor: pred[n],
      };
    }

    // Explanation for fixing u
    let expl = `Step ${step}: Node ${u} has the smallest tentative distance (${dist[u]}). Add ${u} to S = {${S.join(', ')}}.`;

    // Now relax neighbors of u
    const relaxedNotes: string[] = [];
    for (const edge of adj[u]) {
      const v = edge.node;
      if (!S.includes(v)) {
        const newDist = dist[u] + edge.cost;
        if (newDist < dist[v]) {
          dist[v] = newDist;
          pred[v] = u;
          relaxedNotes.push(`Through ${u}: ${v} becomes ${newDist} via ${u}`);
        }
      }
    }

    if (relaxedNotes.length > 0) {
      expl += ` Updated neighbors: ${relaxedNotes.join(', ')}.`;
    }

    tableRows.push({
      step,
      fixedNode: u,
      setS: S.join(''),
      entries: snapshotEntries,
      explanation: expl,
    });

    step++;
  }

  // Build shortest path tree edges and routing table
  const treeEdges: { u: string; v: string }[] = [];
  const finalRoutingTable: RoutingTableResult[] = [];

  for (const dest of otherNodes) {
    if (dist[dest] === Infinity) continue;

    // reconstruct path backwards
    const path: string[] = [];
    let curr = dest;
    while (curr !== source && curr !== '–') {
      path.unshift(curr);
      const p = pred[curr];
      if (p && p !== '–') {
        // record tree edge
        const sortedEdge = [p, curr].sort();
        if (
          !treeEdges.some(
            (e) => e.u === sortedEdge[0] && e.v === sortedEdge[1]
          )
        ) {
          treeEdges.push({ u: sortedEdge[0], v: sortedEdge[1] });
        }
        curr = p;
      } else {
        break;
      }
    }
    path.unshift(source);

    const nextHop = path.length > 1 ? path[1] : '–';
    finalRoutingTable.push({
      dest,
      path,
      pathStr: path.join(' → '),
      cost: dist[dest],
      nextHop,
    });
  }

  return {
    source,
    nodes,
    tableRows,
    finalRoutingTable,
    treeEdges,
  };
}
