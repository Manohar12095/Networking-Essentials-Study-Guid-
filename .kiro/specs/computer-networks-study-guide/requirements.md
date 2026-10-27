# Requirements Document

## Feature: Computer Networks Exam Study Guide Website

## Introduction

Build a static, mobile-first, offline-capable web application for Computer Networks exam preparation. The website delivers 7 exam topics (16 marks each = 112 marks total), organized into 3 units, with interactive tools, progress tracking, offline functionality, and a marks gutter design system. The application targets students revising on mobile phones, often with poor internet connectivity, requiring complete offline functionality after first load. No backend, login, or database; all content lives in typed data files and progress is stored locally in `localStorage`.

---

## Glossary

- **Application**: The Computer Networks study guide website built with Vite, React, TypeScript, and Tailwind CSS.
- **Topic**: One exam question (16 marks) covering a specific Computer Networks concept (e.g., VLSM, TCP state diagram).
- **Unit**: A collection of related topics (Unit 3: routing, Unit 4: transport, Unit 5: application layer).
- **Section**: A subsection of a topic page that covers one part of the 16-mark structure (e.g., "Core concept", "Worked example").
- **Marks Gutter**: A visual indicator on the left edge of a topic page showing how many marks each section is worth.
- **PWA**: Progressive Web App; the Application must be installable on phones and work offline after first visit.
- **Service Worker**: Background process enabling offline functionality and caching.
- **BlockRenderer**: Component responsible for rendering different content block types (paragraphs, tables, diagrams, code, etc.).
- **Native Component**: An inline SVG or HTML component built without external libraries (e.g., `DistanceVectorSvg`, `UdpHeader`).
- **Interactive Tool**: A user-facing component that animates, calculates, or steps through a concept (e.g., `VlsmCalculator`, `DijkstraStepper`).
- **localStorage**: Browser-local key-value storage for saving user progress, bookmarks, theme preference, and font size.
- **Image Correction**: An image rendering issue requiring replacement with a corrected native component or HTML alternative.
- **Revision Mode**: A swipeable view showing quick summaries of all topics.
- **Quiz**: A testing feature with multiple choice questions, immediate feedback, and saved best scores per topic.
- **Theme**: Light or dark color mode, following system preference by default.
- **Font Size Control**: A user-facing feature to adjust body text size across 4 predefined steps (stored in localStorage).
- **Search**: Client-side full-text search across topic titles, headings, key points, and keywords.
- **Bookmarks**: User-saved collection of topics and sections for later review.
- **Resume**: Stored scroll position per topic, allowing users to continue from where they left off.

---

## Requirements

### Requirement 1: Seven Topics with 16-Mark Structure

**User Story:** As a student revising for the Computer Networks exam, I want each topic structured as a complete 16-mark answer so that I can revise the exact structure needed for full exam marks.

#### Acceptance Criteria

1. THE Application SHALL provide exactly 7 exam topics organized into Unit 3 (3 topics), Unit 4 (2 topics), and Unit 5 (2 topics).

2. THE Application SHALL display these topics: VLSM (variable length subnet masking), Distance vector routing, Link state routing, UDP and TCP with state transition diagram, SCTP (Stream Control Transmission Protocol), DNS (Domain Name System), and SMTP (Simple Mail Transfer Protocol).

3. EACH Topic SHALL be structured with exactly 5 sections: Introduction and definition (2 marks), Core concept and working (5 marks), Diagram (3 marks), Worked example or detailed steps (4 marks), Advantages, disadvantages and comparison (2 marks).

