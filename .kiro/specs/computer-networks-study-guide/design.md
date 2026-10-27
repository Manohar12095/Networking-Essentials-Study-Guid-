# Design Document: Computer Networks 16-Mark Study Guide

## Overview

The Computer Networks study guide is a static, offline-capable progressive web application built with React, TypeScript, and Tailwind CSS. The app provides exam-focused study materials for a 16-mark computer networking exam, with 7 topics organized across Units 3, 4, and 5. Each topic is structured as a complete 16-mark answer with marks badges, keywords, and revision aids.

**Key characteristics:**
- No backend or login; all content is typed data files
- Works offline after first load via PWA with service worker caching
- Mobile-first responsive design (360px+) with adaptive navigation (bottom bar on mobile, sidebar on desktop ≥1024px)
- Exam-oriented: each topic rendered as a complete answer sheet with 5 sections totaling exactly 16 marks
- Interactive algorithm visualizations (VLSM calculator, Dijkstra stepper, distance vector stepper) with step-by-step replay
- Three image corrections handled via native components (DistanceVectorSvg, TcpStateSvg, UdpHeader) with originals in collapsed panels

## Architecture

The application follows a layered architecture:

- **Presentation Layer:** React components organized by responsibility (layout, content, diagrams, interactive tools, pages)
- **Data Layer:** TypeScript files defining all content (topics, quiz, units) with type safety
- **Logic Layer:** Pure functions for algorithms (VLSM, Dijkstra, Bellman-Ford), storage, and search
- **State Management:** React hooks for UI state; localStorage for persistence with safe try/catch fallback
- **Offline Support:** vite-plugin-pwa with service worker and manifest for PWA installation

**Tech Stack:** Vite + React 18 + TypeScript, Tailwind CSS v3, react-router-dom v6 (HashRouter), lucide-react icons, framer-motion (response animations only), self-hosted fonts via `@fontsource`, vite-plugin-pwa.

## Components and Interfaces

### Folder Structure and File Organization

