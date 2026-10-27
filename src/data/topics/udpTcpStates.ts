import { Topic } from '../../types/content';

export const udpTcpStatesTopic: Topic = {
  slug: 'udp-tcp-states',
  unit: 4,
  order: 1,
  title: 'UDP and TCP with TCP State Transition Diagram',
  shortTitle: 'UDP & TCP States',
  oneLineDefinition:
    'UDP provides connectionless, lightweight datagram delivery with an 8-byte header, while TCP provides reliable, connection-oriented byte-stream transmission governed by an 11-state finite state machine.',
  examKeywords: [
    'three-way handshake',
    'four-way termination',
    'half-close',
    'SYN',
    'ACK',
    'FIN',
    '2MSL',
    'passive open',
    'active open',
    'port number',
  ],
  writeInExam: [
    '1. Introduce transport layer role (process-to-process delivery, port numbers) and contrast UDP vs TCP philosophies.',
    '2. Detail the 8-byte UDP header fields and explain TCP three-way handshake and four-way termination.',
    '3. Draw the complete TCP Finite State Machine (11 states) with active and passive open/close transitions.',
    '4. Construct the 11-state explanation table, explaining 2MSL TIME-WAIT rationale and typical paths.',
    '5. Conclude with an 8-point comparison table between UDP and TCP.',
  ],
  revisionPoints: [
    'UDP Header is exactly 8 bytes (4 fields × 16 bits: Source Port, Dest Port, Total Length, Checksum).',
    'UDP is connectionless and stateless: no connection setup, no sequence numbers, single idle/ready socket state.',
    'TCP is connection-oriented, reliable, full-duplex byte stream governed by an 11-state Finite State Machine.',
    'Three-Way Handshake: SYN (seq=x) → SYN+ACK (seq=y, ack=x+1) → ACK (ack=y+1).',
    'Active Close (Client): ESTABLISHED → FIN-WAIT-1 → FIN-WAIT-2 → TIME-WAIT (waits 2 MSL) → CLOSED.',
    'Passive Close (Server): ESTABLISHED → CLOSE-WAIT → LAST-ACK → CLOSED.',
    'Mnemonic for client termination: "Fin-one, Fin-two, Time, Closed."',
  ],
  sections: [
    {
      id: 'introduction',
      title: '1. Introduction to Transport Protocols',
      marks: 2,
      blocks: [
        {
          type: 'paragraph',
          text: 'The Transport Layer provides logical, process-to-process communication between host applications across an IP internetwork. It demultiplexes incoming traffic using 16-bit Port Numbers (0 to 65535). The two canonical protocols of the Internet suite are the User Datagram Protocol (UDP, RFC 768) and the Transmission Control Protocol (TCP, RFC 793).',
        },
        {
          type: 'keypoints',
          title: 'Core Architectural Distinctions',
          items: [
            'UDP: Lightweight, connectionless, minimal overhead best-effort delivery. Does not establish or maintain session state.',
            'TCP: Heavyweight, connection-oriented, reliable byte-stream service with error detection, retransmissions, sliding-window flow control, and congestion control.',
            'State Machine Requirement: Because TCP maintains stateful sessions across time, its lifecycle is strictly governed by a deterministic 11-state Finite State Machine (FSM).',
          ],
        },
      ],
    },
    {
      id: 'udp-header-tcp-lifecycle',
      title: '2. UDP Datagram Format & TCP Connection Lifecycle',
      marks: 5,
      blocks: [
        {
          type: 'paragraph',
          text: 'UDP Header Format: The UDP header is fixed at exactly 8 bytes (64 bits), partitioned into four 16-bit fields.',
        },
        {
          type: 'native',
          component: 'UdpHeader',
        },
        {
          type: 'callout',
          tone: 'warn',
          text: 'Textbook Image Ruler Notice: In the textbook image, the bit ruler contains a typographical duplicate at bit position 23 (reads 22, 23, 23, 24). Our native component above displays the correct, single 0-to-31 bit ruler.',
        },
        {
          type: 'image',
          src: './images/udp-header.png',
          alt: 'UDP Datagram Header Format',
          caption: 'Figure 2.1: UDP 8-byte header format (Source Port, Destination Port, Length, Checksum).',
          note: 'Original textbook diagram (note the bit ruler repeating 23).',
        },
        {
          type: 'bullets',
          items: [
            'Source Port (16 bits): Port number of the sending process (optional in UDP; set to 0 if unused).',
            'Destination Port (16 bits): Port number of the destination application process (mandatory).',
            'Length (16 bits): Length of the entire UDP datagram in bytes (Header + Payload). Minimum value is 8.',
            'Checksum (16 bits): Error-detection field computed over the UDP header, payload, and an IPv4/IPv6 pseudo-header (Source IP, Dest IP, Protocol 17, UDP length). Optional in IPv4, mandatory in IPv6.',
          ],
        },
        {
          type: 'paragraph',
          text: 'TCP Connection Lifecycle: TCP establishes, maintains, and tears down connections through deterministic handshakes.',
        },
        {
          type: 'steps',
          items: [
            '1. Three-Way Handshake (Establishment): (a) Client sends SYN (seq=x). (b) Server responds with SYN+ACK (seq=y, ack=x+1). (c) Client acknowledges with ACK (ack=y+1). Both sides enter ESTABLISHED.',
            '2. Full-Duplex Data Transfer: Bytes flow bidirectionally using sliding-window flow control and selective acknowledgements.',
            '3. Four-Way Handshake (Termination / Half-Close): Since each data channel is independent: (a) Active closer sends FIN. (b) Passive closer returns ACK (enters CLOSE-WAIT; client enters FIN-WAIT-2). (c) Passive closer later sends its own FIN. (d) Active closer returns ACK and enters TIME-WAIT for 2 MSL.',
          ],
        },
      ],
    },
    {
      id: 'diagram',
      title: '3. TCP State Transition Diagram (11-State FSM)',
      marks: 3,
      blocks: [
        {
          type: 'paragraph',
          text: 'The TCP Finite State Machine encompasses 11 states. Blue lines indicate active client transitions, green lines indicate passive server transitions, and dark lines represent common or timeout transitions.',
        },
        {
          type: 'native',
          component: 'TcpStateSvg',
        },
        {
          type: 'callout',
          tone: 'warn',
          text: 'Examiner Correction Note on Textbook Diagram: The textbook diagram erroneously labels the transition from ESTABLISHED to CLOSE-WAIT as "close / send FIN". This is completely wrong; the passive receiver receives a FIN from the peer and sends an ACK ("receive FIN / send ACK"). Furthermore, the rare simultaneous close transition from FIN-WAIT-1 to TIME-WAIT was omitted. Our native SVG above corrects both errors.',
        },
        {
          type: 'image',
          src: './images/tcp-state-diagram.png',
          alt: 'Original TCP State Transition Diagram',
          caption: 'Figure 3.1: Original textbook TCP state transition diagram.',
          note: 'Original illustration (see correction note regarding ESTABLISHED to CLOSE-WAIT label).',
        },
        {
          type: 'interactive',
          component: 'TcpStateExplorer',
        },
      ],
    },
    {
      id: 'state-table',
      title: '4. State Definitions, Transitions & Typical Paths',
      marks: 4,
      blocks: [
        {
          type: 'table',
          caption: 'The 11 TCP States and Their Explicit Operational Meanings',
          headers: ['State', 'Operational Meaning'],
          rows: [
            ['CLOSED', 'Fictional starting and ending state; no connection exists.'],
            ['LISTEN', 'Passive server waits for an incoming connection request (SYN) on a bound port.'],
            ['SYN-SENT', 'Client has transmitted an active SYN segment; waits for matching SYN+ACK from server.'],
            ['SYN-RCVD', 'Server received SYN and returned SYN+ACK; waits for completing ACK from client.'],
            ['ESTABLISHED', 'Connection open; normal bidirectional full-duplex data transfer occurs.'],
            ['FIN-WAIT-1', 'Active closer issued local close and sent FIN; waits for peer ACK or peer FIN.'],
            ['FIN-WAIT-2', 'Peer acknowledged our FIN; waiting for peer to close its half and send its FIN.'],
            ['CLOSE-WAIT', 'Received peer FIN and sent ACK; waiting for local application process to close.'],
            ['CLOSING', 'Simultaneous close: both endpoints sent FIN before receiving ACK; waiting for ACK.'],
            ['LAST-ACK', 'Passive closer sent its own FIN after CLOSE-WAIT; waiting for final terminating ACK.'],
            ['TIME-WAIT', 'Active closer received peer FIN and sent ACK; waits 2 × MSL before entering CLOSED.'],
          ],
        },
        {
          type: 'keypoints',
          title: 'Why Does TIME-WAIT Last 2 × MSL (Maximum Segment Lifetime)?',
          items: [
            '1. Reliable Final ACK Delivery: If the active closer’s final ACK is lost in transit, the peer will time out and retransmit its FIN. Staying in TIME-WAIT allows the active closer to resend the ACK rather than generating an RST error.',
            '2. Flushing Delayed Segments: Prevents duplicate, delayed packets from the old connection from roaming the network and corrupting an identical upcoming incarnation (same IP and port pair). MSL is classically 2 minutes (2 MSL = 4 minutes, though modern OS use 30–60s).',
          ],
        },
        {
          type: 'steps',
          items: [
            'Standard Client Path (Active Open / Active Close): CLOSED → [active open/send SYN] → SYN-SENT → [rcv SYN+ACK/send ACK] → ESTABLISHED → [close/send FIN] → FIN-WAIT-1 → [rcv ACK] → FIN-WAIT-2 → [rcv FIN/send ACK] → TIME-WAIT → [timeout 2 MSL] → CLOSED.',
            'Standard Server Path (Passive Open / Passive Close): CLOSED → [passive open] → LISTEN → [rcv SYN/send SYN+ACK] → SYN-RCVD → [rcv ACK] → ESTABLISHED → [rcv FIN/send ACK] → CLOSE-WAIT → [close/send FIN] → LAST-ACK → [rcv ACK] → CLOSED.',
          ],
        },
        {
          type: 'mnemonic',
          text: 'Mnemonic for Client Close: "Fin-one, Fin-two, Time, Closed."',
        },
      ],
    },
    {
      id: 'comparison',
      title: '5. UDP vs TCP Comprehensive Comparison',
      marks: 2,
      blocks: [
        {
          type: 'table',
          caption: 'UDP vs TCP Technical Comparison Matrix',
          headers: ['Parameter', 'UDP (User Datagram Protocol)', 'TCP (Transmission Control Protocol)'],
          rows: [
            ['Connection Nature', 'Connectionless', 'Connection-oriented (virtual circuit)'],
            ['Reliability', 'Unreliable (best-effort, no ACKs, no retransmits)', 'Reliable (sequence numbers, ACKs, retransmissions)'],
            ['Header Overhead', 'Fixed 8 bytes', 'Variable 20 to 60 bytes (options)'],
            ['Data Transfer Unit', 'Independent Datagrams (preserves boundaries)', 'Continuous Byte Stream (no message boundaries)'],
            ['Flow Control', 'None', 'Sliding Window Protocol'],
            ['Congestion Control', 'None', 'Additive Increase / Multiplicative Decrease (AIMD)'],
            ['Delivery Order', 'Out of order delivery possible', 'Strictly in-order byte delivery'],
            ['Typical Use Cases', 'DNS, VoIP, video streaming, DHCP, SNMP', 'HTTP/HTTPS, SSH, FTP, SMTP'],
          ],
        },
      ],
    },
  ],
};
