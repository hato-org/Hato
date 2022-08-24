import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  server: {
    open: true,
    proxy: {
      "/api/": {
        target: "http://localhost:8460",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace("/api", ""),
      },
      // '/api': 'http://localhost:8460'
    },
  },
  build: {
    outDir: "./dist",
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: 'Hato',
        short_name: 'Hato',
        description: '屋代高校非公式情報板',
        theme_color: '#ffffff',
        display: 'standalone'
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
