import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    // Docs are edited by hand (including in the GitHub web editor); don't let
    // Markdown whitespace fail `vp check` and block the release pipeline.
    ignorePatterns: ["**/*.md"],
  },
  pack: {
    entry: ["src/index.ts"],
    dts: true,
    format: ["esm"],
    sourcemap: true,
  },
});
