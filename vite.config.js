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
      '/api': {
        target: process.env.VITE_PROXY_TARGET || 'https://srt-backend-m5mc.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  preview: {
    port: 4173,
  },
});
