# Implementation Plan: Computer Networks Study Guide Website

## Overview

Implement a static, mobile-first, offline-capable Progressive Web App for Computer Networks exam preparation. The application delivers 7 exam topics (16 marks each, 112 marks total) organized into 3 units with interactive algorithm visualizations, marks gutter design, offline PWA support, and full accessibility compliance. Tech stack: Vite + React 18 + TypeScript + Tailwind CSS v3 + react-router-dom v6 (HashRouter) + framer-motion + lucide-react + @fontsource. All content is typed data files; progress and bookmarks are stored in localStorage with safe fallback.

---

## Phase 1: Project Scaffold with Vite, React, TypeScript, Tailwind, Router, and PWA

### Objective

Set up the complete build infrastructure, routing, theming, fonts, and PWA support so that the app is ready for content and components.

---

- [x] **1. Initialize Vite project with React 18 and TypeScript**
  - Create project scaffold: `npm create vite@latest -- --template react-ts`
  - Install React 18, React DOM, TypeScript, and dev dependencies
  - Update `package.json` with build commands: `npm run dev`, `npm run build`, `npm run preview`
  - _Requirements: 1.0, 2.0_

- [ ] **2. Install and configure Tailwind CSS v3**
  - Install Tailwind CSS v3, PostCSS, autoprefixer
  - Create `tailwind.config.ts` with custom theme tokens:
    - Light colors: --paper #F6F8FB, --surface #FFFFFF, --ink #14213D, --muted #5B6B86, --packet #1D6FE0, --signal #0F9D8A, --mark #FFD84D, --alert #E4572E, --rule #D8E0EC
    - Dark colors: --paper #0E1624, --surface #152033, --ink #E8EEF8, --muted #9AA9C2, --packet #5AA0FF, --signal #34D1B8, --mark #E8B923, --alert #FF8A66, --rule #27364F
    - Typography scale: 14, 16, 18, 22, 28, 36 px
    - Breakpoints: sm 360px, md 640px, lg 1024px, xl 1280px, 2xl 1536px
    - Border radius: 4px, 10px, 999px
  - Configure PostCSS for Tailwind
  - Create `src/styles/index.css` with Tailwind directives and custom styles
  - _Requirements: 5.0 (Design system)_

- [~] **3. Install and self-host fonts via @fontsource**
  - Install `@fontsource/bricolage-grotesque`, `@fontsource/source-serif-4`, `@fontsource/jetbrains-mono`
  - Import fonts in `src/styles/index.css` (Bricolage 600–800, Source Serif 4 normal, JetBrains Mono normal)
  - Add CSS font-face declarations so fonts work offline
  - Verify fonts load in both light and dark modes
  - _Requirements: 2.0 (Offline fonts), 5.0 (Typography)_