```
/
├─ README.md                                    # User guide (source of truth for content)
├─ DEPLOY.md                                    # Deployment instructions
├─ DEV.md                                       # Developer notes for maintainers
├─ index.html
├─ package.json
├─ tsconfig.json
├─ tailwind.config.ts                           # Design tokens: colors, typography, breakpoints
├─ vite.config.ts                               # Vite with PWA plugin
│
├─ public/
│  └─ images/
│     ├─ distance-vector.png                    # 5-router network (corrected by DistanceVectorSvg)
│     ├─ dns-resolution.png                     # 8-step DNS resolution
│     ├─ vlsm-network.png                       # Single router with 4 LANs
│     ├─ smtp-architecture.png                  # UA, MTA, MDA, MAA layout
│     ├─ sctp-handshake-multistreaming.png      # 4-way handshake and streams demo
│     ├─ link-state-concept.png                 # Practice example for Dijkstra
│     ├─ tcp-state-diagram.png                  # TCP FSM (corrected by TcpStateSvg)
│     ├─ udp-header.png                         # UDP header format (corrected by UdpHeader component)
│     └─ link-state-question.jpg                # Exam question: nodes A–E, Dijkstra from B
│
└─ src/
   ├─ main.tsx                                  # React entry and PWA registration
   ├─ App.tsx                                   # HashRouter, theme provider, layout shell
   ├─ styles/index.css                          # Tailwind, custom fonts, print styles, animations
   │
   ├─ types/content.ts                          # Type definitions for all data structures
   │
   ├─ data/
   │  ├─ units.ts                               # Unit 3, 4, 5 metadata
   │  ├─ topics/
   │  │  ├─ vlsm.ts                             # VLSM topic (16-mark answer with 5 sections)
   │  │  ├─ distanceVector.ts                   # Distance vector routing
   │  │  ├─ linkState.ts                        # Link state routing (Dijkstra)
   │  │  ├─ udpTcpStates.ts                     # UDP and TCP with state diagram
   │  │  ├─ sctp.ts                             # SCTP association and streams
   │  │  ├─ dns.ts                              # DNS resolution process
   │  │  └─ smtp.ts                             # SMTP mail transfer
   │  └─ quiz.ts                                # 21+ quiz questions (3–4 per topic)
   │
   ├─ lib/
   │  ├─ storage.ts                             # Safe localStorage read/write with fallback
   │  ├─ search.ts                              # Client-side search engine
   │  ├─ vlsm.ts                                # VLSM calculation logic (tested against README examples)
   │  ├─ dijkstra.ts                            # Dijkstra algorithm with step-by-step replay
   │  └─ distanceVector.ts                      # Distance vector convergence (Bellman-Ford)
   │
   ├─ components/
   │  ├─ layout/
   │  │  ├─ Header.tsx                          # Sticky top bar: back, title, bookmark, revision
   │  │  ├─ BottomNav.tsx                       # 5-item bottom navigation (mobile)
   │  │  ├─ Sidebar.tsx                         # Left sidebar with units and progress (desktop)
   │  │  ├─ OnThisPageOutline.tsx                # Right outline anchors (desktop, long pages)
   │  │  ├─ ThemeToggle.tsx                      # Light/dark/system theme selector
   │  │  └─ FontSizeControl.tsx                  # 4-step font size (A−, A, A, A+)
   │  │
   │  ├─ content/
   │  │  ├─ BlockRenderer.tsx                   # Dispatches block types to specialized renderers
   │  │  ├─ MarksGutter.tsx                     # Yellow badge with marks, left of section
   │  │  ├─ KeyPointBox.tsx                     # Yellow-tinted box for key points
   │  │  ├─ FormulaBox.tsx                      # Multi-line formula in monospace
   │  │  ├─ StepList.tsx                        # Numbered sequence (true steps only)
   │  │  ├─ DataTable.tsx                       # Horizontal-scrolling table with fade
   │  │  ├─ ImageFigure.tsx                     # Lazy-loaded image with caption and lightbox
   │  │  ├─ Lightbox.tsx                        # Full-screen image viewer (pinch-zoom, pan, double-tap)
   │  │  ├─ CollapsiblePanel.tsx                # Accordion for collapsed image corrections
   │  │  └─ CorrectionNote.tsx                  # Alert-colored banner for corrections
   │  │
   │  ├─ diagrams/
   │  │  ├─ DistanceVectorSvg.tsx               # 5-node network + Router A's table (replaces PNG)
   │  │  ├─ TcpStateSvg.tsx                     # TCP FSM: 11 states, 18 transitions, colored (replaces PNG)
   │  │  ├─ UdpHeader.tsx                       # 32-column grid with 0–31 ruler (replaces PNG)
   │  │  └─ TopologySvg.tsx                     # Generic graph renderer (link-state exam question)
   │  │
   │  └─ interactive/
   │     ├─ VlsmCalculator.tsx                  # Form, dynamic rows, table output
   │     ├─ DistanceVectorStepper.tsx           # Round buttons, router selector, changed cells highlighted
   │     ├─ DijkstraStepper.tsx                 # Step through Dijkstra on exam graph, tree edges turn red
   │     ├─ TcpStateExplorer.tsx                # State machine with scenario playback and state details
   │     ├─ DnsAnimator.tsx                     # 8-step DNS resolution with packet content
   │     ├─ SmtpSimulator.tsx                   # Chat-style SMTP session replay
   │     └─ SctpHandshake.tsx                   # 4-message sequence, state transitions, multi-stream demo
   │
   └─ pages/
      ├─ Home.tsx                               # Hero, progress ring, Continue button, units grid
      ├─ UnitPage.tsx                           # Unit topics as large cards with marks and progress
      ├─ TopicPage.tsx                          # 16-mark answer sheet with sections and tools
      ├─ RevisionMode.tsx                       # Swipeable topic summaries (one per screen)
      ├─ QuizPage.tsx                           # One question per screen, topic filter, score tracking
      ├─ SavedPage.tsx                          # Bookmarked topics and sections
      ├─ SearchPage.tsx                         # Live search results with highlights
      └─ NotFound.tsx                           # 404 with link home
```

