import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { build } from "vite-plus/pack";

await build({
  config: false,
  entry: ["smoke/badge-entry.ts"],
  outDir: "artifacts/size",
  dts: false,
  platform: "neutral",
  format: ["esm"],
  minify: true,
  sourcemap: false,
  deps: { neverBundle: ["react", "react/jsx-runtime"] },
  inputOptions: {
    onLog(level, log, defaultHandler) {
      // Client boundaries are checked separately; this fixture deliberately simulates a client bundler.
      if (log.code !== "MODULE_LEVEL_DIRECTIVE") defaultHandler(level, log);
    },
  },
});
const code = readFileSync("artifacts/size/badge-entry.js", "utf8");
assert(
  !/useState|useEffect|fds-menu|fds-field|fds-button/.test(code),
  "Badge-only consumers must not include interactive modules",
);
const bytes = gzipSync(code).length;
assert(bytes <= 600, `Badge-only bundle is ${bytes} bytes gzip (budget 600, React external)`);
console.log(`Badge-only import: ${bytes} bytes gzip; budget 600, React external.`);
