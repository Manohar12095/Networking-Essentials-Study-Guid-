import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['images/**/*', 'vite.svg', 'favicon.svg'],
      manifest: {
        name: 'Computer Networks 16-Mark Study Guide',
        short_name: 'CN 16-Marks',
        description: 'Mobile-first, offline-capable study guide for Computer Networks 16-mark questions',
        theme_color: '#14213D',
        background_color: '#F6F8FB',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: './',
        icons: [
          {
            src: 'vite.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: 'vite.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,woff,woff2}'],
        // Cache images with CacheFirst strategy
        runtimeCaching: [
          {
            urlPattern: /^.*\/images\/.*\.(png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cn-images-cache',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
    }),
  ],
  build: {
    // Target modern browsers for smaller bundles
    target: 'es2020',
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // React ecosystem in one vendor chunk
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Lucide icons in a separate chunk
          'vendor-icons': ['lucide-react'],
          // Interactive components (largest pieces)
          'chunk-interactive': [
            './src/components/interactive/DijkstraStepper',
            './src/components/interactive/DistanceVectorStepper',
            './src/components/interactive/VlsmCalculator',
          ],
          // Topic data (content)
          'chunk-data': [
            './src/data/topics/vlsm',
            './src/data/topics/distanceVector',
            './src/data/topics/linkState',
            './src/data/topics/udpTcpStates',
            './src/data/topics/sctp',
            './src/data/topics/dns',
            './src/data/topics/smtp',
          ],
        },
      },
    },
  },
});
