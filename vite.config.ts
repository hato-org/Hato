import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  server: {
    open: true,
    proxy: {
      '/api/': {
        target:
          process.env.NODE_ENV === 'production'
            ? 'https://api.hato.cf:11111'
            : 'http://localhost:8460',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace('/api', ''),
      },
      // '/api': 'http://localhost:8460'
    },
  },
  build: {
    outDir: './dist',
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Hato',
        short_name: 'Hato',
        description: '屋代高校非公式情報板',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: 'icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
