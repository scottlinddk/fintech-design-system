// Compatibility entry point. The browser suite uses the built showcase over HTTP,
// all three real themes, and locked dev dependencies instead of obsolete file URLs.
const { spawnSync } = require("node:child_process");
const result = spawnSync("npm", ["run", "test:browser"], { stdio: "inherit" });
process.exitCode = result.status ?? 1;
