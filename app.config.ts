import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  ssr: true,
  // Entrega la cookie de visitante en la propia pagina. Sin registrarla aqui,
  // el archivo existe y no se ejecuta nunca.
  middleware: "./src/middleware.ts",
  server: {
    preset: "vercel",
  },
  vite: {
    css: {
      postcss: "./postcss.config.js",
    },
  },
});
