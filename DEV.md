# Developer Documentation: Computer Networks Study Guide

This project is an offline-first, mobile-first study guide for Computer Networks 16-mark exam questions.

---

## Architecture Overview

- **Routing:** `react-router-dom` v6 with `HashRouter` to allow static hosting from GitHub Pages, S3, or local file systems.
- **Offline & PWA:** Handled by `vite-plugin-pwa` with `autoUpdate` service worker caching images, fonts, and scripts.
- **State Management:** Zero external store libraries; all user persistence (progress, bookmarks, theme, font scaling, quiz scores) is safely handled by `src/lib/storage.ts` using `localStorage` with fail-soft `try/catch`.
- **Styling:** Tailwind CSS v3 augmented with CSS custom property design tokens in `src/styles/index.css`.
- **Self-Hosted Typography:** `@fontsource/bricolage-grotesque`, `@fontsource/source-serif-4`, and `@fontsource/jetbrains-mono` for 100% offline availability without third-party CDN requests.

---

## 3 Critical Image Corrections Handled

1. **Distance Vector (`distance-vector.png`):**
   - *Problem:* Textbook illustration erroneously showed Router A reaching D via D (cost 6) and E via D (cost 7).
   - *Solution:* Replaced with native SVG component `DistanceVectorSvg` displaying the true shortest paths via next-hop B. The original PNG is accessible via a collapsed warning panel.
2. **TCP State Machine (`tcp-state-diagram.png`):**
   - *Problem:* Transition from `ESTABLISHED` to `CLOSE-WAIT` was mislabeled as "close / send FIN".
   - *Solution:* Replaced with native SVG component `TcpStateSvg` with the correct transition "receive FIN / send ACK", and includes the simultaneous close transition to `TIME-WAIT`.
3. **UDP Datagram Header (`udp-header.png`):**
   - *Problem:* The bit ruler contained duplicate bit position 23 (reads 22, 23, 23, 24).
   - *Solution:* Replaced with a pure HTML/CSS component `UdpHeader` featuring a precise 0-to-31 column bit ruler.

---

## Key Verification Commands

```bash
# Verify build succeeds with zero errors
npm run build

# Run unit verification tests
node -e "
const { calculateVlsm } = require('./dist/assets/...');
"
```