4. EACH Section SHALL display a MarksGutter badge on the left edge showing its mark value (on mobile, a slim yellow tab on the section's top-left).

5. THE Application SHALL assert in development that all marks across 5 sections total exactly 16 per topic.

6. EACH Topic page SHALL include a sticky top bar containing: back arrow, topic title, bookmark button, and "Mark as revised" checkbox.

7. EACH Topic page SHALL display: unit number, total 16 marks, estimated reading time, and chip buttons for interactive tools available on that topic.

8. EACH Topic page SHALL include a collapsible "Write this in the exam" box containing: the 5-part skeleton (one line each) and the 4 to 5 keywords required for the exam answer.

---

### Requirement 2: Offline PWA with Service Worker

**User Story:** As a student with intermittent internet on exam eve, I want the website to work completely offline after first visit so that I can revise anywhere without connectivity concerns.

#### Acceptance Criteria

1. THE Application SHALL be built as a Progressive Web App using `vite-plugin-pwa`.

2. THE Application SHALL implement a Service Worker that caches all HTML, CSS, JavaScript, fonts, and images after the first page load.

3. WHEN the browser is offline, THE Application SHALL serve all cached content without attempting network requests.

4. AFTER the Service Worker activates, THE Application SHALL display a small "Available offline" notification once.

5. WHEN a user visits the Application again, all previously cached content SHALL load instantly without network requests.

6. THE Application SHALL be installable on mobile devices (iOS and Android) with an "Add to home screen" prompt or similar.

7. THE Application SHALL function as a standalone app when installed, without showing browser UI elements.

8. WHEN accessed from the home screen shortcut, THE Application SHALL launch in fullscreen mode with the same functionality as the web version.

---

### Requirement 3: Interactive Tools (Six Required)

**User Story:** As a student learning complex networking concepts, I want interactive tools that animate the concepts step-by-step so that I can understand and remember the processes.

#### Acceptance Criteria

1. THE Application SHALL provide 6 interactive tools accessible from their respective topic pages: VlsmCalculator, DistanceVectorStepper, DijkstraStepper, TcpStateExplorer, DnsAnimator, and SmtpSimulator, plus SctpHandshake.

2. **VLSM Calculator:**
   - WHEN the user enters a base network in CIDR notation (e.g., 192.168.1.0/24) and a list of LAN names with host counts, THE VlsmCalculator SHALL calculate and display a table showing Network ID, Subnet Mask, First host, Last host, Broadcast address, and Usable hosts for each LAN.
   - THE Calculator SHALL validate inputs: reject invalid CIDR, show error if total hosts exceed the base network capacity, and flag host counts under 1.
   - THE Calculator SHALL sort LANs by host count descending and allocate subnets sequentially following the Bellman-Ford formula.
   - FOR the default input (192.168.1.0/24 with LANs A 100, B 50, C 25, D 2), THE Application SHALL reproduce the exact table from source documentation (A /25 128 hosts, B /26 62 hosts, C /27 30 hosts, D /30 2 hosts).
   - THE Calculator SHALL include a "Reset to exam example" button restoring defaults and a "Show practice answer" panel with the answer to 10.0.0.0/24 (60, 30, 10, 2 hosts) revealed on tap.

3. **Distance Vector Stepper:**
   - WHEN the user selects a router (A through E) and taps Next/Previous, THE DistanceVectorStepper SHALL display the routing table for that router at each round (Round 0, 1, 2, final).
   - EACH row SHALL show the destination, cost, and next hop for that round.
   - CELLS that changed in the current round SHALL be highlighted in yellow with bold values.
   - THE Application SHALL reproduce the exact tables from source documentation for Round 0, Round 1, and Round 2.
   - AFTER Round 2 converges, THE Stepper SHALL display "No changes in Round 3; convergence reached."
   - A caption SHALL explain the most significant change in each round in one sentence.

4. **Dijkstra Stepper:**
   - WHEN the user selects a source node and taps Next/Previous, THE DijkstraStepper SHALL display Dijkstra's algorithm step-by-step with a table showing distance, predecessor, and which nodes are fixed (in set S).
   - THE highlighted row SHALL show the node being fixed in the current step.
   - DISTANCE updates on the nodes themselves (not just the table) as the algorithm progresses.
   - THE shortest-path tree edges SHALL turn red when confirmed by the algorithm.
   - FOR the exam graph with source Node B, THE Application SHALL produce the exact 4-row table and final routing table (A 2 via A, C 3 via A, D 5 via A, E 5 via E) from source documentation.
   - A "Load practice example" option SHALL switch to a second network for additional practice.

5. **TCP State Explorer:**
   - WHEN the user selects "Client scenario" or "Server scenario", THE TcpStateExplorer SHALL highlight and animate the typical state path one transition at a time.
   - EACH transition SHALL display the event and action as a caption (e.g., "SYN-SENT → ESTABLISHED: Receive SYN+ACK / send ACK").
   - WHEN the user taps any state, THE Explorer SHALL show a bottom sheet with the state's meaning and its outgoing transitions.
   - A "Reset" button SHALL clear the highlight and restore the initial view.

6. **DNS Animator:**
   - WHEN the user taps Play, THE DnsAnimator SHALL animate all 8 steps of DNS resolution for www.example.com (resolver → root → TLD → authoritative → resolver → client).
   - EACH step SHALL highlight the relevant arrow between parties (Client, Local Resolver, Root server, TLD server, Authoritative server) and display the query or response.
   - A "With cache" toggle SHALL skip steps 2 to 7 if the resolver already has the answer cached.
   - Next and Previous buttons SHALL step through the process.

7. **SMTP Simulator:**
   - WHEN the user taps Next, THE SmtpSimulator SHALL reveal one line of the sample SMTP session at a time.
   - CLIENT lines (HELO, MAIL FROM, etc.) SHALL appear in blue on the right; SERVER lines (220, 250, 354, etc.) in green on the left.
   - A side panel SHALL explain the current command or reply code.
   - A "Show reply code meanings" toggle SHALL display a reference table of 2xx, 3xx, 4xx, 5xx code meanings.
   - A "Run with error" option SHALL show an alternate path where RCPT TO receives an unknown address and the server replies 550.

8. **SCTP Handshake:**
   - WHEN the user taps Play or Next, THE SctpHandshake SHALL animate the four-way handshake (INIT, INIT ACK with cookie, COOKIE ECHO, COOKIE ACK).
   - CLIENT and SERVER states SHALL update visually for each message (Client: CLOSED → COOKIE-WAIT → COOKIE-ECHOED → ESTABLISHED; Server: CLOSED → ESTABLISHED).
   - BELOW the handshake, a multi-stream demo SHALL show: 3 streams with a "drop a message" button on Stream 2, demonstrating Stream 1 and 3 continuing while Stream 2 waits.
   - A toggle "Same data over TCP" SHALL show all 3 streams blocked by a dropped message, illustrating SCTP's head-of-line blocking advantage.

---

### Requirement 4: Three Image Corrections (Critical)

**User Story:** As a student learning from exam-standard material, I need incorrect diagrams corrected so that I do not memorize wrong information for the exam.

#### Acceptance Criteria

1. **CRITICAL - Distance Vector Diagram:**
   - THE Application SHALL replace the incorrect distance vector PNG with a native inline `DistanceVectorSvg` component showing the correct network and Router A's final routing table.
   - THE SVG SHALL display routers A, B, C, D, E as nodes at positions (A 80,170; B 260,60; C 440,170; D 170,310; E 350,310).
   - LINKS SHALL be drawn as black lines with the cost displayed in a circle at the midpoint: A-B 2, A-D 7, B-C 3, B-D 4, C-E 2, D-E 1.
   - ROUTER A's final table SHALL appear beside or below the network showing: B (cost 2, next hop B), C (5, B), D (6, B), E (7, B).
   - THE original PNG SHALL be kept in a collapsed panel titled "Original illustration (see correction)" with a warning note: "The next-hop for D and E in this picture should be B, not D."

2. **CRITICAL - TCP State Transition Diagram:**
   - THE Application SHALL replace the incorrect TCP state PNG with a native inline `TcpStateSvg` component showing all correct transitions.
   - THE transition from ESTABLISHED to CLOSE-WAIT SHALL be labeled "receive FIN / send ACK" (correcting the wrong "close / send FIN").
   - THE transition from FIN-WAIT-1 to TIME-WAIT (optional in the original) SHALL be included as "receive FIN+ACK / send ACK".
   - STATE colors SHALL follow: client / active paths in packet blue, server / passive paths in signal green, common/timeout transitions in ink.
   - A legend SHALL explain the color coding.
   - THE SVG layout SHALL follow the original's general structure: CLOSED at top, LISTEN/SYN-SENT below, ESTABLISHED in the middle, active-close left, passive-close right, TIME-WAIT and CLOSED at bottom.
   - THE original PNG SHALL be kept in a collapsed panel with a one-line correction note.

3. **CRITICAL - UDP Header Diagram:**
   - THE Application SHALL replace the incorrect UDP header PNG with a native `UdpHeader` HTML/CSS component showing a 32-column grid.
   - THE bit ruler at the top SHALL read 0, 1, 2, ..., 30, 31 with no repeats (correcting the original's "22, 23, 23, 24").
   - THE four 16-bit fields SHALL be clearly labeled: Source port (bits 0–15), Destination port (16–31), Length (32–47), Checksum (48–63).
   - EACH column SHALL represent one bit; each field SHALL span its correct bit range.
   - THE original PNG SHALL be kept in a collapsed panel with the note: "The bit ruler has been corrected to show 0 to 31 once each."

---

### Requirement 5: Marks Gutter Design

**User Story:** As an exam student, I want a visual marking structure that mirrors an examiner's marking sheet so that I internalize the mark allocation for each section.

#### Acceptance Criteria

1. THE Marks Gutter is a left-edge visual element showing how many marks each section of an answer is worth.

2. ON screens 768px and wider, the Marks Gutter SHALL be a vertical strip along the left edge of the topic page displaying mark badges aligned to section starts.

3. ON mobile (under 768px), the Marks Gutter SHALL appear as a slim yellow tab on the top-left of each section.

4. EACH badge SHALL display a yellow background (--mark color), rounded corners (4px), and text such as "2 marks", "5 marks", etc.

5. THE badge values across all 5 sections of a topic SHALL sum to exactly 16; THE Application SHALL assert this in development.

6. THE badge font SHALL use Bricolage Grotesque, weight 600, sized appropriately for readability without dominating the section.

---

### Requirement 6: localStorage for Progress, Bookmarks, and Resume

**User Story:** As a returning student, I want my progress to be saved automatically so that I can resume studying without losing my place or forgetting which topics I have revised.

#### Acceptance Criteria

1. THE Application SHALL use `localStorage` with these keys: `cn.progress`, `cn.bookmarks`, `cn.lastRead`, `cn.theme`, `cn.fontStep`, `cn.quizScores`.

2. THE `cn.progress` key SHALL store a set (serialized as JSON array) of topic slugs marked as "revised" by the user.

3. THE `cn.bookmarks` key SHALL store a set of bookmarked topics and sections (topic slug + optional section ID).

4. THE `cn.lastRead` key SHALL store an object with slug and scroll offset (pixels from top), allowing the user to resume at the exact scroll position within a topic.

5. THE `cn.theme` key SHALL store "system", "light", or "dark" (default is "system").

6. THE `cn.fontStep` key SHALL store a number from 0 to 3 representing the user's font size preference (0 = smallest, 3 = largest).

7. THE `cn.quizScores` key SHALL store best score (number correct / total questions) per topic.

8. EVERY `localStorage` read and write operation SHALL be wrapped in a try/catch block; THE Application SHALL continue working normally if `localStorage` is unavailable (e.g., in private browsing mode or quota exceeded).

9. WHEN a user marks a topic revised via the checkbox, THE Application SHALL immediately write to `cn.progress`.

10. WHEN a user bookmarks a topic via the bookmark icon, THE Application SHALL immediately write to `cn.bookmarks`.

11. WHEN a user navigates away from a topic, THE Application SHALL save their scroll position to `cn.lastRead`.

12. WHEN a user returns to a previously visited topic, THE Application SHALL scroll to the saved scroll position automatically.

---

### Requirement 7: Quiz System

**User Story:** As a student testing my knowledge, I want a quiz feature with immediate feedback so that I can identify weak areas and improve before the exam.

#### Acceptance Criteria

1. THE Application SHALL provide a Quiz page accessible from the bottom navigation and home page.

2. EACH Quiz screen SHALL present one multiple-choice question with exactly four options.

3. THE Question SHALL specify the topic and the question text.

4. WHEN the user selects an option, THE Application SHALL:
   - Highlight the selected option
   - Display the correct answer (if wrong)
   - Show an explanation paragraph
   - Disable further selection until the user taps "Next"

5. AFTER answering all questions, THE Quiz SHALL display a score (number correct / total) and a best-score summary.

6. THE Best Score per topic SHALL be saved to `cn.quizScores` in localStorage.

7. OPTION order SHALL be shuffled on each quiz attempt; THE Application SHALL maintain the correct `answerIndex` after shuffling.

8. THE Application SHALL seed at least 21 quiz questions (3+ per topic from source material) with correct answers and explanations.

9. THE Quiz page SHALL include a topic filter dropdown and an "All topics" mode.

10. WHEN the user taps "All topics", THE Quiz SHALL run all seeded questions in a single session.

---

### Requirement 8: Search Feature

**User Story:** As a student looking for a specific concept, I want to search topic titles and content so that I can quickly locate what I need to revise.

#### Acceptance Criteria

1. A search icon SHALL be present in the application header.

2. WHEN the user taps the search icon or presses `/` on desktop, a search input field SHALL open.

3. THE Search function SHALL be implemented client-side and cover: topic titles, section headings, key points, keywords, and content text.

4. SEARCH matches SHALL be case-insensitive and SHALL support partial word matching.

5. SEARCH results SHALL rank title matches first, then section matches, ordered by relevance.

6. EACH result SHALL show the matched text highlighted and indicate which topic and section it belongs to.

7. TAPPING a result SHALL navigate to that topic and scroll to the matching section.

8. AN empty state with a prompt ("Start typing to search") SHALL appear when the search field is empty.

---

### Requirement 9: Revision Mode

**User Story:** As a student with limited time before the exam, I want a swipeable quick-revision view so that I can absorb key points fast without reading full answers.

#### Acceptance Criteria

1. THE Application SHALL provide a Revision Mode page (`/revise`) accessible from the bottom navigation.

2. THE Revision page SHALL display one topic per screen in a swipeable carousel (or list with full-screen scroll on mobile).

3. FOR each topic, THE Revision screen SHALL show:
   - One-sentence definition
   - 5 to 7 bullet key points
   - Thumbnail diagram (clickable to open in lightbox)
   - Exam keywords
   - 4 to 5 vocabulary or mnemonic terms from the topic

4. A "Quick" / "Full" toggle SHALL switch between showing just key points and showing a link to the full answer sheet.

5. THE user's scroll position within each topic's revision card SHALL be saved and restored on return.

6. SWIPING to the next/previous topic SHALL be smooth and immediate.

---

### Requirement 10: Theme Toggle and Font-Size Control

**User Story:** As a student revising for hours on my phone, I want to adjust text size and choose a comfortable theme so that I can reduce eye strain and read in any lighting condition.

#### Acceptance Criteria

1. A theme toggle button in the header SHALL allow the user to switch between Light, Dark, and System (default).

2. THE selected theme preference SHALL be saved to `cn.theme` in localStorage and restored on return.

3. IN Light mode, THE Application SHALL use the light color palette (--paper #F6F8FB, --surface #FFFFFF, --ink #14213D, etc.).

4. IN Dark mode, THE Application SHALL use the dark color palette (--paper #0E1624, --surface #152033, --ink #E8EEF8, etc.).

5. ALL color contrasts SHALL meet WCAG AA standards in both light and dark modes.

6. A Font Size Control feature (A− / A / A+) SHALL be accessible in the header.

7. THE Font Size Control SHALL adjust the root font size across 4 steps (e.g., 14px, 16px, 18px, 20px base).

8. FONT size preference SHALL be saved to `cn.fontStep` in localStorage and applied on page load.

9. THE Marks Gutter badges, text, tables, and all content SHALL scale proportionally with the font size adjustment.

10. Adjusting font size or theme SHALL take effect immediately without requiring a page reload.

---

### Requirement 11: Print Styles and Print Button

**User Story:** As a student preparing for the exam, I want to print or save topic pages as PDFs so that I can have offline paper notes.

#### Acceptance Criteria

1. THE Application SHALL include a "Print or save as PDF" button on each topic page.

2. WHEN the user triggers print (via button or browser Ctrl+P), THE `@media print` styles SHALL:
   - Remove header, footer, and navigation elements
   - Force light theme colors (ink on white)
   - Avoid orphaned headings or split tables across page breaks
   - Print each topic as a clean, self-contained answer sheet
   - Include section marks gutter in a printable format

3. THE print output SHALL preserve tables, formulas, and diagrams.

4. IMAGES SHALL be high-quality in print (no reduced resolution).

---

### Requirement 12: Accessibility and PWA Installability

**User Story:** As a student using assistive technologies or installing the app on my home screen, I need the website to meet accessibility standards and be installable as a Progressive Web App.

#### Acceptance Criteria

1. THE Application SHALL use semantic HTML: one `h1` per page, landmarks (`<header>`, `<nav>`, `<main>`), tables with `<th>` and captions, and proper button elements.

2. SVG diagrams (DistanceVectorSvg, TcpStateSvg, etc.) SHALL have `role="img"`, a `<title>` element, and a `<desc>` element describing the content.

3. EVERY diagram and image SHALL have descriptive `alt` text and captions.

4. COLOR is never the sole indicator of information: changed cells in steppers SHALL also use bold text; client/server paths SHALL include labels, not just color.

5. Keyboard focus rings SHALL be visible (2px --packet color, 2px offset) on every interactive element.

6. Touch targets SHALL be at least 44px tall.

7. THE Application SHALL work at 360px width and up to ultra-wide screens; 200% zoom SHALL not break the layout.

8. THE Application SHALL respect `prefers-reduced-motion`; animations animate only on user tap, never on page load.

9. ALL icons from lucide-react SHALL include `aria-label` or semantic context.

10. THE Application SHALL pass Lighthouse audits: Performance 90+, Accessibility 95+, Best Practices 95+, PWA installable.

11. THE Application build (`npm run build`) SHALL produce zero console errors or warnings in development or production.

12. THE PWA manifest SHALL include name, short name, icons, start URL, scope, and display mode (fullscreen or standalone).

13. AFTER first load, THE entire application (HTML, CSS, JS, fonts, images) SHALL be cached by the Service Worker, allowing full offline operation.

---

## Marks Structure Summary

| Topic | Sections and Marks |
|---|---|
| VLSM | Intro 2 + Core concept 5 + Diagram 3 + Worked example 4 + Advantages/disadvantages 2 = **16** |
| Distance vector | Intro 2 + Core concept 5 + Diagram 3 + Worked example 4 + Comparison 2 = **16** |
| Link state | Intro 2 + Core concept 5 + Diagram 3 + Worked example 4 + Comparison 2 = **16** |
| UDP and TCP | Intro (UDP & TCP) 2 + Concept (UDP header & TCP lifecycle) 5 + Diagram (TCP state) 3 + State table & paths 4 + UDP vs TCP comparison 2 = **16** |
| SCTP | Intro 2 + Core concept 5 + Diagram (handshake & multi-streaming) 3 + Worked example 4 + Comparison/advantages 2 = **16** |
| DNS | Intro 2 + Core concept 5 + Diagram 3 + Resolution process 4 + Resource records & advantages 2 = **16** |
| SMTP | Intro 2 + Core concept 5 + Diagram (architecture & flow) 3 + Session example 4 + Limitations & improvements 2 = **16** |

---

## Technology Stack Constraints

- Vite + React 18 + TypeScript
- Tailwind CSS v3
- react-router-dom v6 (HashRouter for static hosting)
- lucide-react (icons only)
- framer-motion (animations on user tap only, respect reduced-motion)
- vite-plugin-pwa (Service Worker, offline)
- @fontsource packages (self-hosted: Bricolage Grotesque, Source Serif 4, JetBrains Mono)
- No other UI libraries; custom components for BlockRenderer, Marks Gutter, search, etc.

---

## Deployment Notes

- Commands: `npm install`, `npm run dev`, `npm run build`, `npm run preview` must all succeed.
- Build output directory: `dist/`
- HashRouter enables deployment on Vercel, Netlify, GitHub Pages with no rewrite rules.
- PWA installable on iOS and Android after first load.

