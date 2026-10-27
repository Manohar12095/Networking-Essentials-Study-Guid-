import { Topic } from '../../types/content';

export const sctpTopic: Topic = {
  slug: 'sctp',
  unit: 4,
  order: 2,
  title: 'Stream Control Transmission Protocol (SCTP)',
  shortTitle: 'SCTP',
  oneLineDefinition:
    'SCTP (RFC 4960) is a reliable, message-oriented transport protocol that combines features of UDP and TCP, introducing multi-streaming to eliminate head-of-line blocking and multi-homing for high-availability path redundancy.',
  examKeywords: [
    'association',
    'multi-streaming',
    'multi-homing',
    'four-way handshake',
    'state cookie',
    'TSN',
    'SSN',
    'chunk',
    'head-of-line blocking',
    'heartbeat',
  ],
  writeInExam: [
    '1. Define SCTP: message-oriented, connection-oriented ("association") combining UDP message boundaries with TCP reliability.',
    '2. Detail core innovations: Multi-streaming (prevents HOL blocking) and Multi-homing (path fault tolerance).',
    '3. Draw the 4-way handshake (INIT, INIT ACK with cookie, COOKIE ECHO, COOKIE ACK) and multi-stream data paths.',
    '4. Explain the cookie mechanism against SYN-flood attacks and list key chunk types and sequence identifiers (TSN, SSN).',
    '5. Present an 8-row comparison table of SCTP vs TCP vs UDP, advantages/disadvantages, and telecom/5G use cases.',
  ],
  revisionPoints: [
    'Combines message boundaries (UDP) with reliability, ordering, and flow control (TCP).',
    'Connection is termed an "association" between multi-homed endpoints with multiple IP addresses.',
    'Multi-streaming: independent streams per association; a lost packet on stream 2 does not stall streams 1 or 3 (no cross-stream HOL blocking).',
    'Multi-homing: endpoints bind multiple IP interfaces; automatic failover using HEARTBEAT and HEARTBEAT ACK chunks.',
    'Four-Way Handshake: INIT → INIT ACK (cookie) → COOKIE ECHO → COOKIE ACK. Zero server resource allocation until Step 3 (SYN-flood immune).',
    'Packets consist of a 12-byte common header followed by bundled control and DATA chunks.',
    'Mnemonic: "INIT, ACK, ECHO, ACK: INIT-ACK carries the cookie, COOKIE-ECHO returns it."',
  ],
  sections: [
    {
      id: 'definition',
      title: '1. Introduction and Definition',
      marks: 2,
      blocks: [
        {
          type: 'paragraph',
          text: 'Stream Control Transmission Protocol (SCTP, RFC 4960) is a general-purpose, connection-oriented transport protocol operating at the Transport Layer of the OSI/TCP model. It was originally engineered by the IETF to transport PSTN telephony signalling (SS7) over IP networks (SIGTRAN), but has evolved into the mission-critical transport engine for 4G/5G mobile cores (S1AP, NGAP) and WebRTC data channels.',
        },
        {
          type: 'keypoints',
          title: 'The Hybrid Nature of SCTP',
          items: [
            'Preserves Message Boundaries: Delivers discrete messages like UDP; the application receives exactly what was sent without manual framing.',
            'Guarantees Reliability: Employs acknowledgements, retransmissions, Selective ACKs (SACK), and TCP-friendly congestion control.',
            'Association Concept: A connection in SCTP is called an "association" to reflect that both endpoints can span multiple IP addresses across different physical network interfaces.',
          ],
        },
        {
          type: 'mnemonic',
          text: 'Mnemonic: "INIT, ACK, ECHO, ACK: INIT-ACK carries the cookie, COOKIE-ECHO returns it."',
        },
      ],
    },
    {
      id: 'features',
      title: '2. Core Features, Sequence Identifiers & Packet Architecture',
      marks: 5,
      blocks: [
        {
          type: 'keypoints',
          title: 'Fundamental Architectural Innovations',
          items: [
            'Multi-Streaming: An association can partition traffic into multiple independent logical streams. If a message in Stream 2 is dropped, Stream 1 and Stream 3 continue uninterrupted. Head-of-line (HOL) blocking across unrelated streams is completely eliminated.',
            'Multi-Homing: Each endpoint can bind several IP addresses (e.g., dual NICs connected to distinct ISPs). One IP is designated as the primary path for transmission; secondary IPs serve as hot backups. HEARTBEAT chunks periodically audit alternate path viability.',
            'Strong Protection Against Blind Attacks: Employs a 32-bit verification tag in every packet to prevent blind spoofing, and computes a 32-bit CRC-32c checksum (far superior to 16-bit Internet checksum).',
          ],
        },
        {
          type: 'table',
          caption: 'SCTP Sequence Number Architecture',
          headers: ['Identifier', 'Full Form', 'Scope & Purpose'],
          rows: [
            ['TSN', 'Transmission Sequence Number', 'Association-wide 32-bit sequence number assigned to each DATA chunk for reliable transport, ACKs, and retransmissions.'],
            ['Stream ID', 'Stream Identifier', '16-bit identifier specifying which logical stream the message belongs to.'],
            ['SSN', 'Stream Sequence Number', '16-bit sequence number used to order messages strictly within that specific stream.'],
          ],
        },
        {
          type: 'paragraph',
          text: 'SCTP Packet Format: Every SCTP packet consists of a 12-byte Common Header followed by one or more bundled Chunks (control or data).',
        },
        {
          type: 'table',
          caption: 'SCTP Common Header (12 Bytes Total)',
          headers: ['Field', 'Size', 'Description'],
          rows: [
            ['Source Port', '16 bits', 'Sending application port number'],
            ['Destination Port', '16 bits', 'Receiving application port number'],
            ['Verification Tag', '32 bits', 'Unique association identifier randomly selected during handshake to prevent blind injection'],
            ['Checksum', '32 bits', 'CRC-32c algorithm computed over entire SCTP packet'],
          ],
        },
      ],
    },
    {
      id: 'diagram',
      title: '3. Handshake and Multi-Streaming Architecture Diagram',
      marks: 3,
      blocks: [
        {
          type: 'paragraph',
          text: 'The architecture combines a cookie-based 4-way establishment handshake with parallel, non-blocking multi-stream message queues.',
        },
        {
          type: 'image',
          src: './images/sctp-handshake-multistreaming.png',
          alt: 'SCTP Four-Way Handshake and Multi-Streaming Diagram',
          caption:
            'Figure 3.1: SCTP Four-Way Handshake (INIT, INIT ACK, COOKIE ECHO, COOKIE ACK) and Multi-Streaming independent queues.',
        },
      ],
    },
    {
      id: 'lifecycle',
      title: '4. Association Lifecycle, Cookie Mechanism & Chunk Types',
      marks: 4,
      blocks: [
        {
          type: 'steps',
          items: [
            '1. Client sends INIT chunk: Advertises initial TSN, requested inbound/outbound streams, list of local IP addresses, and client verification tag.',
            '2. Server replies with INIT ACK chunk: Contains server initial TSN, server verification tag, and a cryptographically signed State Cookie (HMAC). Crucially, the server allocates ZERO memory or TCB (Transmission Control Block) at this point.',
            '3. Client echoes with COOKIE ECHO chunk: Client echoes the unmodified state cookie back to the server. User data chunks can be bundled directly with this packet.',
            '4. Server completes with COOKIE ACK: Server validates the cookie signature, extracts association parameters, allocates memory resources, and returns COOKIE ACK. Both sides enter ESTABLISHED.',
          ],
        },
        {
          type: 'callout',
          tone: 'success',
          text: 'Why the Cookie Defeats SYN-Flood DoS Attacks: In TCP, receiving a SYN forces the server to allocate an embryo connection state block (TCB), allowing attackers to exhaust memory with spoofed SYNs. In SCTP, the server keeps no state during Step 2; it signs the client parameters into a cookie. The server commits resources only when the client proves it can receive packets at its declared address by returning the cookie in Step 3.',
        },
        {
          type: 'table',
          caption: 'Primary SCTP Chunk Types to Write in Exam',
          headers: ['Chunk Name', 'Type Flag', 'Functional Purpose'],
          rows: [
            ['INIT', 'Control', 'Initiates association setup from active client'],
            ['INIT ACK', 'Control', 'Acknowledges INIT and delivers the state cookie'],
            ['COOKIE ECHO', 'Control', 'Returns unmodified cookie to validate client legitimacy'],
            ['COOKIE ACK', 'Control', 'Finalizes association establishment'],
            ['DATA', 'Data', 'Transports application payload (TSN, Stream ID, SSN)'],
            ['SACK', 'Control', 'Selective Acknowledgement (cumulative TSN + gap reports)'],
            ['HEARTBEAT', 'Control', 'Probes viability of idle or secondary multi-homed paths'],
            ['HEARTBEAT ACK', 'Control', 'Validates path reachability'],
            ['SHUTDOWN', 'Control', 'Initiates graceful 3-way association termination (no half-close)'],
            ['ABORT', 'Control', 'Abruptly terminates association upon critical error'],
          ],
        },
        {
          type: 'interactive',
          component: 'SctpHandshake',
        },
      ],
    },
    {
      id: 'comparison',
      title: '5. SCTP vs TCP vs UDP Comparison & Applications',
      marks: 2,
      blocks: [
        {
          type: 'table',
          caption: 'SCTP vs TCP vs UDP Comprehensive Comparison',
          headers: ['Feature', 'UDP', 'TCP', 'SCTP'],
          rows: [
            ['Connection Nature', 'Connectionless', 'Connection (virtual circuit)', 'Association (multi-homed)'],
            ['Reliability', 'Unreliable (best effort)', 'Reliable (ACKs, timeout)', 'Reliable (SACKs, timeout)'],
            ['Data Framing Unit', 'Discrete Message', 'Continuous Byte Stream', 'Discrete Message (Chunks)'],
            ['Stream Support', 'Single channel', 'Single stream per socket', 'Multiple independent streams'],
            ['Multi-Homing', 'No', 'No', 'Native (multiple IPs bound)'],
            ['Establishment Handshake', 'None', '3-Way Handshake', '4-Way Handshake with Cookie'],
            ['SYN-Flood Resilience', 'N/A', 'Vulnerable', 'Immune (State Cookie)'],
            ['Head-of-Line Blocking', 'None', 'Severe across entire stream', 'Isolated to affected stream'],
            ['Security & Checksum', '16-bit 1s-complement', '16-bit 1s-complement', '32-bit CRC-32c + Verification Tag'],
          ],
        },
        {
          type: 'bullets',
          items: [
            'Telecom Signalling (SIGTRAN): SS7 telephony over IP requires high availability and zero HOL blocking.',
            '4G LTE & 5G NR Core: Transport for S1AP (eNodeB to MME) and NGAP (gNodeB to AMF) control plane signalling.',
            'WebRTC DataChannels: Browser-to-browser peer data communication runs SCTP encapsulated over DTLS/UDP.',
          ],
        },
      ],
    },
  ],
};
