import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MB
        cleanupOutdatedCaches: true,
        runtimeCaching: [],
        globPatterns: ["**/*.{js,css,html,png,svg,ico,json}"],
      },
      manifest: {
        name: "TheDevDraw",
        short_name: "TheDevDraw",
        description: "TheDevDraw",
        background_color: "#0a3670",
        theme_color: "#fff",
        display: "standalone",
        start_url: "/",
        orientation: "any",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
