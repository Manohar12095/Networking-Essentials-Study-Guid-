import { UnitInfo } from '../types/content';

export const UNITS: UnitInfo[] = [
  {
    unit: 3,
    title: 'Unit 3: Network Layer & Routing',
    description:
      'Variable Length Subnet Masking (VLSM), Distance Vector Routing (Bellman-Ford & count-to-infinity), and Link State Routing (Flooding, LSDB, and Dijkstra algorithm).',
    topicSlugs: ['vlsm', 'distance-vector', 'link-state'],
  },
  {
    unit: 4,
    title: 'Unit 4: Transport Layer & Protocols',
    description:
      'UDP datagram header, TCP connection lifecycle and 11-state transition machine (FSM), plus Stream Control Transmission Protocol (SCTP) associations and multi-streaming.',
    topicSlugs: ['udp-tcp-states', 'sctp'],
  },
  {
    unit: 5,
    title: 'Unit 5: Application Layer Services',
    description:
      'Domain Name System (DNS hierarchy, resolution, resource records, and caching), and Simple Mail Transfer Protocol (SMTP email architecture, commands, codes, and MIME).',
    topicSlugs: ['dns', 'smtp'],
  },
];
