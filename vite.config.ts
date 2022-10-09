import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tsConfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd()));

  return {
    base: './',
    server: {
      open: true,
      port: 3000,
      proxy: {
        '/api/': {
          target: process.env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace('/api', ''),
        },
      },
    },
    build: {
      outDir: './dist',
    },
    plugins: [
      react(),
      tsConfigPaths(),
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
  };
});