### Component Hierarchy

**Layout Tier (persistent):**
- `App.tsx` → `Header` + `BottomNav`/`Sidebar` (responsive) + `OnThisPageOutline` (desktop) + page content
- `ThemeToggle`, `FontSizeControl` integrated into Header

**Content Tier (renders topic sections):**
- `BlockRenderer` → dispatches to `KeyPointBox`, `FormulaBox`, `StepList`, `DataTable`, `ImageFigure`, etc.
- `MarksGutter` → sidebar badge showing section marks
- `Lightbox` → overlays on tap, closes on Esc

**Diagram Tier (native SVG and HTML):**
- `DistanceVectorSvg`, `TcpStateSvg`, `TopologySvg` render cleanly with text and ARIA labels
- `UdpHeader` pure CSS grid, no JavaScript

**Interactive Tier (algorithm steppers):**
- `VlsmCalculator` → form + button → output table
- `DistanceVectorStepper` → Round buttons + router tabs + changed cells highlighted
- `DijkstraStepper` → step buttons + source selector + Dijkstra table building + tree edges
- `TcpStateExplorer` → SVG + scenario buttons + state details on tap
- `DnsAnimator`, `SmtpSimulator`, `SctpHandshake` → step-by-step replay with captions

**Page Tier (route handlers):**
- `Home`, `UnitPage`, `TopicPage`, `RevisionMode`, `QuizPage`, `SavedPage`, `SearchPage`, `NotFound`

## Data Models

### Type Definitions (`src/types/content.ts`)

```typescript
// Block: union type for all renderable content
export type Block =
  | { type: 'paragraph'; text: string }
  | { type: 'bullets'; items: string[] }
  | { type: 'steps'; items: string[] }  // Numbered, true sequences only
  | { type: 'table'; caption?: string; headers: string[]; rows: string[][] }
  | { type: 'formula'; label?: string; lines: string[] }
  | { type: 'keypoints'; title?: string; items: string[] }
  | { type: 'mnemonic'; text: string }  // Inside keypoints
  | { type: 'mistakes'; items: string[] }  // Alert-toned callout
  | { type: 'code'; title?: string; language?: string; code: string }
  | { type: 'image'; src: string; alt: string; caption: string; note?: string }
  | { type: 'native'; component: 'DistanceVectorSvg' | 'TcpStateSvg' | 'UdpHeader' | 'TopologySvg'; props?: Record<string, unknown> }
  | { type: 'interactive'; component: 'VlsmCalculator' | 'DistanceVectorStepper' | 'DijkstraStepper' | 'TcpStateExplorer' | 'DnsAnimator' | 'SmtpSimulator' | 'SctpHandshake' }
  | { type: 'callout'; tone: 'info' | 'warn' | 'success'; text: string };

// Section: contributes to the 16-mark total
export interface Section {
  id: string;  // Anchor ID: 'intro', 'concept', 'diagram', 'example', 'comparison'
  title: string;  // Human-readable section title
  marks: number;  // Part of the 16-mark total
  blocks: Block[];
}

// Topic: always a 16-mark exam answer
export interface Topic {
  slug: string;  // 'vlsm', 'distance-vector', 'link-state', 'udp-tcp-states', 'sctp', 'dns', 'smtp'
  unit: 3 | 4 | 5;
  order: number;  // 1–7
  title: string;
  shortTitle: string;
  oneLineDefinition: string;  // Revision mode summary
  examKeywords: string[];  // 4–6 keywords that must appear in the answer
  writeInExam: string[];  // 5-part skeleton (one line per part)
  revisionPoints: string[];  // 5–7 key bullet points
  sections: Section[];  // Always marks sum to 16
}

// QuizQuestion: one multiple-choice item
export interface QuizQuestion {
  topic: string;  // Topic slug
  question: string;
  options: string[];  // Exactly 4 options
  answerIndex: number;  // Index of correct option (0–3)
  explanation: string;
}

// Runtime state (stored in localStorage with safe fallback)
export interface Progress {
  revisedTopics: Set<string>;
}

export interface Bookmarks {
  topics: Set<string>;
  sections: Map<string, Set<string>>;  // topic -> set of section IDs
}

export interface QuizScores {
  [topic: string]: { best: number; lastAttempt: number };
}
```