- [~] **4. Set up react-router-dom v6 with HashRouter**
  - Install `react-router-dom@6`
  - Create `App.tsx` with `HashRouter` wrapping all routes (to support static hosting and file:// URLs)
  - Define 9 routes: `/`, `/unit/:n`, `/topic/:slug`, `/revise`, `/quiz`, `/quiz/:slug`, `/saved`, `/search`, `*` (NotFound)
  - Create placeholder pages for each route
  - Test that routing works via hash URLs
  - _Requirements: 6.1_

- [~] **5. Create theme provider and theme toggle component**
  - Implement theme context (light, dark, system)
  - Store theme preference to `localStorage` with key `cn.theme`
  - Create `ThemeToggle.tsx` component with three options: Light, Dark, System
  - Apply theme via `<html data-theme="light">` or `document.documentElement.className = 'dark'`
  - Ensure `prefers-color-scheme` media query is respected for System mode
  - CSS variables automatically switch based on theme
  - _Requirements: 10.0_

- [~] **6. Create font size control component**
  - Implement font size context with 4 steps: 0 (×0.85), 1 (×1.0), 2 (×1.15), 3 (×1.3)
  - Store font size preference to `localStorage` with key `cn.fontStep`
  - Create `FontSizeControl.tsx` with A−, A, A, A+ buttons
  - Apply step to `html { font-size }` CSS custom property
  - All content scales proportionally (uses rem-based sizing)
  - _Requirements: 10.0_

- [~] **7. Install framer-motion and lucide-react**
  - Install `framer-motion@latest` and `lucide-react@latest`
  - Verify imports work in React components
  - Document motion constraints: animations only on user tap, no entrance animations, respect `prefers-reduced-motion`
  - _Requirements: 2.0 (Tech stack)_

- [~] **8. Install vite-plugin-pwa and configure Service Worker**
  - Install `vite-plugin-pwa`
  - Configure `vite.config.ts` with PWA plugin:
    - Manifest: name "Computer Networks Study Guide", short name "CN Guide", scope "/", start_url "/"
    - Include app icon (192×192, 512×512 PNG or SVG)
    - Cache strategies: precache all dist assets on build
    - Display mode: standalone or fullscreen
  - Register Service Worker in `src/main.tsx` with offline notification
  - Test: build, preview, install on Android emulator or iOS simulator
  - _Requirements: 2.0_

- [~] **9. Create safe localStorage utility (`src/lib/storage.ts`)**
  - Implement `getStorage(key, defaultValue)` with try/catch, returns default on error
  - Implement `setStorage(key, value)` with try/catch, handles quota exceeded
  - Document all 6 keys: `cn.progress`, `cn.bookmarks`, `cn.lastRead`, `cn.theme`, `cn.fontStep`, `cn.quizScores`
  - Add console warnings for failures; app continues normally
  - Unit test: verify all reads/writes with and without localStorage available
  - _Requirements: 6.4_

- [~] **10. Create basic layout shell (Header, BottomNav, Sidebar)**
  - Create `Header.tsx`: sticky top bar with back arrow, title, bookmark icon, revision checkbox (placeholders)
  - Create `BottomNav.tsx`: 5-item navigation bar (Home, Units, Revise, Quiz, Saved) visible on mobile
  - Create `Sidebar.tsx`: left sidebar with units and progress (desktop only, ≥1024px)
  - Create `OnThisPageOutline.tsx`: right outline for desktop (≥1024px)
  - Update `App.tsx` to render layout shell around pages
  - Test responsive behavior at 360px, 768px, and 1400px widths
  - _Requirements: 6.0_

- [~] **11. Create placeholder pages (all 8)**
  - Create `Home.tsx` with hero section (packet animation TBD, 16-mark headline, progress ring TBD, unit grid TBD, Continue button TBD)
  - Create `UnitPage.tsx` with unit title and empty topic list
  - Create `TopicPage.tsx` with sticky header (title TBD) and empty content area
  - Create `RevisionMode.tsx` with swipeable carousel container (TBD)
  - Create `QuizPage.tsx` with quiz hub selector or question display (TBD)
  - Create `SavedPage.tsx` with empty state message
  - Create `SearchPage.tsx` with search input and results area (TBD)
  - Create `NotFound.tsx` with 404 message and link home
  - All routes must load without errors
  - _Requirements: 6.1_

- [~] **12. Verify build and dev commands work**
  - Run `npm run dev` and verify app loads at http://localhost:5173/#/
  - Run `npm run build` and verify zero errors in dist/
  - Run `npm run preview` and test hash routes work
  - Verify Service Worker registers in preview mode
  - _Requirements: all_

- [~] **Checkpoint: Verify scaffold complete**
  - All build commands succeed (dev, build, preview)
  - Routing works (all 9 routes load)
  - Theme toggle works (light/dark/system)
  - Font size control works (text scales)
  - localStorage utility works (no errors)
  - PWA manifest present, Service Worker registered
  - Ask the user if they have any questions before proceeding to data types and content files.

---

## Phase 2: Data Types and Topic Content Files (7 Topics from README Section 9)

### Objective

Define TypeScript types for all content structures and create 7 topic data files with 16-mark exam answer structure, keyword lists, revision points, and all content blocks from requirements and design.

---

- [~] **13. Create TypeScript content types (`src/types/content.ts`)**
  - Define `Block` union type: paragraph, bullets, steps, table, formula, keypoints, mnemonic, mistakes, code, image, native, interactive, callout
  - Define `Section` interface: id, title, marks (2, 5, 3, 4, or 2), blocks[]
  - Define `Topic` interface: slug, unit (3|4|5), order (1–7), title, shortTitle, oneLineDefinition, examKeywords[], writeInExam[], revisionPoints[], sections[]
  - Define `QuizQuestion`: topic, question, options[], answerIndex, explanation
  - Add assertion helper: `assertTopicMarks(topic)` → throws if marks ≠ 16
  - _Requirements: 1.0 (16-mark structure), 7.0 (data model)_

- [~] **14. Create `src/data/units.ts` with Unit 3, 4, 5 metadata**
  - Define Unit interface with id, number, title, description, topics[]
  - Unit 3 (Routing): VLSM, Distance vector, Link state (3 topics)
  - Unit 4 (Transport): UDP/TCP, SCTP (2 topics)
  - Unit 5 (Application): DNS, SMTP (2 topics)
  - Export units array in correct order
  - _Requirements: 1.0_

- [~] **15. Create VLSM topic file (`src/data/topics/vlsm.ts`)**
  - Slug: `vlsm`, Unit 3, order 1
  - 5 sections: Introduction and definition (2 marks), Core concept and working (5 marks), Diagram (3 marks), Worked example VLSM network (4 marks), Advantages, disadvantages, FLSM comparison (2 marks)
  - Content blocks:
    - Intro: definition, FLSM vs VLSM paragraph, formulas (Usable hosts = 2^h − 2, etc.), Steps box (7 planning steps)
    - Core concept: Bellman-Ford equation, working steps (initialization, exchange, update, repeat)
    - Diagram: native VlsmCalculator component (default 192.168.1.0/24 with LANs A 100, B 50, C 25, D 2)
    - Worked example: VLSM table showing all 4 LANs with exact values from README Section 9.1 (A /25, B /26, C /27, D /30, 228/256 used)
    - Advantages/disadvantages: KeyPointBox with efficiency, scalability, planning effort; comparison table VLSM vs FLSM
  - Exam keywords: CIDR, subnet mask, host bits, 2^h − 2, network ID, broadcast address, classless, route summarisation
  - Write in exam: 5-line skeleton (definition, requirements, sort descending, allocate, verify)
  - Revision points: 5–7 key bullet points (VLSM is variable sizes, block alignment, no waste, formula 2^h − 2, hosts = LAN size, prefix = 32 − h, start at block boundary)
  - Mnemonic: "Biggest first, block by block."
  - Common mistakes: forgetting −2, allocating small first, misaligned blocks
  - _Requirements: 1.0, 9.1_

- [~] **16. Create Distance Vector topic file (`src/data/topics/distanceVector.ts`)**
  - Slug: `distance-vector`, Unit 3, order 2
  - 5 sections: Introduction and definition (2 marks), Core concept (5 marks), Diagram and network (3 marks), Worked example with rounds (4 marks), Count-to-infinity and RIP facts (2 marks)
  - Content blocks:
    - Intro: definition (distance vector = table to every destination + next hop), Bellman-Ford algorithm box, working steps (initialization, exchange, update, repeat until convergence)
    - Core concept: Bellman-Ford equation box, RIP facts (metric = hop count, max 15 hops, updates every 30s, UDP port 520)
    - Diagram: native DistanceVectorSvg component (5 routers A–E, link costs, Router A's final table)
    - Worked example: Round 0 table (initial), Round 1 table (first update), Round 2 table (converged); highlight changed cells; final Router A table (B cost 2 via B, C 5 via B, D 6 via B, E 7 via B)
    - Count-to-infinity: problem description, solutions (hop limit 16, split horizon, poison reverse, hold-down, triggered updates)
  - Exam keywords: Bellman-Ford, distance vector, next hop, convergence, count-to-infinity, split horizon, poison reverse, RIP, hop count
  - Write in exam: 5-line skeleton
  - Revision points: table keeps cost + next hop, periodic exchange with neighbors, add link cost to advertised, keep cheaper route, convergence on stable tables
  - Mnemonic: "Neighbours only, whole table, on a timer."
  - _Requirements: 1.0, 9.2_

- [~] **17. Create Link State topic file (`src/data/topics/linkState.ts`)**
  - Slug: `link-state`, Unit 3, order 3
  - 5 sections: Introduction and definition (2 marks), Core concept and Dijkstra (5 marks), Diagram (3 marks), Worked example – exam question (4 marks), Comparison with distance vector (2 marks)
  - Content blocks:
    - Intro: definition (learns complete topology, LSDB, independent Dijkstra), working 5 stages (Hello, measure cost, build LSP, flood, compute), OSPF/IS-IS protocols
    - Core concept: Dijkstra algorithm 6 steps (initialize, relax source, pick min, update neighbors, repeat, read paths), explanation of S set and predecessors
    - Diagram: native TopologySvg component (nodes A–E from exam question, link costs 2, 1, 7, 2, 5, 3)
    - Worked example: Dijkstra table at Node B from exam (4-row table: step 1 A fixed, step 2 C fixed, step 3 D fixed, step 4 E fixed; final routing table B→A cost 2 via A, B→C 3 via A, B→D 5 via A, B→E 5 via E); tree edges highlighted red
    - Comparison: reliability vs RIP, convergence speed, CPU/bandwidth tradeoff
  - Exam keywords: link state, LSDB, Dijkstra, SPF, routing tree, LSP, flooding, OSPF, IS-IS
  - Write in exam: 5-line skeleton
  - Revision points: learns full topology via LSP flooding, Dijkstra computes SPF, independent routing, fast convergence, OSPF/IS-IS protocols
  - _Requirements: 1.0, 9.3_

- [~] **18. Create UDP/TCP topic file (`src/data/topics/udpTcpStates.ts`)**
  - Slug: `udp-tcp-states`, Unit 4, order 1
  - Sections (custom marks per requirements 9.4):
    - Introduction and definition (2 marks): UDP definition, TCP definition, key differences
    - Core concept and lifecycle (5 marks): UDP header fields (source, dest, length, checksum), TCP 3-way handshake (SYN, SYN-ACK, ACK), TCP lifecycle phases
    - Diagram – TCP state machine (3 marks): native TcpStateSvg component (11 states, 18 transitions, corrected labels)
    - Worked example – state paths and UDP header (4 marks): Client and server state sequences for active and passive close; UDP header grid component (UdpHeader native)
    - Comparison UDP vs TCP (2 marks): reliability, ordering, speed, use cases
  - Content blocks:
    - Intro: UDP (connectionless, unreliable, fast) vs TCP (connection-oriented, reliable, ordered)
    - UDP header: DataTable showing 4 fields (source port 0–15, dest port 16–31, length 32–47, checksum 48–63) PLUS native UdpHeader component
    - TCP lifecycle: Steps for SYN, SYN-ACK, ACK; active close (FIN sequence); passive close (FIN sequence)
    - TCP state machine: native TcpStateSvg with all 18 transitions, ESTABLISHED→CLOSE-WAIT labeled "receive FIN / send ACK" (corrected)
    - Comparison table: reliability, ordering, speed, header size, use cases
  - Exam keywords: TCP, UDP, handshake, SYN, FIN, ACK, RST, state machine, congestion control, flow control, sequence number, acknowledgment
  - Write in exam: 5-line skeleton
  - Revision points: UDP fast, no setup overhead; TCP reliable, ordered, 3-way handshake, state machine, FIN sequence for close
  - _Requirements: 1.0, 9.4, 4.0 (image corrections)_

- [~] **19. Create SCTP topic file (`src/data/topics/sctp.ts`)**
  - Slug: `sctp`, Unit 4, order 2
  - 5 sections: Introduction and definition (2 marks), Core concept and features (5 marks), Diagram (3 marks), Handshake and multi-streaming example (4 marks), Advantages over TCP/UDP (2 marks)
  - Content blocks:
    - Intro: SCTP (Stream Control Transmission Protocol), hybrid of TCP and UDP, message-oriented
    - Core concept: SCTP features (multi-homing, multi-streaming, message boundaries, association instead of connection)
    - Diagram: native SctpHandshake component (4-way handshake: INIT, INIT-ACK with cookie, COOKIE-ECHO, COOKIE-ACK; multi-stream demo with 3 streams, one dropped message)
    - Worked example: handshake sequence with state transitions (Closed → Cookie-Wait → Cookie-Echoed → Established); multi-stream demo showing Stream 2 packet drop while 1 and 3 continue
    - Advantages: multi-homing for redundancy, multi-streaming (no head-of-line blocking), message boundaries preserved, proven for telecom
  - Exam keywords: SCTP, association, multi-streaming, multi-homing, INIT, cookie, stream, head-of-line blocking, telecom
  - Write in exam: 5-line skeleton
  - Revision points: 4-way handshake, multi-streaming (each stream independent), multi-homing (failover), message-oriented, INIT/INIT-ACK/COOKIE-ECHO/COOKIE-ACK
  - _Requirements: 1.0, 9.5_

- [~] **20. Create DNS topic file (`src/data/topics/dns.ts`)**
  - Slug: `dns`, Unit 5, order 1
  - 5 sections: Introduction and definition (2 marks), Core concept and hierarchy (5 marks), Diagram – resolution process (3 marks), 8-step resolution worked example (4 marks), Resource records and caching (2 marks)
  - Content blocks:
    - Intro: DNS (Domain Name System), resolves names to IP addresses, distributed hierarchy, UDP port 53
    - Core concept: hierarchy (root, TLD, authoritative), recursive vs iterative queries, caching, TTL
    - Diagram: native DnsAnimator component (animated 8-step resolution for www.example.com)
    - Worked example: 8-step sequence with packet contents (Client → Resolver query, Resolver → Root query, Root → TLD referral, TLD → Auth referral, Auth → answer, chain back to Client); cache toggle showing cached path
    - Resource records: A (IPv4), AAAA (IPv6), CNAME, MX, NS, SOA records; TTL and caching benefits
  - Exam keywords: DNS, FQDN, query, response, root server, TLD, authoritative, recursive, iterative, A record, TTL, caching
  - Write in exam: 5-line skeleton
  - Revision points: DNS hierarchy (root, TLD, auth), recursive query chain, 8 steps to resolve, caching speeds up, UDP port 53, TTL controls freshness
  - _Requirements: 1.0, 9.6_

- [~] **21. Create SMTP topic file (`src/data/topics/smtp.ts`)**
  - Slug: `smtp`, Unit 5, order 2
  - 5 sections: Introduction and definition (2 marks), Core concept and commands (5 marks), Diagram – architecture (3 marks), Worked example – SMTP session (4 marks), Limitations and improvements (2 marks)
  - Content blocks:
    - Intro: SMTP (Simple Mail Transfer Protocol), push email from UA to MTA, TCP port 25, simple text-based protocol
    - Core concept: SMTP commands (HELO, MAIL FROM, RCPT TO, DATA, QUIT), reply codes (2xx, 3xx, 4xx, 5xx), session flow
    - Diagram: native image or component showing UA → MTA → MTA → UA path (or SmtpSimulator for interactive demo)
    - Worked example: SmtpSimulator component with 10-line session (HELO → 250, MAIL FROM → 250, RCPT TO → 250, DATA → 354, message lines + ., QUIT → 221); toggle shows error case (RCPT TO → 550 unknown user)
    - Limitations: SMTP sends only (retrieval via POP3/IMAP), no encryption (needs STARTTLS), plaintext auth (needs AUTH or TLS)
  - Exam keywords: SMTP, MTA, UA, HELO, MAIL FROM, RCPT TO, DATA, reply code, TCP port 25, session
  - Write in exam: 5-line skeleton
  - Revision points: SMTP pushes mail from UA to MTA, commands (HELO, MAIL FROM, RCPT TO, DATA, QUIT), reply codes (2xx success, 3xx need more, 4xx temp fail, 5xx perm fail), session-based, port 25
  - _Requirements: 1.0, 9.7_

- [~] **22. Verify topic marks total 16 and all content complete**
  - Run `assertTopicMarks()` on all 7 topics; must all pass
  - Verify each topic has: slug, unit, order, title, shortTitle, oneLineDefinition, examKeywords (4–6), writeInExam (5 lines), revisionPoints (5–7), 5 sections with correct marks
  - Spot-check content: VLSM table exact match to README Section 9.1, Distance Vector tables exact match Section 9.2, Dijkstra table exact match Section 9.3
  - All sections render without placeholder text
  - _Requirements: 1.0_

---

## Phase 3: Content Renderer (BlockRenderer and All Block Components)

### Objective

Build the BlockRenderer system to dispatch content blocks to specialized renderers (paragraphs, tables, images, formulas, key points, steppers, callouts, and placeholder renderers for interactive/native components).

---

- [~] **23. Create `BlockRenderer.tsx` component**
  - Accepts `blocks: Block[]`, dispatches each block to its renderer
  - Import or create sub-components: `ParagraphBlock`, `BulletsBlock`, `StepsBlock`, `TableBlock`, `FormulaBlock`, `KeyPointsBox`, `MnemonicBox`, `MistakesBox`, `CodeBlock`, `ImageFigure`, `NativeComponent`, `InteractiveComponent`, `CalloutBox`
  - Each block type must render without errors; missing renderers show error boundary
  - _Requirements: 7.0_

- [~] **24. Create `ParagraphBlock.tsx` for paragraph type**
  - Renders text as `<p>` with --ink color, line-height 1.65, max-width ~70 chars
  - Supports inline Markdown-style formatting (bold, italic, links) if text contains `**` or `_`
  - _Requirements: 7.0_

- [~] **25. Create `BulletsBlock.tsx` for bullets type**
  - Renders items as unordered list `<ul>`
  - Each item as `<li>` with bullet marker
  - --muted color for bullets
  - _Requirements: 7.0_

- [~] **26. Create `StepsBlock.tsx` for steps type**
  - Renders items as ordered list `<ol>`
  - Each step numbered 1, 2, 3, ... (not letters)
  - Used ONLY for true sequences per design; no step markers on regular lists
  - --ink color for step numbers
  - _Requirements: 7.0_

- [~] **27. Create `DataTable.tsx` for table type**
  - Accepts `{ caption?, headers[], rows[][] }`
  - Renders as HTML `<table>` with `<thead>` and `<tbody>`
  - Horizontal scroll container if table wider than viewport
  - Fade effect at right edge (gray gradient) showing more content
  - All cells have --surface background, --ink text, --rule borders (1px top/bottom only)
  - Table-specific: Tailwind classes `border-collapse`, `text-left`, `text-sm`
  - If caption provided, render as `<caption>` above table
  - _Requirements: 7.0_

- [~] **28. Create `FormulaBox.tsx` for formula type**
  - Accepts `{ label?, lines[] }`
  - Render as bordered box with JetBrains Mono font
  - Label (if any) as bold heading above formula
  - Each line on its own line (preserve line breaks)
  - Background --surface, border --rule, text --ink
  - _Requirements: 7.0_

- [~] **29. Create `KeyPointBox.tsx` for keypoints type**
  - Accepts `{ title?, items[] }`
  - Render as box with yellow-tinted left border (--mark color, 4px width)
  - Title (if any) as bold heading
  - Items as bullet list inside
  - Background slightly tinted (mix of --paper and --mark)
  - Include any mnemonic inside or after key points
  - _Requirements: 6.2, 7.0_

- [~] **30. Create `MnemonicBox.tsx` for mnemonic type**
  - Accepts `{ text }`
  - Render as italicized text with quotation marks
  - --muted color, slightly smaller font (0.9em)
  - Often appears inside KeyPointBox
  - _Requirements: 7.0_

- [~] **31. Create `MistakesBox.tsx` for mistakes type**
  - Accepts `{ items[] }`
  - Render as alert-colored box (--alert background, dark overlay, --alert text)
  - Heading "Common mistakes:" bold
  - Items as bullet list
  - Alert icon from lucide-react
  - _Requirements: 7.0_

- [~] **32. Create `CodeBlock.tsx` for code type**
  - Accepts `{ title?, language?, code }`
  - Render as box with dark background (#1e1e1e or --surface dark-adjusted)
  - If language provided, show as label
  - Code in JetBrains Mono font, all-white text
  - Line numbers optional (count code lines)
  - Horizontal scroll if code longer than viewport
  - _Requirements: 7.0_

- [~] **33. Create `MarksGutter.tsx` component**
  - Accepts `marks: number, sectionId: string`
  - On desktop (lg: ≥1024px): vertical strip on left of section showing badge "X marks" in yellow (--mark)
  - On mobile (< lg): slim yellow tab on top-left of section
  - Badge: 4px border-radius, Bricolage Grotesque 600, sized for readability
  - Aligned to section heading
  - _Requirements: 5.0_

- [~] **34. Create `ImageFigure.tsx` component**
  - Accepts `{ src, alt, caption, note? }`
  - Render image with `<figure>` and `<figcaption>`
  - Image attributes: `loading="lazy"`, `decoding="async"`, responsive width (100% of container), max 100vw
  - Caption text below image (--muted, smaller font)
  - If `note` provided (correction note), show as small alert box below caption
  - On tap: open `Lightbox` overlay
  - _Requirements: 4.3, 7.0_

- [~] **35. Create `Lightbox.tsx` component**
  - Overlay on tap of image, full-screen
  - Display image at largest safe size (pinch-zoom on mobile, pan, double-tap zoom on mobile)
  - Desktop: full-screen with close button (X in top-right), keyboard Esc closes
  - Mobile: swipe down or tap X to close
  - Show caption and alt text below image
  - Respect `prefers-reduced-motion` (no animation, instant open/close)
  - _Requirements: 4.3_

- [~] **36. Create `CollapsiblePanel.tsx` component**
  - Accordion-style component for "Original illustration" sections
  - Accepts `{ title, content }`
  - Header clickable to expand/collapse
  - Content hidden by default
  - Smooth open/close animation (framer-motion, 150ms)
  - Chevron icon rotates
  - _Requirements: 4.1, 4.2, 4.3_

- [~] **37. Create `CalloutBox.tsx` for callout type**
  - Accepts `{ tone: 'info' | 'warn' | 'success', text }`
  - Render as left-bordered box
  - Colors: info (--packet), warn (--alert), success (--signal)
  - Icon from lucide-react (Info, AlertCircle, CheckCircle)
  - Text --ink color
  - _Requirements: 7.0_

- [~] **38. Create placeholder for native component renders**
  - BlockRenderer recognizes `type: 'native'` and renders component from `components/diagrams/`
  - Placeholder error boundary: if component not found, show "Component not implemented: X"
  - _Requirements: 7.0_

- [~] **39. Create placeholder for interactive component renders**
  - BlockRenderer recognizes `type: 'interactive'` and renders component from `components/interactive/`
  - Placeholder error boundary: if component not found, show "Interactive tool not implemented: X"
  - _Requirements: 7.0_

- [~] **40. Verify BlockRenderer with topic content**
  - Load a topic page with all block types present
  - Verify all blocks render without errors
  - Check responsive layout on 360px, 768px, 1400px widths
  - Verify table scrolls, images load lazy, marks gutter badges appear
  - _Requirements: 1.0, 6.2, 7.0_

- [~] **Checkpoint: Verify content rendering complete**
  - All 7 topics load and display content without errors
  - Table scrolls, images lazy-load, key points styled correctly
  - Marks gutter badges appear on both mobile and desktop
  - No placeholder text remains in live topics
  - Ask the user if they have any questions before proceeding to pages.

---

## Phase 4: Pages (Home, UnitPage, TopicPage, SavedPage, SearchPage, NotFound)

### Objective

Build all 8 page routes with full functionality: Home hero with progress, unit pages, topic pages with sticky header and sections, revision mode, quiz hub, bookmarks, search, and 404 page.

---

- [~] **41. Create `Home.tsx` page**
  - Sticky header: "Computer Networks Study Guide"
  - Hero section with packet animation (placeholder for Phase 5)
  - Headline: "Computer Networks, 7 questions, 16 marks each"
  - Progress ring: "(X of 7 topics revised)"
  - Per-unit progress bars (Unit 3, Unit 4, Unit 5)
  - "Continue where you left off" button: loads last visited topic or shows nothing if first visit
  - Units grid: Unit 3 (3 topics), Unit 4 (2), Unit 5 (2) as cards with marks and estimated time
  - Quick links: "Revise", "Take a quiz"
  - Mobile-first layout, center hero
  - _Requirements: 6.1, 6.0_

- [~] **42. Create `UnitPage.tsx` page**
  - Accept `:n` param (3, 4, or 5)
  - Display unit title and description
  - List all topics in that unit as large cards with:
    - Topic title
    - 16 marks badge
    - Estimated reading time
    - Progress state: "Not started", "In progress", "Revised" (with color and icon)
  - Tap card to navigate to topic page
  - Back arrow to home
  - _Requirements: 6.1_

- [~] **43. Create `TopicPage.tsx` page (full implementation)**
  - Accept `:slug` param (vlsm, distance-vector, etc.)
  - Sticky header with:
    - Back arrow (to previous unit or topic list)
    - Topic title
    - Bookmark icon (toggle boolean, save to localStorage cn.bookmarks)
    - "Mark as revised" checkbox (save to cn.progress)
  - Under title:
    - Unit badge (Unit 3, etc.)
    - 16 marks badge
    - Estimated reading time
    - Chip buttons for available interactive tools on this topic
  - Collapsible "Write this in the exam" box:
    - Heading "Write this in the exam"
    - 5-line skeleton (one line each) from topic.writeInExam
    - Keywords list (comma-separated)
  - Main content:
    - Loop through topic.sections, render each with:
      - MarksGutter badge (left edge or top-left)
      - Section heading (anchor)
      - (Long pages) collapse toggle
      - BlockRenderer for section.blocks
  - Footer:
    - "Previous topic / Next topic" links (circular: last → first)
    - "Print or save as PDF" button
  - Save scroll position to cn.lastRead on navigate away
  - Restore scroll position on return (if in cn.lastRead)
  - _Requirements: 1.0, 6.2, 6.4_

- [~] **44. Create `RevisionMode.tsx` page (swipeable carousel)**
  - One topic per screen, swipeable carousel or scrollable list
  - For each topic, display:
    - One-sentence definition (topic.oneLineDefinition)
    - 5–7 key bullet points (topic.revisionPoints)
    - Diagram thumbnail (clickable to open lightbox)
    - Exam keywords (comma-separated)
    - "Quick" / "Full" toggle (Quick = just points; Full = link to answer sheet)
  - Next/Previous buttons or swipe gesture
  - Save scroll position per topic
  - On return to same topic, restore position
  - Mobile-first swiping on touch
  - _Requirements: 6.3_

- [~] **45. Create `QuizPage.tsx` page with hub and single question view**
  - Quiz hub: selector for single topic or "All topics", "Start quiz" button
  - Once started: show one question per screen
  - Display: topic name, question text, 4 options
  - On option tap: highlight selected, show correct answer (if wrong), show explanation, disable further selections
  - "Next" button to advance to next question
  - After all questions: score screen ("X of Y correct"), "Quiz complete" message, best score saved to cn.quizScores
  - Shuffle options each attempt but track correct answerIndex
  - At least 21 questions total (3+ per topic)
  - _Requirements: 7.0 (Quiz system)_

- [~] **46. Create `SavedPage.tsx` page**
  - Display list of bookmarked topics (from cn.bookmarks)
  - Each item as link to topic page
  - Empty state if no bookmarks: "No saved topics yet. Tap the bookmark on any topic to keep it here."
  - Icon from lucide-react (Bookmark)
  - _Requirements: 6.4_

- [~] **47. Create `SearchPage.tsx` page with live search**
  - Search input field with placeholder "Search topics, sections, keywords..."
  - Keyboard shortcut `/` on desktop opens search
  - Live results as user types (client-side, from `src/lib/search.ts`)
  - Results show: topic name, section name (if applicable), matching text highlighted, matched context
  - Rank title matches first, then section matches
  - Tap result to navigate to topic and scroll to matching section
  - Empty state: "Start typing to search topics, content, and keywords."
  - Close search with Esc or back arrow
  - _Requirements: 6.5_

- [~] **48. Create `NotFound.tsx` page (404)**
  - Message: "Page not found"
  - "Go home" button with home icon
  - No navbar; simple centered layout
  - _Requirements: 6.1_

- [~] **49. Implement safe localStorage handling in all pages**
  - All progress, bookmarks, theme, font, quiz scores stored via `src/lib/storage.ts`
  - Wrap all reads in try/catch; app continues if storage unavailable
  - localStorage keys: cn.progress, cn.bookmarks, cn.lastRead, cn.theme, cn.fontStep, cn.quizScores
  - _Requirements: 6.4_

- [~] **50. Verify all page routes load and render**
  - Home loads with hero, progress, units, Continue button
  - UnitPage loads Unit 3, 4, 5 with topic cards
  - TopicPage loads all 7 topics with correct content, marks badges, sections
  - RevisionMode loads swipeable topics, key points visible
  - QuizPage quiz hub loads, question view works
  - SavedPage empty state shows if no bookmarks
  - SearchPage responds to `/` key and displays live results
  - NotFound appears on invalid routes
  - All transitions smooth, no errors
  - _Requirements: 6.1_

- [~] **Checkpoint: Verify all pages complete and working**
  - All 9 routes load and display correctly
  - Progress is saved (revise a topic, reload page, progress persists)
  - Bookmarks work (bookmark a topic, navigate to SavedPage, topic appears)
  - Last read scroll position restores
  - Search results rank and highlight correctly
  - Quiz flow works (select topic, answer questions, see score, score saved)
  - Ask the user if they have any questions before proceeding to interactive tools.

---

## Phase 5: Native Diagrams (DistanceVectorSvg, TcpStateSvg, UdpHeader, TopologySvg)

### Objective

Build four corrected native components that replace or supplement incorrect PNG images with accurate inline SVG and HTML implementations.

---

- [~] **51. Create `DistanceVectorSvg.tsx` component (replaces incorrect PNG)**
  - Render 5-node network as SVG: Routers A, B, C, D, E positioned (A 80,170; B 260,60; C 440,170; D 170,310; E 350,310)
  - Draw links as black lines with cost in circle at midpoint: A-B 2, A-D 7, B-C 3, B-D 4, C-E 2, D-E 1
  - Nodes as circles with labels A–E in center
  - Router A's final routing table displayed beside network: B (cost 2, via B), C (5, via B), D (6, via B), E (7, via B)
  - SVG attributes: role="img", `<title>`, `<desc>` with full content description
  - Responsive width (100% of container), max 600px
  - Keep original PNG in CollapsiblePanel with correction note: "The next-hop for D and E in this picture should be B, not D."
  - _Requirements: 4.1, 9.2_

- [~] **52. Create `TcpStateSvg.tsx` component (replaces incorrect PNG)**
  - Render TCP finite state machine with 11 states and all 18 transitions
  - States: CLOSED, LISTEN, SYN-SENT, SYN-RECEIVED, ESTABLISHED, FIN-WAIT-1, FIN-WAIT-2, CLOSE-WAIT, CLOSING, LAST-ACK, TIME-WAIT
  - Transitions (exact from design):
    - Client path: CLOSED → SYN-SENT (send SYN) → ESTABLISHED (recv SYN+ACK / send ACK) → FIN-WAIT-1 (send FIN) → FIN-WAIT-2 (recv ACK) → TIME-WAIT (recv FIN / send ACK) → CLOSED
    - Server path: CLOSED → LISTEN (passive open) → SYN-RECEIVED (recv SYN / send SYN+ACK) → ESTABLISHED → CLOSE-WAIT (recv FIN / send ACK) → LAST-ACK (send FIN) → CLOSED
    - Simultaneous close: ESTABLISHED → CLOSING (send FIN, recv FIN / send ACK) → TIME-WAIT
    - Timeout transitions: FIN-WAIT-1 → CLOSING (recv FIN), various to CLOSED via timeout (not shown as transitions, mentioned as note)
  - Label every transition correctly (event / action)
  - **CRITICAL CORRECTION:** ESTABLISHED → CLOSE-WAIT labeled "receive FIN / send ACK" (not "close / send FIN")
  - **CRITICAL ADDITION:** FIN-WAIT-1 → TIME-WAIT labeled "receive FIN+ACK / send ACK"
  - Colors:
    - Client paths (SYN-SENT, FIN-WAIT-1, FIN-WAIT-2): --packet blue
    - Server paths (LISTEN, SYN-RECEIVED, CLOSE-WAIT, LAST-ACK): --signal teal
    - Common (ESTABLISHED, CLOSING, TIME-WAIT, CLOSED): --ink
  - Legend explaining color coding
  - SVG role="img", title, desc
  - Responsive (100% container, max 800px)
  - Keep original PNG in CollapsiblePanel with correction note: "ESTABLISHED → CLOSE-WAIT should be 'receive FIN / send ACK'; FIN-WAIT-1 → TIME-WAIT transition added."
  - _Requirements: 4.2, 9.4_

- [~] **53. Create `UdpHeader.tsx` component (pure HTML/CSS, replaces incorrect PNG)**
  - Render 32-column grid (32-bit header)
  - Bit ruler at top: 0, 1, 2, ..., 31 each in its own column (exactly once, no repeats)
  - **CRITICAL CORRECTION:** Bit ruler is 0–31 continuous, not "22, 23, 23, 24"
  - Four 16-bit fields:
    - Source Port (bits 0–15)
    - Destination Port (bits 16–31)
    - Length (bits 32–47)
    - Checksum (bits 48–63)
  - Each field label spans its columns
  - Grid columns aligned 1:1 with bit positions
  - HTML/CSS only (no SVG), semantic table or div grid
  - Responsive: columns scale, text labels fit
  - Keep original PNG in CollapsiblePanel with note: "Bit ruler corrected to show 0 to 31 once each."
  - _Requirements: 4.3, 9.4_

- [~] **54. Create `TopologySvg.tsx` component (generic graph renderer)**
  - Accept props: `{ nodes, links, highlightEdges? }`
  - Render directed or undirected graph
  - Nodes as circles with labels
  - Links as lines with cost labels
  - Used for: link-state exam question (nodes A–E, links with costs), Dijkstra practice examples
  - Highlight tree edges in red when algorithm complete
  - SVG role="img", title, desc
  - Responsive (100% container)
  - _Requirements: 9.3_

- [~] **55. Verify all four native diagram components render correctly**
  - DistanceVectorSvg loads, displays correct network and Router A table
  - TcpStateSvg loads, all 18 transitions visible, labels correct, color legend present
  - UdpHeader loads, bit ruler 0–31 exactly, fields aligned correctly
  - TopologySvg renders test graph without errors
  - All SVG components have role="img", title, desc
  - All have alt text and captions
  - _Requirements: 4.0_

---

## Phase 6: Interactive Tools (VlsmCalculator, Steppers, Animators, Simulators)

### Objective

Build 7 interactive algorithm visualizations and simulators: VLSM calculator, distance vector stepper, Dijkstra stepper, TCP state explorer, DNS animator, SMTP simulator, and SCTP handshake.

---

- [~] **56. Implement VLSM calculation logic (`src/lib/vlsm.ts`)**
  - Export `calculateVlsm(baseNetwork: string, lans: { name: string; hosts: number }[])`
  - Parse CIDR notation (e.g., "192.168.1.0/24")
  - Sort LANs by hosts descending
  - For each LAN: calculate required host bits h (2^h − 2 ≥ hosts), prefix 32 − h
  - Allocate subnets sequentially starting at base network, each on block-size boundary
  - Return array of `{ name, hosts, networkId, prefix, mask, firstHost, lastHost, broadcast, usable }`
  - Validation: reject invalid CIDR, return error if total exceeds base network, flag host count < 1
  - Unit test: default input (192.168.1.0/24, A 100, B 50, C 25, D 2) reproduces exact table from README Section 9.1
  - _Requirements: 9.1_

- [~] **57. Create `VlsmCalculator.tsx` component**
  - Input section: base network in CIDR (default 192.168.1.0/24), dynamic list of LANs with name + host count
  - Buttons: "Calculate", "Reset to exam example", "Show practice answer"
  - Output table: one row per LAN with Network ID, Prefix, Mask, First host, Last host, Broadcast, Usable hosts
  - Validation errors displayed prominently in alert boxes
  - "Show practice answer" panel: hidden by default, tappable to reveal answer to 10.0.0.0/24 (60, 30, 10, 2 hosts)
  - Logic from src/lib/vlsm.ts
  - _Requirements: 3.2_

- [~] **58. Implement distance vector algorithm (`src/lib/distanceVector.ts`)**
  - Export `runDistanceVector(graph, maxRounds)`
  - Graph structure: `{ nodes: string[], edges: { from, to, cost }[] }`
  - Compute Bellman-Ford rounds: start with initial distances (direct neighbors), then iteratively update
  - Return array of tables: one for each round up to convergence or maxRounds
  - Each table: { [router]: { [destination]: { cost, nextHop } } }
  - For 5-node network (Section 9.2), reproduce exact tables at Round 0, 1, 2 (final)
  - Track which cells changed in each round for highlighting
  - Unit test: 5-node graph → exact tables from README
  - _Requirements: 9.2_

- [~] **59. Create `DistanceVectorStepper.tsx` component**
  - Display: DistanceVectorSvg network at top, stepper controls below
  - Buttons: "Round 0" (initial), "Next", "Previous", "Reset"
  - Router selector tabs: A, B, C, D, E (current router's table shown)
  - Table displays current round's entries for selected router: destination, cost, next hop
  - Cells that changed in this round: yellow background + bold value
  - Caption under table explains the biggest change in one sentence
  - Data from src/lib/distanceVector.ts
  - _Requirements: 3.3_

- [~] **60. Implement Dijkstra algorithm with step replay (`src/lib/dijkstra.ts`)**
  - Export `runDijkstra(graph, sourceNode)`
  - Graph: `{ nodes: string[], edges: { from, to, cost }[] }`
  - Return steps array: `[{ S, distances, predecessors, fixedNode }]` for each iteration
  - Each step shows which node was fixed, updated distances, and updated predecessors
  - For exam graph (Section 9.3, source Node B), produce exact 4-row Dijkstra table and final routing table
  - Unit test: 5-node graph → exact table from README
  - _Requirements: 9.3_

- [~] **61. Create `DijkstraStepper.tsx` component**
  - Display: TopologySvg network, source node selector, stepper table below
  - Buttons: "Start", "Next", "Previous", "Reset"
  - Table shows Dijkstra steps: current row highlighted yellow (newly fixed node), columns for nodes A–E with distance/predecessor pairs
  - Shortest-path tree edges turn red as they are confirmed in the algorithm
  - Final routing table displayed after last step
  - "Load practice example" option switches to a second network (smaller, for practice)
  - Data from src/lib/dijkstra.ts
  - _Requirements: 3.4_

- [~] **62. Create `TcpStateExplorer.tsx` component**
  - Display: TcpStateSvg state machine at top
  - Buttons/scenarios: "Client scenario", "Server scenario", "Reset"
  - On scenario selection, path through state machine highlights and animates (one transition per tap/Next)
  - Caption shows current event and action (e.g., "SYN-SENT → ESTABLISHED: Receive SYN+ACK / send ACK")
  - Tap any state to show bottom sheet with state definition and outgoing transitions
  - Reset clears highlight and restores initial view
  - Respect prefers-reduced-motion (no entrance animation, instant highlights)
  - _Requirements: 3.5_

- [~] **63. Create `DnsAnimator.tsx` component**
  - Display: arrow diagram showing 8-step DNS resolution for www.example.com
  - Parties: Client, Local Resolver, Root server, TLD server, Authoritative server
  - Buttons: Play (step-by-step), Next, Previous, Reset
  - Each step highlights the relevant arrow and shows query or response text (e.g., "Query: www.example.com? A record")
  - "With cache" toggle: if enabled, skip steps 2–7 and show cached answer path
  - Step captions: "Step 1: Client asks resolver", "Step 2: Resolver asks root", etc.
  - _Requirements: 3.6_

- [~] **64. Create `SmtpSimulator.tsx` component**
  - Display: chat-style SMTP session dialogue
  - Default session: HELO, MAIL FROM, RCPT TO, DATA (message lines), QUIT with responses
  - Buttons: Next (reveal one line at a time), Previous, Reset
  - Client lines (HELO, MAIL FROM, etc.) in blue on the right
  - Server lines (220, 250, 354, etc.) in green on the left
  - Side panel: current command or response code explanation (2xx = success, 3xx = more info needed, 4xx = temp fail, 5xx = perm fail)
  - "Show reply code meanings" toggle: display reference table (2xx, 3xx, 4xx, 5xx codes)
  - "Run with error" option: alternate path where RCPT TO → 550 unknown user
  - _Requirements: 3.7_

- [~] **65. Create `SctpHandshake.tsx` component**
  - Display: 4-way handshake sequence (INIT, INIT-ACK with cookie, COOKIE-ECHO, COOKIE-ACK)
  - Client and server columns showing state transitions for each message
  - Client: CLOSED → COOKIE-WAIT → COOKIE-ECHOED → ESTABLISHED
  - Server: CLOSED → (after INIT) → (after INIT-ACK) → ESTABLISHED
  - Buttons: Play (step-by-step), Next, Previous, Reset
  - Below handshake: multi-stream demo with 3 streams (Stream 0, 1, 2)
  - "Drop packet on Stream 1" button: message dropped on Stream 1 while others continue (shows no head-of-line blocking in SCTP)
  - "Same data over TCP" toggle: show equivalent TCP scenario where dropped packet blocks all streams
  - _Requirements: 3.8_

- [~] **66. Verify all interactive tools render and function**
  - VlsmCalculator: default input produces exact table; practice answer hidden/revealed correctly
  - DistanceVectorStepper: Round 0–2, router selector works, changed cells highlighted, captions show
  - DijkstraStepper: steps show correct table, tree edges turn red, practice example loads
  - TcpStateExplorer: client/server scenarios highlight state path, state details show on tap
  - DnsAnimator: 8 steps animate correctly, cache toggle works, captions show
  - SmtpSimulator: session reveals line by line, error path works, code meanings show
  - SctpHandshake: handshake steps show state transitions, multi-stream demo works, TCP comparison shows
  - _Requirements: 3.0_

- [~] **Checkpoint: Verify all interactive tools complete**
  - All 7 tools display without errors on their respective topic pages
  - Algorithms produce exact results from README (VLSM table, distance vector tables, Dijkstra table)
  - Steppers advance/reverse correctly
  - Animations smooth and respect prefers-reduced-motion
  - Ask the user if they have any questions before proceeding to quiz and revision mode.

---

## Phase 7: Revision Mode and Quiz System (with 21+ Questions)

### Objective

Build swipeable revision summaries and a quiz system with 21+ questions across all 7 topics, immediate feedback, score tracking, and best-score persistence.

---

- [~] **67. Implement client-side search function (`src/lib/search.ts`)**
  - Export `search(query: string, topics: Topic[])`
  - Match case-insensitive against: topic titles, section headings, key points, keywords, content text
  - Support partial word matching
  - Return sorted results: title matches first, then section matches, ranked by relevance
  - Each result includes: topic, section, matched text, context snippet
  - Highlight matched substring in result display
  - _Requirements: 6.5_

- [~] **68. Create quiz questions data (`src/data/quiz.ts`)**
  - Define at least 21 questions: 3+ per topic × 7 topics
  - Each question: { topic, question, options[], answerIndex, explanation }
  - Exactly 4 options per question
  - Correct explanation paragraph per question
  - Example questions per topic drawn from content in Section 9 (README):
    - VLSM: VLSM formula, subnet mask calculation, address wastage comparison
    - Distance Vector: Bellman-Ford, count-to-infinity, RIP updates
    - Link state: Dijkstra, LSP flooding, LSDB
    - UDP/TCP: TCP handshake, state machine, UDP header fields
    - SCTP: multi-streaming, handshake, multi-homing
    - DNS: resolution steps, resource records, TTL
    - SMTP: commands, reply codes, session flow
  - _Requirements: 7.0_

- [~] **69. Create `QuizPage.tsx` with hub and question view (complete)**
  - Hub view: topic selector dropdown (or radio buttons "All topics", "VLSM", "Distance Vector", etc.), "Start quiz" button
  - Question view: one question per screen
    - Topic name and question count ("Question 2 of 10")
    - Question text
    - 4 options as buttons (clickable)
    - On option tap: highlight selected, show correct answer (if wrong), show explanation paragraph, disable further taps
    - "Next" button to advance
  - After final question: score screen ("You got X of Y correct", percentage)
  - Best score saved to localStorage cn.quizScores (keep best attempt)
  - Shuffle options on each attempt but maintain correct answerIndex
  - All questions in one session show mixed topics if "All topics" selected
  - _Requirements: 7.0_

- [~] **70. Create `RevisionMode.tsx` page (complete swipeable implementation)**
  - Swipeable carousel (mobile) or scrollable list (desktop)
  - One topic per screen
  - For each topic, display:
    - One-line definition
    - 5–7 key bullet points
    - Diagram thumbnail (clickable to open in Lightbox)
    - Exam keywords
  - "Quick" / "Full" toggle: Quick shows above; Full adds link to full answer sheet on topic page
  - Save scroll position per topic (in localStorage)
  - Restore position on return
  - Next/Previous buttons or swipe gesture (left = next, right = prev)
  - Smooth transitions (framer-motion, 200ms, no reduced-motion animations)
  - _Requirements: 6.3_

- [~] **71. Create quiz score tracking and display**
  - Store best score per topic in localStorage cn.quizScores: `{ [topic]: { best: number, lastAttempt: number } }`
  - Home page displays best scores in unit progress bars (optional mini badge)
  - QuizPage shows best score when topic quiz is loaded
  - After quiz completes, update cn.quizScores if new score is better
  - _Requirements: 7.0, 6.4_

- [~] **72. Create answer shuffling in quiz**
  - Before displaying question, shuffle options array
  - Track original correct answerIndex before shuffle
  - After shuffle, find new position of correct answer
  - Update component state with shuffled options and correct index
  - User selects from shuffled options; comparison uses correct index
  - _Requirements: 7.0_

- [~] **73. Verify revision mode and quiz function correctly**
  - RevisionMode loads with first topic, key points visible, diagram clickable
  - Swipe/Next button advances to next topic, Previous goes back
  - Quick/Full toggle works
  - Revision scroll position saves and restores
  - QuizPage hub loads with topic selector and "Start" button
  - Starting quiz shows first question, 4 options, answerable
  - Selected option highlights, correct answer shows, explanation visible
  - Next button advances to question 2
  - After final question, score displays correctly
  - Best score saved to localStorage
  - Quiz can be retaken, score shuffles options
  - _Requirements: 6.3, 7.0_

---

## Phase 8: Polish, Accessibility, Offline Test, Performance, and Final Checklist

### Objective

Complete accessibility compliance, reduce motion support, offline verification, performance optimization, image renaming, data validation, and final testing.

---

- [~] **74. Implement print styles and print button**
  - Add `@media print` CSS rules:
    - Hide header, footer, navigation (display: none)
    - Force light theme colors (white background, black text)
    - Avoid orphan headings or split tables across pages
    - Page breaks after main sections if needed
    - High-quality images (no reduced resolution)
  - Add "Print or save as PDF" button on topic pages
  - Test print output by pressing Ctrl+P or Cmd+P on each topic page
  - Verify output is clean, readable, self-contained per topic
  - _Requirements: 11.0_

- [~] **75. Implement full accessibility compliance**
  - Semantic HTML: one `h1` per page, use `<header>`, `<nav>`, `<main>`, `<footer>`
  - SVG diagrams: role="img", `<title>`, `<desc>` elements, alt text on images
  - Color + text: changed cells in steppers also use bold (not just color)
  - Client/server paths: include text labels, not just color coding
  - Keyboard navigation: Tab through all elements, focus rings visible (2px --packet, 2px offset)
  - Touch targets: all buttons and links ≥ 44px tall
  - Reduced motion: all framer-motion animations respect `prefers-reduced-motion: reduce`
  - ARIA labels: icons have aria-label or semantic context
  - Test with screen reader (VoiceOver on Mac, NVDA on Windows, or browser inspection)
  - _Requirements: 12.0_

- [~] **76. Implement prefers-reduced-motion support throughout**
  - Theme toggle: respect system preference, no animation (instant switch)
  - Font size control: no animation on text resize
  - Accordion open/close: no animation (instant show/hide)
  - Stepper transitions: no animation between steps
  - Quiz reveal: no animation (instant)
  - Lightbox open/close: no animation
  - `framer-motion` components: wrap in `motion` only if `!prefersReducedMotion`
  - Test by enabling "Reduce motion" in browser developer tools or OS settings
  - _Requirements: 5.0 (Layout)_

- [~] **77. Rename 9 images exactly as specified in README Section 4**
  - Rename in `public/images/` directory:
    1. `file_000000007fcc8208b62e37d0bd2555af.png` → `distance-vector.png`
    2. `DNS_Resolution_Flow_Infographic.png` → `dns-resolution.png`
    3. `file_0000000088e08208a60e75249b94815d.png` → `vlsm-network.png`
    4. `Email_Architecture_and_SMTP_Flow.png` → `smtp-architecture.png`
    5. `SCTP_Handshake_and_Multi-Streaming_Diagram.png` → `sctp-handshake-multistreaming.png`
    6. `file_0000000095e88208b8621374036ebb9d.png` → `link-state-concept.png`
    7. `TCP_State_Transition_Diagram.png` → `tcp-state-diagram.png`
    8. `UDP_Datagram_Header_Format.png` → `udp-header.png`
    9. `Screenshot_20261019-090949.jpg` → `link-state-question.jpg`
  - Update all references in code (ImageFigure components and data files) to use new names
  - Verify all images still load after renaming
  - _Requirements: 4.0_

- [~] **78. Data validation and algorithm correctness testing**
  - Run unit tests for VLSM calculator: default input produces exact table from README
  - Run unit tests for distance vector: all 3 rounds match README tables exactly
  - Run unit tests for Dijkstra: exam graph produces exact 4-row table and final routing table
  - TCP state machine: verify all 18 transitions present, ESTABLISHED→CLOSE-WAIT label exact
  - UDP header: verify bit ruler 0–31 exactly once each, fields aligned
  - Quiz questions: verify all 21+ questions load, 4 options each, answerIndex valid
  - Topic marks: assert all 7 topics have sections summing to exactly 16 marks
  - All localStorage keys: verify cn.progress, cn.bookmarks, cn.lastRead, cn.theme, cn.fontStep, cn.quizScores exist and work
  - _Requirements: 1.0, 3.0, 7.0_

- [~] **79. Offline functionality test**
  - Run `npm run build && npm run preview`
  - Load preview in browser (http://localhost:4173/#/)
  - Open DevTools, Application tab, Service Worker → check "Offline"
  - Toggle offline mode in DevTools (Disable cache, offline mode)
  - Navigate to different pages: all pages load without errors
  - Verify PWA manifest present in DevTools, shows installable
  - Verify fonts load (check Network tab shows fonts from cache, not network)
  - Verify all images show (check Network shows them cached)
  - Verify interactive tools work (calculator, steppers, animators)
  - _Requirements: 2.0_

- [~] **80. Run Lighthouse audit**
  - Run `npm run build && npm run preview`
  - Open Chrome DevTools, Lighthouse tab
  - Run audit (Performance, Accessibility, Best Practices, PWA)
  - Performance: target ≥ 90
  - Accessibility: target ≥ 95 (check for color contrast, alt text, keyboard navigation, focus rings)
  - Best Practices: target ≥ 95
  - PWA: installable (check manifest, icons, service worker, HTTPS on production)
  - Fix any failing audits
  - Screenshot Lighthouse results
  - _Requirements: 12.0_

- [~] **81. Console error and warning cleanup**
  - Run `npm run build` and check build output for errors/warnings
  - Run `npm run preview`, open DevTools Console, navigate through all pages
  - Verify zero errors and zero warnings in console (except informational messages from React or PWA)
  - Fix any remaining console errors or warnings
  - _Requirements: 12.0_

- [~] **82. Test responsive design across breakpoints**
  - Test at 360px width (mobile): BottomNav visible, Sidebar hidden, no horizontal overflow
  - Test at 640px width (tablet): similar to mobile, layout clean
  - Test at 1024px width (desktop): Sidebar appears, OnThisPage outline appears, BottomNav hides
  - Test at 1400px width (wide desktop): same as desktop, no overflow
  - Test at 200% zoom: no layout breaks, all buttons clickable
  - Test orientation changes (landscape/portrait on mobile emulator)
  - _Requirements: 5.0 (Layout)_

- [~] **83. Test theme switching and persistence**
  - Light mode: verify --paper, --surface, --ink colors correct, contrast ≥ 4.5:1
  - Dark mode: verify dark colors correct, contrast ≥ 4.5:1
  - System mode: follows OS setting, changes on OS setting change
  - Toggle theme: verify instant change, no page reload
  - Reload page: verify theme preference persists from localStorage
  - _Requirements: 10.0_

- [~] **84. Test font size control and persistence**
  - Click A− (step 0): text size smaller, all content scales (including tables, cards, headers)
  - Click A (step 1): default size
  - Click A+ (step 2): larger size
  - Click A+ again (step 3): even larger size, still readable
  - Reload page: verify font size persists
  - All components scale proportionally (rem-based sizing)
  - _Requirements: 10.0_

- [~] **85. Test bookmarks and progress persistence**
  - Bookmark a topic: icon changes, appears in SavedPage
  - Reload page: bookmark persists
  - Mark topic revised: checkbox checked, topic added to progress ring
  - Reload page: progress persists
  - Scroll within topic: scroll position saved
  - Leave topic and return: scroll position restored
  - Quiz: complete a quiz, check best score in localStorage
  - Reload page: best score persists
  - _Requirements: 6.4_

- [~] **86. Test all 9 image rename tasks as required**
  - **Task 1:** Rename `file_000000007fcc8208b62e37d0bd2555af.png` to `distance-vector.png`
  - **Task 2:** Rename `DNS_Resolution_Flow_Infographic.png` to `dns-resolution.png`
  - **Task 3:** Rename `file_0000000088e08208a60e75249b94815d.png` to `vlsm-network.png`
  - **Task 4:** Rename `Email_Architecture_and_SMTP_Flow.png` to `smtp-architecture.png`
  - **Task 5:** Rename `SCTP_Handshake_and_Multi-Streaming_Diagram.png` to `sctp-handshake-multistreaming.png`
  - **Task 6:** Rename `file_0000000095e88208b8621374036ebb9d.png` to `link-state-concept.png`
  - **Task 7:** Rename `TCP_State_Transition_Diagram.png` to `tcp-state-diagram.png`
  - **Task 8:** Rename `UDP_Datagram_Header_Format.png` to `udp-header.png`
  - **Task 9:** Rename `Screenshot_20261019-090949.jpg` to `link-state-question.jpg`
  - Verify all images load correctly after renaming
  - _Requirements: 4.0_

- [~] **87. Test image corrections (critical)**
  - **Distance Vector PNG:** original PNG in collapsed "Original illustration" panel, warning note visible, DistanceVectorSvg shows correct network and Router A table
  - **TCP State PNG:** original PNG in collapsed panel, correction note visible, TcpStateSvg shows correct transitions (ESTABLISHED→CLOSE-WAIT = "receive FIN / send ACK", FIN-WAIT-1→TIME-WAIT present)
  - **UDP Header PNG:** original PNG in collapsed panel, note visible, UdpHeader component shows 0–31 ruler correctly
  - All three components render inline with correct content
  - Original PNGs only visible when panel expanded
  - _Requirements: 4.0_

- [~] **88. Final verification checklist**
  - ✅ `npm install` succeeds
  - ✅ `npm run dev` runs without errors
  - ✅ `npm run build` succeeds with zero errors/warnings
  - ✅ `npm run preview` runs and app is accessible
  - ✅ All 9 routes load: /, /unit/:n, /topic/:slug, /revise, /quiz, /quiz/:slug, /saved, /search, *
  - ✅ All 7 topics loaded with correct 16-mark structure, 5 sections each
  - ✅ All 4 native components render (DistanceVectorSvg, TcpStateSvg, UdpHeader, TopologySvg)
  - ✅ All 7 interactive tools work (VlsmCalculator, DistanceVectorStepper, DijkstraStepper, TcpStateExplorer, DnsAnimator, SmtpSimulator, SctpHandshake)
  - ✅ 21+ quiz questions functional with immediate feedback
  - ✅ Revision mode swipeable and smooth
  - ✅ Search function live and ranking correct
  - ✅ Progress, bookmarks, theme, font size all persist to localStorage
  - ✅ Offline mode works: Service Worker caches everything, app fully functional without network
  - ✅ Lighthouse: Performance ≥90, Accessibility ≥95, Best Practices ≥95, PWA installable
  - ✅ Zero console errors/warnings
  - ✅ Accessibility: semantic HTML, alt text, keyboard focus, touch targets ≥44px, reduced motion respected
  - ✅ Print styles: clean PDF output, light theme, no navigation
  - ✅ Responsive: 360px, 640px, 1024px, 1400px widths all work correctly
  - ✅ Theme toggle: light/dark/system, persistent
  - ✅ Font size control: 4 steps, scales all content, persistent
  - ✅ All 9 images renamed correctly
  - ✅ 9 image rename tasks documented in commit
  - ✅ All acceptance criteria from requirements.md met
  - _Requirements: all_

- [~] **Checkpoint: Final Verification Complete**
  - All tests pass
  - All accessibility standards met
  - All algorithms produce exact results
  - All data validated
  - Offline fully functional
  - Lighthouse scores meet targets
  - Console clean
  - App ready for deployment
  - Ask the user if they have any questions before final submission.

---

## Notes

- **Tech Stack:** Vite + React 18 + TypeScript + Tailwind CSS v3 + react-router-dom v6 (HashRouter) + framer-motion + lucide-react + @fontsource + vite-plugin-pwa
- **Marks Structure:** All topics structured as 5 sections totaling exactly 16 marks (2 + 5 + 3 + 4 + 2, with per-topic adjustments allowed)
- **Algorithm Correctness:** VLSM calculator, distance vector, and Dijkstra implementations must produce exact tables from README Section 9. Unit tests verify this.
- **Image Corrections:** Three images corrected with native components (DistanceVectorSvg, TcpStateSvg, UdpHeader); originals kept in collapsed panels with correction notes
- **Interactive Tools:** All 7 tools must be functional with step-by-step replay and immediate visual feedback
- **Offline:** Complete offline functionality after first load via Service Worker caching
- **Accessibility:** WCAG AA contrast, semantic HTML, keyboard navigation, touch targets, reduced-motion support
- **localStorage:** 6 keys used safely with try/catch fallback; app continues normally if storage unavailable
- **No Decorative Animations:** Only response animations on user tap (accordion, stepper, quiz reveal); no entrance animations; respect prefers-reduced-motion

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1", "13"] },
    { "id": 1, "tasks": ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "14"] },
    { "id": 2, "tasks": ["15", "16", "17", "18", "19", "20", "21"] },
    { "id": 3, "tasks": ["22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39"] },
    { "id": 4, "tasks": ["40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50"] },
    { "id": 5, "tasks": ["51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65"] },
    { "id": 6, "tasks": ["67", "68", "69", "70", "71", "72", "73"] },
    { "id": 7, "tasks": ["74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84", "85", "86", "87", "88"] }
  ]
}
```
