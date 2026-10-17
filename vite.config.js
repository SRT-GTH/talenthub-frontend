import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Mirrors elysium's vite config: Tailwind v4 via Vite plugin, vendor chunk splitting, port 5173.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          redux: ['react-redux', '@reduxjs/toolkit', 'redux-persist'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  server: {
    port: 5173,
    open: false,
    // Dev only: forward /api to the backend so the browser stays same-origin
    // (no CORS). Point VITE_PROXY_TARGET at another backend if needed.
    proxy: {
      // Dev only: Career Buddy V2 agent (Mastra). /agent/* -> the Mastra
      // server, prefix stripped. Point VITE_AGENT_PROXY_TARGET elsewhere if
      // the agent isn't on localhost:4111.
      '/agent': {
        target: process.env.VITE_AGENT_PROXY_TARGET || 'http://localhost:4111',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/agent/, ''),
        // A turn can take 10-20 s (classifier + extractor + rephraser).
        timeout: 120_000,
        proxyTimeout: 120_000,
      },
      '/api': {
        target: process.env.VITE_PROXY_TARGET || 'https://srt-backend-m5mc.onrender.com',
        changeOrigin: true,
        secure: true,
        // The backend checks Origin against CORS_ORIGINS. Proxied requests are
        // server-to-server, so drop the browser's localhost Origin header.
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => proxyReq.removeHeader('origin'));
        },
      },
    },
  },
  preview: {
    port: 4173,
  },
});