### Storage Keys (`src/lib/storage.ts`)

| Key | Type | Purpose | Fallback |
|---|---|---|---|
| `cn.progress` | JSON string | Set of revised topic slugs | Empty set |
| `cn.bookmarks` | JSON string | Topics and sections bookmarked | Empty |
| `cn.lastRead` | JSON string | Last topic slug + scroll offset | None (page loads at top) |
| `cn.theme` | `'light' \| 'dark' \| 'system'` | Theme preference | `'system'` |
| `cn.fontStep` | 0–3 | Font size control step | 1 (default) |
| `cn.quizScores` | JSON object | Best and last quiz scores per topic | Empty |

All reads wrapped in try/catch; on quota exceed, app continues without storing. On reload, localStorage unavailability is graceful—the user sees all content but progress is not saved.

## Routing and Pages

### Routes (HashRouter)

| Route | Component | Purpose |
|---|---|---|
| `/` | `Home` | Landing: hero packet animation, progress ring, unit cards, Continue button |
| `/unit/:n` | `UnitPage` | List all topics in Unit 3, 4, or 5 with marks, time, progress state |
| `/topic/:slug` | `TopicPage` | Full 16-mark answer sheet for the topic |
| `/revise` | `RevisionMode` | Swipeable one-screen summaries (definition, key points, keywords) |
| `/quiz` | `QuizPage` | Quiz hub: select topic or "All topics"; one question per screen |
| `/quiz/:slug` | `QuizPage` | Quiz filtered to one topic |
| `/saved` | `SavedPage` | Bookmarked topics and sections; empty state message |
| `/search` | `SearchPage` | Client-side search results with highlighting and section context |
| `*` | `NotFound` | 404 with link home |

**HashRouter** enables static hosting and file:// URLs without server rewrites.

### Topic Page Structure (5 Sections = 16 Marks)

Every topic renders with:
1. **Introduction and definition** (2 marks)
2. **Core concept and working** (5 marks)
3. **Diagram** (3 marks)
4. **Worked example or detailed steps** (4 marks)
5. **Advantages, disadvantages, and comparison** (2 marks)

Per-topic adjustments allowed (e.g., UDP/TCP splits differently per Section 9.4), but marks always total 16. The app asserts this in development.

**Page header:**
- Back arrow, topic title, bookmark icon, "Mark as revised" toggle
- Unit badge, 16 marks, reading time estimate, chips for interactive tools

**Collapsible "Write this in the exam" box:**
- 5-part skeleton (one line each) + 4–6 required keywords

**Each section:**
- MarksGutter badge showing marks
- Heading with anchor link
- Content blocks
- (Long pages) collapse toggle

**Page footer:**
- "Previous topic / Next topic" navigation
- "Print or save as PDF" button

## Design System

### Colors (CSS Variables)

**Light mode (default):**
```css
--paper: #F6F8FB;              /* Page background */
--surface: #FFFFFF;            /* Answer sheet, tables */
--ink: #14213D;                /* Body text, headings */
--muted: #5B6B86;              /* Secondary text */
--packet: #1D6FE0;             /* Links, client path, primary actions (blue) */
--signal: #0F9D8A;             /* Server path, success, "revised" (teal) */
--mark: #FFD84D;               /* Marks badges, highlight (yellow) */
--alert: #E4572E;              /* Warnings, corrections (orange-red) */
--rule: #D8E0EC;               /* Borders, dividers (light gray) */
```

