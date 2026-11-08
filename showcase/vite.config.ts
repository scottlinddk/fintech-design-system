import { defineConfig } from "vite-plus";

export default defineConfig({
  root: "showcase",
  base: "./",
  build: { outDir: "../showcase-dist", emptyOutDir: true, assetsInlineLimit: 0 },
});
