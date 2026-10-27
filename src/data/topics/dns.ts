import { Topic } from '../../types/content';

export const dnsTopic: Topic = {
  slug: 'dns',
  unit: 5,
  order: 1,
  title: 'Domain Name System (DNS)',
  shortTitle: 'DNS',
  oneLineDefinition:
    'DNS is a distributed, hierarchical database and application-layer protocol that translates human-friendly domain names (www.example.com) into numerical IP addresses (93.184.216.34).',
  examKeywords: [
    'domain name space',
    'root',
    'TLD',
    'authoritative server',
    'resolver',
    'recursive',
    'iterative',
    'resource record',
    'A',
    'MX',
    'NS',
    'CNAME',
    'TTL',
    'caching',
    'port 53',
  ],
  writeInExam: [
    '1. Define DNS: distributed hierarchical database translating FQDNs to IP addresses operating on port 53 (UDP/TCP).',
    '2. Explain the Domain Name Space tree: Root (.), TLDs (gTLD, ccTLD), Second-Level Domains, Subdomains, and Zones.',
    '3. Draw the 8-step resolution diagram resolving www.example.com alongside the inverted hierarchy tree.',
    '4. Walk through all 8 resolution steps, contrast recursive vs iterative queries, and explain caching with TTL.',
    '5. Detail Resource Record (RR) types (A, AAAA, CNAME, MX, NS, PTR, SOA, TXT), DNS message structure, and DNSSEC.',
  ],
  revisionPoints: [
    'Distributed hierarchical database resolving human hostnames into routable IP addresses.',
    'Runs over UDP port 53 for standard queries (<512 bytes) and TCP port 53 for zone transfers or oversized responses.',
    'Hierarchy: Root (.) → Top-Level Domains (.com, .org, .edu, .in) → Second-Level (example.com) → Host (www).',
    'Server Roles: Local Resolver (recursive), Root Server (referral to TLD), TLD Server (referral to Auth), Authoritative Server (final record).',
    '8-Step Resolution: Client → Resolver → Root → Resolver → TLD → Resolver → Authoritative → Resolver → Client.',
    'Recursive Query: Client delegates complete lookup to Local Resolver. Iterative Query: Resolver queries each hierarchy tier independently.',
    'Mnemonic: "Resolver asks Root, TLD, Authoritative: R-T-A."',
  ],
  sections: [
    {
      id: 'definition',
      title: '1. Introduction and Architectural Need',
      marks: 2,
      blocks: [
        {
          type: 'paragraph',
          text: 'The Domain Name System (DNS, RFC 1034 / 1035) is an application-layer service and distributed database that provides mapping between human-memorable hostnames (such as www.example.com) and machine-routable IP addresses (such as 93.184.216.34). It functions as the decentralized "phone book" of the global Internet.',
        },
        {
          type: 'keypoints',
          title: 'Why a Centralized Database is Impossible',
          items: [
            'Single Point of Failure: If a central server fails, the entire Internet collapses.',
            'Traffic Volume: Billions of daily queries would saturate any single server or datacenter.',
            'Geographic Latency: Distant clients would endure unacceptable round-trip delays.',
            'Maintenance Impossibility: No single entity could handle millions of daily domain updates.',
          ],
        },
        {
          type: 'mnemonic',
          text: 'Mnemonic: "Resolver asks Root, TLD, Authoritative: R-T-A."',
        },
      ],
    },
    {
      id: 'hierarchy-servers',
      title: '2. Domain Name Space, Zones & Name Server Roles',
      marks: 5,
      blocks: [
        {
          type: 'paragraph',
          text: 'The domain namespace is structured as an inverted hierarchical tree starting from the Root label at the apex.',
        },
        {
          type: 'bullets',
          items: [
            'Root Domain (.): Apex of the hierarchy; denoted by a trailing dot in a Fully Qualified Domain Name (FQDN) like "www.example.com.". Managed globally by ICANN, operated as 13 logical root server IP addresses (A to M) using anycast routing across hundreds of physical locations worldwide.',
            'Top-Level Domains (TLDs): Subdivided into generic TLDs (gTLDs: .com, .org, .net, .edu, .gov) and country-code TLDs (ccTLDs: .in, .uk, .jp, .ca). Managed by designated registry operators.',
            'Second-Level Domains: Registered by organizations or individuals (e.g. example.com, google.com).',
            'Subdomains and Hosts: Created by domain owners to segment resources (e.g. www.example.com, mail.example.com).',
            'Zones: An administrative subdivision of the domain tree managed by a single authoritative entity. A domain may be partitioned into multiple separate zones (e.g., example.com and dev.example.com).',
          ],
        },
        {
          type: 'table',
          caption: 'The Four Classes of Name Servers',
          headers: ['Server Class', 'Operational Role in Resolution'],
          rows: [
            ['Local Resolver (Recursive)', 'Operated by ISP or public DNS (8.8.8.8, 1.1.1.1). Receives the recursive client query, performs iterative queries, caches responses, and delivers final answer.'],
            ['Root Name Server', 'Maintains pointers to all TLD servers. Does not know domain IPs; returns referrals to corresponding TLD servers.'],
            ['TLD Name Server', 'Maintains pointers to authoritative servers for domains registered under that TLD (e.g., all .com domains). Returns referrals.'],
            ['Authoritative Server', 'Holds the master resource records for the domain. Provides the definitive final answer (IP address) to queries.'],
          ],
        },
      ],
    },
    {
      id: 'diagram',
      title: '3. DNS Resolution Flow & Hierarchy Diagram',
      marks: 3,
      blocks: [
        {
          type: 'paragraph',
          text: 'The complete resolution flow tracks an 8-step message sequence for resolving www.example.com, progressing down the Root, TLD, and Authoritative hierarchy.',
        },
        {
          type: 'image',
          src: './images/dns-resolution.png',
          alt: 'DNS Resolution Diagram showing 8-step resolution and DNS hierarchy',
          caption:
            'Figure 3.1: Complete 8-step DNS resolution sequence of www.example.com alongside the inverted DNS hierarchy tree.',
        },
      ],
    },
    {
      id: 'steps',
      title: '4. The 8 Resolution Steps, Query Modes & Caching',
      marks: 4,
      blocks: [
        {
          type: 'steps',
          items: [
            '1. User’s Computer → Local Resolver: The client application issues a query for www.example.com.',
            '2. Local Resolver → Root Server: Resolver queries Root server for www.example.com.',
            '3. Root Server → Local Resolver: Root replies with referral to the .com TLD name servers.',
            '4. Local Resolver → TLD Server: Resolver queries the .com TLD server for www.example.com.',
            '5. TLD Server → Local Resolver: TLD server replies with referral to authoritative servers for example.com.',
            '6. Local Resolver → Authoritative Server: Resolver queries example.com’s authoritative name server.',
            '7. Authoritative Server → Local Resolver: Authoritative server replies with Type A record: 93.184.216.34.',
            '8. Local Resolver → User’s Computer: Resolver returns IP 93.184.216.34 to client application and caches it.',
          ],
        },
        {
          type: 'keypoints',
          title: 'Recursive vs Iterative Queries (Must Differentiate in Exam)',
          items: [
            'Recursive Query: The client requests the contacted server (Local Resolver) to return either the definitive answer or an explicit error. The client performs no further legwork (Steps 1 & 8).',
            'Iterative Query: The querying server asks for the best known answer. If the target IP is unknown, the responder returns a referral to the next delegated name server down the chain. The inquirer contacts each successive server itself (Steps 2 through 7).',
          ],
        },
        {
          type: 'paragraph',
          text: 'Caching and Time-to-Live (TTL): Local resolvers cache resource records for the duration specified by the author in the TTL field (e.g. 3600 seconds). Cached queries bypass Steps 2 through 7 entirely, resulting in sub-millisecond lookups. Responses served from cache are explicitly tagged as non-authoritative.',
        },
        {
          type: 'interactive',
          component: 'DnsAnimator',
        },
      ],
    },
    {
      id: 'records-security',
      title: '5. Resource Records, Message Format & Security',
      marks: 2,
      blocks: [
        {
          type: 'table',
          caption: 'Fundamental DNS Resource Records (RR)',
          headers: ['Type', 'Full Form', 'Function', 'Exam Example'],
          rows: [
            ['A', 'Address', 'Maps hostname to 32-bit IPv4 address', 'example.com. IN A 93.184.216.34'],
            ['AAAA', 'IPv6 Address', 'Maps hostname to 128-bit IPv6 address', 'example.com. IN AAAA 2606:2800:220:1:...'],
            ['CNAME', 'Canonical Name', 'Creates an alias pointing to real domain name', 'www.example.com. IN CNAME example.com.'],
            ['MX', 'Mail Exchanger', 'Specifies mail servers for domain with priority', 'example.com. IN MX 10 mail.example.com.'],
            ['NS', 'Name Server', 'Specifies authoritative name servers for zone', 'example.com. IN NS ns1.example.com.'],
            ['PTR', 'Pointer', 'Reverse DNS lookup (IP to hostname)', '34.216.184.93.in-addr.arpa. IN PTR example.com.'],
            ['SOA', 'Start of Authority', 'Zone admin email, serial number, refresh timers', 'Primary NS, hostmaster@example.com'],
            ['TXT', 'Text Record', 'Arbitrary text for SPF, DKIM, and site verification', '"v=spf1 include:_spf.google.com ~all"'],
          ],
        },
        {
          type: 'keypoints',
          title: 'DNS Message Format and Modern Security Enhancements',
          items: [
            'Message Header (12 Bytes): Identification (16 bits), Flags (16 bits: QR, Opcode, AA, TC, RD, RA, RCODE), Questions count, Answer RRs count, Authority RRs count, Additional RRs count.',
            'Transport: Operates over UDP port 53 for standard queries (<512 bytes) and TCP port 53 for zone transfers or truncated responses (TC bit set).',
            'DNS Security: Plain DNS is vulnerable to DNS Spoofing and Cache Poisoning. Defenses include DNSSEC (cryptographic digital signatures on RRs), DNS over TLS (DoT - port 853), and DNS over HTTPS (DoH - port 443).',
          ],
        },
      ],
    },
  ],
};