**Dark mode (via `@media (prefers-color-scheme: dark)` or `.dark` class):**
```css
--paper: #0E1624;
--surface: #152033;
--ink: #E8EEF8;
--muted: #9AA9C2;
--packet: #5AA0FF;
--signal: #34D1B8;
--mark: #E8B923;
--alert: #FF8A66;
--rule: #27364F;
```

**Contrast:** All text meets WCAG AA (4.5:1 normal, 3:1 large) in both themes.

### Typography

- **Headings (h1–h6):** Bricolage Grotesque (self-hosted via `@fontsource/bricolage-grotesque`), weights 600–800
- **Body:** Source Serif 4 (self-hosted via `@fontsource/source-serif-4`), line-height 1.65, max ~70 chars per line
- **Code/addresses:** JetBrains Mono (self-hosted via `@fontsource/jetbrains-mono`), never for decorative labels
- **Scale:** 14, 16, 18, 22, 28, 36 px
- **Body default:** 17px mobile, 18px desktop
- **Font size control:** 4 steps (×0.85, ×1.0, ×1.15, ×1.3) on `html { font-size }`

### Layout Breakpoints

| Name | Width | Usage |
|---|---|---|
| `sm` | 360px | Mobile base |
| `md` | 640px | Large phone/tablet |
| `lg` | 1024px | Desktop (sidebar + outline appear) |
| `xl` | 1280px | Wide desktop |
| `2xl` | 1536px | Ultra-wide |

**Mobile-first:** Start at 360px; desktop layout at `@media (min-width: 1024px)`.

### Spacing, Radius, Shadows

- **Padding scale:** 8, 12, 16, 24, 32, 48 px
- **Gap scale:** 12, 16, 24, 32 px
- **Border radius:** 4px (tables, badges, chips), 10px (sheets, panels, buttons), 999px (pills)
- **Shadows:**
  - Light mode: no shadow on answer sheet (use `border-top: 1px solid var(--rule)`)
  - Floating: `0 4px 12px rgba(0, 0, 0, 0.1)` light, `0 4px 12px rgba(0, 0, 0, 0.3)` dark

### Motion

- **No entrance animations** (fade-in, slide-in, stagger)
- **Response animations only** (150–200ms `cubic-bezier(0.4, 0, 0.2, 1)`):
  - Accordion open/close
  - Stepper transitions
  - Quiz reveal
- **Respect `prefers-reduced-motion`:** Remove motion for those users

## Error Handling

### Storage Error Handling (`src/lib/storage.ts`)

```typescript
export function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch {
    console.warn(`Failed to read ${key} from storage`);
    return defaultValue;
  }
}

export function setStorage(key: string, value: any): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.code === 22) {
      console.warn('Storage quota exceeded');
    } else {
      console.warn(`Failed to write ${key} to storage`);
    }
    return false;
  }
}
```

**Fallback:** If storage unavailable (quota, incognito, disabled), the app:
- Works normally (no crash)
- Reads default values
- Continues without persisting (user notices progress is lost on reload)
- Logs warnings to console

### Algorithm Validation Errors

**VLSM Calculator:**
- Invalid CIDR notation → show error message
- Host count < 1 → reject
- Total subnets exceed base network → show "Not enough addresses: needs X, block has Y"
- Reset to exam example button

**Dijkstra / Distance Vector:**
- Invalid graph → show error
- Display all steps even if convergence slow
- Tie-breaking: alphabetical (documented)

### Image Loading

- All images have `alt` text for accessibility
- Lazy-loaded with `loading="lazy"`, `decoding="async"`
- Lightbox gracefully handles non-existent images (shows error message)
- Corrected images (SVG components) always display; PNG originals in collapsed panels

## Testing Strategy

### Unit Tests

