# Deployment Guide: Computer Networks 16-Mark Study Guide

This application is a **static, offline-first React SPA** built with Vite, TypeScript, and Tailwind CSS. It uses `HashRouter` (`/#/`), making it deployable onto any static host or file server without requiring server-side URL rewrite rules.

---

## 1. Local Development & Preview

```bash
# Install dependencies
npm install

# Start Vite local development server
npm run dev

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 2. Deploy to Vercel / Netlify

1. Connect the GitHub/Git repository.
2. Build Settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Click **Deploy**. Since the app uses `HashRouter`, deep links (e.g. `/#/topic/vlsm`) work seamlessly with zero server redirects.

---

## 3. Deploy to GitHub Pages

1. In `vite.config.ts`, add the repository name as the base path:
   ```ts
   export default defineConfig({
     base: '/<repository-name>/',
     // ...
   });
   ```
2. Build the project:
   ```bash
   npm run build
   ```
3. Push the `dist` directory to the `gh-pages` branch or configure GitHub Actions to deploy from `dist`.

---

## 4. Run Offline on Mobile (PWA)

1. Open the deployed website in Chrome or Safari on your phone.
2. Tap **"Add to Home Screen"** or **"Install App"**.
3. Once loaded, the Service Worker caches all assets (fonts, images, logic). The site is fully functional with airplane mode enabled.
