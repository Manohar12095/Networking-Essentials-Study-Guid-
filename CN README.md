# Computer Networks: 16-Mark Study Guide Website (Master Build Prompt)

> **How to use this file**
> 1. Create an empty project folder and put this `README.md` in its root.
> 2. Create the folder `public/images/` and add the 9 images, renamed exactly as listed in Section 4.
> 3. Open the folder in Cursor or Antigravity, then paste this one line into the agent chat:
>    **"Read README.md completely, then build the entire application exactly as specified. Do not ask me questions. Make reasonable choices, build in the phases of Section 14, run the app, fix every error, and tick off the checklist in Section 15 before you finish."**

---

## 1. Project overview

Build a **static, mobile-first, offline-capable study guide website** for a Computer Networks exam. Every topic is a **16-mark question**, so each topic page is written and laid out as a complete exam answer that a student can read, revise, and reproduce in the exam hall.

- **Audience:** one engineering student revising on a phone, usually the night before the exam, often with poor internet.
- **Primary job:** make the 8 important questions fast to revise, easy to remember, and easy to write in the right structure for full marks.
- **No backend, no login, no database.** All content lives in typed data files. Progress and bookmarks are saved in `localStorage`.
- Tone of all copy: plain, exam-oriented, short sentences, active voice, sentence case.

### Syllabus covered (all 16 marks)

| Unit | # | Topic | Slug |
|---|---|---|---|
| 3 | 1 | VLSM (Variable Length Subnet Mask) | `vlsm` |
| 3 | 2 | Distance vector routing | `distance-vector` |
| 3 | 3 | Link state routing (diagram given, find the final routing table) | `link-state` |
| 4 | 1 | UDP and TCP, with the TCP state transition diagram | `udp-tcp-states` |
| 4 | 2 | Stream Control Transmission Protocol (SCTP) | `sctp` |
| 5 | 1 | DNS (Domain Name System) | `dns` |
| 5 | 2 | SMTP (Simple Mail Transfer Protocol) | `smtp` |

That is 7 topic pages. Unit 3 has three, Unit 4 has two (the UDP and TCP question counts as one), Unit 5 has two. The user's list numbered Unit 5 items 3 and 4, but they are simply the two Unit 5 questions.

---

## 2. Tech stack (use exactly this)

- **Vite + React 18 + TypeScript**
- **Tailwind CSS v3** with a custom theme (tokens in Section 5)
- **react-router-dom v6 using `HashRouter`** (so it works on any static host and from a plain file server)
- **lucide-react** for icons
- **framer-motion** only for answering user actions (opening a panel, stepping an animation). No decorative entrance animations.
- **vite-plugin-pwa** so the site works offline after first load
- No other UI libraries. Write the small search function yourself.
- Fonts: self-host through `@fontsource` packages so they work offline (Section 5).

Commands that must work: `npm install`, `npm run dev`, `npm run build`, `npm run preview`.

---

## 3. Folder structure

```
/
├─ README.md
├─ index.html
├─ package.json
├─ tailwind.config.ts
├─ vite.config.ts            (with PWA plugin)
├─ public/
│  └─ images/                (9 renamed images, Section 4)
└─ src/
   ├─ main.tsx
   ├─ App.tsx                (routes)
   ├─ styles/index.css
   ├─ types/content.ts       (Section 7)
   ├─ data/
   │  ├─ units.ts
   │  ├─ topics/
   │  │  ├─ vlsm.ts
   │  │  ├─ distanceVector.ts
   │  │  ├─ linkState.ts
   │  │  ├─ udpTcpStates.ts
   │  │  ├─ sctp.ts
   │  │  ├─ dns.ts
   │  │  └─ smtp.ts
   │  └─ quiz.ts
   ├─ lib/
   │  ├─ storage.ts          (safe localStorage with try/catch)
   │  ├─ search.ts
   │  ├─ vlsm.ts             (calculator logic)
   │  ├─ dijkstra.ts
   │  └─ distanceVector.ts
   ├─ components/
   │  ├─ layout/ (Header, BottomNav, Sidebar, ThemeToggle, FontSizeControl)
   │  ├─ content/ (BlockRenderer, MarksGutter, KeyPointBox, FormulaBox, StepList, DataTable, ImageFigure, Lightbox)
   │  ├─ diagrams/ (DistanceVectorSvg, TcpStateSvg, UdpHeader, TopologySvg)
   │  └─ interactive/ (VlsmCalculator, DistanceVectorStepper, DijkstraStepper, TcpStateExplorer, DnsAnimator, SmtpSimulator, SctpHandshake)
   └─ pages/ (Home, UnitPage, TopicPage, RevisionMode, QuizPage, Bookmarks, SearchPage, NotFound)
```

---

## 4. Image assets (IMPORTANT: rename, then wire up)

The user uploaded these 9 images. Their original file names are cryptic, so **rename them exactly as below** and place them in `public/images/`. Reference them in code as `/images/<name>`.

| Original file name | Rename to | Used in topic | What it shows |
|---|---|---|---|
| `file_000000007fcc8208b62e37d0bd2555af.png` | `distance-vector.png` | distance-vector | 5-router network with Router A table (see issue below) |
| `DNS_Resolution_Flow_Infographic.png` | `dns-resolution.png` | dns | 8-step resolution of www.example.com plus DNS hierarchy |
| `file_0000000088e08208a60e75249b94815d.png` | `vlsm-network.png` | vlsm | One router, LAN A (100), B (50), C (25), D (2) with /25, /26, /27, /30 |
| `Email_Architecture_and_SMTP_Flow.png` | `smtp-architecture.png` | smtp | UA, sender MTA, receiver MTA, UA with SMTP command sequence |
| `SCTP_Handshake_and_Multi-Streaming_Diagram.png` | `sctp-handshake-multistreaming.png` | sctp | Four-way handshake and multi-streaming panel |
| `file_0000000095e88208b8621374036ebb9d.png` | `link-state-concept.png` | link-state | Generic link state example with LSDB, Dijkstra steps and final table at Router A |
| `TCP_State_Transition_Diagram.png` | `tcp-state-diagram.png` | udp-tcp-states | TCP finite state machine (see issue below) |
| `UDP_Datagram_Header_Format.png` | `udp-header.png` | udp-tcp-states | UDP header fields (see issue below) |
| `Screenshot_20261019-090949.jpg` | `link-state-question.jpg` | link-state | **The exam question's own diagram**: 5 nodes, Node B Dijkstra table |

### 4.1 Three image problems found, and exactly how to handle each

The student must never learn something wrong. Three of the AI-generated images contain small mistakes. **Do not delete them**, but handle them as follows.

1. **`distance-vector.png`: the Router A table is wrong.**
   The picture shows D = 6 via D and E = 7 via D. With the links A-B 2, A-D 7, B-D 4, B-C 3, C-E 2, D-E 1, the correct entries are **D = 6 via B** and **E = 7 via B**. The vertical link from B also meets the D-E line ambiguously.
   **Fix:** Build the distance vector diagram yourself as an inline SVG component `DistanceVectorSvg` using the data in Section 9.2, and use it as the main figure. Show the PNG only inside a collapsed panel titled "Original illustration (see correction)" with a warning note: "The next-hop for D and E in this picture should be B."

2. **`tcp-state-diagram.png`: one transition label is wrong.**
   The arrow ESTABLISHED to CLOSE-WAIT is labeled "close / send FIN". It must be **"receive FIN / send ACK"**. (The label on CLOSE-WAIT to LAST-ACK, "close / send FIN", is correct.) Also the optional FIN-WAIT-1 to TIME-WAIT transition is missing.
   **Fix:** Build `TcpStateSvg` as an inline SVG with the correct transitions from Section 9.4 and use it as the main figure. Keep the PNG in a collapsed panel with a correction note.

