import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      process: "process/browser",
      "@": "/src",
      "@assets": "/src/assets",
      "@images": "/src/assets/images",
      "@components": "/src/components",
      "@modules": "/src/modules",
      "@shared": "/src/shared",
      "@layout": "/src/layout",
    },
  },
  define: {
    "process.env": {
      NODE_ENV: "development",
    },
    I18N_HASH: '"generated_hash"',
  },
  server: {
    port: 3000,
  },
});
