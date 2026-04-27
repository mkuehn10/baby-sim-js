import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** GitHub project Pages use `/<repo-name>/`; CI sets `VITE_BASE` (see `.github/workflows`). */
const base = (() => {
  const b = process.env.VITE_BASE?.trim();
  if (!b) return "/";
  return b.endsWith("/") ? b : `${b}/`;
})();

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          plotly: ["plotly.js-dist-min"],
        },
      },
    },
  },
});