3. **`udp-header.png`: the bit ruler repeats "23".**
   The ruler reads 22, 23, 23, 24. It should run 0 to 31 once each.
   **Fix:** Build `UdpHeader` as a pure HTML/CSS component (a 32-column grid with a correct 0 to 31 ruler). Use it as the main figure. The PNG goes in a collapsed panel with a one-line note.

The other six images are correct and are used as-is.

### 4.2 Link state: two diagrams, use both, in this order

- `link-state-question.jpg` is **the exam question's diagram**. It is the main worked example. Nodes A, B, C, D, E; costs A-B 2, A-C 1, A-D 7, C-D 2, B-E 5, D-E 3; the Dijkstra table is computed **at Node B**. The red numbers beside nodes (A 2, B 0, C 3, D 5, E 5) are the final least costs from B.
- `link-state-concept.png` is a **second practice example** (Dijkstra at Router A). Label it "Practice example".

### 4.3 Image display rules

- Every image is an `ImageFigure` with a caption, descriptive `alt` text, `loading="lazy"`, and `decoding="async"`.
- Tapping an image opens a full-screen `Lightbox` with pinch-zoom, pan, double-tap zoom, and a close button. Esc closes it.
- Images never overflow the screen; they scale to the container width. Wide images allow horizontal scroll inside the lightbox.

---

## 5. Design system

**Concept: "the examiner's marking sheet meets a network engineer's blueprint."** Calm paper-like surfaces, ink-navy text, and a **marks gutter** that shows how many of the 16 marks each section of an answer is worth. That gutter is the one memorable element; keep everything else quiet. Do not use a generic card grid, gradient washes, glassmorphism, or a dark-mode-only look.

### Colors (CSS variables, light and dark)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--paper` | `#F6F8FB` | `#0E1624` | page background |
| `--surface` | `#FFFFFF` | `#152033` | answer sheet, tables |
| `--ink` | `#14213D` | `#E8EEF8` | body text and headings |
| `--muted` | `#5B6B86` | `#9AA9C2` | secondary text |
| `--packet` | `#1D6FE0` | `#5AA0FF` | links, client path, primary actions |
| `--signal` | `#0F9D8A` | `#34D1B8` | server path, success, "revised" |
| `--mark` | `#FFD84D` | `#E8B923` | marks badges and key-point highlight |
| `--alert` | `#E4572E` | `#FF8A66` | warnings, correction notes |
| `--rule` | `#D8E0EC` | `#27364F` | borders and dividers |

Contrast must meet WCAG AA in both themes. The theme follows the system setting by default, with a manual toggle saved to `localStorage`.

### Typography

- **Headings and UI:** `Bricolage Grotesque` (variable). Weights 600 to 800.
- **Answer body:** `Source Serif 4`. Line height 1.65, max line length about 70 characters.
- **Commands, bit fields, code, IP addresses:** `JetBrains Mono`, used only for actual code and addresses, never for decorative labels.
- Type scale: 14 / 16 / 18 / 22 / 28 / 36. Body default 17px on mobile.
- Do **not**: use ALL CAPS labels, put a small label above every heading, color a single word in a headline, add arrows to the end of every button, or number things that are not a sequence. Use numbers only for real steps.
- User font-size control (A- / A / A+) changes the root size across 4 steps and is remembered.

### Layout

- **Mobile first (360px wide up).** Bottom navigation bar with 5 items: Home, Units, Revise, Quiz, Saved. On screens 1024px and wider, replace it with a left sidebar plus a right "On this page" outline.
- **Topic page = "answer sheet".** A white sheet on the paper background. Along its left edge runs the **MarksGutter**: each major section shows a yellow badge such as `2 marks`, `4 marks`, aligned to the section start. The badge values always add up to **16** (Section 6.2). On mobile the gutter becomes a slim yellow tab at the top-left of each section.
- Left-align all prose. Center only the hero on the Home page.
- Tables scroll horizontally inside their own container with a visible fade at the edge. The page itself never scrolls sideways.
- Border radius: 4px on tables and badges, 10px on sheets and panels, 999px only on chips. Do not use one radius everywhere.
- Shadows: none on the sheet in light mode (use the rule color border); a faint shadow only on floating elements (lightbox, bottom bar).
- Motion: no entrance animations. Animate only in response to a tap (accordion open, stepper step, quiz answer reveal). Respect `prefers-reduced-motion`.
- Visible keyboard focus ring (2px `--packet`, 2px offset) on every interactive element. Touch targets at least 44px.

### Home page hero

Open with the thing that is characteristic of this subject: a **live "packet journey" strip**, a thin animated line showing a packet hopping Client → Router → Router → Server (it moves only when the user taps "Send packet", otherwise it is static). Under it: the headline "Computer Networks, 7 questions, 16 marks each", the user's overall progress, and a big **Continue where you left off** button.

---

## 6. Pages, navigation, and features

### 6.1 Routes (HashRouter)

| Route | Page |
|---|---|
| `/` | Home: hero, progress summary, Continue button, units list, quick links to Revise and Quiz |
| `/unit/:n` | Unit page (3, 4, or 5): its topics as large rows with marks, reading time, progress state |
| `/topic/:slug` | Topic answer sheet |
| `/revise` | Revision mode: one-screen summaries of all topics (Section 6.3) |
| `/quiz` and `/quiz/:slug` | Quizzes (Section 11) |
| `/saved` | Bookmarked topics and sections |
| `/search` | Search results |
| `*` | NotFound with a link home |

### 6.2 Topic page structure (the 16-mark answer template)

Every topic page renders these sections in this order with these mark values (the data files set them; the sum must be 16 and the app should assert this in development):

1. **Introduction and definition**: 2 marks
2. **Core concept and working**: 5 marks
3. **Diagram**: 3 marks
4. **Worked example or detailed steps**: 4 marks
5. **Advantages, disadvantages and comparison**: 2 marks

Per-topic content can add sub-sections inside these. Marks may be re-split per topic where noted in Section 9, but must still total 16.

Page elements:
- Sticky top bar: back arrow, topic title, bookmark button, "Mark as revised" check.
- Under the title: unit, 16 marks, estimated reading time, and a row of chips for the interactive tools on the page.
- Collapsible **"Write this in the exam"** box at the top: the 5-part skeleton in one line each plus the 4 or 5 keywords that must appear.
- Sections as described, each with a MarksGutter badge, a heading anchor, and (on long pages) a collapse toggle.
- **KeyPointBox** (yellow-tinted left border): the "must remember" lines. A **Mnemonic** line where Section 9 provides one.
- **FormulaBox** for formulas, set in the mono font.
- **Common mistakes** callout (alert color) where given.
- "Previous topic / Next topic" at the bottom.
- Print styles: `@media print` removes navigation, forces light colors, avoids splitting tables and figures across pages, and prints each topic as a clean answer sheet. Provide a "Print or save as PDF" button.

### 6.3 Revision mode (`/revise`)

A swipeable list (one topic per screen) showing, for each topic: the definition in one sentence, 5 to 7 key points, the diagram thumbnail (opens the lightbox), and the exam keywords. A toggle switches between "Quick" (key points only) and "Full" (links to the answer sheet). Saved scroll position per topic.

### 6.4 Progress, bookmarks, resume

- `localStorage` keys: `cn.progress` (set of revised slugs), `cn.bookmarks`, `cn.lastRead` (slug plus scroll offset), `cn.theme`, `cn.fontStep`, `cn.quizScores`.
- Every localStorage read and write is wrapped in try/catch, and the app works normally if storage is unavailable.
- Home shows a progress ring (revised topics out of 7) and per-unit bars.

### 6.5 Search

Client-side search across topic titles, headings, key points, and keywords. Case-insensitive, matches partial words, ranks title matches first, highlights matches, and shows the section it was found in. Opens from a search icon in the header; supports the `/` keyboard shortcut on desktop.

