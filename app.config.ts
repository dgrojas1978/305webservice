import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  ssr: true,
  server: {
    preset: "vercel",
  },
  vite: {
    css: {
      postcss: "./postcss.config.js",
    },
  },
});