**VLSM calculator:**
- Default input (192.168.1.0/24, LANs 100, 50, 25, 2) → exact table from README Section 9.1
- Practice example (10.0.0.0/24, LANs 60, 30, 10, 2) → exact answers
- Overlap detection
- Out-of-bounds rejection

**Dijkstra:**
- Exam graph (Section 9.3) from Node B → fixed order [A, C, D, E], final costs B→A=2, C=3, D=5, E=5
- Both directions (undirected graph)
- Disconnected nodes → infinity

**Distance vector:**
- Graph from Section 9.2 → Round 0, Round 1, Round 2 converged with A→E=7 via B, E→A=7 via C
- No negative cycles
- Tie-breaking consistent

**Storage:**
- Read/write all 6 keys successfully
- Quota exceed → graceful fallback
- Missing localStorage → no crash

### Property-Based Tests

- **VLSM:** For any base network and requirements, subnets never overlap and fit inside base
- **Dijkstra:** For any graph, shortest-path tree satisfies triangle inequality
- **Distance vector:** For any network, Bellman-Ford converges in finite steps

### Integration Tests

- **Search:** Results rank title matches first; highlight all occurrences; show section context
- **Offline:** First load caches everything; second load with network off shows all content
- **Print:** Print stylesheet removes nav, forces light, avoids splitting content
- **Accessibility:** Tab through all elements; color contrast 4.5:1; alt text; reduced motion respected
- **Routing:** All 9 routes load and work; back button restores scroll position
- **Bookmarks/progress:** Save, reload, verify persistence
- **Theme toggle:** Light/dark switch, system preference respected, saved to storage

## Correctness Properties

### Property 1: VLSM Calculator Exact Mapping

*For any* VLSM calculation with base network 192.168.1.0/24 and host requirements [100, 50, 25, 2], the calculator SHALL output a subnet table exactly matching Section 9.1: LAN A at 192.168.1.0/25, B at .128/26, C at .192/27, D at .224/30, with all LANs fitting and no overlaps.

**Validates: Requirements 9.1 (VLSM worked example)**

### Property 2: Distance Vector Convergence

*For any* distance vector scenario with the 5-node network in Section 9.2 (Routers A–E with given link costs), running Bellman-Ford updates SHALL converge within 3 rounds to: Router A sees B cost 2 via B, C cost 5 via B, D cost 6 via B, E cost 7 via B.

**Validates: Requirements 9.2 (distance vector final table)**

### Property 3: Dijkstra Fixed-Node Order

*For any* Dijkstra computation on the link-state exam graph (Section 9.3) with source Node B, the algorithm SHALL fix nodes in order [A, C, D, E] and produce final routing table: B→A cost 2 via A, B→C cost 3 via A, B→D cost 5 via A, B→E cost 5 via E.

**Validates: Requirements 9.3 (Dijkstra exam question)**

### Property 4: TCP State Diagram Completeness

*For any* rendering of the TCP state machine, all 18 transitions from Section 9.4 SHALL be present with correct labels, and ESTABLISHED → CLOSE-WAIT SHALL be labeled exactly "receive FIN / send ACK".

**Validates: Requirements 9.4 (TCP transitions)**

### Property 5: UDP Header Bit Ruler Correctness

*For any* rendering of the UDP header component, the bit ruler SHALL display 0, 1, 2, ..., 31 exactly once each with no repetition, each bit aligned to its column.

**Validates: Requirements 4.1 (UDP header correction)**

### Property 6: Topic Marks Total

*For any* topic page rendered, the sum of marks across all sections SHALL equal exactly 16.

**Validates: Requirements 6.2 (topic structure)**

### Property 7: Search Ranking

*For any* search query, results matching in topic title SHALL rank higher than results matching only in section content.

**Validates: Requirements 6.5 (search ranking)**

### Property 8: Persistence Across Reload

*For any* user action (bookmark, mark revised, font size change), after a browser page reload, the same state SHALL be restored from localStorage unless storage is unavailable.

**Validates: Requirements 6.4 (bookmarks and progress)**
