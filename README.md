# Computer Networks 16-Mark Study Guide & Revision Engine

> **A modern, offline-first, standalone web application built for Computer Networks university examinations.**
>
> **Created by S. Manohar**

---

## 🌟 Overview

The **Computer Networks 16-Mark Study Guide** provides high-yield, structured 16-mark exam answers with step-by-step mathematical calculations, native vector diagrams, interactive step-by-step algorithms, and instant-feedback practice quizzes.

- **Offline-First PWA:** Fully functional without an active internet connection via Service Worker caching.
- **Independent Architecture:** Uses `HashRouter` (`/#/`) and relative assets (`./`) to run seamlessly on **GitHub Pages**, Vercel, Netlify, or directly from any static host with zero server configuration.
- **Mobile-First Design:** Responsive layout with desktop sidebar and mobile bottom navigation.

---

## 📚 Syllabus & Topics Covered

### Unit 3: Network Layer
1. **Variable Length Subnet Mask (VLSM):** Hierarchical subnetting, host bit allocation, and subnet boundary tables.
2. **Distance Vector Routing:** Bellman-Ford equation, routing table updates, and Count-to-Infinity solutions (Split Horizon & Poison Reverse).
3. **Link State Routing (Dijkstra's Algorithm):** Link State Packets (LSPs), flooding, and Dijkstra's step-by-step algorithm.

### Unit 4: Transport Layer
4. **UDP Header & TCP 11-State Transition Diagram:** 8-byte UDP header analysis and TCP Finite State Machine (FSM) state transitions.
5. **Stream Control Transmission Protocol (SCTP):** 4-way cookie handshake and multi-streaming architecture vs TCP/UDP.

### Unit 5: Application Layer
6. **Domain Name System (DNS):** Hierarchical name space, recursive vs iterative resolution, resource records (RR), and caching.
7. **Simple Mail Transfer Protocol (SMTP):** End-to-end email architecture (MTA/MDA/MUA), SMTP command phases, and comparison with POP3/IMAP.

---

## 🚀 Getting Started

### 1. Run Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Build for Production

```bash
npm run build
```

The compiled, standalone static files will be generated in the `dist/` directory.

---

## 🌐 Deploy to GitHub Pages

This repository includes a pre-configured GitHub Actions workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

1. Push this repository to GitHub.
2. In your GitHub repository, navigate to **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. GitHub Actions will automatically build and publish your site!

---

## 👨‍💻 Author

**Created by S. Manohar**  
*Computer Networks Study Guide & Interactive Revision Engine*