### 6.6 Other required features

- Theme toggle (system, light, dark).
- Font size control.
- "Copy section as text" button on each section (plain text, tables flattened to lines).
- Share button using the Web Share API when available, with a copy-link fallback.
- Offline: after the first visit everything works without internet. Show a small "Available offline" note once the service worker is ready.
- Empty states have a direction ("No saved topics yet. Tap the bookmark on any topic to keep it here.").

---

## 7. Data model (`src/types/content.ts`)

```ts
export type Block =
  | { type: 'paragraph'; text: string }
  | { type: 'bullets'; items: string[] }
  | { type: 'steps'; items: string[] }                       // real sequences only
  | { type: 'table'; caption?: string; headers: string[]; rows: string[][] }
  | { type: 'formula'; label?: string; lines: string[] }
  | { type: 'keypoints'; title?: string; items: string[] }
  | { type: 'mnemonic'; text: string }
  | { type: 'mistakes'; items: string[] }
  | { type: 'code'; title?: string; language?: string; code: string }
  | { type: 'image'; src: string; alt: string; caption: string; note?: string }
  | { type: 'native'; component: 'DistanceVectorSvg' | 'TcpStateSvg' | 'UdpHeader' | 'TopologySvg'; props?: Record<string, unknown> }
  | { type: 'interactive'; component: 'VlsmCalculator' | 'DistanceVectorStepper' | 'DijkstraStepper' | 'TcpStateExplorer' | 'DnsAnimator' | 'SmtpSimulator' | 'SctpHandshake' }
  | { type: 'callout'; tone: 'info' | 'warn' | 'success'; text: string };

export interface Section {
  id: string;
  title: string;
  marks: number;
  blocks: Block[];
}

export interface Topic {
  slug: string;
  unit: 3 | 4 | 5;
  order: number;
  title: string;
  shortTitle: string;
  oneLineDefinition: string;
  examKeywords: string[];
  writeInExam: string[];     // the 5-part skeleton, one line each
  revisionPoints: string[];  // 5 to 7 lines for Revise mode
  sections: Section[];       // marks sum to 16
}

export interface QuizQuestion {
  topic: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}
```

---

## 8. Content rules for the AI building this

- Use the content in Section 9 **as the source of truth**. You may tidy wording for readability but must not change any number, address, command, state name, or transition.
- Where Section 9 gives a table, render it as a real table. Where it gives steps, render them as ordered steps.
- Write each topic as a full 16-mark answer in the five-part structure of Section 6.2.
- After building, **re-verify every calculation** in the VLSM, distance vector, and Dijkstra sections by running the logic in `src/lib` and comparing with the values given here. If your code disagrees with this README, the README wins; fix the code.

---

## 9. Topic content (source of truth)

### 9.1 VLSM: Variable Length Subnet Mask (Unit 3)

**Definition.** VLSM is a technique of dividing one IP network into subnets of **different sizes**, each with its own subnet mask, so that every subnet gets just enough addresses for its hosts. It is the subnetting method used with classless addressing (CIDR) and needs a routing protocol that sends the mask with each route (RIPv2, OSPF, EIGRP, IS-IS, BGP). Classful protocols (RIPv1, IGRP) do not support it.

**FLSM vs VLSM.** In fixed length subnet masking every subnet has the same size, so small LANs waste addresses. VLSM removes that waste.

**Formulas.**
- Usable hosts in a subnet = 2^h − 2 (h = host bits; one address for network ID, one for broadcast)
- Prefix length = 32 − h
- Block size = 256 − (value of the interesting octet of the mask)
- Next subnet starts at: previous broadcast address + 1

**Steps (the procedure to write in the exam).**
1. Note the base network and the host requirement of every LAN or link.
2. Sort the requirements from largest to smallest.
3. For each, find the smallest h with 2^h − 2 ≥ hosts. Prefix = 32 − h.
4. Allocate the largest subnet first, starting at the lowest address of the block.
5. Start each next subnet at the previous broadcast address + 1 (it must fall on a multiple of its own block size).
6. Write network ID, mask, first host, last host, broadcast for each subnet.
7. Check that no subnets overlap and everything fits inside the base network.

**Worked example (the image `vlsm-network.png`).** Base network 192.168.1.0/24. Requirements: LAN A 100 hosts, LAN B 50 hosts, LAN C 25 hosts, LAN D 2 hosts (point-to-point link).

Calculations:
- LAN A: 100 hosts, 2^7 − 2 = 126 ≥ 100, so h = 7, prefix **/25**
- LAN B: 50 hosts, 2^6 − 2 = 62 ≥ 50, so h = 6, prefix **/26**
- LAN C: 25 hosts, 2^5 − 2 = 30 ≥ 25, so h = 5, prefix **/27**
- LAN D: 2 hosts, 2^2 − 2 = 2 ≥ 2, so h = 2, prefix **/30**

| LAN | Hosts needed | Network ID / prefix | Subnet mask | First host | Last host | Broadcast | Usable hosts |
|---|---|---|---|---|---|---|---|
| A | 100 | 192.168.1.0/25 | 255.255.255.128 | 192.168.1.1 | 192.168.1.126 | 192.168.1.127 | 126 |
| B | 50 | 192.168.1.128/26 | 255.255.255.192 | 192.168.1.129 | 192.168.1.190 | 192.168.1.191 | 62 |
| C | 25 | 192.168.1.192/27 | 255.255.255.224 | 192.168.1.193 | 192.168.1.222 | 192.168.1.223 | 30 |
| D | 2 | 192.168.1.224/30 | 255.255.255.252 | 192.168.1.225 | 192.168.1.226 | 192.168.1.227 | 2 |

Addresses used: 128 + 64 + 32 + 4 = 228 of 256. **Unused: 192.168.1.228 to 192.168.1.255 (28 addresses)**, kept for future growth.

**Why FLSM fails here:** to give 100 hosts a subnet you need /25 for every subnet, but a /24 holds only two /25 subnets, so the four LANs cannot fit. VLSM fits all four.

**Router's view:** four directly connected routes, 192.168.1.0/25, .128/26, .192/27, .224/30. Summarisation is possible when subnets are allocated contiguously.

**Practice question (put in a collapsed "Try it yourself" panel with the answer hidden until tapped).** Base 10.0.0.0/24; LANs need 60, 30, 10 and 2 hosts.
Answer: 60 → /26: 10.0.0.0/26 (hosts .1 to .62, broadcast .63). 30 → /27: 10.0.0.64/27 (hosts .65 to .94, broadcast .95). 10 → /28: 10.0.0.96/28 (hosts .97 to .110, broadcast .111). 2 → /30: 10.0.0.112/30 (hosts .113 and .114, broadcast .115).

**VLSM vs FLSM table.**

| Point | FLSM | VLSM |
|---|---|---|
| Subnet size | All equal | Different sizes |
| Address wastage | High | Low |
| Mask | One mask | Many masks |
| Routing protocol | Classful or classless | Classless only |
| Planning effort | Easy | More careful planning |
| Fits mixed LAN sizes | Poorly | Well |

**Advantages:** efficient use of addresses; supports route summarisation; scalable; suits point-to-point WAN links (/30). **Disadvantages:** more planning, higher chance of overlap errors, needs classless routing protocols, harder to troubleshoot.

**Mnemonic:** "Biggest first, block by block."
**Common mistakes:** forgetting the −2 for network and broadcast; allocating small subnets first (causes misalignment); starting a subnet at an address that is not a multiple of its block size.
**Exam keywords:** CIDR, subnet mask, host bits, 2^h − 2, network ID, broadcast address, classless, route summarisation.

