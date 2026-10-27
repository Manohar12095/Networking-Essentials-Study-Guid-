import { Topic } from '../../types/content';

export const vlsmTopic: Topic = {
  slug: 'vlsm',
  unit: 3,
  order: 1,
  title: 'Variable Length Subnet Mask (VLSM)',
  shortTitle: 'VLSM',
  oneLineDefinition:
    'VLSM is a technique of dividing one IP network into subnets of different sizes, each with its own subnet mask, so that every subnet gets just enough addresses for its hosts.',
  examKeywords: [
    'CIDR',
    'subnet mask',
    'host bits',
    '2^h − 2',
    'network ID',
    'broadcast address',
    'classless',
    'route summarisation',
  ],
  writeInExam: [
    '1. Define VLSM as dividing one network into subnets of variable sizes using classless addressing.',
    '2. State key formulas: usable hosts = 2^h − 2, prefix = 32 − h, block size = 2^h.',
    '3. Draw network topology with router connecting LAN A (100), B (50), C (25), and D (2).',
    '4. Show complete calculations sorted largest-first with a clean subnet allocation table.',
    '5. Compare FLSM vs VLSM in a 6-point table, ending with advantages and disadvantages.',
  ],
  revisionPoints: [
    'Divides a single base network into subnets of unequal sizes to prevent IPv4 address waste.',
    'Formula: Usable hosts = 2^h − 2 (one address for Network ID, one for Broadcast).',
    'Golden Rule: Always sort subnet host requirements from largest to smallest before allocating.',
    'Prefix length = 32 − h; Block size = 2^h = 256 − (mask interesting octet).',
    'Each subsequent subnet begins at previous broadcast address + 1 (aligned to its block size).',
    'Supported only by classless routing protocols: RIPv2, OSPF, EIGRP, IS-IS, BGP (RIPv1 fails).',
    'Mnemonic: "Biggest first, block by block."',
  ],
  sections: [
    {
      id: 'definition',
      title: '1. Introduction and Definition',
      marks: 2,
      blocks: [
        {
          type: 'paragraph',
          text: 'Variable Length Subnet Masking (VLSM) is an advanced IP subnetting design technique where a single network address space is divided into subnets of varying sizes rather than uniform blocks. Each subnet is assigned an individual subnet mask tailored precisely to the number of host addresses required by that specific segment.',
        },
        {
          type: 'keypoints',
          title: 'Core Fundamentals to State in Exam',
          items: [
            'Classless Addressing: VLSM operates strictly within Classless Inter-Domain Routing (CIDR) architecture.',
            'Protocol Requirement: Routing protocols must transmit the subnet mask alongside route advertisements (e.g., RIPv2, OSPF, EIGRP, BGP). Classful protocols like RIPv1 and IGRP cannot support VLSM.',
            'Eliminates Address Waste: Solves the severe internal fragmentation problem of Fixed Length Subnet Masking (FLSM).',
          ],
        },
        {
          type: 'mnemonic',
          text: 'Mnemonic: "Biggest first, block by block."',
        },
      ],
    },
    {
      id: 'concept',
      title: '2. Core Concept and Working Procedure',
      marks: 5,
      blocks: [
        {
          type: 'paragraph',
          text: 'In Fixed Length Subnet Masking (FLSM), every subnet shares an identical subnet mask. Consequently, allocating a subnet for a 2-host WAN link wastes the same address volume as a 100-host department. VLSM addresses this by allocating power-of-two address blocks tailored to the required host count.',
        },
        {
          type: 'formula',
          label: 'Essential Subnetting Formulas',
          lines: [
            'Usable Hosts = 2^h − 2',
            'h = number of host bits in the address',
            'Prefix Length (/n) = 32 − h',
            'Block Size = 2^h = 256 − (value of the interesting octet in mask)',
            'Next Subnet Start = Previous Subnet Broadcast Address + 1',
          ],
        },
        {
          type: 'steps',
          items: [
            'Step 1: Identify the base network IP and CIDR prefix, along with the exact host requirements for each LAN or point-to-point link.',
            'Step 2: Sort all host requirements in descending order (largest requirement to smallest).',
            'Step 3: For each requirement, determine the minimum integer h such that 2^h − 2 ≥ host requirement. Calculate prefix length as 32 − h.',
            'Step 4: Allocate the largest subnet first, starting at the lowest address of the parent base network.',
            'Step 5: Calculate the subnet boundary: Network Address, First Usable Host (+1), Last Usable Host (Broadcast − 1), and Broadcast Address (Network + Block Size − 1).',
            'Step 6: Start each subsequent subnet at (Previous Broadcast + 1). Verify that the address is an exact multiple of the new subnet block size.',
            'Step 7: Verify that no subnets overlap and the final address does not exceed the parent network boundaries.',
          ],
        },
        {
          type: 'mistakes',
          items: [
            'Forgetting the −2 subtraction: Network ID (all host bits 0) and Directed Broadcast (all host bits 1) cannot be assigned to hosts.',
            'Allocating smaller subnets first: This causes address fragmentation and misalignment with power-of-two boundaries.',
            'Starting a subnet at an improper boundary: A subnet with block size N must begin on an address that is a multiple of N.',
          ],
        },
      ],
    },
    {
      id: 'diagram',
      title: '3. Network Topology Diagram',
      marks: 3,
      blocks: [
        {
          type: 'paragraph',
          text: 'The standard exam scenario depicts a central router interconnecting four independent networks: LAN A (100 hosts), LAN B (50 hosts), LAN C (25 hosts), and LAN D (2 hosts, point-to-point serial link).',
        },
        {
          type: 'image',
          src: './images/vlsm-network.png',
          alt: 'VLSM network diagram with router connecting LAN A (100 hosts), LAN B (50 hosts), LAN C (25 hosts), and LAN D (2 hosts)',
          caption:
            'Figure 3.1: Network topology showing 4 subnets connected to a central router with prefix assignments /25, /26, /27, and /30.',
        },
        {
          type: 'callout',
          tone: 'info',
          text: 'Exam note: When drawing this diagram on paper, clearly label each interface with its assigned subnet CIDR (e.g. 192.168.1.0/25) and state the number of hosts accommodated.',
        },
      ],
    },
    {
      id: 'example',
      title: '4. Worked Exam Example and Calculations',
      marks: 4,
      blocks: [
        {
          type: 'paragraph',
          text: 'Given Base Network: 192.168.1.0/24 (Total 256 addresses). Host requirements: LAN A = 100 hosts, LAN B = 50 hosts, LAN C = 25 hosts, LAN D = 2 hosts.',
        },
        {
          type: 'bullets',
          items: [
            'LAN A (100 hosts): 2^7 − 2 = 126 ≥ 100 → h = 7, Prefix = 32 − 7 = /25, Block size = 128.',
            'LAN B (50 hosts): 2^6 − 2 = 62 ≥ 50 → h = 6, Prefix = 32 − 6 = /26, Block size = 64.',
            'LAN C (25 hosts): 2^5 − 2 = 30 ≥ 25 → h = 5, Prefix = 32 − 5 = /27, Block size = 32.',
            'LAN D (2 hosts): 2^2 − 2 = 2 ≥ 2 → h = 2, Prefix = 32 − 2 = /30, Block size = 4.',
          ],
        },
        {
          type: 'table',
          caption: 'Complete VLSM Subnet Allocation Table',
          headers: [
            'LAN',
            'Hosts Needed',
            'Network ID / Prefix',
            'Subnet Mask',
            'First Host',
            'Last Host',
            'Broadcast',
            'Usable Hosts',
          ],
          rows: [
            [
              'LAN A',
              '100',
              '192.168.1.0/25',
              '255.255.255.128',
              '192.168.1.1',
              '192.168.1.126',
              '192.168.1.127',
              '126',
            ],
            [
              'LAN B',
              '50',
              '192.168.1.128/26',
              '255.255.255.192',
              '192.168.1.129',
              '192.168.1.190',
              '192.168.1.191',
              '62',
            ],
            [
              'LAN C',
              '25',
              '192.168.1.192/27',
              '255.255.255.224',
              '192.168.1.193',
              '192.168.1.222',
              '192.168.1.223',
              '30',
            ],
            [
              'LAN D',
              '2',
              '192.168.1.224/30',
              '255.255.255.252',
              '192.168.1.225',
              '192.168.1.226',
              '192.168.1.227',
              '2',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Address Accounting: Total allocated addresses = 128 + 64 + 32 + 4 = 228 addresses out of 256. Unused addresses = 192.168.1.228 to 192.168.1.255 (28 addresses remaining), reserved for future network expansion.',
        },
        {
          type: 'callout',
          tone: 'warn',
          text: 'Why FLSM fails here: To satisfy LAN A (100 hosts), FLSM would force all subnets to use a /25 mask (128 addresses each). But a /24 parent block can only accommodate two /25 subnets, making it impossible to support 4 LANs. VLSM successfully provisions all four with room to spare.',
        },
        {
          type: 'interactive',
          component: 'VlsmCalculator',
        },
      ],
    },
    {
      id: 'comparison',
      title: '5. FLSM vs VLSM Comparison, Advantages & Disadvantages',
      marks: 2,
      blocks: [
        {
          type: 'table',
          caption: 'FLSM vs VLSM Direct Comparison',
          headers: ['Comparison Point', 'FLSM (Fixed Length)', 'VLSM (Variable Length)'],
          rows: [
            ['Subnet Size', 'All subnets are identical in size', 'Subnets vary in size per requirement'],
            ['Address Wastage', 'High (especially on WAN point-to-point links)', 'Minimal (exact power-of-2 fit)'],
            ['Subnet Mask', 'Single uniform mask across the entire network', 'Multiple distinct subnet masks'],
            ['Routing Protocols', 'Supports both classful (RIPv1) & classless', 'Classless routing protocols only (RIPv2, OSPF, etc.)'],
            ['Planning Complexity', 'Simple and straightforward', 'Requires careful descending allocation'],
            ['Suitability', 'Uniform departments of equal size', 'Realistic enterprise topologies with varied LANs'],
          ],
        },
        {
          type: 'keypoints',
          title: 'Advantages and Disadvantages of VLSM',
          items: [
            'Advantage - High Address Efficiency: Prevents address exhaustion in private and public IPv4 spaces.',
            'Advantage - Route Summarisation: Hierarchical allocation allows multiple subnets to be represented by a single summary route.',
            'Advantage - Ideal for WAN links: Efficiently provisions 2-host /30 subnets without wasting 60+ addresses.',
            'Disadvantage - Configuration Complexity: Higher probability of human error and overlapping subnets during manual assignment.',
            'Disadvantage - Routing Overhead: Requires protocols that broadcast subnet masks, adding slight packet payload overhead.',
          ],
        },
      ],
    },
  ],
};
