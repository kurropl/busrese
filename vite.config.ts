import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "/busrese/" para GitHub Pages (project page).
// En desarrollo o dominio propio, cambiar a "/".
const base = process.env.GITHUB_ACTIONS ? "/busrese/" : "/";

export default defineConfig({
  plugins: [react()],
  base,
  server: { port: 5173, open: true },
  build: { outDir: "dist", sourcemap: true },
});