**Interactive: `VlsmCalculator`.** Inputs: base network in CIDR (default 192.168.1.0/24) and a list of LAN names with host counts (default the 4 above; add and remove rows). On "Calculate": sort descending, compute prefix per Step 3, allocate sequentially, and output the same table as above. Validation: reject invalid CIDR, show an error if the total exceeds the base network ("Not enough addresses: needs X, block has Y"), and flag any host count under 1. A "Reset to exam example" button restores the defaults. Logic lives in `src/lib/vlsm.ts` with a unit test that the default input reproduces the table above exactly.

---

### 9.2 Distance vector routing (Unit 3)

**Definition.** In distance vector routing each router keeps a table (a "vector") giving the **distance (cost) to every destination and the next hop**, and periodically shares that table with its **directly connected neighbours only**. It is based on the **Bellman-Ford algorithm** and is often called "routing by rumour", since a router trusts what neighbours say without knowing the whole network.

**Bellman-Ford equation.**
`D_x(y) = min over all neighbours v of { c(x, v) + D_v(y) }`
(cost from x to y = the cheapest of: cost to neighbour v plus v's advertised cost to y).

**Working (steps).**
1. **Initialisation:** each router knows only itself (cost 0) and its direct neighbours (link cost). All others are infinity.
2. **Exchange:** each router sends its whole distance vector to every neighbour (RIP: every 30 seconds).
3. **Update:** on receiving a neighbour's vector, the router adds the link cost to each advertised distance and keeps the cheaper route (updating the next hop).
4. **Repeat** until no table changes. This is **convergence**.

**Network used (draw it as native SVG `DistanceVectorSvg`).** Routers A, B, C, D, E. Link costs: A-B 2, A-D 7, B-C 3, B-D 4, C-E 2, D-E 1. Suggested node positions: A (80,170), B (260,60), C (440,170), D (170,310), E (350,310). Links are black lines with the cost in a circle at the midpoint. Highlight Router A's table beside it.

**Initial tables (Round 0), each entry is cost / next hop.**

| Router | A | B | C | D | E |
|---|---|---|---|---|---|
| A | 0 / – | 2 / B | ∞ | 7 / D | ∞ |
| B | 2 / A | 0 / – | 3 / C | 4 / D | ∞ |
| C | ∞ | 3 / B | 0 / – | ∞ | 2 / E |
| D | 7 / A | 4 / B | ∞ | 0 / – | 1 / E |
| E | ∞ | ∞ | 2 / C | 1 / D | 0 / – |

**After Round 1.**

| Router | A | B | C | D | E |
|---|---|---|---|---|---|
| A | 0 / – | 2 / B | 5 / B | 6 / B | 8 / D |
| B | 2 / A | 0 / – | 3 / C | 4 / D | 5 / C |
| C | 5 / B | 3 / B | 0 / – | 3 / E | 2 / E |
| D | 6 / B | 4 / B | 3 / E | 0 / – | 1 / E |
| E | 8 / D | 5 / C | 2 / C | 1 / D | 0 / – |

(B to E is 5 via C or via D, a tie. The app uses C. E to B is 5 via C or D, a tie. The app uses C.)

**After Round 2 (final, converged; Round 3 changes nothing).**

| Router | A | B | C | D | E |
|---|---|---|---|---|---|
| A | 0 / – | 2 / B | 5 / B | 6 / B | **7 / B** |
| B | 2 / A | 0 / – | 3 / C | 4 / D | 5 / C |
| C | 5 / B | 3 / B | 0 / – | 3 / E | 2 / E |
| D | 6 / B | 4 / B | 3 / E | 0 / – | 1 / E |
| E | **7 / C** | 5 / C | 2 / C | 1 / D | 0 / – |

Changed cells in Round 2: A to E improves from 8 to 7 (now via B), and E to A improves from 8 to 7 (via C). (E to A is also 7 via D, a tie; the app uses C.)

**Final routing table at Router A (use this in the answer, and make the SVG's Router A table match it):**

| Destination | Cost | Next hop |
|---|---|---|
| A | 0 | – |
| B | 2 | B |
| C | 5 | B |
| D | 6 | B |
| E | 7 | B |

**Count-to-infinity problem.** Example: A – B – C, each link cost 1, B reaches C directly (cost 1). If link B–C fails, B hears from A that A can reach C with cost 2 (A's route goes through B!). B believes it and sets cost 3 via A; then A updates to 4 via B; the costs keep rising 5, 6, 7... slowly "counting to infinity". Bad news travels slowly.

**Solutions:**
- **Maximum hop limit** (RIP treats 16 as infinity)
- **Split horizon:** never advertise a route back out of the interface it was learned on
- **Poison reverse:** advertise it back with cost infinity (16)
- **Hold-down timers:** ignore worse news about a route for a while after it fails
- **Triggered updates:** send an update immediately when a route changes

**RIP facts.** Metric = hop count; maximum 15 hops (16 = unreachable); updates every 30 s; runs over UDP port 520; timers: invalid 180 s, flush 240 s.

**Advantages:** simple to configure; low CPU and memory; suits small networks. **Disadvantages:** slow convergence; count-to-infinity; routing loops; periodic full-table updates waste bandwidth; poor scalability; hop count ignores bandwidth.

**Mnemonic:** "Neighbours only, whole table, on a timer."
**Exam keywords:** Bellman-Ford, distance vector, next hop, convergence, count-to-infinity, split horizon, poison reverse, RIP, hop count.

**Interactive: `DistanceVectorStepper`.** Uses the same SVG topology. Buttons: Round 0, Next, Previous, Reset. Shows the table for the chosen router (tabs A to E) and highlights cells that changed in the current round (yellow background plus a bold value). A short caption explains the biggest change in each round. Data for all rounds comes from `src/lib/distanceVector.ts`, which must **compute** the rounds from the link list (not hard-code them) and must match the tables above.

---

### 9.3 Link state routing (Unit 3), the "diagram given, find the final routing table" question

**Definition.** In link state routing every router learns the **complete topology** of the network by flooding information about its own links, stores it in a **Link-State Database (LSDB)**, and independently runs **Dijkstra's shortest path algorithm** to build its routing table. OSPF and IS-IS are link state protocols.

**Working (five stages).**
1. **Discover neighbours:** send Hello packets on each link.
2. **Measure cost:** assign a cost to each link (delay, bandwidth, or fixed).
3. **Build link-state packet (LSP / LSA):** the router's ID, its neighbours and the costs, a sequence number, and an age.
4. **Flood reliably:** send the LSP to all routers (not just neighbours). Sequence numbers stop old LSPs replacing new ones and stop endless re-flooding.
5. **Compute routes:** each router runs Dijkstra on its LSDB to get the shortest-path tree, then makes the routing table.

**Dijkstra's algorithm (steps).**
1. Set the source distance to 0 and every other node to ∞. Let S = {source} (the set of nodes whose least-cost path is definitely known).
2. Relax the source's neighbours: distance = link cost, predecessor = source.
3. Pick the node **not in S** with the smallest tentative distance. Add it to S.
4. For each neighbour w of that node: if `dist(node) + cost(node, w) < dist(w)`, update `dist(w)` and set its predecessor to this node.
5. Repeat steps 3 and 4 until all nodes are in S.
6. Read the paths backwards through the predecessors; the **first hop** of each path is the next hop for the routing table.

**THE EXAM QUESTION (image `link-state-question.jpg`).**
Topology: nodes A, B, C, D, E. Links and costs: **A-B = 2, A-C = 1, A-D = 7, C-D = 2, B-E = 5, D-E = 3.** Find the routing table of **Node B**.

Native data for `TopologySvg`: node positions A (300,60), B (60,230), C (300,230), D (540,230), E (300,400)... (any clean layout that matches the picture is fine). Draw the tree edges B-A, A-C, C-D, B-E in red as in the screenshot after the final step.

**Dijkstra table at Node B. Reproduce this table exactly as in the screenshot** (cell = cost, predecessor; the newly fixed node in each row is highlighted yellow):

| Step | A | C | D | E | S (nodes fixed) |
|---|---|---|---|---|---|
| 1 | **(2, B)** | ∞ | ∞ | (5, B) | BA |
| 2 | (2, B) | **(3, A)** | (9, A) | (5, B) | BAC |
| 3 | (2, B) | (3, A) | **(5, C)** | (5, B) | BACD |
| 4 | (2, B) | (3, A) | (5, C) | **(5, B)** | BACDE |

Add a note under the table: "Each row shows the best-known costs at the moment the highlighted node is fixed. The effect of fixing that node shows up in the next row."

**Step-by-step explanation (show beside or under the table):**
- Start: B = 0. Direct neighbours: A = 2, E = 5. S = {B}.
- Fix A (smallest, 2). Through A: C = 2 + 1 = 3, D = 2 + 7 = 9. S = {B, A}.
- Fix C (3). Through C: D = 3 + 2 = 5, better than 9, so D = 5 via C. S = {B, A, C}.
- Fix D (5). Through D: E = 5 + 3 = 8, worse than 5, so E stays 5. S = {B, A, C, D}. (D and E tie at 5; the sheet fixes D first.)
- Fix E (5). All nodes done.

**Final least costs from B:** A = 2, C = 3, D = 5, E = 5 (matches the red numbers in the picture).

**FINAL ROUTING TABLE AT NODE B (the answer):**

| Destination | Path | Total cost | Next hop |
|---|---|---|---|
| A | B → A | 2 | A |
| C | B → A → C | 3 | A |
| D | B → A → C → D | 5 | A |
| E | B → E | 5 | E |

**Second practice example (image `link-state-concept.png`).** Dijkstra at Router A. Final routing table at A: B cost 2 next hop B (path A→B); C cost 5 next hop B (A→B→C); D cost 1 next hop D (A→D); E cost 2 next hop D (A→D→E). Show this table and the image under a "Practice example" heading.

**Link state vs distance vector.**

| Point | Distance vector | Link state |
|---|---|---|
| Knowledge | Neighbour's table only | Whole topology |
| Algorithm | Bellman-Ford | Dijkstra |
| Sends to | Neighbours only | All routers (flooding) |
| Sends | Whole routing table | Only link information |
| Convergence | Slow | Fast |
| Loops / count-to-infinity | Possible | Avoided |
| CPU and memory | Low | High |
| Examples | RIP, IGRP | OSPF, IS-IS |

**Advantages:** fast convergence; loop-free; accurate, complete view; supports scaling through areas (OSPF). **Disadvantages:** more memory and CPU; flooding uses bandwidth at startup; complex to configure.

**Mnemonic:** "Everyone learns the map, then draws their own shortest-path tree."
**Exam keywords:** LSDB, LSP/LSA, flooding, Dijkstra, shortest-path tree, OSPF, Hello packet, sequence number.

**Interactive: `DijkstraStepper`.** Uses the exam graph (default) with a source selector (any node) and a "Load practice example" option. Next and Previous move through the algorithm: the node being fixed is highlighted, distances update on the nodes, the table builds row by row exactly like the screenshot, and tree edges turn red when confirmed. When finished, show the routing table for the chosen source. The logic in `src/lib/dijkstra.ts` must produce the Node B table above exactly (cost, predecessor, and order of fixing: A, C, D, E; ties broken alphabetically).

---

### 9.4 UDP and TCP, with the TCP state transition diagram (Unit 4)

**Transport layer role.** Process-to-process delivery using port numbers.

**UDP (User Datagram Protocol).** Connectionless, unreliable, **stateless**, minimal overhead. No handshake, no acknowledgement, no ordering, no flow or congestion control. Best-effort delivery.

**UDP header = 8 bytes (use native `UdpHeader` component).** Four 16-bit fields:
- Source port (16 bits)
- Destination port (16 bits)
- Length (16 bits): header plus data, in bytes
- Checksum (16 bits): over the UDP header, data and a pseudo-header (source IP, destination IP, protocol 17, UDP length). Optional in IPv4, mandatory in IPv6.
Then the data (variable length).

**UDP "state diagram".** UDP has no connection, so it has **no real state machine**: a UDP socket is effectively in one state, "idle / ready", and each datagram is independent. Mention this clearly because the question pairs UDP with TCP's state diagram.

**UDP uses:** DNS, DHCP, SNMP, TFTP, VoIP, video streaming, online games, NTP.

**TCP (Transmission Control Protocol).** Connection-oriented, reliable, byte-stream service with sequence numbers, acknowledgements, retransmission, flow control (sliding window) and congestion control. Full duplex. TCP header is 20 to 60 bytes.

**TCP connection lifecycle.**
- **Establishment: three-way handshake.** Client sends SYN (seq = x). Server replies SYN+ACK (seq = y, ack = x+1). Client sends ACK (ack = y+1).
- **Data transfer** in ESTABLISHED.
- **Termination: four-way handshake**, because each direction is closed separately (half-close): FIN, ACK, FIN, ACK.

**The 11 TCP states.**

| State | Meaning |
|---|---|
| CLOSED | No connection exists |
| LISTEN | Server waits for a connection request (SYN) |
| SYN-SENT | Client has sent SYN, waiting for SYN+ACK |
| SYN-RCVD | Server received SYN and sent SYN+ACK, waiting for the final ACK |
| ESTABLISHED | Connection open; data can flow both ways |
| FIN-WAIT-1 | Sent FIN, waiting for its ACK (or the peer's FIN) |
| FIN-WAIT-2 | FIN was acknowledged; waiting for the peer's FIN |
| CLOSE-WAIT | Received peer's FIN and sent ACK; waiting for the local application to close |
| CLOSING | Both sides sent FIN at the same time; waiting for the ACK |
| LAST-ACK | Sent own FIN after CLOSE-WAIT; waiting for the final ACK |
| TIME-WAIT | Waits 2 × MSL (Maximum Segment Lifetime) before closing |

**All transitions (this is the data for `TcpStateSvg`; every one must be drawn with its label).**

| From | To | Event / action |
|---|---|---|
| CLOSED | LISTEN | Passive open (server) |
| CLOSED | SYN-SENT | Active open / send SYN (client) |
| LISTEN | SYN-RCVD | Receive SYN / send SYN+ACK |
| LISTEN | SYN-SENT | Send data / send SYN (rare) |
| SYN-SENT | ESTABLISHED | Receive SYN+ACK / send ACK |
| SYN-SENT | SYN-RCVD | Receive SYN / send SYN+ACK (simultaneous open) |
| SYN-RCVD | ESTABLISHED | Receive ACK |
| SYN-RCVD | FIN-WAIT-1 | Close / send FIN |
| ESTABLISHED | FIN-WAIT-1 | Close / send FIN (active close) |
| ESTABLISHED | CLOSE-WAIT | **Receive FIN / send ACK** (passive close) |
| FIN-WAIT-1 | FIN-WAIT-2 | Receive ACK |
| FIN-WAIT-1 | CLOSING | Receive FIN / send ACK (simultaneous close) |
| FIN-WAIT-1 | TIME-WAIT | Receive FIN+ACK / send ACK |
| FIN-WAIT-2 | TIME-WAIT | Receive FIN / send ACK |
| CLOSING | TIME-WAIT | Receive ACK |
| CLOSE-WAIT | LAST-ACK | Close / send FIN |
| LAST-ACK | CLOSED | Receive ACK |
| TIME-WAIT | CLOSED | Timeout after 2 MSL |

**Colour code for the SVG:** client / active path in `--packet` blue, server / passive path in `--signal` green, common and timeout transitions in `--ink`. Include the legend. Use the same layout idea as `tcp-state-diagram.png` (CLOSED at top; LISTEN and SYN-SENT below it; ESTABLISHED in the middle; active-close states to the left; CLOSE-WAIT and LAST-ACK to the right; TIME-WAIT and CLOSED at the bottom).

**Why TIME-WAIT (2 MSL)?** (1) To make sure the last ACK reaches the peer; if it is lost, the peer resends its FIN and we can reply again. (2) To let delayed old segments from this connection expire so they cannot corrupt a new connection using the same ports.

**Typical paths to write in the exam.**
- **Client:** CLOSED → SYN-SENT → ESTABLISHED → FIN-WAIT-1 → FIN-WAIT-2 → TIME-WAIT → CLOSED
- **Server:** CLOSED → LISTEN → SYN-RCVD → ESTABLISHED → CLOSE-WAIT → LAST-ACK → CLOSED

**UDP vs TCP.**

| Point | UDP | TCP |
|---|---|---|
| Connection | Connectionless | Connection-oriented |
| Reliability | Unreliable | Reliable (ACK, retransmit) |
| Ordering | Not guaranteed | In order |
| Header | 8 bytes | 20 to 60 bytes |
| Flow / congestion control | None | Yes |
| Speed / overhead | Fast, low | Slower, higher |
| Unit of data | Datagram (message) | Byte stream |
| Uses | DNS, VoIP, streaming, DHCP | HTTP(S), FTP, SMTP, SSH |

**Mnemonic for the client close path:** "Fin-one, Fin-two, Time, Closed."
**Exam keywords:** three-way handshake, four-way termination, half-close, SYN, ACK, FIN, 2MSL, passive open, active open, port number.
**Marks split for this topic:** Introduction (UDP and TCP, 2) · Concept: UDP header and TCP lifecycle (5) · Diagram: TCP state diagram (3) · State table and paths (4) · UDP vs TCP comparison (2).

**Interactive: `TcpStateExplorer`.** Shows the SVG state machine. Buttons "Client scenario" and "Server scenario" play the typical path one transition at a time with a caption of the event and action. Tapping any state opens a bottom sheet with its meaning (from the state table) and its outgoing transitions. A "Reset" button clears the highlight.

---

### 9.5 SCTP: Stream Control Transmission Protocol (Unit 4)

**Definition.** SCTP (RFC 4960) is a **reliable, message-oriented transport protocol** that combines features of UDP (message boundaries) and TCP (reliability, ordering, congestion control) and adds **multi-streaming** and **multi-homing**. It is connection-oriented, but its connection is called an **association**.

**Key features.**
- **Message-oriented:** preserves message boundaries (TCP is a byte stream).
- **Multi-streaming:** one association carries several independent streams; a lost message blocks only its own stream, so there is **no head-of-line blocking** across streams.
- **Multi-homing:** an endpoint can have several IP addresses; one is the **primary path**, others are backups. Heartbeat chunks check path health, giving fast failover.
- **Four-way handshake with a cookie:** protects against SYN-flooding attacks.
- **Ordered or unordered delivery** per message.
- **Selective acknowledgement (SACK)**, congestion control and flow control similar to TCP.
- **Partial reliability** (PR-SCTP extension) for time-sensitive data.
- **Built-in protection:** verification tag in every packet blocks blind injection; checksum is CRC-32c.

**Identifiers.** **TSN** (Transmission Sequence Number) numbers each DATA chunk for reliability. **SSN** (Stream Sequence Number) orders messages inside a stream. **Stream ID** identifies the stream.

**SCTP packet format.** Common header (12 bytes): source port (16), destination port (16), verification tag (32), checksum (32). Followed by one or more **chunks**. Each chunk: type (8), flags (8), length (16), value. Control and data chunks can be bundled in one packet.

**Main chunk types.** DATA, INIT, INIT ACK, SACK, HEARTBEAT, HEARTBEAT ACK, ABORT, SHUTDOWN, SHUTDOWN ACK, ERROR, COOKIE ECHO, COOKIE ACK, SHUTDOWN COMPLETE.

**Association establishment: four-way handshake (image `sctp-handshake-multistreaming.png`).**
1. Client → Server: **INIT** (client's initial TSN, number of streams, capabilities, IP addresses)
2. Server → Client: **INIT ACK** (server's initial TSN, **state cookie**, capabilities). The server keeps **no state** yet.
3. Client → Server: **COOKIE ECHO** (returns the cookie)
4. Server → Client: **COOKIE ACK** (association established)
Data can be bundled with the third and fourth messages.

Why the cookie? The server allocates resources only after the client proves it can receive at its claimed address, so spoofed INITs cannot exhaust the server (unlike TCP SYN floods).

**Association termination: three-way, no half-close.** SHUTDOWN → SHUTDOWN ACK → SHUTDOWN COMPLETE. ABORT closes immediately.

**SCTP states.** CLOSED, COOKIE-WAIT (client sent INIT), COOKIE-ECHOED (client sent COOKIE ECHO), ESTABLISHED, SHUTDOWN-PENDING, SHUTDOWN-SENT, SHUTDOWN-RECEIVED, SHUTDOWN-ACK-SENT.

**SCTP vs TCP vs UDP.**

| Feature | UDP | TCP | SCTP |
|---|---|---|---|
| Connection | None | Connection | Association |
| Reliable | No | Yes | Yes |
| Unit | Message | Byte stream | Message |
| Ordering | No | Strict, single stream | Per stream (or unordered) |
| Streams | 1 | 1 | Multiple |
| Multi-homing | No | No | Yes |
| Handshake | None | 3-way | 4-way with cookie |
| SYN-flood protection | n/a | Weak | Strong (cookie) |
| Head-of-line blocking | No | Yes | Reduced (per stream) |

**Applications.** SS7 signalling over IP (SIGTRAN), 4G and 5G core network signalling (S1AP, NGAP), WebRTC data channels, telephony, high-availability systems.

**Advantages:** no head-of-line blocking between streams; fast failover; secure handshake; message boundaries. **Disadvantages:** not as widely supported by operating systems, firewalls and NATs; less common in everyday applications; more complex than TCP.

**Mnemonic:** "INIT, ACK, ECHO, ACK: INIT-ACK carries the cookie, COOKIE-ECHO returns it."
**Exam keywords:** association, multi-streaming, multi-homing, four-way handshake, state cookie, TSN, SSN, chunk, head-of-line blocking, heartbeat.

**Interactive: `SctpHandshake`.** Steps through the four messages with arrows between Client and Server, a caption for each, and the state shown on each side (CLOSED → COOKIE-WAIT → COOKIE-ECHOED → ESTABLISHED for the client; CLOSED → ESTABLISHED for the server after COOKIE ECHO). Below, a small multi-stream demo: three streams with a "drop a message" button on Stream 2 that shows Streams 1 and 3 continuing while Stream 2 waits, then a toggle "Same data over TCP" that shows all three blocked.

---

### 9.6 DNS: Domain Name System (Unit 5)

**Definition.** DNS is a **distributed, hierarchical database and application-layer protocol** that translates human-friendly **domain names** (www.example.com) into **IP addresses** (93.184.216.34), and provides other information such as mail servers. It is the "phone book of the Internet".

**Why needed.** People remember names; networks route by IP addresses. A single central file does not scale, so DNS is **distributed**.

**Domain name space (hierarchy).** An upside-down tree.
- **Root (.)**: top; 13 logical root server addresses (A to M), many physical servers worldwide (anycast); managed by ICANN
- **Top-level domains (TLD):** generic (.com, .org, .net, .edu), country (.in, .uk, .jp), others
- **Second-level domain:** example.com
- **Subdomains / hosts:** www.example.com
A **fully qualified domain name (FQDN)** ends with a dot, e.g. `www.example.com.`

**Zones.** A zone is the part of the tree managed by one authority. A domain may be split into several zones.

**Name servers.**

| Server | Role |
|---|---|
| Local resolver (recursive resolver / ISP DNS) | Receives the client's query, does the work of finding the answer, caches results |
| Root server | Knows the TLD servers; replies with a referral |
| TLD server | Knows the authoritative servers of each domain under that TLD |
| Authoritative server | Holds the actual records for the domain and gives the final answer |

**Resolution process (image `dns-resolution.png`, resolving www.example.com).**
1. User's computer → Local resolver: query www.example.com
2. Local resolver → Root server: query www.example.com
3. Root → Local resolver: referral to the .com TLD server
4. Local resolver → TLD (.com) server: query www.example.com
5. TLD → Local resolver: referral to example.com's authoritative server
6. Local resolver → Authoritative server: query www.example.com
7. Authoritative → Local resolver: IP address 93.184.216.34
8. Local resolver → User's computer: IP address 93.184.216.34 (the resolver also caches it)

**Recursive vs iterative queries.** In a **recursive query** the client asks the resolver to return the final answer (step 1 and 8). In an **iterative query** the server returns the best answer it has, usually a referral, and the asker contacts the next server itself (steps 2 to 7).

**Caching and TTL.** Resolvers and hosts cache answers for the record's **TTL** (time to live), which cuts traffic and delay. Cached answers from non-authoritative sources are marked non-authoritative.

**Resource records (RR).** Format: name, type, class, TTL, data.

| Type | Meaning | Example data |
|---|---|---|
| A | Domain to IPv4 address | 93.184.216.34 |
| AAAA | Domain to IPv6 address | 2606:2800:... |
| NS | Name server of a domain | ns1.example.com |
| CNAME | Alias (canonical name) | www → example.com |
| MX | Mail exchanger (with priority) | 10 mail.example.com |
| PTR | IP address to name (reverse lookup) | in-addr.arpa |
| SOA | Start of authority (zone info, serial, timers) | primary NS, admin email |
| TXT | Free text (SPF, verification) | v=spf1 ... |

**DNS message format.** Same format for query and response. Header is 12 bytes: Identification (16), Flags (16: QR, Opcode, AA, TC, RD, RA, Z, RCODE), Number of questions, Number of answer RRs, Number of authority RRs, Number of additional RRs. Then four sections: **Question, Answer, Authority, Additional**.

**Transport.** Port **53**. **UDP** for normal queries (small, fast; limit 512 bytes classically). **TCP** for zone transfers and for responses too large for UDP (when the TC bit is set).

**Reverse DNS.** Maps IP to name using the `in-addr.arpa` domain with the address octets reversed (e.g., 34.216.184.93.in-addr.arpa).

**Security.** DNS spoofing and cache poisoning are threats. Defences: **DNSSEC** (digital signatures on records), **DNS over TLS (DoT)** and **DNS over HTTPS (DoH)** for privacy.

**Advantages:** user-friendly names; distributed and scalable; caching makes it fast; redundancy through multiple servers. **Disadvantages:** vulnerable to spoofing without DNSSEC; cache can hold stale data until TTL expires; a DNS outage makes sites unreachable by name.

**Mnemonic for the chain:** "Resolver asks Root, TLD, Authoritative: R-T-A."
**Exam keywords:** domain name space, root, TLD, authoritative server, resolver, recursive, iterative, resource record, A, MX, NS, CNAME, TTL, caching, port 53.

**Interactive: `DnsAnimator`.** A diagram of the five parties. Buttons Play, Next, Previous, Reset. Highlights the arrow for each of the 8 steps, with the step text as a caption and the packet content (query or referral or answer) in a small box. A toggle shows "With cache": if the resolver already has the answer, steps 2 to 7 are skipped.

---

### 9.7 SMTP: Simple Mail Transfer Protocol (Unit 5)

**Definition.** SMTP (RFC 5321) is the application-layer **push protocol** used to **send and relay email** from a client to a mail server and between mail servers. It runs over **TCP**, port **25** (server to server), **587** (client submission), and 465 (SMTP over implicit TLS).

**Email architecture (image `smtp-architecture.png`).**
- **User Agent (UA):** the mail client (Outlook, Gmail app, Thunderbird). Composes, sends, reads.
- **Mail Transfer Agent (MTA):** the mail server software that sends and relays mail using SMTP. The sender's MTA acts as the **SMTP client**; the receiver's MTA acts as the **SMTP server**.
- **Mail Delivery Agent (MDA):** places the mail into the user's mailbox.
- **Message Access Agent (MAA):** POP3 or IMAP, which lets the receiver's UA retrieve mail from the mailbox.

**Mail flow.** Sender's UA → (SMTP) → Sender's mail server → looks up the receiver's domain **MX record** through DNS → (SMTP) → Receiver's mail server (stored in the mailbox) → (POP3 / IMAP) → Receiver's UA.

**Why SMTP is a "push" protocol and POP3/IMAP are "pull".** SMTP pushes mail to the server; POP3 and IMAP let the receiver pull mail out.

**SMTP phases.**
1. **Connection establishment:** the client opens a TCP connection to port 25; the server replies `220` (service ready).
2. **Mail transfer:** handshake (`HELO` / `EHLO`), then `MAIL FROM`, `RCPT TO`, `DATA`, message text ending with a line containing only a dot.
3. **Connection termination:** `QUIT`; the server replies `221`.

**Commands (from the diagram).**

| Command | Purpose |
|---|---|
| HELO / EHLO domain | Identifies the sending server (EHLO asks for ESMTP extensions) |
| MAIL FROM:<address> | Specifies the sender's address |
| RCPT TO:<address> | Specifies a recipient (repeated for many recipients) |
| DATA | Begins the message content (header and body); ends with `<CRLF>.<CRLF>` |
| QUIT | Ends the SMTP session |
| RSET | Aborts the current mail transaction |
| VRFY | Verifies a user name |
| NOOP | Does nothing; keeps the connection alive |

**Reply codes.**

| Code | Meaning |
|---|---|
| 220 | Service ready |
| 221 | Service closing the connection |
| 250 | Requested action completed (OK) |
| 354 | Start mail input; end with `<CRLF>.<CRLF>` |
| 421 | Service not available |
| 450 / 451 | Temporary failure (mailbox busy / local error) |
| 500 / 501 | Syntax error in command / argument |
| 550 | Mailbox unavailable (not found) |
| 554 | Transaction failed |

Reply code classes: 2xx success, 3xx more information needed, 4xx temporary failure, 5xx permanent failure.

**Sample session (use for `SmtpSimulator` and show as a code block).**

```
S: 220 mail.example.com ESMTP ready
C: HELO example.com
S: 250 Hello example.com
C: MAIL FROM:<sender@example.com>
S: 250 OK
C: RCPT TO:<receiver@example.com>
S: 250 OK
C: DATA
S: 354 Start mail input; end with <CRLF>.<CRLF>
C: From: sender@example.com
C: To: receiver@example.com
C: Subject: Hello
C:
C: This is a test message.
C: .
S: 250 OK: message accepted for delivery
C: QUIT
S: 221 mail.example.com closing connection
```

**Message format.** Header lines (From, To, Subject, Date) + a blank line + body. Original SMTP only supports **7-bit ASCII text**.

**MIME (Multipurpose Internet Mail Extensions).** Extends email to carry non-ASCII text, images, audio, video and attachments by encoding them into ASCII (e.g., Base64) and adding headers (`MIME-Version`, `Content-Type`, `Content-Transfer-Encoding`).

**POP3 vs IMAP.**

| Point | POP3 (port 110, 995 with TLS) | IMAP (port 143, 993 with TLS) |
|---|---|---|
| Mail storage | Downloads to device, usually deletes from server | Stays on server |
| Multiple devices | Poor | Good |
| Folders on server | No | Yes |
| Bandwidth use | Low after download | Higher |

**Limitations and improvements.** Plain SMTP has no authentication and no encryption, so spam and spoofing are easy. Improvements: **ESMTP** extensions (AUTH), **STARTTLS** for encryption, and **SPF, DKIM, DMARC** for sender verification.

**Advantages:** simple and universal; reliable (queues and retries); works across different mail systems. **Disadvantages:** text-only without MIME; no built-in security; spam; only pushes mail (needs POP3 or IMAP to read it).

**Mnemonic for the command order:** "Hello, Mail, Rcpt, Data, Quit."
**Exam keywords:** MTA, UA, MDA, MX record, push protocol, port 25, HELO, MAIL FROM, RCPT TO, DATA, 250, 354, MIME, POP3, IMAP.

**Interactive: `SmtpSimulator`.** A chat-style view of the sample session. "Next" reveals one line at a time (client lines in blue on the right, server lines in green on the left), with a side panel explaining the current command or reply code. A "Show reply code meanings" toggle. A "Run it with an error" option replaces `RCPT TO` with an unknown address and shows the `550` response and what the client does.

---

## 10. Marks split reference

Default (all topics unless stated): Introduction 2 · Core concept and working 5 · Diagram 3 · Worked example or steps 4 · Advantages, disadvantages, comparison 2 = **16**.
For UDP and TCP, use the split given in Section 9.4. The marks always total 16.

---

## 11. Quiz (`src/data/quiz.ts`)

A quiz page with a topic filter and an "All topics" mode. One question per screen, four options, instant feedback with the explanation, a score at the end, and the best score per topic saved. Shuffle option order each attempt (keep `answerIndex` correct after shuffling). Seed questions (add 3 more per topic yourself, strictly from Section 9):

1. **VLSM:** Maximum usable hosts in a /27 subnet? → **30** (2^5 − 2).
2. **VLSM:** Subnet mask size best for a point-to-point link of 2 hosts? → **/30**.
3. **VLSM:** Which protocol does NOT support VLSM? → **RIPv1** (classful).
4. **Distance vector:** Which algorithm does it use? → **Bellman-Ford**.
5. **Distance vector:** Advertising a route back with infinite cost is called? → **Poison reverse**.
6. **Distance vector:** In RIP, what hop count means "unreachable"? → **16**.
7. **Link state:** Which algorithm computes the routes? → **Dijkstra**.
8. **Link state:** In the exam graph, the least cost from B to D is? → **5** (via B-A-C-D).
9. **Link state:** Link state routers send their link information to? → **All routers (flooding)**.
10. **TCP:** State a server enters after receiving a SYN? → **SYN-RCVD**.
11. **TCP:** Why does TIME-WAIT last 2 MSL? → **To ensure the last ACK arrives and old segments expire.**
12. **UDP:** UDP header size? → **8 bytes**.
13. **SCTP:** Number of messages in the SCTP association setup? → **Four**.
14. **SCTP:** Which feature allows an endpoint to have several IP addresses? → **Multi-homing**.
15. **SCTP:** Which message carries the state cookie? → **INIT ACK**.
16. **DNS:** Port number used by DNS? → **53**.
17. **DNS:** Record type that names a domain's mail server? → **MX**.
18. **DNS:** Which server holds the actual records of a domain? → **Authoritative server**.
19. **SMTP:** Default server-to-server port? → **25**.
20. **SMTP:** Reply code 354 means? → **Start mail input**.
21. **SMTP:** Which protocols let a user retrieve mail? → **POP3 and IMAP**.

---

## 12. Accessibility, performance, and quality bar

- Semantic HTML: one `h1` per page, landmarks (`header`, `nav`, `main`), tables with `th` and captions, buttons are buttons.
- Every diagram has a text alternative or a visible description. SVG components have `role="img"` plus `<title>` and `<desc>`.
- Color is never the only signal (changed cells in steppers also use bold; client and server paths also carry labels).
- Works at 360px wide and up to ultra-wide; supports 200% zoom without breaking.
- Lighthouse targets: Performance 90+, Accessibility 95+, Best Practices 95+, PWA installable.
- Lazy-load below-the-fold images; route-level code splitting for the interactive tools.
- No console errors or warnings in dev or production build.

---

## 13. Deployment notes (put a short section in a second file `DEPLOY.md`)

- **Vercel / Netlify:** connect the repo, build command `npm run build`, output directory `dist`.
- **GitHub Pages:** set `base` in `vite.config.ts` to the repo name; HashRouter needs no extra rewrite rules.
- **Run offline from the phone:** after the first load the PWA caches everything; add to home screen.

---

## 14. Build order (follow in phases; run the app after each phase)

1. **Scaffold:** Vite + React + TS + Tailwind + router + PWA plugin; tokens, fonts, light/dark theme, layout shell (header, bottom nav, sidebar).
2. **Data and types:** `content.ts`, `units.ts`, all 7 topic files from Section 9 (full content), `quiz.ts`.
3. **Content renderer:** `BlockRenderer` and all block components, `MarksGutter`, `ImageFigure` plus `Lightbox`, print styles.
4. **Pages:** Home, UnitPage, TopicPage, Saved, Search, NotFound; progress, bookmarks, resume.
5. **Native diagrams:** `UdpHeader`, `DistanceVectorSvg`, `TcpStateSvg`, `TopologySvg` (Section 4.1 and 9).
6. **Interactive tools:** VlsmCalculator, DistanceVectorStepper, DijkstraStepper, TcpStateExplorer, DnsAnimator, SmtpSimulator, SctpHandshake, each with its logic tested against Section 9 values.
7. **Revision mode and quiz.**
8. **Polish:** accessibility pass, reduced motion, offline test, Lighthouse, README for developers (`DEV.md`).

---

## 15. Final acceptance checklist (tick every item before finishing)

- [ ] `npm run build` succeeds with no errors or warnings.
- [ ] All 9 images load from `/images/` with the exact names in Section 4.
- [ ] The three problem images (distance vector, TCP state diagram, UDP header) are replaced by correct native components, with the originals kept in collapsed "see correction" panels.
- [ ] Every topic page has the five sections, marks badges that total exactly 16, a "Write this in the exam" box, key points, and the exam keywords.
- [ ] VLSM calculator reproduces the 4-row table in Section 9.1 for the default input and the practice answer for 10.0.0.0/24 (60, 30, 10, 2).
- [ ] Distance vector stepper reproduces Round 0, Round 1 and Round 2 tables in Section 9.2, and Router A's final table matches (B 2/B, C 5/B, D 6/B, E 7/B).
- [ ] Dijkstra stepper at Node B reproduces the exact 4-row table and the final routing table (A 2 via A, C 3 via A, D 5 via A, E 5 via E).
- [ ] TCP state diagram shows all 18 transitions from Section 9.4, with ESTABLISHED → CLOSE-WAIT labeled "receive FIN / send ACK".
- [ ] UDP header ruler runs 0 to 31 with no repeats.
- [ ] DNS animator walks all 8 steps; SMTP simulator replays the full session; SCTP handshake shows the 4 messages and the cookie.
- [ ] Search, bookmarks, progress, resume, theme toggle, font-size control, print stylesheet, and Revise mode all work.
- [ ] Quiz has at least 21 seed questions plus 3 per topic, with working feedback and saved best scores.
- [ ] Works offline after first load; installable as a PWA.
- [ ] Usable and readable at 360px width in both light and dark themes; keyboard focus visible; no horizontal page scroll.
- [ ] No generic template look: the marks gutter is the one signature element, and the page has no decorative entrance animation, gradient washes, all-caps labels, or identical card grids.

When everything above is done, give the user a short summary: how to run it, how to deploy it, and the list of the three image corrections that were made.
