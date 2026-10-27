import { Topic } from '../../types/content';

export const distanceVectorTopic: Topic = {
  slug: 'distance-vector',
  unit: 3,
  order: 2,
  title: 'Distance Vector Routing',
  shortTitle: 'Distance Vector',
  oneLineDefinition:
    'In distance vector routing each router keeps a table giving the distance (cost) to every destination and the next hop, and periodically shares that table with its directly connected neighbours only.',
  examKeywords: [
    'Bellman-Ford',
    'distance vector',
    'next hop',
    'convergence',
    'count-to-infinity',
    'split horizon',
    'poison reverse',
    'RIP',
    'hop count',
  ],
  writeInExam: [
    '1. Define Distance Vector Routing based on Bellman-Ford equation: D_x(y) = min_v { c(x,v) + D_v(y) }.',
    '2. Explain 4-stage working: Initialization (Round 0), Periodic Exchange, Table Update, and Convergence.',
    '3. Draw 5-node topology (A-E) with link costs and Router A converged routing table.',
    '4. Construct iteration tables for Round 0, Round 1, and Round 2 with highlighted updates.',
    '5. Explain Count-to-Infinity with 3-node failure example and list all 5 mitigation techniques.',
  ],
  revisionPoints: [
    'Routers exchange full routing tables only with directly connected neighbors ("routing by rumor").',
    'Uses the Bellman-Ford algorithm: D_x(y) = min_v { c(x, v) + D_v(y) }.',
    'Round 0: Direct neighbors known; Round 1: 2-hop destinations reached; Round 2: Converged.',
    'Router A final least costs: to B=2 (via B), to C=5 (via B), to D=6 (via B), to E=7 (via B).',
    'Count-to-Infinity: Routing loops cause costs to increment endlessly when links fail.',
    'Solutions: Max Hop Count (16 in RIP), Split Horizon, Poison Reverse, Hold-down timers, Triggered updates.',
    'Mnemonic: "Neighbours only, whole table, on a timer."',
  ],
  sections: [
    {
      id: 'definition',
      title: '1. Introduction and Definition',
      marks: 2,
      blocks: [
        {
          type: 'paragraph',
          text: 'Distance Vector Routing is a distributed, dynamic routing algorithm in which every router maintains a table (vector) containing the minimum known distance (metric cost) to every destination in the network and the corresponding next-hop router. Routers periodically transmit copies of their routing tables exclusively to directly connected neighbors.',
        },
        {
          type: 'keypoints',
          title: 'Foundational Concepts for 16-Mark Answers',
          items: [
            'Bellman-Ford Algorithm: Mathematical foundation used to compute shortest paths across distributed nodes.',
            '"Routing by Rumour": Routers do not possess a global map of the network; they blindly trust metric assessments advertised by adjacent neighbors.',
            'Periodic Updates: State exchanges occur on fixed time intervals (e.g. RIP broadcasts its vector every 30 seconds over UDP port 520).',
          ],
        },
        {
          type: 'mnemonic',
          text: 'Mnemonic: "Neighbours only, whole table, on a timer."',
        },
      ],
    },
    {
      id: 'concept',
      title: '2. Core Concept and Working Mechanism',
      marks: 5,
      blocks: [
        {
          type: 'paragraph',
          text: 'Each router x measures link cost c(x, v) to each direct neighbor v. When router x receives a distance vector D_v from neighbor v, it updates its estimate D_x(y) to destination y using the Bellman-Ford equation.',
        },
        {
          type: 'formula',
          label: 'The Bellman-Ford Optimality Equation',
          lines: [
            'D_x(y) = min_v { c(x, v) + D_v(y) }',
            'Where:',
            '  c(x, v) = direct cost of link from router x to neighbor v',
            '  D_v(y)  = neighbor v’s advertised minimum cost to reach destination y',
            '  min_v   = minimum evaluated across all direct neighbors v of x',
          ],
        },
        {
          type: 'steps',
          items: [
            '1. Initialisation (Round 0): Each router initializes distance to itself as 0 and directly connected neighbors as link cost c(x, v). All other destinations are marked as infinity (∞) with next-hop undefined.',
            '2. Exchange: Each router packages its entire distance vector and broadcasts/multicasts it to all immediate neighbors.',
            '3. Update: Upon receiving neighbor vectors, the router adds link cost c(x, v) to every advertised distance D_v(y). If (c(x, v) + D_v(y)) < current D_x(y), the router updates its cost and re-points next-hop to v.',
            '4. Repeat & Convergence: The exchange and update cycle repeats until no router table undergoes any further modification. The network is then converged.',
          ],
        },
      ],
    },
    {
      id: 'diagram',
      title: '3. Network Topology & Native Vector Representation',
      marks: 3,
      blocks: [
        {
          type: 'paragraph',
          text: 'Consider the standard 5-router network (Routers A, B, C, D, E) with link costs: A-B = 2, A-D = 7, B-C = 3, B-D = 4, C-E = 2, D-E = 1.',
        },
        {
          type: 'native',
          component: 'DistanceVectorSvg',
        },
        {
          type: 'callout',
          tone: 'warn',
          text: 'Examiner Correction Note on Textbook Diagram: The original generated illustration shows Router A reaching D via D (cost 6) and E via D (cost 7). This is incorrect because A has no direct cost 6 to D through D. With A-B=2, B-D=4, the shortest path to D is A → B → D with cost 6 (next-hop B), and to E is A → B → C → E with cost 7 (next-hop B). Our native interactive diagram above displays the true, mathematically proven paths.',
        },
        {
          type: 'image',
          src: './images/distance-vector.png',
          alt: 'Original distance vector network illustration with 5 routers',
          caption:
            'Original textbook illustration (retained for reference; note that next-hop for D and E should be B).',
          note: 'Original illustration (see correction note above).',
        },
      ],
    },
    {
      id: 'worked-example',
      title: '4. Step-by-Step Round Iterations and Convergence',
      marks: 4,
      blocks: [
        {
          type: 'paragraph',
          text: 'We trace the execution of the Bellman-Ford algorithm round by round until complete network convergence. Each table entry represents (Cost / Next Hop).',
        },
        {
          type: 'table',
          caption: 'Round 0: Initialisation (Direct Neighbors Only)',
          headers: ['Router', 'Dest A', 'Dest B', 'Dest C', 'Dest D', 'Dest E'],
          rows: [
            ['Router A', '0 / –', '2 / B', '∞', '7 / D', '∞'],
            ['Router B', '2 / A', '0 / –', '3 / C', '4 / D', '∞'],
            ['Router C', '∞', '3 / B', '0 / –', '∞', '2 / E'],
            ['Router D', '7 / A', '4 / B', '∞', '0 / –', '1 / E'],
            ['Router E', '∞', '∞', '2 / C', '1 / D', '0 / –'],
          ],
        },
        {
          type: 'table',
          caption: 'Round 1: Vectors Exchanged (2-Hop Paths Discovered)',
          headers: ['Router', 'Dest A', 'Dest B', 'Dest C', 'Dest D', 'Dest E'],
          rows: [
            ['Router A', '0 / –', '2 / B', '5 / B', '6 / B', '8 / D'],
            ['Router B', '2 / A', '0 / –', '3 / C', '4 / D', '5 / C'],
            ['Router C', '5 / B', '3 / B', '0 / –', '3 / E', '2 / E'],
            ['Router D', '6 / B', '4 / B', '3 / E', '0 / –', '1 / E'],
            ['Router E', '8 / D', '5 / C', '2 / C', '1 / D', '0 / –'],
          ],
        },
        {
          type: 'paragraph',
          text: 'Round 1 notes: Router A learns of C via B (2 + 3 = 5), updates D to 6 via B (2 + 4 = 6, beating 7), and learns of E via D (7 + 1 = 8). At Router B, cost to E is 5 (tied via C [3+2] and via D [4+1]; alphabetical tie-breaker selects C).',
        },
        {
          type: 'table',
          caption: 'Round 2: Final Converged Routing Tables (Round 3 produces no changes)',
          headers: ['Router', 'Dest A', 'Dest B', 'Dest C', 'Dest D', 'Dest E'],
          rows: [
            ['Router A', '0 / –', '2 / B', '5 / B', '6 / B', '7 / B'],
            ['Router B', '2 / A', '0 / –', '3 / C', '4 / D', '5 / C'],
            ['Router C', '5 / B', '3 / B', '0 / –', '3 / E', '2 / E'],
            ['Router D', '6 / B', '4 / B', '3 / E', '0 / –', '1 / E'],
            ['Router E', '7 / C', '5 / C', '2 / C', '1 / D', '0 / –'],
          ],
        },
        {
          type: 'keypoints',
          title: 'Final Routing Table at Router A (Reproduce in Exam)',
          items: [
            'Destination A: Cost 0 | Next Hop – (Direct / Local)',
            'Destination B: Cost 2 | Next Hop B (Direct)',
            'Destination C: Cost 5 | Next Hop B (Path: A → B → C)',
            'Destination D: Cost 6 | Next Hop B (Path: A → B → D)',
            'Destination E: Cost 7 | Next Hop B (Path: A → B → C → E)',
          ],
        },
        {
          type: 'interactive',
          component: 'DistanceVectorStepper',
        },
      ],
    },
    {
      id: 'count-to-infinity',
      title: '5. Count-to-Infinity Problem, Solutions & Protocol Comparison',
      marks: 2,
      blocks: [
        {
          type: 'paragraph',
          text: 'The primary failure mode of Distance Vector Routing is the Count-to-Infinity problem, stemming from the fact that "bad news travels slowly." When a link fails, neighboring nodes may hold stale, looping routing information.',
        },
        {
          type: 'bullets',
          items: [
            'Failure Scenario: Consider linear topology A — B — C (cost 1 each). B reaches C directly with cost 1; A reaches C via B with cost 2.',
            'Link Breaks: If link B—C fails, B can no longer reach C directly. However, B receives an advertisement from A claiming A can reach C at cost 2.',
            'Routing Loop: Unaware that A’s route goes through B itself, B adopts A’s route and updates its cost to 3 via A. In the next round, A sees B’s cost is 3 and updates to 4 via B. Costs incrementally spiral to 5, 6, 7...',
          ],
        },
        {
          type: 'keypoints',
          title: '5 Exam Solutions to Count-to-Infinity',
          items: [
            '1. Maximum Hop Count: Define a small metric limit beyond which a destination is deemed unreachable (e.g., RIP defines 16 hops as infinity).',
            '2. Split Horizon: Never advertise a route back out of the same interface through which it was originally learned.',
            '3. Poison Reverse: Instead of omitting the route, advertise it back out of that interface with an infinite metric (cost 16 in RIP).',
            '4. Hold-Down Timers: When a route fails, ignore all updates advertising a worse or equal path for a stabilization duration (e.g., 180 seconds in RIP).',
            '5. Triggered Updates: Immediately transmit routing updates upon detecting a topology change rather than waiting for the periodic timer.',
          ],
        },
        {
          type: 'table',
          caption: 'Routing Information Protocol (RIP) Key Parameters',
          headers: ['Parameter', 'Specification'],
          rows: [
            ['Algorithm', 'Distance Vector (Bellman-Ford)'],
            ['Routing Metric', 'Hop count (minimum 1, maximum 15; 16 = unreachable)'],
            ['Periodic Timer', '30 seconds (full table broadcast)'],
            ['Transport Protocol', 'UDP port 520'],
            ['Invalid Timer', '180 seconds (route declared unreachable if no refresh)'],
            ['Flush Timer', '240 seconds (route purged from routing table)'],
          ],
        },
      ],
    },
  ],
};
