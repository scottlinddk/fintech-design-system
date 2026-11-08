import { resolve } from "node:path";
import { defineConfig } from "vite-plus";

export default defineConfig({
  root: "showcase",
  base: "./",
  build: {
    outDir: "../showcase-dist",
    emptyOutDir: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, "index.html"),
        grain: resolve(import.meta.dirname, "grain.html"),
      },
    },
  },
});
