import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    // Docs are edited by hand (including in the GitHub web editor); don't let
    // Markdown whitespace fail `vp check` and block the release pipeline.
    ignorePatterns: ["**/*.md"],
  },
  test: { exclude: ["**/node_modules/**", "**/dist/**", "e2e/**", "smoke/**"] },
  pack: {
    entry: [
      "src/index.ts",
      "src/components/{Badge,Button,Field,Menu,Meter,Metric,Notice,Panel}.tsx",
    ],
    unbundle: true,
    outExtensions: () => ({ js: ".mjs", dts: ".d.mts" }),
    platform: "neutral",
    outputOptions: {
      banner: (chunk) =>
        /(?:^|\/)components\/(Button|Field|Menu|Panel)\.mjs$/.test(chunk.fileName)
          ? '"use client";'
          : "",
    },
    dts: true,
    format: ["esm"],
    sourcemap: true,
  },
});
