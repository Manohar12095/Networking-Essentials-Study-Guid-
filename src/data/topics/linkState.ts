import { Topic } from '../../types/content';

export const linkStateTopic: Topic = {
  slug: 'link-state',
  unit: 3,
  order: 3,
  title: 'Link State Routing (Dijkstra Algorithm)',
  shortTitle: 'Link State Routing',
  oneLineDefinition:
    'In link state routing every router learns the complete topology of the network by flooding information about its own links, stores it in a Link-State Database (LSDB), and independently runs Dijkstra’s shortest path algorithm to build its routing table.',
  examKeywords: [
    'LSDB',
    'LSP/LSA',
    'flooding',
    'Dijkstra',
    'shortest-path tree',
    'OSPF',
    'Hello packet',
    'sequence number',
  ],
  writeInExam: [
    '1. Define Link State Routing: full network map via flooding LSPs into an LSDB, and independent Dijkstra calculation.',
    '2. Detail the 5 operational phases: Neighbor discovery (Hello), Cost metric, LSP generation, Reliable flooding, SPF calculation.',
    '3. Present the Dijkstra algorithm pseudo-code with set S and relaxation condition.',
    '4. Construct the complete 4-step Dijkstra execution table for Node B, including the final routing table.',
    '5. Conclude with a comparison table between Distance Vector and Link State routing.',
  ],
  revisionPoints: [
    'Every router discovers the entire network topology and stores it in an identical Link-State Database (LSDB).',
    'Independent computation: Each router executes Dijkstra’s algorithm locally on its LSDB to find the Shortest Path Tree.',
    '5 Stages: Discover neighbors (Hello), measure cost, build LSP, flood reliably, compute routes.',
    'Exam Question (at Node B): S growth is BA → BAC → BACD → BACDE.',
    'Final least costs from Node B: A = 2, C = 3, D = 5, E = 5.',
    'Final routing table at B: A (cost 2, next hop A), C (cost 3, next hop A), D (cost 5, next hop A), E (cost 5, next hop E).',
    'Mnemonic: "Everyone learns the map, then draws their own shortest-path tree."',
  ],
  sections: [
    {
      id: 'definition',
      title: '1. Introduction and Definition',
      marks: 2,
      blocks: [
        {
          type: 'paragraph',
          text: 'Link State Routing is a modern, dynamic routing paradigm where each router independently gathers information about its directly attached links, floods this information to every other router in the network, and compiles a comprehensive map of the entire network topology called the Link-State Database (LSDB).',
        },
        {
          type: 'keypoints',
          title: 'Core Tenets for Exam Marks',
          items: [
            'Global Topology Knowledge: Unlike distance vector ("routing by rumour"), every router in a link-state network holds an identical, synchronized map of all nodes and edges.',
            'Dijkstra’s Shortest Path First (SPF) Algorithm: Each node places itself at the root and calculates the shortest path tree to all other nodes.',
            'Industry Standard Protocols: Open Shortest Path First (OSPF) and Intermediate System to Intermediate System (IS-IS) are the dominant implementations.',
          ],
        },
        {
          type: 'mnemonic',
          text: 'Mnemonic: "Everyone learns the map, then draws their own shortest-path tree."',
        },
      ],
    },
    {
      id: 'stages',
      title: '2. The Five Working Stages & Dijkstra’s Algorithm',
      marks: 5,
      blocks: [
        {
          type: 'steps',
          items: [
            '1. Discover Neighbours: On startup, a router transmits Hello packets across every active link. Adjacent routers respond, establishing bidirectional adjacency.',
            '2. Measure Link Cost: The router determines the metric cost of each active link (typically inversely proportional to bandwidth, e.g. 10^8 / bandwidth in OSPF, or configured delay).',
            '3. Construct Link-State Packet (LSP / LSA): The router packages its ID, a list of adjacent neighbors with their respective costs, a 32-bit sequence number, and an Age field.',
            '4. Reliable Flooding: The router floods its LSP to all immediate neighbors, which forward it across all other interfaces. Sequence numbers prevent duplicate processing and infinite loops; age fields purge obsolete LSPs.',
            '5. Compute Routes via Dijkstra: Once all LSPs are assembled in the LSDB, each router independently executes Dijkstra’s algorithm to generate its Shortest Path Tree (SPT) and derive its forwarding table.',
          ],
        },
        {
          type: 'formula',
          label: 'Dijkstra Iterative Relaxation Step',
          lines: [
            'For candidate node w adjacent to newly fixed node u:',
            'if (dist(u) + cost(u, w) < dist(w)) {',
            '    dist(w) = dist(u) + cost(u, w);',
            '    predecessor(w) = u;',
            '}',
          ],
        },
      ],
    },
    {
      id: 'diagram',
      title: '3. Exam Network Diagram (Node B Perspective)',
      marks: 3,
      blocks: [
        {
          type: 'paragraph',
          text: 'The primary examination question provides a 5-node topology with nodes A, B, C, D, E. Link costs: A-B = 2, A-C = 1, A-D = 7, C-D = 2, B-E = 5, D-E = 3. You are asked to determine the routing table at Node B.',
        },
        {
          type: 'native',
          component: 'TopologySvg',
        },
        {
          type: 'image',
          src: './images/link-state-question.jpg',
          alt: 'Exam question diagram showing 5 nodes with link costs and Node B Dijkstra table',
          caption:
            'Figure 3.1: The official exam paper diagram. The red numbers adjacent to nodes represent the final least costs computed from Node B: A (2), B (0), C (3), D (5), E (5).',
        },
      ],
    },
    {
      id: 'table',
      title: '4. Dijkstra Step-by-Step Table at Node B & Final Routing Table',
      marks: 4,
      blocks: [
        {
          type: 'paragraph',
          text: 'Reproduce this exact execution table in the exam. Each table entry records (Tentative Cost, Predecessor). Cells highlighted in bold yellow indicate the node permanently fixed into set S during that step.',
        },
        {
          type: 'table',
          caption: 'Execution Table of Dijkstra Algorithm at Node B',
          headers: ['Step', 'Dest A', 'Dest C', 'Dest D', 'Dest E', 'Set S (Nodes Fixed)'],
          rows: [
            ['1', '(2, B) [Fixed]', '∞', '∞', '(5, B)', 'BA'],
            ['2', '(2, B)', '(3, A) [Fixed]', '(9, A)', '(5, B)', 'BAC'],
            ['3', '(2, B)', '(3, A)', '(5, C) [Fixed]', '(5, B)', 'BACD'],
            ['4', '(2, B)', '(3, A)', '(5, C)', '(5, B) [Fixed]', 'BACDE'],
          ],
        },
        {
          type: 'callout',
          tone: 'info',
          text: 'Examiner Marking Rule: Each row shows the best-known costs at the moment the highlighted node is fixed into set S. The relaxation effect of fixing that node updates the unvisited neighbors in the subsequent row.',
        },
        {
          type: 'bullets',
          items: [
            'Initialization: Root B = 0. Direct neighbors: A = 2 (pred B), E = 5 (pred B). Set S = {B}.',
            'Step 1: Node A has minimum cost 2. Fix A into S = {B, A}. Relax through A: C becomes 2 + 1 = 3 (pred A); D becomes 2 + 7 = 9 (pred A).',
            'Step 2: Node C has minimum tentative cost 3. Fix C into S = {B, A, C}. Relax through C: D becomes 3 + 2 = 5 (pred C), which is strictly lower than 9.',
            'Step 3: Nodes D and E are tied at cost 5. Break tie alphabetically by selecting D. Fix D into S = {B, A, C, D}. Relax through D: E path would be 5 + 3 = 8, which is worse than existing direct path 5, so E remains 5 (pred B).',
            'Step 4: Fix E (cost 5, pred B) into S = {B, A, C, D, E}. All nodes are permanently evaluated.',
          ],
        },
        {
          type: 'table',
          caption: 'FINAL ROUTING TABLE AT NODE B (THE EXAM ANSWER)',
          headers: ['Destination', 'Shortest Path from B', 'Total Cost', 'Next Hop'],
          rows: [
            ['A', 'B → A', '2', 'A'],
            ['C', 'B → A → C', '3', 'A'],
            ['D', 'B → A → C → D', '5', 'A'],
            ['E', 'B → E', '5', 'E'],
          ],
        },
        {
          type: 'interactive',
          component: 'DijkstraStepper',
        },
      ],
    },
    {
      id: 'comparison',
      title: '5. Link State vs Distance Vector & Practice Example',
      marks: 2,
      blocks: [
        {
          type: 'table',
          caption: 'Link State vs Distance Vector Comparison',
          headers: ['Metric / Feature', 'Distance Vector Routing', 'Link State Routing'],
          rows: [
            ['Topology Knowledge', 'Neighbor’s table only ("routing by rumor")', 'Full global network topology (LSDB)'],
            ['Algorithm Used', 'Bellman-Ford equation', 'Dijkstra’s Shortest Path First (SPF)'],
            ['Update Scope', 'Sent only to direct neighbors', 'Flooded to all routers across the network'],
            ['Information Sent', 'Entire routing table', 'Only state/cost of directly attached links'],
            ['Convergence Speed', 'Slow (prone to count-to-infinity)', 'Fast and deterministic'],
            ['Routing Loops', 'Possible; requires timers & split horizon', 'Inherently loop-free (SPF tree)'],
            ['Memory & CPU Overhead', 'Low memory, low computation', 'Higher memory (LSDB) and CPU (SPF)'],
            ['Standard Protocols', 'RIP, IGRP', 'OSPF, IS-IS'],
          ],
        },
        {
          type: 'paragraph',
          text: 'Practice Example (Router A perspective from textbook illustration):',
        },
        {
          type: 'image',
          src: './images/link-state-concept.png',
          alt: 'Second practice example of Link State Routing at Router A',
          caption:
            'Figure 5.1: Practice Example — Dijkstra computed at Router A with resulting routing table: B (cost 2, next B), C (cost 5, next B), D (cost 1, next D), E (cost 2, next D).',
        },
      ],
    },
  ],
};
